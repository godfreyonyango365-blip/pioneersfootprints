import Navbar from "@/components/Navbar";
import Footer from "@/components/footer"; // make sure path is correct

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );



}
