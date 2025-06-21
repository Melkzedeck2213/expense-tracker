"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Spinner from "@/components/Spinner";
import Navbar from "@/components/Navbar";

//date utiliy functions
import { timeExpenseAdded } from "@/lib/utils/dateUtils";

export default function ExpensesByDatePage() {
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [userId, setUserId] = useState("");
  const router = useRouter();
  const params = useParams();

// Extract the date parameter from the URL

 const dateParam = params?.date;

const selectedDate = decodeURIComponent(
  Array.isArray(dateParam) ? dateParam[0] || "" : dateParam || ""
);

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
        await fetchExpensesForDate(user.id);
        setLoading(false);
      }
    };

    getUserAndExpenses();
  }, [router, selectedDate]);

  const fetchExpensesForDate = async (uid: string) => {
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .eq("user_id", uid)
      .gte("created_at", `${selectedDate}T00:00:00.000Z`)
      .lt("created_at", `${selectedDate}T23:59:59.999Z`)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setExpenses(data);
    } else {
      console.error("Error fetching expenses for date:", error);
    }
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
        <h1 className="text-xl font-bold mb-4">
          Expenses for {formatDateHeader(selectedDate)}
        </h1>

        <div className="space-y-4">
          {expenses.length === 0 ? (
            <p className="text-gray-500">No expenses recorded for this date.</p>
          ) : (
            expenses.map((expense) => (
              <div
                key={expense.id}
                className="border p-4 rounded shadow-sm bg-white"
              >
                <p className="font-semibold">{expense.name}</p>
                <p className="text-sm text-gray-600">Category: {expense.category}</p>
                <p className="text-green-700 font-bold">
                  TZS {expense.amount}
                </p>
                <p className="text-sm text-gray-600 italic">Recorded at: {timeExpenseAdded(expense.created_at)}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
