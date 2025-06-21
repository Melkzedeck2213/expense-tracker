"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import PasswordInput from "@/components/passwordInput";
import AuthLayout from "@/components/AuthLayout";
import SmallSpinner from "@/components/SmallSpinner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message === "failed to fetch") {
        setError("Please check your internet connection and try again.");
      } else {
        setError(error.message);
      }
      setSubmitting(false);
      return;
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <AuthLayout title="Login">
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border p-2 rounded w-full mb-3"
        />

        <PasswordInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded w-full mt-3 cursor-pointer flex items-center justify-center"
          disabled={submitting}
        >
          {submitting ? <SmallSpinner /> : "Login"}
        </button>

        {error && <p className="text-red-600">{error}</p>}
      </form>
    </AuthLayout>
  );
}
