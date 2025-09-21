'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminNavbar from '@/components/AdminNavbar';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token && !window.location.pathname.includes('/admin/login')) {
      router.push('/admin/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <main className="pt-20 px-4 sm:px-6 lg:px-8 pb-12 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}
