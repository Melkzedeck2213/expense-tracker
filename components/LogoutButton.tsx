"use client"
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useState } from "react";


export default function LogoutButton(){
    const router = useRouter()
    const [error, setError] = useState("")


    const handleLogout= async ()=>{
        const { error } = await supabase.auth.signOut()
        if (!error) {
            router.push('/login')
        }
        else{
            setError(error.message)
        }
    }

return(
    <>
           <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 cursor-pointer"
    >
      Logout
    </button>
         {error && <p className="text-red-600 mt-3">{error}</p>}
    </>
 
  );

}