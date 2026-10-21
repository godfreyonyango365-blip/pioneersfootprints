const {test} = require('node:test');
const assert = require('node:assert/strict');
const ts = require('typescript');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const root = path.resolve(__dirname,'..');
class HttpError extends Error {constructor(status,message){super(message);this.status=status;}}
function loader(overrides={}) {
  const cache = new Map();
  function load(file) {
    file = path.resolve(root,file);
    if (cache.has(file)) return cache.get(file).exports;
    const module = {exports:{}}; cache.set(file,module);
    const source = ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,esModuleInterop:true}}).outputText;
    const localRequire = id => {
      if (Object.hasOwn(overrides,id)) return overrides[id];
      if (id === 'server-only') return {};
      if (id === './admin') return {HttpError};
      if (id.startsWith('.')) return load(path.resolve(path.dirname(file),id+'.ts'));
      return require(id);
    };
    vm.runInThisContext('(function(require,module,exports){'+source+'\n})',{filename:file})(localRequire,module,module.exports);
    return module.exports;
  }
  return load;
}
process.env.DONATION_QUOTE_SIGNING_SECRET = crypto.randomBytes(32).toString('hex');
process.env.PAYSTACK_SECRET_KEY = crypto.randomBytes(32).toString('hex');
const load = loader();
const money = load('lib/donations/config.ts');
const quotes = load('lib/donations/quotes.ts');
test('money rejects malformed amounts and enforces exact boundaries',() => {
  for (const value of ['-1','1e3','NaN','Infinity','1.001','.5',' 10','10.','100000000',10,null,'0']) assert.throws(()=>money.parseDonationAmount(value,'KES'));
  assert.equal(money.parseDonationAmount('10','KES'),1000);
  assert.equal(money.parseDonationAmount('10000000.00','KES'),1000000000);
  assert.equal(money.parseDonationAmount('1.01','USD'),101);
  assert.throws(()=>money.parseDonationAmount('100000.01','USD'));
  assert.equal(money.donationSubunitToMajor(101),'1.01');
  assert.equal(money.isDonationPurpose('__proto__'),false);
  assert.equal(money.isDonationPurpose('Support health education'),true);
  assert.equal(money.isDonationPurpose('x'.repeat(121)),false);
});
test('KES quotes never call an FX service and bind input and expiration',async () => {
  const q = await quotes.createQuote('10','KES');
  assert.equal(q.chargeCurrency,'KES');
  assert.equal(q.chargeAmountSubunit,1000);
  assert.equal(quotes.verifyQuote(q.token,'10.00','KES').chargeCurrency,'KES');
  assert.throws(()=>quotes.verifyQuote(q.token,'11','KES'));
  assert.throws(()=>quotes.verifyQuote(q.token,'10','USD'));
  assert.throws(()=>quotes.verifyQuote(q.token.slice(0,-1)+'!','10','KES'));
  assert.throws(()=>quotes.verifyQuote(quotes.signQuote({...quotes.verifyQuote(q.token,'10','KES'),expiresAt:Math.floor(Date.now()/1000)-1}),'10','KES'));
});
test('signed malformed quotes and inconsistent conversion are rejected',()=> {
  const q = {v:1,inputCurrency:'USD',inputAmountSubunit:100,chargeCurrency:'KES',chargeAmountSubunit:12900,exchangeRate:'129',exchangeRateDate:new Date().toISOString().slice(0,10),expiresAt:Math.floor(Date.now()/1000)+900};
  assert.equal(quotes.verifyQuote(quotes.signQuote(q),'1','USD').chargeAmountSubunit,12900);
  for (const change of [{chargeCurrency:'USD'},{chargeAmountSubunit:12901},{exchangeRate:'Infinity'},{exchangeRateDate:'2020-01-01'},{exchangeRateDate:'2026-02-30'},{inputAmountSubunit:101},{v:2}]) assert.throws(()=>quotes.verifyQuote(quotes.signQuote({...q,...change}),'1','USD'));
});
test('decimal-rate conversion rounds half up using integers',()=> {
  assert.equal(quotes.convertAmount(101,'129.5'),13080);
  assert.equal(quotes.convertAmount(2500,'129.123456789'),322809);
  assert.throws(()=>quotes.convertAmount(100,'0'));
  assert.throws(()=>quotes.convertAmount(10000000,'129'));
});
test('bounded body reader rejects oversized streaming and invalid JSON',async()=> {
  const http = loader()('lib/donations/http.ts');
  await assert.rejects(()=>http.jsonBody(new Request('https://local',{method:'POST',headers:{'Content-Type':'text/plain'},body:'{}'})),e=>e.status===415);
  await assert.rejects(()=>http.jsonBody(new Request('https://local',{method:'POST',headers:{'Content-Type':'application/json'},body:'['})),e=>e.status===400);
  await assert.rejects(()=>http.readBody(new Request('https://local',{method:'POST',body:'x'.repeat(8193)})),e=>e.status===413);
});
test('verification is idempotent, rejects conflicts and never downgrades success',async()=> {
  const reference = money.donationConfig.referencePrefix+'a'.repeat(32);
  const records = new Map([[reference,{reference,source:money.donationConfig.source,siteId:money.donationConfig.siteId,currency:'KES',amountSubunit:1000,donorEmail:'donor@example.test',status:'pending'}]]);
  const ref = id => ({id});
  const db = {collection:()=>({doc:ref}),runTransaction:async work=>work({get:async r=>({exists:records.has(r.id),data:()=>records.get(r.id)}),set:(r,d)=>records.set(r.id,d),update:(r,d)=>records.set(r.id,{...records.get(r.id),...d})})};
  db.collection = ()=>({doc:id=>({...ref(id),get:async()=>({exists:records.has(id),data:()=>records.get(id)})})});
  const payments = loader({'./admin':{donationDb:()=>db,HttpError},'firebase-admin/firestore':{FieldValue:{serverTimestamp:()=>new Date()}}})('lib/donations/payments.ts');
  let transaction = {reference,currency:'KES',amount:1000,requested_amount:1000,id:123,status:'success',customer:{email:'donor@example.test'},metadata:{donation:true,source:money.donationConfig.source},paid_at:new Date().toISOString(),channel:'card'};
  const original = global.fetch;
  global.fetch = async()=>Response.json({status:true,data:transaction});
  try {
    assert.equal((await payments.reconcileDonation(reference)).status,'success');
    assert.equal((await payments.reconcileDonation(reference)).status,'success');
    assert.equal(records.size,2);
    transaction = {...transaction,status:'failed'};
    assert.equal((await payments.reconcileDonation(reference)).status,'success');
    transaction = {...transaction,amount:999};
    await assert.rejects(()=>payments.reconcileDonation(reference),e=>e.status===409);
    transaction = {...transaction,amount:1000,id:124};
    await assert.rejects(()=>payments.reconcileDonation(reference),e=>e.status===409);
    assert.equal(records.get(reference).status,'success');
  } finally {global.fetch=original;}
});
test('checkout and reference validators reject lookalike hosts and malformed references',()=> {
  const p = loader({'firebase-admin/firestore':{}})('lib/donations/payments.ts');
  assert.equal(p.validCheckout('https://checkout.paystack.com/test'),true);
  for (const url of ['http://checkout.paystack.com/test','https://checkout.paystack.com.evil.test','https://user@checkout.paystack.com','javascript:alert(1)']) assert.equal(p.validCheckout(url),false);
  assert.equal(p.validReference(money.donationConfig.referencePrefix+'a'.repeat(32)),true);
  assert.equal(p.validReference('other-'+'a'.repeat(32)),false);
});

test('USD quote fetches a current rate and reuses it, rejecting stale or wrong-pair rates',async()=> {
  const original = global.fetch;
  let calls = 0;
  try {
    global.fetch = async()=> {calls++;return Response.json({base:'USD',quote:'KES',rate:129.25,date:new Date().toISOString().slice(0,10)});};
    const q = loader()('lib/donations/quotes.ts');
    const quote = await q.createQuote('25','USD');
    assert.equal(quote.chargeCurrency,'KES');assert.equal(quote.chargeAmountSubunit,323125);
    await q.createQuote('30','USD');assert.equal(calls,1);
    for (const change of [{base:'EUR'},{quote:'USD'},{date:'2020-01-01'},{rate:0}]) {
      global.fetch = async()=>Response.json({base:'USD',quote:'KES',rate:129,date:new Date().toISOString().slice(0,10),...change});
      await assert.rejects(()=>loader()('lib/donations/quotes.ts').createQuote('25','USD'));
    }
  } finally {global.fetch=original;}
});
test('webhook verifies the original bytes and acknowledges unrelated events',async()=> {
  const http = loader()('lib/donations/http.ts');
  const route = loader({
    '@/lib/donations/quotes':quotes,
    '@/lib/donations/payments':{validReference:()=>true,reconcileDonation:async()=>{throw new Error('must not run');}},
    '@/lib/donations/config':money,
    '@/lib/donations/admin':{HttpError},
    '@/lib/donations/http':http,
  })('app/api/paystack/webhook/route.ts');
  const body = '{ "event": "unrelated" }';
  const signature = crypto.createHmac('sha512',process.env.PAYSTACK_SECRET_KEY).update(body).digest('hex');
  const request = (payload,sig) => new Request('https://local/api/paystack/webhook',{method:'POST',headers:{'x-paystack-signature':sig},body:payload});
  assert.equal((await route.POST(request(body,signature))).status,200);
  assert.equal((await route.POST(request(JSON.stringify(JSON.parse(body)),signature))).status,401);
  assert.equal((await route.POST(request(body,'invalid'))).status,401);
});

test('admin authorization rejects unauthenticated and untrusted roles, requiring verified tokens',async()=> {
  let claims = {uid:'test-user'};
  const admin = loader({
    'firebase-admin/app':{getApps:()=>[{name:'donations'}]},
    'firebase-admin/auth':{getAuth:()=>({verifyIdToken:async(token,revoked)=>{assert.equal(revoked,true);if(token !== 'verified')throw new Error();return claims;}})},
    'firebase-admin/firestore':{},
  })('lib/donations/admin.ts');
  const request = token=>new Request('https://local',{headers:token?{Authorization:'Bearer '+token}:{}});
  await assert.rejects(()=>admin.requireDonationAdmin(request()),e=>e.status===401);
  await assert.rejects(()=>admin.requireDonationAdmin(request('forged')),e=>e.status===401);
  await assert.rejects(()=>admin.requireDonationAdmin(request('verified')),e=>e.status===403);
  claims={uid:'test-user',admin:true};assert.equal(await admin.requireDonationAdmin(request('verified')),'test-user');
  claims={uid:'test-user',roles:['owner']};assert.equal(await admin.requireDonationAdmin(request('verified')),'test-user');
  const old = process.env.ADMIN_EMAILS;
  try {
    process.env.ADMIN_EMAILS='administrator@example.test';
    claims={uid:'test-user',email:'administrator@example.test',email_verified:false};
    await assert.rejects(()=>admin.requireDonationAdmin(request('verified')),e=>e.status===403);
    claims.email_verified=true;assert.equal(await admin.requireDonationAdmin(request('verified')),'test-user');
  } finally {if(old===undefined)delete process.env.ADMIN_EMAILS;else process.env.ADMIN_EMAILS=old;}
});
test('initialization persists original USD details and sends only KES to Paystack',async()=> {
  let record;
  const ref = {create:async data=>{record=data;}};
  const db = {collection:()=>({doc:()=>ref}),runTransaction:async work=>work({get:async()=>({data:()=>record}),update:(_ref,data)=>{record={...record,...data};}})};
  const payments = loader({'./admin':{donationDb:()=>db,HttpError},'firebase-admin/firestore':{FieldValue:{serverTimestamp:()=>new Date()}}})('lib/donations/payments.ts');
  const original = global.fetch, oldSite = process.env.SITE_URL;
  process.env.SITE_URL='https://www.pioneersfootprints.com';
  const quote = quotes.signQuote({v:1,inputCurrency:'USD',inputAmountSubunit:1000,chargeCurrency:'KES',chargeAmountSubunit:129250,exchangeRate:'129.25',exchangeRateDate:new Date().toISOString().slice(0,10),expiresAt:Math.floor(Date.now()/1000)+900});
  const input = {amount:'10',currency:'USD',quoteToken:quote,email:'donor@example.test',donorName:'',purpose:'Support health education'};
  try {
    global.fetch=async(_url,options)=>{
      assert.equal(record.status,'pending');
      const body=JSON.parse(options.body);
      assert.equal(record.currency,'KES');assert.equal(record.amountSubunit,129250);
      assert.equal(record.donorInputCurrency,'USD');assert.equal(record.donorInputAmountSubunit,1000);assert.equal(record.exchangeRate,'129.25');
      assert.equal(record.purpose,'Support health education');
      assert.equal(body.amount,'129250');assert.equal(body.currency,'KES');assert.equal(body.reference,record.reference);
      assert.equal(body.metadata.donor_input_currency,'USD');assert.equal(body.metadata.donor_input_amount_subunit,1000);assert.equal(body.metadata.usd_to_kes_rate,'129.25');
      assert.equal(body.metadata.donation_purpose,'Support health education');
      return Response.json({status:true,data:{reference:body.reference,authorization_url:'https://checkout.paystack.com/test'}});
    };
    assert.match((await payments.initializeDonation(input)).authorizationUrl,/^https:/);
    global.fetch=async()=>{throw new Error('private provider details');};
    await assert.rejects(()=>payments.initializeDonation(input),e=>e.status===502);
    assert.equal(record.status,'failed');assert.equal(record.reason.includes('private'),false);
  } finally {global.fetch=original;if(oldSite===undefined)delete process.env.SITE_URL;else process.env.SITE_URL=oldSite;}
});

test('client response parsing hides HTML infrastructure errors',async()=> {
  const client = loader()('lib/donations/client.ts');
  await assert.rejects(
    ()=>client.readDonationResponse(new Response('<!DOCTYPE html>',{status:500,headers:{'Content-Type':'text/html'}}),'Service unavailable.'),
    error=>error.message==='Service unavailable.',
  );
  await assert.rejects(
    ()=>client.readDonationResponse(Response.json({error:'Safe message'},{status:503}),'Fallback.'),
    error=>error.message==='Safe message',
  );
});
