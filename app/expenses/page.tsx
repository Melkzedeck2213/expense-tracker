"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Spinner from "@/components/Spinner";
import SmallSpinner from "@/components/SmallSpinner";
import Navbar from "@/components/Navbar";

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState("");
  const [fullName, setFullName] = useState("");
  const [expenses, setExpenses] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Edit Mode
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editCategory, setEditCategory] = useState("");

  const router = useRouter();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

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

  const handleSave = async (id: string) => {
    setSubmitting(true);
    const { error } = await supabase
      .from("expenses")
      .update({
        name: editName,
        amount: parseFloat(editAmount),
        category: editCategory,
      })
      .eq("id", id);

    if (error) {
      alert("Error updating expense");
    } else {
      await fetchExpenses(userId);
      setEditingId(null);
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this expense?");
    if (!confirmDelete) return;

    const { error } = await supabase
      .from("expenses")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Failed to delete expense.");
      console.error(error);
    } else {
      await fetchExpenses(userId);
    }
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
        <h1 className="text-2xl font-bold mb-1">
          {getGreeting()}, {fullName || "User"} 👋
        </h1>
        <p className="mb-4 text-gray-700">Logged in as: {userEmail}</p>

        {/* Expenses List */}
        <h2 className="text-lg font-bold mb-2">Recent Expenses</h2>
        <div className="space-y-4">
          {expenses.map((expense) => {
            const date = new Date(expense.created_at).toLocaleDateString();

            return (
              <div
                key={expense.id}
                className="p-3 border rounded flex justify-between items-start"
              >
                {editingId === expense.id ? (
                  <div className="w-full space-y-2">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full border p-2 rounded"
                    />
                    <input
                      type="number"
                      value={editAmount}
                      onChange={(e) => setEditAmount(e.target.value)}
                      className="w-full border p-2 rounded"
                    />
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="w-full border p-2 rounded"
                    >
                      <option value="water">Water</option>
                      <option value="electricity">Electricity</option>
                      <option value="food">Food</option>
                      <option value="transport">Transport</option>
                      <option value="entertainment">Entertainment</option>
                      <option value="health">Health</option>
                      <option value="others">Others</option>
                    </select>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSave(expense.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded"
                      >
                        {submitting ? <SmallSpinner /> : "Save"}
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-gray-400 text-white px-3 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <p className="font-semibold">{expense.name}</p>
                      <p className="text-sm text-gray-500">
                        {expense.category}
                      </p>
                      <p className="text-xs text-gray-400">Recorded: {date}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-green-700 font-bold">
                        TZS {expense.amount}
                      </p>
                      <button
                        onClick={() => {
                          setEditingId(expense.id);
                          setEditName(expense.name);
                          setEditAmount(expense.amount);
                          setEditCategory(expense.category);
                        }}
                        className="text-blue-600 text-sm underline block"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(expense.id)}
                        className="text-red-600 text-sm underline block"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
