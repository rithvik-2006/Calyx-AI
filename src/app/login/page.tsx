'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      
      if (res.ok) {
        router.push('/dashboard');
        router.refresh();
      } else {
        setError(data.error || 'Failed to login');
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full max-w-[430px] px-lg py-xl flex flex-col justify-center min-h-[1024px]">
      <div className="flex flex-col items-center mb-xl w-full text-center">
        <img src="/logo.png" alt="Calyx AI" className="w-16 h-16 rounded-2xl object-cover mb-lg shadow-xl" />
        <h1 className="font-display-data text-on-surface mb-sm tracking-tighter">
          Welcome Back
        </h1>
        <p className="font-body-lg text-on-surface-variant">
          Sign in to continue to Calyx AI.
        </p>
      </div>

      <form onSubmit={handleLogin} className="w-full flex flex-col gap-md">
        {error && <div className="text-error text-center font-body-sm">{error}</div>}
        
        <div className="flex flex-col gap-xs relative">
          <label htmlFor="email" className="sr-only">Email address</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            placeholder="Email address" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-minimal w-full px-md py-lg rounded-xl text-on-surface font-body-lg appearance-none" 
          />
        </div>

        <div className="flex flex-col gap-xs relative">
          <label htmlFor="password" className="sr-only">Password</label>
          <div className="relative w-full">
            <input 
              type={showPassword ? 'text' : 'password'} 
              id="password" 
              name="password" 
              placeholder="Password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-minimal w-full px-md py-lg rounded-xl text-on-surface font-body-lg appearance-none pr-[50px]" 
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-md top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]" data-icon={showPassword ? 'visibility' : 'visibility_off'}>
                {showPassword ? 'visibility' : 'visibility_off'}
              </span>
            </button>
          </div>
        </div>

        <div className="flex justify-end mt-sm mb-lg">
          <Link href="#" className="font-body-sm text-on-surface-variant hover:text-on-surface transition-colors">
            Forgot password?
          </Link>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="group w-full bg-[#FFFFFF] text-[#000000] font-headline-md py-[18px] rounded-[24px] hover:bg-opacity-90 transition-all duration-300 transform active:scale-[0.98] mt-sm flex items-center justify-center gap-sm disabled:opacity-50"
        >
          <span>{loading ? 'Signing In...' : 'Sign In'}</span>
          {!loading && (
            <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1" data-icon="arrow_forward">
              arrow_forward
            </span>
          )}
        </button>
      </form>

      <div className="mt-xl text-center w-full">
        <p className="font-body-sm text-on-surface-variant">
          Don't have an account? 
          <Link href="/register" className="text-on-surface font-medium hover:underline underline-offset-4 ml-sm">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
