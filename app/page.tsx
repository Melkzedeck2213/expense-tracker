"use client"
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center px-4">
      <h1 className="text-4xl font-bold mb-6">Welcome to the Expense Tracker</h1>
      <p className="text-lg text-gray-600 mb-10">Track your spending, manage your budget, and stay financially healthy.</p>

      <div className="flex gap-6">
        <button
          onClick={() => router.push('/login')}
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition cursor-pointer"
        >
          Login
        </button>

        <button
          onClick={() => router.push('/signup')}
          className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition cursor-pointer"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
  
}
