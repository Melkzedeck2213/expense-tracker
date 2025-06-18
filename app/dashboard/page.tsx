"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Spinner from "@/components/Spinner";

export default function page() {
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState("");
  const [fullName, setFullName] = useState(""); // ✅ Add state for display name
  const [expenses, setExpenses] = useState<any[]>([]);
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
  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.from("expenses").insert([
      {
        user_id: userId,
        name,
        amount: parseFloat(amount),
        category: category || "others",
      },
    ]);

    if (error) {
      setMessage("Error: " + error.message);
    } else {
      setMessage("Expense added successfully ✅");
      setAmount("");
      setName("");
      setCategory("");
      await fetchExpenses(userId);
    }
  };

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
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">
        {getGreeting()}, {fullName || "User"} 👋
      </h1>
      <p className="mb-4 text-gray-700">Logged in as: {userEmail}</p>

      {/* We’ll move expenses later from this page */}
      {/* Expense Form */}
      <form onSubmit={handleAddExpense} className="space-y-4">
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="w-full border p-2 rounded"
        >
          <option value="">Select Category</option>
          <option value="water">Water</option>
          <option value="electricity">Electricity</option>
          <option value="food">Food</option>
          <option value="transport">Transport</option>
          <option value="entertainment">Entertainment</option>
          <option value="health">Health</option>
          <option value="others">Others</option>
        </select>

        <input
          type="text"
          placeholder="Name of the expense"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Add Expense
        </button>

        {message && <p className="text-sm mt-2">{message}</p>}
      </form>
    </div>
  );
}
