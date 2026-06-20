"use client";

import AdminForm from "@/components/admin/AdminForm";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/np-godfrey123/dashboard");
    } catch (err) {
      alert("Login failed: " + (err as Error).message);
    }
  };

  return <AdminForm title="Admin Login" onSubmit={handleLogin} />;
}
