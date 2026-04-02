"use client";

import { useState } from "react";
import { WorkoutEntry } from "@/types";
import { Trash2, Copy, Edit2, Check } from "lucide-react";
import { updateWorkoutEntry } from "@/lib/firestore";
import { useAuth } from "@/contexts/AuthContext";

interface WorkoutListProps {
  date: string;
  entries: WorkoutEntry[];
}

export function WorkoutList({ date, entries }: WorkoutListProps) {
  const { user } = useAuth();
  const [editingId, setEditingId] = useState<string | null>(null);

  // Group entries by movement name
  const groups = entries.reduce((acc, entry) => {
    if (!acc[entry.movementName]) acc[entry.movementName] = [];
    acc[entry.movementName].push(entry);
    return acc;
  }, {} as Record<string, WorkoutEntry[]>);

  const handleDelete = async (entryId: string) => {
    if (!user) return;
    const filtered = entries.filter(e => e.id !== entryId);
    await updateWorkoutEntry(user.uid, date, filtered);
  };

  const handleDuplicate = async (entry: WorkoutEntry) => {
    if (!user) return;
    const newEntry: WorkoutEntry = {
      ...entry,
      id: Math.random().toString(36).substring(7),
      createdAt: Date.now()
    };
    await updateWorkoutEntry(user.uid, date, [...entries, newEntry]);
  };

  return (
    <div className="flex flex-col gap-8 pb-10">
      {Object.entries(groups).map(([name, groupEntries]) => (
        <div key={name} className="flex flex-col gap-3 animate-stagger-in">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xl font-black tracking-tight text-text-primary">
              {name}
            </h2>
            <span className="rounded-full bg-bg-tertiary px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-text-secondary">
              {groupEntries.length} Sets
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {groupEntries.map((entry, index) => (
              <div 
                key={entry.id}
                className="card-depth flex items-center justify-between rounded-2xl bg-bg-secondary p-4 transition-all"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-bg-accent-area text-xs font-bold text-accent">
                    {index + 1}
                  </span>
                  <div className="flex flex-col">
                    <div className="flex items-baseline gap-1 font-black">
                      <span className="text-lg">{entry.reps}</span>
                      <span className="text-xs uppercase text-text-tertiary">×</span>
                      <span className="text-lg">{entry.weight}</span>
                      <span className="ml-0.5 text-xs font-bold text-text-tertiary">{entry.unit}</span>
                    </div>
                    {entry.notes && (
                      <p className="text-xs font-medium text-text-tertiary">{entry.notes}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => handleDuplicate(entry)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-text-tertiary transition-all hover:bg-bg-accent-area hover:text-accent active:scale-90"
                  >
                    <Copy size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(entry.id)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-text-tertiary transition-all hover:bg-danger-hover hover:text-white active:scale-90"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
