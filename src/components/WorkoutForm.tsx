"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";
import { getMovements, addEntriesToWorkout } from "@/lib/firestore";
import { Movement } from "@/types";
import { Plus, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";

export function WorkoutForm() {
  const { user } = useAuth();
  const { settings } = useSettings();
  const [movement, setMovement] = useState("");
  const [reps, setReps] = useState<number | "">("");
  const [weight, setWeight] = useState<number | "">("");
  const [notes, setNotes] = useState("");
  const [showNotes, setShowNotes] = useState(false);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [filteredMovements, setFilteredMovements] = useState<Movement[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  
  const movementRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      getMovements(user.uid).then(setMovements);
    }
  }, [user]);

  useEffect(() => {
    if (movement.trim()) {
      const filtered = movements
        .filter(m => m.name.toLowerCase().includes(movement.toLowerCase()))
        .slice(0, 8);
      setFilteredMovements(filtered);
    } else {
      setFilteredMovements([]);
    }
  }, [movement, movements]);

  const handleLogSet = async () => {
    if (!user || !movement.trim() || reps === "" || weight === "") return;

    try {
      const today = new Date().toISOString().split('T')[0];
      await addEntriesToWorkout(user.uid, today, [{
        movementName: movement,
        reps: Number(reps),
        weight: Number(weight),
        unit: settings.unit,
        notes: notes.trim() || undefined
      }]);

      // Reset form but keep movement for fast multi-set logging
      setReps("");
      setWeight("");
      setNotes("");
      movementRef.current?.focus();
    } catch (error) {
      console.error("Failed to log set:", error);
    }
  };

  return (
    <div className="card-depth flex flex-col gap-4 rounded-3xl bg-bg-secondary p-5 transition-all">
      <div className="relative">
        <input
          ref={movementRef}
          type="text"
          placeholder="What exercise?"
          value={movement}
          onChange={(e) => setMovement(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          className="w-full rounded-2xl bg-bg-primary px-5 py-4 text-lg font-bold placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent/50"
        />
        
        {isFocused && filteredMovements.length > 0 && (
          <div className="absolute left-0 right-0 top-full z-10 mt-2 flex flex-col overflow-hidden rounded-2xl border border-border bg-bg-secondary shadow-card-lg animate-modal-in">
            {filteredMovements.map((m) => (
              <button
                key={m.id}
                onClick={() => setMovement(m.name)}
                className="px-5 py-3 text-left font-semibold transition-colors hover:bg-bg-accent-area active:bg-accent-active"
              >
                {m.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="relative">
          <input
            type="number"
            placeholder="Reps"
            value={reps}
            onChange={(e) => setReps(e.target.value === "" ? "" : Number(e.target.value))}
            className="w-full rounded-2xl bg-bg-primary px-5 py-4 text-center text-xl font-black focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
          <span className="absolute bottom-1 left-0 right-0 text-[10px] font-bold uppercase tracking-widest text-text-tertiary">
            Reps
          </span>
        </div>
        <div className="relative">
          <input
            type="number"
            placeholder={`Weight (${settings.unit})`}
            value={weight}
            onChange={(e) => setWeight(e.target.value === "" ? "" : Number(e.target.value))}
            className="w-full rounded-2xl bg-bg-primary px-5 py-4 text-center text-xl font-black focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
          <span className="absolute bottom-1 left-0 right-0 text-[10px] font-bold uppercase tracking-widest text-text-tertiary">
            {settings.unit}
          </span>
        </div>
      </div>

      <button
        onClick={() => setShowNotes(!showNotes)}
        className="flex items-center gap-2 text-sm font-bold text-text-secondary transition-opacity hover:opacity-70"
      >
        {showNotes ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        {showNotes ? "Hide Notes" : "Add Notes"}
      </button>

      {showNotes && (
        <textarea
          placeholder="How did it feel?"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="h-20 w-full resize-none rounded-2xl bg-bg-primary p-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/50 animate-fade-in"
        />
      )}

      <button
        onClick={handleLogSet}
        disabled={!movement || reps === "" || weight === ""}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-accent py-5 text-lg font-black text-white shadow-btn transition-all hover:bg-accent-hover active:scale-95 disabled:opacity-50 disabled:active:scale-100"
      >
        <Plus size={24} strokeWidth={3} />
        Log Set
      </button>
    </div>
  );
}
