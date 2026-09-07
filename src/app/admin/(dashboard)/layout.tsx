import React from 'react';
import { redirect } from 'next/navigation';
import { createServerSideClient } from '@/lib/supabase/server';
import { AdminLayoutShell } from '@/components/layout/AdminLayoutShell';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSideClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin');
  }

  return (
    <AdminLayoutShell userEmail={user.email}>
      {children}
    </AdminLayoutShell>
  );
}
