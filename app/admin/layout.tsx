'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminNavbar from '@/components/AdminNavbar';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    const isLoginPage = window.location.pathname.includes('/admin/login');
    
    if (token) {
      setIsAuthenticated(true);
      // If on login page but already authenticated, redirect to dashboard
      if (isLoginPage) {
        router.push('/admin/dashboard');
      }
    } else if (!isLoginPage) {
      // If not authenticated and not on login page, redirect to home
      router.push('/');
      return;
    }
    
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Don't show navbar on login page
  const showNavbar = !window.location.pathname.includes('/admin/login');

  return (
    <div className="min-h-screen bg-gray-50">
      {showNavbar && <AdminNavbar />}
      <main className={`${showNavbar ? 'pt-20' : ''} px-4 sm:px-6 lg:px-8 pb-12 max-w-7xl mx-auto`}>
        {children}
      </main>
    </div>
  );
}
