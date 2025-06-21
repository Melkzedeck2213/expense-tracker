"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Spinner from "@/components/Spinner";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function ExpensesPage() {
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");
  const [expenses, setExpenses] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const getUserAndExpenses = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        router.push("/login");
      } else {
        setUserId(user.id);
        await fetchExpenses(user.id);
        setLoading(false);
      }
    };

    getUserAndExpenses();
  }, [router]);

  const fetchExpenses = async (uid: string) => {
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .eq("user_id", uid)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setExpenses(data);
    } else {
      console.error("Error fetching expenses:", error);
    }
  };

  const groupExpensesByDate = (expenses: any[]) => {
    const grouped: Record<string, any[]> = {};

    expenses.forEach((expense) => {
      const dateOnly = new Date(expense.created_at).toISOString().split("T")[0];
      if (!grouped[dateOnly]) grouped[dateOnly] = [];
      grouped[dateOnly].push(expense);
    });

    return grouped;
  };

  const formatDateHeader = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const groupedExpenses = groupExpensesByDate(expenses);

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
        <h1 className="text-2xl font-bold mb-4">Your Daily Expenses</h1>

        <div className="space-y-4">
          {Object.entries(groupedExpenses).map(([date, expenses]) => (
            <Link
              href={`/expenses/${encodeURIComponent(date)}`}
              key={date}
              className="block border p-4 rounded hover:bg-gray-100"
            >
              <p className="font-semibold">Expenses as of {formatDateHeader(date)}</p>
              <p className="text-sm text-gray-500">
                Total: TZS {expenses.reduce((sum, e) => sum + e.amount, 0)}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
