"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Spinner from "@/components/Spinner";
import SmallSpinner from "@/components/SmallSpinner";
import Navbar from "@/components/Navbar";

export default function page() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState("");
  const [fullName, setFullName] = useState(""); // ✅ Add state for display name
  const [expenses, setExpenses] = useState<any[]>([]);
  const [submitting, setSubmtting] = useState(false);
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

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

        setLoading(false);
      }
    };

    getUser();
  }, [router]);

   const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmtting(true)

 
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
   
    }

    setSubmtting(false)
  };

   if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <Spinner />
        </div>
      );
    }

  return (
    <>
      <Navbar />
        <div className="min-h-screen p-4 max-w-xl mx-auto">
    

      <h1>Add new Expenses</h1>
      {/* Expense Form */}
      <form onSubmit={handleAddExpense} className="space-y-4">
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          className="w-full border p-2 rounded"
          min={50}
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
          disabled={submitting}
        >
          
          {submitting? <SmallSpinner/>: "Add Expense"}

        </button>

        {message && <p className="text-sm mt-2">{message}</p>}
      </form>
    </div>
    </>
  );
}
