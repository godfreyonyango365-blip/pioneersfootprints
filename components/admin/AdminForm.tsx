"use client";

import { FormEvent, useState } from "react";

interface AdminFormProps {
  title: string;
  onSubmit: (email: string, password: string) => void;
}

export default function AdminForm({ title, onSubmit }: AdminFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  const handleDemoLogin = () => {
    setEmail("pioneersfootprints1844@gmail.com");
    setPassword("cet204.1");
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">{title}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-600"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-600"
          required
        />
        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
        >
          Submit
        </button>
        <button
          type="button"
          onClick={handleDemoLogin}
          className="w-full py-2 mt-2 rounded-xl bg-gray-600 text-white font-semibold hover:bg-gray-700 transition text-sm"
        >
          Demo Login
        </button>
      </form>
    </div>
  );
}
