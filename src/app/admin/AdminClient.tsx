"use client";
import { EditorClient } from '@/components/EditorClient';
import { useAuth } from '@/components/AuthProvider';
import Link from 'next/link';

export default function AdminClient() {
  const { user, isAdmin } = useAuth();

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl py-12 px-4 space-y-4">
        <h1 className="text-2xl font-bold">Sign in required</h1>
        <p>Please <Link href="/login" className="underline">sign in</Link> to continue.</p>
      </div>
    );
  }
  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-3xl py-12 px-4 space-y-4">
        <h1 className="text-2xl font-bold">Access denied</h1>
        <p>Your account is not authorized to manage posts.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl py-12 px-4 space-y-8">
      <h1 className="text-3xl font-bold">New Post Draft</h1>
      <p className="text-sm text-neutral-600">Use the in-browser editor to draft content, enrich, and publish.</p>
      <EditorClient />
    </div>
  );
}
