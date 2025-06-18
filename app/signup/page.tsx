"use client";
// pages/auth/register.tsx
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Eye, EyeClosed } from "lucide-react";
import PasswordInput from "@/components/passwordInput";
import AuthLayout from "@/components/AuthLayout";

export default function page() {
  // State to store form data
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [fullName, setFullName] = useState("");

  const router = useRouter();
  const [passwordError, setPasswordError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload

    // Call Supabase sign up

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return; // STOP the function here if error
    } else {
      setPasswordError(""); // clear previous error
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName, // ✅ Store in metadata
        },
      },
    });

    if (error) {
      setError(error.message);
    } else {
      router.push("/login");
    }
  };

  return (
    <>
      <AuthLayout title="Signup">
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full border p-2 rounded mb-3"
          />

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

          <PasswordInput
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="confirm your password"
             
          />
          {passwordError  && <p className="text-red-600">{error}</p>}

          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded w-full mt-3 cursor-pointer"
          >
            Signup
          </button>

          {error && <p className="text-red-600">{error}</p>}
        </form>
      </AuthLayout>
    </>
  );
}
