"use client";
import Link from 'next/link';
import { useAuth } from './AuthProvider';

export function SiteHeader() {
  const { user, isAdmin, logout } = useAuth();
  return (
    <header className="w-full border-b border-neutral-200 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50">
      <div className="mx-auto max-w-3xl px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold text-lg tracking-tight">My Blog</Link>
        <nav className="flex items-center gap-6 text-sm text-neutral-600">
          <Link href="/" className="hover:text-black">Posts</Link>
          <Link href="/about" className="hover:text-black">About</Link>
          {isAdmin && <Link href="/admin" className="hover:text-black">Admin</Link>}
          {!user ? (
            <Link href="/login" className="hover:text-black">Login</Link>
          ) : (
            <button onClick={()=>logout()} className="text-xs border px-2 py-1 rounded">Logout</button>
          )}
        </nav>
      </div>
    </header>
  );
}
