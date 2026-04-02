"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";
import { WorkoutForm } from "@/components/WorkoutForm";
import { WorkoutList } from "@/components/WorkoutList";
import { SkeletonList } from "@/components/Skeleton";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { Workout } from "@/types";
import { CheckCircle2, TrendingUp, Calendar, Dumbbell } from "lucide-react";

export default function HomePage() {
  const { user } = useAuth();
  const { settings } = useSettings();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(true);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (!user) return;

    // Listen to today's workout in real-time
    const unsubscribe = onSnapshot(
      doc(db, `users/${user.uid}/workouts`, today),
      (doc) => {
        if (doc.exists()) {
          setWorkout({ id: doc.id, ...doc.data() } as Workout);
        } else {
          setWorkout(null);
        }
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, today]);

  if (loading) return <SkeletonList />;

  const totalVolume = workout?.entries.reduce((acc, entry) => acc + (entry.weight * entry.reps), 0) || 0;
  const totalSets = workout?.entries.length || 0;

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      {/* Header Summary */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-accent">
          <Calendar size={14} strokeWidth={3} />
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
        </div>
        <h1 className="text-4xl font-black tracking-tight text-text-primary">
          Training Day
        </h1>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card-depth flex items-center gap-4 rounded-3xl bg-bg-secondary p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-bg-accent-area text-accent shadow-sm">
            <CheckCircle2 size={24} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black text-text-primary">{totalSets}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary">Sets Done</span>
          </div>
        </div>
        <div className="card-depth flex items-center gap-4 rounded-3xl bg-bg-secondary p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-bg-accent-area text-success shadow-sm">
            <TrendingUp size={24} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-text-primary">{totalVolume}</span>
              <span className="text-[10px] font-bold text-text-tertiary">{settings.unit}</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary">Total Volume</span>
          </div>
        </div>
      </div>

      {/* Logging Form */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-black uppercase tracking-widest text-text-tertiary">
            Log New Set
          </h2>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="text-xs font-bold text-accent transition-opacity hover:opacity-70"
          >
            {showForm ? "Minimize" : "Expand"}
          </button>
        </div>
        {showForm && <WorkoutForm />}
      </section>

      {/* Today's Log */}
      <section className="flex flex-col gap-4">
        <h2 className="px-1 text-sm font-black uppercase tracking-widest text-text-tertiary">
          Today&apos;s Gains
        </h2>
        {workout && workout.entries.length > 0 ? (
          <WorkoutList date={today} entries={workout.entries} />
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 rounded-[2.5rem] border-2 border-dashed border-border py-16 text-center animate-pulse">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-bg-tertiary text-text-tertiary">
              <Dumbbell size={40} strokeWidth={1.5} />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-lg font-black text-text-secondary">No sets logged yet</p>
              <p className="text-xs font-bold text-text-tertiary tracking-wide uppercase">Time to hit the weights!</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

