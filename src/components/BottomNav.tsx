"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, ClipboardList, Dumbbell, BarChart2, Settings } from "lucide-react";

const tabs = [
  { name: "Workout", href: "/", icon: Activity },
  { name: "Templates", href: "/templates", icon: ClipboardList },
  { name: "Movements", href: "/movements", icon: Dumbbell },
  { name: "History", href: "/history", icon: BarChart2 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-center p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div className="flex w-full max-w-lg items-center justify-around rounded-2xl border border-glass-border bg-glass-bg py-3 shadow-card-lg backdrop-blur-xl">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;

          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`group relative flex flex-col items-center gap-1 transition-all active:scale-90 ${
                isActive ? "text-accent" : "text-text-tertiary"
              }`}
            >
              <div
                className={`relative flex items-center justify-center transition-all ${
                  isActive ? "scale-110 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" : ""
                }`}
              >
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest">
                {tab.name}
              </span>
              {isActive && (
                <div className="absolute -bottom-1.5 h-1 w-1 rounded-full bg-accent animate-pulse-ring" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
