"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

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
      setError("Invalid email or password.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-midnight-roast)] p-4 font-sans text-[var(--color-parchment)]">
      <div className="w-full max-w-md p-8 sm:p-12 bg-[var(--color-onyx-warm)] rounded-xl border border-[var(--color-warm-stone)]/20 shadow-2xl relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-light text-[var(--color-saffron-glow)] uppercase tracking-widest mb-3" style={{ fontFamily: "var(--font-tt-ramillas-variable)" }}>
            Moksh Haveli Inn
          </h1>
          <p className="text-[var(--color-warm-stone)] tracking-wide text-sm font-medium">ADMINISTRATOR PORTAL</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-950/50 border border-red-900/50 text-red-200 text-sm rounded text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[var(--color-warm-stone)] uppercase tracking-widest text-xs font-semibold">Email Address</Label>
            <Input 
              id="email" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[var(--color-midnight-roast)] border-[var(--color-warm-stone)]/30 text-[var(--color-parchment)] focus-visible:ring-[var(--color-saffron-glow)]"
              style={{ height: "3.5rem", padding: "0 1rem", fontSize: "1rem" }}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-[var(--color-warm-stone)] uppercase tracking-widest text-xs font-semibold">Password</Label>
            <Input 
              id="password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[var(--color-midnight-roast)] border-[var(--color-warm-stone)]/30 text-[var(--color-parchment)] focus-visible:ring-[var(--color-saffron-glow)]"
              style={{ height: "3.5rem", padding: "0 1rem", fontSize: "1rem" }}
              required
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-8 flex justify-center items-center py-4 bg-[var(--color-saffron-glow)] text-[var(--color-midnight-roast)] uppercase tracking-widest text-sm font-bold rounded-md hover:bg-[#e3a869] transition-colors disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
