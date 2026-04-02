"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getWorkouts, deleteWorkout } from "@/lib/firestore";
import { Workout } from "@/types";
import { SkeletonList } from "@/components/Skeleton";
import { WorkoutList } from "@/components/WorkoutList";
import { Calendar, ChevronDown, ChevronUp, Trash2, Box } from "lucide-react";

export default function HistoryPage() {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      getWorkouts(user.uid).then((data) => {
        setWorkouts(data);
        setLoading(false);
      });
    }
  }, [user]);

  if (loading) return <SkeletonList />;

  if (workouts.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center animate-fade-in">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-bg-tertiary text-text-tertiary">
          <Box size={40} />
        </div>
        <h2 className="text-2xl font-black text-text-primary">Journal is Empty</h2>
        <p className="mt-2 text-text-secondary">Your workout history will appear here once you start logging sets.</p>
      </div>
    );
  }

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!user || !confirm("Delete this workout session?")) return;
    await deleteWorkout(user.uid, id);
    setWorkouts(workouts.filter(w => w.id !== id));
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-accent">
          <Calendar size={14} strokeWidth={3} />
          Training Journal
        </div>
        <h1 className="text-4xl font-black tracking-tight text-text-primary">
          History
        </h1>
      </div>

      <div className="flex flex-col gap-4 pb-20">
        {workouts.map((w) => {
          const isExpanded = expandedId === w.id;
          const totalVolume = w.entries.reduce((acc, e) => acc + (e.weight * e.reps), 0);
          
          return (
            <div 
              key={w.id}
              className={`card-depth flex flex-col overflow-hidden rounded-[2rem] bg-bg-secondary transition-all ${
                isExpanded ? "ring-2 ring-accent/20" : ""
              }`}
            >
              <div 
                onClick={() => setExpandedId(isExpanded ? null : w.id)}
                className="flex cursor-pointer items-center justify-between p-6 active:bg-bg-accent-area"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-black uppercase tracking-widest text-accent">
                    {new Date(w.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-black text-text-primary">
                      {w.entries.length} Sets
                    </span>
                    <span className="h-1 w-1 rounded-full bg-text-tertiary" />
                    <span className="text-sm font-bold text-text-secondary">
                      {totalVolume} kg Volume
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={(e) => handleDelete(e, w.id)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-text-tertiary transition-all hover:bg-danger/10 hover:text-danger active:scale-90"
                  >
                    <Trash2 size={18} />
                  </button>
                  <div className={`text-text-tertiary transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}>
                    <ChevronDown size={20} />
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-border bg-bg-primary/30 p-6 animate-fade-in">
                  <WorkoutList date={w.date} entries={w.entries} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
