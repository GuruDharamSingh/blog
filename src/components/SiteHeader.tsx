"use client";
import Link from 'next/link';

export function SiteHeader() {
  return (
    <header className="w-full border-b border-gray-800 bg-black">
      <div className="mx-auto max-w-4xl px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-light text-2xl tracking-wide text-white">Justin's Blog</Link>
        <nav className="flex items-center gap-6 text-sm text-gray-400">
          <Link href="/" className="hover:text-white transition-colors">Posts</Link>
          <Link href="/about" className="hover:text-white transition-colors">About</Link>
          <Link href="/private" className="hover:text-white transition-colors">Private</Link>
        </nav>
      </div>
    </header>
  );
}
