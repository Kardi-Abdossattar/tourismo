"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Home, Shield, LogOut } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminNavbar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/admin/login');
    toast.success('Successfully logged out');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/admin/dashboard" className="flex items-center">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg mr-2">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Admin Panel</span>
              </Link>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-4">
              <Link href="/admin/dashboard">
                <Button variant="ghost" className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium">
                  Dashboard
                </Button>
              </Link>
              <Link href="/admin/pages">
                <Button variant="ghost" className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium">
                  Pages
                </Button>
              </Link>
              <Link href="/admin/bookings">
                <Button variant="ghost" className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium">
                  Bookings
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => router.push('/')}
              className="text-gray-700 hover:bg-gray-100"
            >
              <Home className="w-4 h-4 mr-2" />
              View Site
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              className="text-red-600 hover:bg-red-50 border-red-200 hover:border-red-300"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
