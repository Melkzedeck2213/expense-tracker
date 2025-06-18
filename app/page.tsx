"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Spinner from "@/components/Spinner";
import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        router.push("/dashboard");
      } else {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center px-4">
      <h1 className="text-4xl font-bold mb-6">Welcome to the Expense Tracker</h1>
      <p className="text-lg text-gray-600 mb-10">
        Track your spending, manage your budget, and stay financially healthy.
      </p>

      <div className="flex gap-6">
        <button
          onClick={() => router.push("/login")}
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition cursor-pointer"
        >
          Login
        </button>
        <button
          onClick={() => router.push("/signup")}
          className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition cursor-pointer"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
