export const donationConfig = {
  siteId: "pioneersfootprints",
  displayName: "Pioneers Footprints",
  referencePrefix: "pff-don-",
  source: "pioneersfootprints-donations-v1",
  chargeCurrency: "KES" as const,
  defaultPurpose: "general",
  purposes: { general: "Where it is needed most" },
  currencies: {
    KES: { symbol: "KSh", min: 1000, max: 1000000000 },
    USD: { symbol: "$", min: 100, max: 10000000 },
  },
  rateUrl: "https://api.frankfurter.dev/v2/rate/usd/kes?providers=cbk",
  rateProvider: "Central Bank of Kenya via Frankfurter",
  gateway: "https://api.paystack.co",
  checkoutHost: "checkout.paystack.com",
  adminRoles: ["admin", "owner", "super_admin", "super-admin"],
  receiptDelivery: "gateway" as const,
  privacy: "Your name and email are used to process your donation and support payment enquiries. Payment details are handled by Paystack.",
};
export type DonationCurrency = keyof typeof donationConfig.currencies;
export function isDonationCurrency(value: unknown): value is DonationCurrency {
  return value === "KES" || value === "USD";
}
export function isDonationPurpose(value: unknown): value is keyof typeof donationConfig.purposes {
  return typeof value === "string" && Object.hasOwn(donationConfig.purposes, value);
}
export function parseDonationAmount(value: unknown, currency: DonationCurrency): number {
  if (typeof value !== "string" || !/^\d{1,8}(\.\d{1,2})?$/.test(value)) throw new Error("Enter a valid amount with up to two decimal places.");
  const [whole, fraction = ""] = value.split(".");
  const amount = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  const limits = donationConfig.currencies[currency];
  if (!Number.isSafeInteger(amount) || amount < limits.min || amount > limits.max) throw new Error("Amount is outside the permitted donation limits.");
  return amount;
}
export function donationSubunitToMajor(amount: number): string {
  if (!Number.isSafeInteger(amount) || amount < 0) throw new Error("Invalid amount.");
  return `${Math.floor(amount / 100)}.${String(amount % 100).padStart(2, "0")}`;
}
export function formatDonationAmount(amount: number, currency: DonationCurrency): string {
  const [whole, fraction] = donationSubunitToMajor(amount).split(".");
  return `${donationConfig.currencies[currency].symbol} ${Number(whole).toLocaleString("en-KE")}.${fraction}`;
}
