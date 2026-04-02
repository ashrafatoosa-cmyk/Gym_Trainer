"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy, addDoc, doc, setDoc } from "firebase/firestore";
import { Movement, Category } from "@/types";
import { Dumbbell, PlusCircle, CheckCircle, Database } from "lucide-react";

// Default Movements (~60 common exercises)
const DEFAULT_MOVEMENTS: Omit<Movement, 'id'>[] = [
  // Legs
  { name: 'Squat', category: 'Legs', isCustom: false },
  { name: 'Front Squat', category: 'Legs', isCustom: false },
  { name: 'Hack Squat', category: 'Legs', isCustom: false },
  { name: 'Leg Press', category: 'Legs', isCustom: false },
  { name: 'Romanian Deadlift', category: 'Legs', isCustom: false },
  { name: 'Walking Lunge', category: 'Legs', isCustom: false },
  { name: 'Bulgarian Split Squat', category: 'Legs', isCustom: false },
  { name: 'Leg Extension', category: 'Legs', isCustom: false },
  { name: 'Leg Curl', category: 'Legs', isCustom: false },
  { name: 'Hip Thrust', category: 'Legs', isCustom: false },
  { name: 'Calf Raise', category: 'Legs', isCustom: false },
  { name: 'Goblet Squat', category: 'Legs', isCustom: false },
  // Back
  { name: 'Deadlift', category: 'Back', isCustom: false },
  { name: 'Barbell Row', category: 'Back', isCustom: false },
  { name: 'Dumbbell Row', category: 'Back', isCustom: false },
  { name: 'Seated Cable Row', category: 'Back', isCustom: false },
  { name: 'T-Bar Row', category: 'Back', isCustom: false },
  { name: 'Pull-Up', category: 'Back', isCustom: false },
  { name: 'Chin-Up', category: 'Back', isCustom: false },
  { name: 'Lat Pulldown', category: 'Back', isCustom: false },
  { name: 'Face Pull', category: 'Back', isCustom: false },
  { name: 'Shrug', category: 'Back', isCustom: false },
  // Chest
  { name: 'Bench Press', category: 'Chest', isCustom: false },
  { name: 'Incline Bench Press', category: 'Chest', isCustom: false },
  { name: 'Dumbbell Bench Press', category: 'Chest', isCustom: false },
  { name: 'Incline Dumbbell Press', category: 'Chest', isCustom: false },
  { name: 'Cable Fly', category: 'Chest', isCustom: false },
  { name: 'Dumbbell Fly', category: 'Chest', isCustom: false },
  { name: 'Chest Dip', category: 'Chest', isCustom: false },
  { name: 'Push-Up', category: 'Chest', isCustom: false },
  { name: 'Machine Chest Press', category: 'Chest', isCustom: false },
  // Shoulders
  { name: 'Overhead Press', category: 'Shoulders', isCustom: false },
  { name: 'Dumbbell Shoulder Press', category: 'Shoulders', isCustom: false },
  { name: 'Arnold Press', category: 'Shoulders', isCustom: false },
  { name: 'Lateral Raise', category: 'Shoulders', isCustom: false },
  { name: 'Front Raise', category: 'Shoulders', isCustom: false },
  { name: 'Reverse Fly', category: 'Shoulders', isCustom: false },
  { name: 'Upright Row', category: 'Shoulders', isCustom: false },
  // Arms
  { name: 'Barbell Curl', category: 'Arms', isCustom: false },
  { name: 'Dumbbell Curl', category: 'Arms', isCustom: false },
  { name: 'Hammer Curl', category: 'Arms', isCustom: false },
  { name: 'Preacher Curl', category: 'Arms', isCustom: false },
  { name: 'Cable Curl', category: 'Arms', isCustom: false },
  { name: 'Tricep Pushdown', category: 'Arms', isCustom: false },
  { name: 'Overhead Tricep Extension', category: 'Arms', isCustom: false },
  { name: 'Skull Crusher', category: 'Arms', isCustom: false },
  { name: 'Close-Grip Bench Press', category: 'Arms', isCustom: false },
  { name: 'Tricep Dip', category: 'Arms', isCustom: false },
  // Core
  { name: 'Plank', category: 'Core', isCustom: false },
  { name: 'Hanging Leg Raise', category: 'Core', isCustom: false },
  { name: 'Cable Crunch', category: 'Core', isCustom: false },
  { name: 'Ab Wheel Rollout', category: 'Core', isCustom: false },
  { name: 'Dead Bug', category: 'Core', isCustom: false },
  { name: 'Russian Twist', category: 'Core', isCustom: false },
  { name: 'Decline Sit-Up', category: 'Core', isCustom: false },
  // Cardio
  { name: 'Running', category: 'Cardio', isCustom: false },
  { name: 'Rowing Machine', category: 'Cardio', isCustom: false },
  { name: 'Stationary Bike', category: 'Cardio', isCustom: false },
  { name: 'Jump Rope', category: 'Cardio', isCustom: false },
  { name: 'Stair Climber', category: 'Cardio', isCustom: false },
];

export default function SeedPage() {
  const { user } = useAuth();
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSeedMovements = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Seed movements individually (or using batch write for better performance)
      for (const m of DEFAULT_MOVEMENTS) {
        await addDoc(collection(db, `users/${user.uid}/movements`), m);
      }
      setStatus("Successfully seeded 60+ movements!");
    } catch (e: any) {
      setStatus(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-8 p-8 text-center animate-fade-in">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-bg-accent-area text-accent shadow-btn">
        <Database size={40} />
      </div>
      
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-text-primary">Data Seeding</h1>
        <p className="text-sm font-medium text-text-secondary max-w-xs">
          Populate your library with 60+ common gym exercises to get started quickly.
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-sm">
        <button
          onClick={handleSeedMovements}
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-2xl bg-accent py-5 text-lg font-black text-white shadow-btn active:scale-95 transition-all disabled:opacity-50"
        >
          {loading ? "Seeding..." : "Seed Default Movements"}
        </button>
        
        {status && (
          <div className="flex items-center justify-center gap-2 rounded-xl bg-success/10 py-3 text-sm font-bold text-success animate-modal-in">
            <CheckCircle size={18} />
            {status}
          </div>
        )}
      </div>
    </div>
  );
}
