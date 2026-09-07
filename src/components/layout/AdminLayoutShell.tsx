'use client';

import React, { useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from '../admin/AdminHeader';

interface AdminLayoutShellProps {
  userEmail?: string | null;
  children: React.ReactNode;
}

export const AdminLayoutShell: React.FC<AdminLayoutShellProps> = ({
  userEmail,
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen h-[100dvh] overflow-hidden bg-[#F3F1EA] text-near-black">
      {/* Mobile backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Fixed Left Sidebar */}
      <AdminSidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Desktop placeholder to occupy the fixed sidebar's 256px in flex flow */}
      <div className="hidden md:block w-64 shrink-0 h-full" aria-hidden="true" />

      {/* Right-Side Content Area (Independently Scrollable with Hidden Scrollbar) */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <AdminHeader
          userEmail={userEmail}
          onMenuToggle={() => setMobileMenuOpen((prev) => !prev)}
        />
        <main className="flex-1 overflow-y-auto no-scrollbar p-6 sm:p-10">
          <div className="max-w-6xl w-full mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
