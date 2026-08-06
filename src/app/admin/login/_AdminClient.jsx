"use client";
export const dynamic = 'force-dynamic';

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // On success, the layout's onAuthStateChanged will redirect us
    } catch (err) {
      console.error(err);
      setError("Invalid email or password. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900 relative overflow-hidden">
      
      {/* Abstract Background Elements (Optional, for premium feel) */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-slate-900 -z-10 [clip-path:polygon(0_0,100%_0,100%_40%,0_100%)]"></div>
      
      <div className="w-full max-w-[600px] p-8 sm:p-14 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 relative z-10 flex flex-col items-center">
        
        <div className="text-center mb-12 w-full">
          <h1 className="text-5xl font-extrabold text-[#c99a2c] uppercase tracking-widest mb-4 font-serif leading-tight">
            HOTEL MOKSH HAVELI INN
          </h1>
          <p className="text-slate-500 tracking-widest text-xl font-bold uppercase flex items-center justify-center gap-3">
            <Lock className="w-6 h-6 text-slate-400" /> Admin Login
          </p>
        </div>

        {error && (
          <div className="w-full mb-8 px-5 py-4 bg-red-50 border border-red-100 text-red-600 text-lg font-medium rounded-lg text-center animate-in slide-in-from-top-2">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="w-full space-y-8">
          <div className="space-y-4 flex flex-col">
            <label htmlFor="email" className="text-slate-700 text-xl font-bold ml-1">Email Address</label>
            <input 
              id="email" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@mokshhaveli.com"
              className="w-full h-20 px-6 text-2xl bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl focus:bg-white focus:outline-none focus:border-[#c99a2c] transition-all font-medium placeholder:text-slate-400 placeholder:font-normal"
              required
            />
          </div>
          
          <div className="space-y-4 flex flex-col">
            <label htmlFor="password" className="text-slate-700 text-xl font-bold ml-1">Password</label>
            <input 
              id="password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-20 px-6 text-2xl bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl focus:bg-white focus:outline-none focus:border-[#c99a2c] transition-all font-medium placeholder:text-slate-400"
              required
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full h-24 mt-8 flex justify-center items-center gap-3 bg-[#0b1329] text-[#c99a2c] text-3xl rounded-xl font-bold tracking-wider hover:bg-[#1e293b] hover:shadow-xl active:scale-[0.98] transition-all disabled:opacity-70 disabled:pointer-events-none"
          >
            {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : "Sign In"}
          </button>
        </form>
        
        <p className="mt-10 text-sm font-semibold text-slate-400 text-center">
          Secure, Encrypted Connection.
        </p>
      </div>
    </div>
  );
}
