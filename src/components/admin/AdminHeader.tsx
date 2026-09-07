'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { LogOut, Loader2, ShieldCheck, Menu } from 'lucide-react';

interface AdminHeaderProps {
  userEmail?: string | null;
  onMenuToggle?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ userEmail, onMenuToggle }) => {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const getPageTitle = (path: string): string => {
    if (path.startsWith('/admin/hero')) return 'Hero Content';
    if (path.startsWith('/admin/settings')) return 'Site Settings';
    if (path.startsWith('/admin/about')) return 'About Narrative';
    if (path.startsWith('/admin/services')) return 'Services';
    if (path.startsWith('/admin/projects/new')) return 'New Project';
    if (path.startsWith('/admin/projects/')) return 'Edit Project';
    if (path.startsWith('/admin/projects')) return 'Projects';
    if (path.startsWith('/admin/categories')) return 'Categories';
    if (path.startsWith('/admin/strengths')) return 'Why Choose Us';
    if (path.startsWith('/admin/testimonials')) return 'Testimonials';
    if (path.startsWith('/admin/enquiries')) return 'Enquiries Inbox';
    return 'Dashboard Overview';
  };

  const pageTitle = getPageTitle(pathname || '');

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
    <header className="h-16 bg-white border-b border-sand px-6 sm:px-8 flex items-center justify-between shrink-0">
      <div className="flex items-center space-x-3">
        {onMenuToggle && (
          <button
            type="button"
            onClick={onMenuToggle}
            className="md:hidden p-1.5 -ml-2 text-warm-grey hover:text-near-black transition-colors rounded-sm hover:bg-sand/30"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" strokeWidth={1.5} />
          </button>
        )}
        <span className="w-2 h-2 rounded-full bg-olive animate-pulse shrink-0" />
        <div className="flex items-center space-x-2">
          <span className="text-[11px] uppercase tracking-[0.2em] text-warm-grey font-medium hidden sm:inline-block">
            Admin Portal
          </span>
          <span className="text-[11px] text-warm-grey/40 hidden sm:inline-block">/</span>
          <span className="text-[11px] uppercase tracking-[0.2em] text-near-black font-semibold">
            {pageTitle}
          </span>
        </div>
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
