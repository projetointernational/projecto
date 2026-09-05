import React from 'react';
import { redirect } from 'next/navigation';
import { createServerSideClient } from '@/lib/supabase/server';
import { AdminLoginForm } from '@/components/admin/AdminLoginForm';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Projecto Administration — Secure Portal Sign In',
  description: 'Internal administration portal sign in for Projecto.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLoginPage() {
  const supabase = await createServerSideClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If already authenticated, forward to dashboard
  if (user) {
    redirect('/admin/dashboard');
  }

  return (
    <main className="min-h-screen bg-off-white flex flex-col justify-center items-center px-6 py-12">
      <AdminLoginForm />
    </main>
  );
}
