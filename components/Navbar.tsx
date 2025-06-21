"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";
import SmallSpinner from "./SmallSpinner";
import Link from "next/link";

export default function Navbar() {
  const router = useRouter();
  const[loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center shadow-md">
      <h1 className="text-lg font-bold">Expense Tracker</h1>

      <ul className="flex space-x-4 items-center">
        <li>
          <Link href="/dashboard" className="hover:underline">
            Dashboard
          </Link>
        </li>
        <li>
          <Link href="/expenses" className="hover:underline">
            Expenses
          </Link>
        </li>
        <li>
          <Link href="/profile" className="hover:underline">
            Profile
          </Link>
        </li>
        <li>
          <button
            onClick={handleLogout}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
          >
            {loggingOut?<SmallSpinner/>:"Logout"}
          </button>
        </li>
      </ul>
    </nav>
  );
}
