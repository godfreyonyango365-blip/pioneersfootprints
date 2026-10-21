import Navbar from '@/components/Navbar';
import Footer from '@/components/footer';
import DonationForm from '@/components/donations/DonationForm';
import { donationConfig } from '@/lib/donations/config';
export const metadata = {title:'Donate',alternates:{canonical:'/donate'}};
export default function DonatePage() {
  return <><Navbar/><main className="min-h-screen bg-slate-50 px-4 py-12 text-slate-950 sm:py-20"><div className="mx-auto grid max-w-6xl min-w-0 items-start gap-10 lg:grid-cols-2"><section className="min-w-0 py-4 text-center lg:sticky lg:top-24"><p className="font-semibold uppercase tracking-widest text-green-700">Give with purpose</p><h1 className="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl">Support {donationConfig.displayName}</h1><p className="mt-6 text-lg leading-8 text-slate-600">Your generosity helps advance publishing, health education, missionary outreach and digital ministry across Kenya and beyond.</p><div className="mt-8 rounded-2xl bg-blue-950 p-6 text-white"><h2 className="text-xl font-semibold">Every gift makes a difference</h2><p className="mt-3 leading-7 text-blue-100">Choose KES or USD. All donations are charged in Kenyan shillings, with the exact charge shown before checkout.</p></div><p className="mt-6 text-sm leading-6 text-slate-600">We never collect your card number, CVV, bank credentials or mobile-money PIN on this website.</p></section><DonationForm/></div></main><Footer/></>;
}
