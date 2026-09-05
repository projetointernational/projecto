'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export const AdminLoginForm: React.FC = () => {
  const router = useRouter();
  const supabase = createClient();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ identifier?: string; password?: string }>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const validate = (): boolean => {
    const errors: { identifier?: string; password?: string } = {};

    const cleanIdentifier = identifier.trim();
    if (!cleanIdentifier) {
      errors.identifier = 'Please enter your administrator email or username.';
    }

    if (!password) {
      errors.password = 'Please enter your password.';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const cleanIdentifier = identifier.trim();
      // If user inputs a username without @, ensure email resolution
      const email = cleanIdentifier.includes('@')
        ? cleanIdentifier
        : `${cleanIdentifier}@projecto.com`;

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data?.session) {
        // Successful login: route to dashboard
        router.push('/admin/dashboard');
        router.refresh();
      } else {
        throw new Error('Authentication session could not be established.');
      }
    } catch (err: unknown) {
      console.error('[AdminLogin] Authentication failure:', err);
      let message = 'Invalid administrator credentials. Please verify your email and password.';

      if (err instanceof Error) {
        if (
          err.message.includes('Invalid login credentials') ||
          err.message.includes('invalid_credentials')
        ) {
          message = 'Invalid administrator credentials. Please check your email and password.';
        } else if (err.message.includes('Email not confirmed')) {
          message = 'This administrator account email has not been confirmed yet.';
        } else if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
          message = 'Network connection to Supabase Auth service failed. Please try again.';
        } else {
          message = err.message;
        }
      }

      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-sm shadow-sm border border-sand">
      {/* Brand Header */}
      <div className="text-center space-y-2 mb-8">
        <span className="font-serif text-3xl tracking-[0.25em] font-normal uppercase text-near-black block">
          PROJECTO
        </span>
        <div className="flex items-center justify-center space-x-2">
          <span className="h-px w-6 bg-warm-grey/30" />
          <span className="text-[11px] uppercase tracking-[0.2em] text-warm-grey font-medium">
            Administrative Access
          </span>
          <span className="h-px w-6 bg-warm-grey/30" />
        </div>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div
          role="alert"
          className="mb-6 p-3.5 bg-red-50/80 border border-red-200 text-red-800 text-xs rounded-sm flex items-start space-x-2.5 animate-fadeIn"
        >
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
          <span className="leading-relaxed">{errorMessage}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* Email or Username */}
        <div>
          <label
            htmlFor="admin-identifier"
            className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-1.5"
          >
            Email or Username
          </label>
          <div className="relative">
            <input
              id="admin-identifier"
              type="text"
              autoComplete="username"
              disabled={isSubmitting}
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                if (fieldErrors.identifier) {
                  setFieldErrors((prev) => ({ ...prev, identifier: undefined }));
                }
              }}
              placeholder="admin@projecto.com"
              className={`w-full bg-sand/20 focus:bg-white text-sm pl-10 pr-4 py-2.5 rounded-sm ring-1 transition-all outline-none font-sans ${
                fieldErrors.identifier
                  ? 'ring-red-400 focus:ring-red-500'
                  : 'ring-sand focus:ring-2 focus:ring-olive'
              }`}
            />
            <Mail className="w-4 h-4 text-warm-grey absolute left-3.5 top-3.5 pointer-events-none" />
          </div>
          {fieldErrors.identifier && (
            <p className="mt-1.5 text-[11px] text-red-600 font-medium">
              {fieldErrors.identifier}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="admin-password"
            className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-1.5"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="admin-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              disabled={isSubmitting}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldErrors.password) {
                  setFieldErrors((prev) => ({ ...prev, password: undefined }));
                }
              }}
              placeholder="••••••••••••"
              className={`w-full bg-sand/20 focus:bg-white text-sm pl-10 pr-10 py-2.5 rounded-sm ring-1 transition-all outline-none font-sans ${
                fieldErrors.password
                  ? 'ring-red-400 focus:ring-red-500'
                  : 'ring-sand focus:ring-2 focus:ring-olive'
              }`}
            />
            <Lock className="w-4 h-4 text-warm-grey absolute left-3.5 top-3.5 pointer-events-none" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              className="absolute right-3 top-3 text-warm-grey hover:text-near-black transition-colors focus:outline-none"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {fieldErrors.password && (
            <p className="mt-1.5 text-[11px] text-red-600 font-medium">
              {fieldErrors.password}
            </p>
          )}
        </div>

        {/* Submit CTA */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="olive"
            size="lg"
            className="w-full"
            isLoading={isSubmitting}
            icon={<ArrowRight className="w-4 h-4" strokeWidth={1.5} />}
          >
            {isSubmitting ? 'Authenticating...' : 'Sign In to Portal'}
          </Button>
        </div>
      </form>

      {/* Security Footer */}
      <div className="mt-8 pt-6 border-t border-sand/80 text-center">
        <div className="flex items-center justify-center space-x-1.5 text-[11px] text-warm-grey">
          <ShieldCheck className="w-3.5 h-3.5 text-olive" />
          <span>Restricted Portal &bull; Supabase Security & RLS</span>
        </div>
      </div>
    </div>
  );
};
