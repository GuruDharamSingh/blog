"use client";
import Link from 'next/link';

export function SiteHeader() {
  return (
    <header className="w-full border-b border-neutral-200 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50">
      <div className="mx-auto max-w-3xl px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold text-lg tracking-tight">My Blog</Link>
        <nav className="flex items-center gap-6 text-sm text-neutral-600">
          <Link href="/" className="hover:text-black">Posts</Link>
          <Link href="/about" className="hover:text-black">About</Link>
          <Link href="/admin" className="hover:text-black">Admin</Link>
        </nav>
      </div>
    </header>
  );
}
