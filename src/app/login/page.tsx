"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Dumbbell } from "lucide-react";
import { SkeletonCard } from "@/components/Skeleton";

export default function LoginPage() {
  const { login, loading, user } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      setError(null);
      await login();
    } catch (err: any) {
      setError(err.message || "Something went wrong during login.");
    }
  };

  if (loading) return <SkeletonCard />;

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center p-6 text-center animate-slide-up">
      <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-accent text-white shadow-btn glow-pulse">
        <Dumbbell size={40} />
      </div>
      
      <h1 className="mb-2 text-3xl font-black tracking-tight text-text-primary">
        Gym Trainer
      </h1>
      <p className="mb-10 text-text-secondary">
        Track your gains with minimal taps.
      </p>

      <div className="card-depth w-full max-w-sm rounded-[2rem] bg-bg-secondary p-8">
        <button
          onClick={handleLogin}
          className="flex w-full items-center justify-center gap-3 rounded-2xl bg-text-primary py-4 text-bg-secondary transition-all active:scale-95 shadow-card hover:shadow-card-hover"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span className="font-bold">Sign in with Google</span>
        </button>

        {error && (
          <p className="mt-4 text-sm font-medium text-danger animate-fade-in">
            {error}
          </p>
        )}
      </div>

      <p className="mt-12 text-xs font-bold uppercase tracking-widest text-text-tertiary">
        Built with Next.js & Firebase
      </p>
    </div>
  );
}
