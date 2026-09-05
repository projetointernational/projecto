'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { LogOut, Loader2, ShieldCheck } from 'lucide-react';

interface AdminHeaderProps {
  userEmail?: string | null;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ userEmail }) => {
  const router = useRouter();
  const supabase = createClient();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('[AdminHeader] Sign out error:', err);
    } finally {
      router.push('/admin');
      router.refresh();
      setIsSigningOut(false);
    }
  };

  return (
    <header className="h-16 bg-white border-b border-sand px-6 sm:px-8 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <span className="w-2 h-2 rounded-full bg-olive animate-pulse" />
        <span className="text-[11px] uppercase tracking-widest text-warm-grey font-medium hidden sm:inline-block">
          Supabase Live Authentication & Database
        </span>
        <span className="text-[11px] uppercase tracking-widest text-warm-grey font-medium sm:hidden">
          Live Database
        </span>
      </div>

      <div className="flex items-center space-x-4">
        {userEmail && (
          <div className="flex items-center space-x-2 text-xs text-warm-grey bg-sand/30 px-2.5 py-1 rounded-sm border border-sand">
            <ShieldCheck className="w-3.5 h-3.5 text-olive" />
            <span className="font-mono text-[11px] max-w-[160px] truncate">{userEmail}</span>
          </div>
        )}

        <button
          type="button"
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="flex items-center space-x-1.5 text-xs text-warm-grey hover:text-red-700 transition-colors px-2 py-1 rounded-sm hover:bg-sand/30 disabled:opacity-50"
          title="Sign out of administrative session"
        >
          {isSigningOut ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <LogOut className="w-3.5 h-3.5" />
          )}
          <span className="hidden sm:inline-block">
            {isSigningOut ? 'Signing out...' : 'Sign Out'}
          </span>
        </button>
      </div>
    </header>
  );
};
