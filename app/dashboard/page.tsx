"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Spinner from "@/components/Spinner";
import SmallSpinner from "@/components/SmallSpinner";
import Navbar from "@/components/Navbar";

export default function page() {
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState("");
  const [fullName, setFullName] = useState(""); // ✅ Add state for display name
  const [expenses, setExpenses] = useState<any[]>([]);
  const [submitting, setSubmtting] = useState(false)
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");


  const router = useRouter();

  // 🔥 Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // 🔐 Fetch user info + expenses
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        router.push("/login");
      } else {
        setUserEmail(user.email || "");
        setUserId(user.id);

        // ✅ Extract display name from metadata
        const metadata = user.user_metadata || user.user_metadata;
        if (metadata && metadata.full_name) {
          setFullName(metadata.full_name);
        }

        await fetchExpenses(user.id);
        setLoading(false);
      }
    };

    getUser();
  }, [router]);

  // 📥 Fetch expenses
  const fetchExpenses = async (uid: string) => {
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .eq("user_id", uid)
      .order("id", { ascending: false });

    if (!error && data) {
      setExpenses(data);
    } else {
      console.error("Error fetching expenses:", error);
    }
  };

  // ➕ Handle form


  // 🌀 Show spinner while loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  // ✅ Render UI
  return (
    <>
    <Navbar/>
    <div className="min-h-screen p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">
        {getGreeting()}, {fullName || "User"} 👋
      </h1>
      <p className="mb-4 text-gray-700">Logged in as: {userEmail}</p>

      {/* We’ll move expenses later from this page */}
      {/* Expense Form */}

    </div>
    </>
  );
}
