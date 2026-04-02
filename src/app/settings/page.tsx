"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";
import { useTheme } from "@/contexts/ThemeContext";
import { getWorkouts } from "@/lib/firestore";
import { Settings, LogOut, Sun, Moon, Monitor, Box, Download, User } from "lucide-react";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { settings, updateSettings } = useSettings();
  const { theme, setTheme } = useTheme();

  const handleExport = async () => {
    if (!user) return;
    const workouts = await getWorkouts(user.uid);
    
    // Create CSV header
    let csv = "Date,Movement,Sets,Reps,Weight,Unit,Notes\n";
    
    workouts.forEach(w => {
      w.entries.forEach(e => {
        csv += `${w.date},"${e.movementName}",1,${e.reps},${e.weight},${e.unit},"${e.notes || ""}"\n`;
      });
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `gym-trainer-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in pb-20">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-accent">
          <Settings size={14} strokeWidth={3} />
          Account & App
        </div>
        <h1 className="text-4xl font-black tracking-tight text-text-primary">
          Settings
        </h1>
      </div>

      {/* Profile Section */}
      <div className="card-depth flex flex-col gap-4 rounded-[2rem] bg-bg-secondary p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-bg-tertiary text-accent">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="h-16 w-16 rounded-3xl object-cover" />
            ) : (
              <User size={32} />
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-text-primary">Profile</span>
            <span className="text-sm font-medium text-text-tertiary">{user?.email}</span>
          </div>
        </div>
        <button 
          onClick={logout}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-danger/10 py-4 text-sm font-black text-danger transition-all active:scale-95"
        >
          <LogOut size={18} strokeWidth={3} />
          Log Out
        </button>
      </div>

      {/* Appearance Section */}
      <div className="card-depth flex flex-col gap-4 rounded-[2rem] bg-bg-secondary p-6">
        <h2 className="text-sm font-black uppercase tracking-widest text-text-tertiary">Appearance</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'light', icon: Sun, label: 'Light' },
            { id: 'dark', icon: Moon, label: 'Dark' },
            { id: 'system', icon: Monitor, label: 'Auto' }
          ].map(opt => (
            <button
              key={opt.id}
              onClick={() => setTheme(opt.id as any)}
              className={`flex flex-col items-center gap-2 rounded-2xl py-4 transition-all active:scale-95 ${
                theme === opt.id ? "bg-accent text-white shadow-btn" : "bg-bg-primary text-text-tertiary"
              }`}
            >
              <opt.icon size={20} strokeWidth={2.5} />
              <span className="text-[10px] font-black uppercase tracking-widest">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Weight Units Section */}
      <div className="card-depth flex flex-col gap-4 rounded-[2rem] bg-bg-secondary p-6">
        <h2 className="text-sm font-black uppercase tracking-widest text-text-tertiary">Weight Unit</h2>
        <div className="grid grid-cols-2 gap-3">
          {['kg', 'lbs'].map(u => (
            <button
              key={u}
              onClick={() => updateSettings({ unit: u as any })}
              className={`rounded-2xl py-5 text-xl font-black transition-all active:scale-95 ${
                settings.unit === u ? "bg-accent text-white shadow-btn" : "bg-bg-primary text-text-tertiary"
              }`}
            >
              {u}
            </button>
          ))}
        </div>
      </div>

      {/* Data Export Section */}
      <div className="card-depth flex flex-col gap-4 rounded-[2rem] bg-bg-secondary p-6">
        <h2 className="text-sm font-black uppercase tracking-widest text-text-tertiary">Data Management</h2>
        <button 
          onClick={handleExport}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-bg-primary py-5 font-black text-text-primary transition-all active:scale-95 hover:bg-bg-accent-area"
        >
          <Download size={20} strokeWidth={3} />
          Export Data as CSV
        </button>
      </div>

      <footer className="mt-4 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-tertiary">
          Gym Trainer • Built with Next.js & Firebase
        </p>
      </footer>
    </div>
  );
}
