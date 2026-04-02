"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc } from "firebase/firestore";
import { Movement, Category } from "@/types";
import { Dumbbell, Search, Plus, Filter, Trash2 } from "lucide-react";
import { SkeletonList } from "@/components/Skeleton";

const CATEGORIES: Category[] = ['Legs', 'Back', 'Chest', 'Shoulders', 'Arms', 'Core', 'Cardio', 'Other'];

export default function MovementsPage() {
  const { user } = useAuth();
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Category | 'All'>('All');
  const [newName, setNewName] = useState("");
  const [newCat, setNewCat] = useState<Category>('Other');

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, `users/${user.uid}/movements`), orderBy("name"));
    const unsub = onSnapshot(q, (snap) => {
      setMovements(snap.docs.map(d => ({ id: d.id, ...d.data() } as Movement)));
      setLoading(false);
    });
    return unsub;
  }, [user]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newName.trim()) return;
    await addDoc(collection(db, `users/${user.uid}/movements`), {
      name: newName.trim(),
      category: newCat,
      isCustom: true
    });
    setNewName("");
  };

  const handleDelete = async (id: string) => {
    if (!user || !confirm("Delete this movement from your library?")) return;
    await deleteDoc(doc(db, `users/${user.uid}/movements`, id));
  };

  const filtered = movements.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filter === 'All' || m.category === filter;
    return matchesSearch && matchesCategory;
  });

  if (loading) return <SkeletonList />;

  return (
    <div className="flex flex-col gap-8 animate-fade-in pb-20">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-accent">
          <Dumbbell size={14} strokeWidth={3} />
          Exercise Library
        </div>
        <h1 className="text-4xl font-black tracking-tight text-text-primary">
          Movements
        </h1>
      </div>

      {/* Add New Form */}
      <form onSubmit={handleAdd} className="card-depth flex flex-col gap-4 rounded-[2rem] bg-bg-secondary p-6">
        <h2 className="text-sm font-black uppercase tracking-widest text-text-tertiary">New Exercise</h2>
        <div className="flex flex-col gap-3">
          <input 
            type="text" 
            placeholder="Name (e.g. Incline Bench)"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full rounded-2xl bg-bg-primary px-5 py-4 font-bold focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
          <div className="flex gap-2 text-sm">
            <select 
              value={newCat}
              onChange={(e) => setNewCat(e.target.value as Category)}
              className="flex-1 rounded-xl bg-bg-primary px-4 py-3 font-bold text-text-secondary focus:outline-none"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button 
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-accent px-6 py-3 font-black text-white active:scale-95 transition-all"
            >
              <Plus size={20} strokeWidth={3} />
              Add
            </button>
          </div>
        </div>
      </form>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-text-tertiary" size={20} />
          <input 
            type="text"
            placeholder="Search movements..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl bg-bg-secondary px-14 py-4 font-bold shadow-card focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button 
            onClick={() => setFilter('All')}
            className={`whitespace-nowrap rounded-full px-5 py-2 text-xs font-black uppercase tracking-widest transition-all ${filter === 'All' ? 'bg-accent text-white shadow-btn' : 'bg-bg-secondary text-text-tertiary'}`}
          >
            All
          </button>
          {CATEGORIES.map(c => (
            <button 
              key={c}
              onClick={() => setFilter(c)}
              className={`whitespace-nowrap rounded-full px-5 py-2 text-xs font-black uppercase tracking-widest transition-all ${filter === c ? 'bg-accent text-white shadow-btn' : 'bg-bg-secondary text-text-tertiary'}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex flex-col gap-2">
        {filtered.map(m => (
          <div key={m.id} className="card-depth flex items-center justify-between rounded-2xl bg-bg-secondary p-5 transition-all">
            <div className="flex flex-col gap-1">
              <span className="text-lg font-black text-text-primary">{m.name}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-text-tertiary">{m.category}</span>
            </div>
            <button 
              onClick={() => handleDelete(m.id)}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-text-tertiary transition-all hover:bg-danger/10 hover:text-danger active:scale-95"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
