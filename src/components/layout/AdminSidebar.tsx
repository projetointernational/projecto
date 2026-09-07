'use client';

import React, { useState, useEffect } from 'react';
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
  Handshake,
  ArrowUpRight,
  LogOut,
  Loader2,
  X,
} from 'lucide-react';

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isOpen = false,
  onClose,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Auto-close mobile drawer when route changes
  useEffect(() => {
    onClose?.();
  }, [pathname]);

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
    { label: 'Clients & Partners', href: '/admin/clients', icon: Handshake },
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
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-64 bg-near-black text-off-white flex flex-col shrink-0 h-full border-r border-white/5 transition-transform duration-200 ease-in-out md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-6 border-b border-white/10 flex items-center justify-between shrink-0">
        <Link
          href="/admin/dashboard"
          className="flex flex-col justify-center group"
          onClick={() => onClose?.()}
        >
          <span className="font-serif text-xl tracking-[0.2em] font-normal uppercase text-off-white group-hover:text-warm-beige transition-colors leading-none">
            PROJECTO
          </span>
          <span className="text-[9px] uppercase tracking-[0.25em] text-warm-beige font-sans mt-1">
            Management Portal
          </span>
        </Link>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="md:hidden p-1 text-off-white/60 hover:text-off-white transition-colors"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        )}
      </div>

      {/* Navigation List - Independently scrollable tabs list with hidden scrollbar */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto no-scrollbar">
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
              onClick={() => onClose?.()}
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
      <div className="p-4 border-t border-white/10 space-y-1.5 shrink-0">
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
