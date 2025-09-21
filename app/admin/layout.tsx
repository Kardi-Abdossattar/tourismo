import { ReactNode } from 'react';
import AdminNavbar from '@/components/AdminNavbar';

// This is a server component now, so we can't use client-side hooks or browser APIs
export default function AdminLayout({ children }: { children: ReactNode }) {
  // We don't need to check authentication here anymore as it's handled by middleware
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <main className="pt-20 px-4 sm:px-6 lg:px-8 pb-12 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}
