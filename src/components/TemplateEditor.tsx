"use client";

import { useState } from "react";
import { Template, TemplateEntry, Movement } from "@/types";
import { Plus, Trash2, GripVertical, Check, X, Search } from "lucide-react";
import { SkeletonList } from "./Skeleton";

interface TemplateEditorProps {
  initialTemplate?: Template;
  movements: Movement[];
  onSave: (template: Partial<Template>) => Promise<void>;
  onCancel: () => void;
}

export function TemplateEditor({ initialTemplate, movements, onSave, onCancel }: TemplateEditorProps) {
  const [name, setName] = useState(initialTemplate?.name || "");
  const [entries, setEntries] = useState<TemplateEntry[]>(initialTemplate?.entries || []);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [saving, setSaving] = useState(false);

  const filteredMovements = movements
    .filter(m => m.name.toLowerCase().includes(search.toLowerCase()))
    .slice(0, 5);

  const addMovement = (m: Movement) => {
    setEntries([...entries, {
      movementName: m.name,
      reps: 10,
      weight: 0,
      unit: 'kg'
    }]);
    setSearch("");
    setShowSearch(false);
  };

  const removeEntry = (index: number) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  const updateEntry = (index: number, updates: Partial<TemplateEntry>) => {
    const newEntries = [...entries];
    newEntries[index] = { ...newEntries[index], ...updates };
    setEntries(newEntries);
  };

  const handleSave = async () => {
    if (!name.trim() || entries.length === 0) return;
    setSaving(true);
    await onSave({ name, entries });
    setSaving(false);
  };

  return (
    <div className="flex flex-col gap-8 animate-modal-in pb-10">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-text-primary">
          {initialTemplate ? "Edit Template" : "New Template"}
        </h2>
        <button onClick={onCancel} className="text-text-tertiary">
          <X size={24} />
        </button>
      </div>

      <div className="flex flex-col gap-6">
        {/* Name Input */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-text-tertiary px-1">Routine Name</label>
          <input 
            type="text"
            placeholder="e.g. Push Day"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="card-depth w-full rounded-2xl bg-bg-secondary px-6 py-5 text-xl font-black focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
        </div>

        {/* Entries List */}
        <div className="flex flex-col gap-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-text-tertiary px-1">Exercises</label>
          {entries.map((entry, index) => (
            <div key={index} className="card-depth flex flex-col gap-4 rounded-[2rem] bg-bg-secondary p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-bg-accent-area text-accent">
                    <Dumbbell size={18} />
                  </div>
                  <span className="font-black text-text-primary">{entry.movementName}</span>
                </div>
                <button onClick={() => removeEntry(index)} className="text-text-tertiary hover:text-danger">
                  <Trash2 size={18} />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <input 
                  type="number"
                  value={entry.reps}
                  onChange={(e) => updateEntry(index, { reps: Number(e.target.value) })}
                  className="rounded-xl bg-bg-primary px-4 py-3 text-center font-black focus:outline-none"
                />
                <input 
                  type="number"
                  value={entry.weight}
                  onChange={(e) => updateEntry(index, { weight: Number(e.target.value) })}
                  className="rounded-xl bg-bg-primary px-4 py-3 text-center font-black focus:outline-none"
                />
              </div>
            </div>
          ))}

          {/* Add Entry Button */}
          {!showSearch ? (
            <button 
              onClick={() => setShowSearch(true)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border py-6 text-sm font-black uppercase tracking-widest text-text-tertiary transition-all active:scale-95 hover:border-accent hover:text-accent"
            >
              <Plus size={20} strokeWidth={3} />
              Add Exercise
            </button>
          ) : (
            <div className="flex flex-col gap-2 animate-fade-in">
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-text-tertiary" size={18} />
                <input 
                  autoFocus
                  type="text"
                  placeholder="Search movements..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-2xl bg-bg-secondary px-12 py-4 font-bold shadow-card focus:outline-none"
                />
              </div>
              {filteredMovements.map(m => (
                <button 
                  key={m.id}
                  onClick={() => addMovement(m)}
                  className="flex items-center gap-3 rounded-xl bg-bg-secondary p-4 font-bold text-text-primary shadow-sm hover:bg-bg-accent-area"
                >
                  <PlusCircle size={18} className="text-accent" />
                  {m.name}
                </button>
              ))}
              <button onClick={() => setShowSearch(false)} className="py-2 text-[10px] font-black uppercase tracking-widest text-text-tertiary">Cancel</button>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="sticky bottom-4 mt-4 flex gap-3">
        <button 
          onClick={handleSave}
          disabled={saving || !name || entries.length === 0}
          className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-accent py-5 font-black text-white shadow-btn transition-all active:scale-95 disabled:opacity-50"
        >
          <Check size={20} strokeWidth={3} />
          {saving ? "Saving..." : "Save Template"}
        </button>
      </div>
    </div>
  );
}

import { PlusCircle, Dumbbell as DumbbellIcon } from "lucide-react";
