// app/auth/callback/page.tsx
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

export default function AuthCallback() {
  const router = useRouter()


  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession()
      if (error || !data.session) {
        console.error("Error confirming email:", error)
        return
      }

      // Success, redirect
      router.push("/dashboard")
    }

    checkSession()
  }, [router, supabase])

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-xl font-medium">Confirming your email...</p>
    </div>
  )
}
