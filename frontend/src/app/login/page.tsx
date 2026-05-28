'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { getStoredToken, setStoredToken } from '@/lib/auth';

const getBaseUrl = () =>
  process.env.NEXT_PUBLIC_BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      const res = await fetch(`${getBaseUrl()}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data?.token) {
        throw new Error(data?.message || 'Failed to login');
      }

      setStoredToken(data.token);
      router.push('/assignments');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
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
        <h1 className="text-2xl font-bold text-[#111]">Sign in to VedaAI</h1>
        <p className="text-sm text-[#666] mt-1 mb-6">Access your assignments and generation history.</p>

        {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-4">{error}</p>}

        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 mb-4 outline-none focus:border-gray-400"
        />

        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 mb-5 outline-none focus:border-gray-400"
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-[#141414] text-white rounded-full py-2.5 font-semibold disabled:opacity-60"
        >
          {submitting ? 'Signing in...' : 'Sign In'}
        </button>

        <p className="text-sm text-[#666] mt-4 text-center">
          No account? <Link href="/signup" className="text-[#111] font-semibold hover:underline">Create one</Link>
        </p>
      </form>
    </main>
  );
}
