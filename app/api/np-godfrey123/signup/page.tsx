"use client";
export const dynamic = "force-dynamic";
import AdminForm from "@/components/admin/AdminForm";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const handleSignup = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/np-godfrey123/dashboard");
    } catch (err) {
      alert("Signup failed: " + (err as Error).message);
    }
  };

  return <AdminForm title="Admin Signup" onSubmit={handleSignup} />;
}
