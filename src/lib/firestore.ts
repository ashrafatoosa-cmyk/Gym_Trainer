import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  Timestamp,
  writeBatch
} from "firebase/firestore";
import { db } from "./firebase";
import { Workout, WorkoutEntry, Template, Movement, UserSettings } from "../types";

const getUsersCollection = (userId: string) => collection(db, `users/${userId}/workouts`);
const getMovementsCollection = (userId: string) => collection(db, `users/${userId}/movements`);
const getTemplatesCollection = (userId: string) => collection(db, `users/${userId}/templates`);
const getSettingsDoc = (userId: string) => doc(db, `users/${userId}/settings/current`);

export const addEntriesToWorkout = async (userId: string, date: string, entries: Omit<WorkoutEntry, 'id' | 'createdAt'>[]) => {
  const workoutId = date; // One workout per day for simplicity, or generate unique ID
  const workoutRef = doc(db, `users/${userId}/workouts`, workoutId);
  const workoutSnap = await getDoc(workoutRef);
  
  const now = Date.now();
  const newEntries: WorkoutEntry[] = entries.map(e => ({
    ...e,
    id: Math.random().toString(36).substring(7),
    createdAt: now
  }));

  if (workoutSnap.exists()) {
    const existingData = workoutSnap.data() as Workout;
    await updateDoc(workoutRef, {
      entries: [...existingData.entries, ...newEntries],
      completed: false
    });
  } else {
    const newWorkout: Workout = {
      id: workoutId,
      date,
      entries: newEntries,
      createdAt: now,
      completed: false
    };
    await setDoc(workoutRef, newWorkout);
  }
};

export const getWorkouts = async (userId: string): Promise<Workout[]> => {
  const q = query(collection(db, `users/${userId}/workouts`), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() } as Workout))
    .filter(w => w.entries.length > 0);
};

export const deleteWorkout = async (userId: string, workoutId: string) => {
  await deleteDoc(doc(db, `users/${userId}/workouts`, workoutId));
};

export const updateWorkoutEntry = async (userId: string, workoutId: string, updatedEntries: WorkoutEntry[]) => {
  const workoutRef = doc(db, `users/${userId}/workouts`, workoutId);
  if (updatedEntries.length === 0) {
    await deleteDoc(workoutRef);
  } else {
    await updateDoc(workoutRef, { entries: updatedEntries });
  }
};

// Movement Helpers
export const getMovements = async (userId: string): Promise<Movement[]> => {
  const q = query(getMovementsCollection(userId), orderBy("name", "asc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Movement));
};

export const seedMovements = async (userId: string, movements: Omit<Movement, 'id'>[]) => {
  const batch = writeBatch(db);
  movements.forEach(m => {
    const ref = doc(getMovementsCollection(userId));
    batch.set(ref, m);
  });
  await batch.commit();
};

// Settings Helpers
export const getSettings = async (userId: string): Promise<UserSettings | null> => {
  const snap = await getDoc(getSettingsDoc(userId));
  return snap.exists() ? snap.data() as UserSettings : null;
};

export const saveSettings = async (userId: string, settings: UserSettings) => {
  await setDoc(getSettingsDoc(userId), settings);
};
