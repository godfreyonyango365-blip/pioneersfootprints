import Confirmation from '@/components/donations/Confirmation';
import { validReference } from '@/lib/donations/payments';
export const metadata = {title:'Donation confirmation',robots:{index:false,follow:false},referrer:'no-referrer' as const};
export default async function ConfirmationPage({searchParams}:{searchParams:Promise<{reference?:string}>}) {
  const {reference} = await searchParams;
  return <main className="flex min-h-screen items-center bg-slate-100 px-4 py-12"><Confirmation reference={validReference(reference) ? reference : ''}/></main>;
}
