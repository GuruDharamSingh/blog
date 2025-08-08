"use client";
import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { signInGoogle, signInEmail, registerEmail, user, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login'|'register'>('login');
  const [error, setError] = useState('');
  const router = useRouter();

  if (user) {
    router.replace('/admin');
  }

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      if (mode === 'login') await signInEmail(email, password); else await registerEmail(email, password);
    } catch (e:any) {
      setError(e.message);
    }
  }

  return (
    <div className="mx-auto max-w-md py-16 px-4 space-y-6">
      <h1 className="text-2xl font-bold">{mode === 'login' ? 'Sign In' : 'Register'}</h1>
      <button onClick={()=>signInGoogle()} className="w-full bg-black text-white py-2 rounded">Continue with Google</button>
      <div className="text-center text-xs text-neutral-500">or email</div>
      <form onSubmit={handleEmail} className="space-y-4">
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="Email" className="w-full border rounded px-3 py-2" />
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="Password" className="w-full border rounded px-3 py-2" />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button disabled={loading} className="w-full border py-2 rounded">{mode==='login'? 'Sign In' : 'Create Account'}</button>
      </form>
      <button className="text-xs underline" onClick={()=> setMode(m => m==='login'? 'register':'login')}>{mode==='login'? 'Need an account? Register' : 'Have an account? Sign in'}</button>
    </div>
  );
}
