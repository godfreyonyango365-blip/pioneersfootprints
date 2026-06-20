import { connection } from "next/server";
import Hero from "@/components/sections/hero";

export default async function HeroPage() {
  await connection();

  return <Hero />;
}
