'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { getStoredToken, setStoredToken } from '@/lib/auth';

const getBaseUrl = () =>
  process.env.NEXT_PUBLIC_BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [school, setSchool] = useState('');
  const [subject, setSubject] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (getStoredToken()) {
      router.replace('/assignments');
    }
  }, [router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`${getBaseUrl()}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, email, password, school, subject }),
      });
      const data = await res.json();
      if (!res.ok || !data?.token) {
        throw new Error(data?.message || 'Failed to sign up');
      }

      setStoredToken(data.token);
      router.push('/assignments');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-dvh bg-[#f0f2f5] flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#444] bg-[#f7f7f7] border border-gray-200 rounded-full px-3 py-1 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
          VedaAI Teacher Portal
        </div>
        <h1 className="text-2xl font-bold text-[#111]">Create teacher account</h1>
        <p className="text-sm text-[#666] mt-1 mb-6">Start generating assessments with your own workspace.</p>

        {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-4">{error}</p>}

        <label className="block text-sm font-medium mb-1">Name</label>
        <input required value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 mb-3 outline-none focus:border-gray-400" />

        <label className="block text-sm font-medium mb-1">Email</label>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 mb-3 outline-none focus:border-gray-400" />

        <label className="block text-sm font-medium mb-1">Password</label>
        <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 mb-3 outline-none focus:border-gray-400" />

        <label className="block text-sm font-medium mb-1">School (optional)</label>
        <input value={school} onChange={(e) => setSchool(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 mb-3 outline-none focus:border-gray-400" />

        <label className="block text-sm font-medium mb-1">Subject (optional)</label>
        <input value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 mb-5 outline-none focus:border-gray-400" />

        <button type="submit" disabled={submitting} className="w-full bg-[#141414] text-white rounded-full py-2.5 font-semibold disabled:opacity-60">
          {submitting ? 'Creating account...' : 'Create Account'}
        </button>

        <p className="text-sm text-[#666] mt-4 text-center">
          Already have an account? <Link href="/login" className="text-[#111] font-semibold hover:underline">Sign in</Link>
        </p>
      </form>
    </main>
  );
}
