"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy, deleteDoc, doc, addDoc, updateDoc } from "firebase/firestore";
import { Template, Movement } from "@/types";
import { ClipboardList, Plus, Play, Edit2, Trash2, CheckCircle2, Box } from "lucide-react";
import { SkeletonList } from "@/components/Skeleton";
import { TemplateEditor } from "@/components/TemplateEditor";
import { addEntriesToWorkout, getMovements } from "@/lib/firestore";
import { useRouter } from "next/navigation";

export default function TemplatesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<Template | undefined>(undefined);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, `users/${user.uid}/templates`), orderBy("order", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setTemplates(snap.docs.map(d => ({ id: d.id, ...d.data() } as Template)));
      setLoading(false);
    });

    getMovements(user.uid).then(setMovements);

    return unsub;
  }, [user]);

  const handleLoad = async (template: Template) => {
    if (!user) return;
    setLoadingId(template.id);
    const today = new Date().toISOString().split('T')[0];
    
    try {
      await addEntriesToWorkout(user.uid, today, template.entries);
      setLoadingId("loaded");
      setTimeout(() => {
        router.push("/");
      }, 1200);
    } catch (e) {
      console.error(e);
      setLoadingId(null);
    }
  };

  const handleSave = async (data: Partial<Template>) => {
    if (!user) return;
    
    if (currentTemplate) {
      await updateDoc(doc(db, `users/${user.uid}/templates`, currentTemplate.id), data);
    } else {
      await addDoc(collection(db, `users/${user.uid}/templates`), {
        ...data,
        createdAt: Date.now(),
        order: templates.length
      });
    }
    
    setIsEditing(false);
    setCurrentTemplate(undefined);
  };

  const handleDelete = async (id: string) => {
    if (!user || !confirm("Delete this template?")) return;
    await deleteDoc(doc(db, `users/${user.uid}/templates`, id));
  };

  if (loading) return <SkeletonList />;

  if (isEditing) {
    return (
      <TemplateEditor 
        initialTemplate={currentTemplate}
        movements={movements}
        onSave={handleSave}
        onCancel={() => {
          setIsEditing(false);
          setCurrentTemplate(undefined);
        }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-8 animate-fade-in pb-20">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-accent">
            <ClipboardList size={14} strokeWidth={3} />
            Saved Routines
          </div>
          <h1 className="text-4xl font-black tracking-tight text-text-primary">
            Templates
          </h1>
        </div>
        <button 
          onClick={() => setIsEditing(true)}
          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-white shadow-btn active:scale-95 transition-all"
        >
          <Plus size={28} strokeWidth={3} />
        </button>
      </div>

      {templates.length === 0 ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-bg-tertiary text-text-tertiary">
            <Box size={40} />
          </div>
          <p className="text-lg font-black text-text-secondary">No templates yet</p>
          <button 
            onClick={() => setIsEditing(true)}
            className="text-xs font-bold uppercase tracking-widest text-accent"
          >
            Create your first routine
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {templates.map(t => (
            <div key={t.id} className="card-depth flex flex-col gap-4 rounded-[2rem] bg-bg-secondary p-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <h3 className="text-xl font-black text-text-primary">{t.name}</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-text-tertiary">
                    {t.entries.length} Exercises
                  </p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setCurrentTemplate(t);
                      setIsEditing(true);
                    }}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-bg-primary text-text-secondary hover:text-accent transition-all"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(t.id)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-bg-primary text-text-secondary hover:text-danger transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {t.entries.slice(0, 3).map((e, i) => (
                  <span key={i} className="rounded-lg bg-bg-accent-area px-3 py-1 text-xs font-bold text-accent">
                    {e.movementName}
                  </span>
                ))}
                {t.entries.length > 3 && (
                  <span className="rounded-lg bg-bg-tertiary px-3 py-1 text-xs font-bold text-text-tertiary">
                    +{t.entries.length - 3} more
                  </span>
                )}
              </div>

              <button 
                onClick={() => handleLoad(t)}
                disabled={loadingId !== null}
                className={`flex w-full items-center justify-center gap-3 rounded-2xl py-4 font-black transition-all active:scale-95 ${
                  loadingId === t.id ? "bg-bg-tertiary text-text-tertiary animate-pulse" :
                  loadingId === "loaded" ? "bg-success text-white" :
                  "bg-text-primary text-bg-secondary shadow-card hover:shadow-card-hover"
                }`}
              >
                {loadingId === t.id ? (
                  "Loading..."
                ) : loadingId === "loaded" ? (
                  <>
                    <CheckCircle2 size={20} strokeWidth={3} />
                    Loaded!
                  </>
                ) : (
                  <>
                    <Play size={18} strokeWidth={3} />
                    Load Routine
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
