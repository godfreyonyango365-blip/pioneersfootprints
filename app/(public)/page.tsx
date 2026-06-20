import { connection } from "next/server";
import Hero from "@/components/sections/hero";
import ServicesPage from "./services/page";

export default async function HomePage() {
  await connection();

  return (
    <main>
      <Hero />
      <ServicesPage />
    </main>
  );
}
