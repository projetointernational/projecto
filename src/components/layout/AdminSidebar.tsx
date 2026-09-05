'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  LayoutDashboard,
  Sliders,
  Sparkles,
  Info,
  Wrench,
  Building2,
  Tag,
  ShieldCheck,
  MessageSquareQuote,
  MailCheck,
  ArrowUpRight,
  LogOut,
  Loader2,
} from 'lucide-react';

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const navItems = [
    { label: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Site Settings', href: '/admin/settings', icon: Sliders },
    { label: 'Hero Content', href: '/admin/hero', icon: Sparkles },
    { label: 'About Narrative', href: '/admin/about', icon: Info },
    { label: 'Services', href: '/admin/services', icon: Wrench },
    { label: 'Projects', href: '/admin/projects', icon: Building2 },
    { label: 'Categories', href: '/admin/categories', icon: Tag },
    { label: 'Why Choose Us', href: '/admin/strengths', icon: ShieldCheck },
    { label: 'Testimonials', href: '/admin/testimonials', icon: MessageSquareQuote },
    { label: 'Enquiries Inbox', href: '/admin/enquiries', icon: MailCheck },
  ];

  const handleSignOut = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('[AdminSidebar] Sign out error:', err);
    } finally {
      router.push('/admin');
      router.refresh();
      setIsSigningOut(false);
    }
  };

  return (
    <aside className="w-64 bg-near-black text-off-white flex flex-col shrink-0 min-h-screen border-r border-white/5">
      {/* Brand Header */}
      <div className="p-6 border-b border-white/10">
        <Link href="/admin/dashboard" className="flex flex-col group">
          <span className="font-serif text-xl tracking-[0.2em] font-normal uppercase text-off-white group-hover:text-warm-beige transition-colors">
            PROJECTO
          </span>
          <span className="text-[9px] uppercase tracking-[0.25em] text-warm-beige -mt-0.5 font-sans">
            Management Portal
          </span>
        </Link>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <div className="text-[10px] uppercase tracking-[0.2em] text-warm-grey/60 px-3 pb-2 font-medium">
          Content Modules
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === '/admin/dashboard'
              ? pathname === '/admin/dashboard'
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-sm text-xs font-medium tracking-wider transition-colors ${
                isActive
                  ? 'bg-olive text-white'
                  : 'text-off-white/70 hover:bg-white/5 hover:text-off-white'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" strokeWidth={1.5} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Portal Actions */}
      <div className="p-4 border-t border-white/10 space-y-1.5">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 text-xs text-warm-grey hover:text-off-white hover:bg-white/5 rounded-sm transition-colors"
        >
          <span className="flex items-center space-x-2">
            <span>Public Website</span>
          </span>
          <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={1.5} />
        </Link>

        <button
          type="button"
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="w-full flex items-center justify-between px-3 py-2 text-xs text-warm-grey hover:text-red-400 hover:bg-white/5 rounded-sm transition-colors text-left disabled:opacity-50"
        >
          <span className="flex items-center space-x-2">
            <span>{isSigningOut ? 'Signing Out...' : 'Sign Out'}</span>
          </span>
          {isSigningOut ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" strokeWidth={1.5} />
          ) : (
            <LogOut className="w-3.5 h-3.5" strokeWidth={1.5} />
          )}
        </button>
      </div>
    </aside>
  );
};
