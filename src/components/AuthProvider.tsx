"use client";
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getFirebaseApp } from '@/lib/firebase/client';
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, type Auth } from 'firebase/auth';

const getAuthSafe = (): Auth | null => {
  const app = getFirebaseApp();
  if (!app) return null;
  try { return getAuth(app); } catch { return null; }
};

export type UserInfo = { uid: string; email?: string | null; displayName?: string | null; photoURL?: string | null } | null;

type AuthCtx = {
  user: UserInfo;
  loading: boolean;
  isAdmin: boolean;
  signInGoogle: () => Promise<void>;
  signInEmail: (email: string, password: string) => Promise<void>;
  registerEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserInfo>(null);
  const [loading, setLoading] = useState(true);
  const adminEmail = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || '').toLowerCase();

  const auth = useMemo(() => getAuthSafe(), []);

  useEffect(() => {
    if (!auth) { setLoading(false); return; }
    return onAuthStateChanged(auth, u => {
      setUser(u ? { uid: u.uid, email: u.email, displayName: u.displayName, photoURL: u.photoURL } : null);
      setLoading(false);
    });
  }, [auth]);

  const isAdmin = !!(user?.email && adminEmail && user.email.toLowerCase() === adminEmail);

  async function signInGoogle() {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  }
  async function signInEmail(email: string, password: string) {
    if (!auth) return;
    await signInWithEmailAndPassword(auth, email, password);
  }
  async function registerEmail(email: string, password: string) {
    if (!auth) return;
    await createUserWithEmailAndPassword(auth, email, password);
  }
  async function logout() { if (!auth) return; await signOut(auth); }

  return <Ctx.Provider value={{ user, loading, isAdmin, signInGoogle, signInEmail, registerEmail, logout }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAuth must be used inside AuthProvider');
  return v;
}
