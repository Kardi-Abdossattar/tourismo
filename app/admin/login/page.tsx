"use client";

import { useState, useEffect, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Lock, User, Loader2 } from 'lucide-react';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('from') || '/admin/dashboard';

  // Get API URL with fallback
  const getApiUrl = () => {
    if (typeof window !== 'undefined') {
      return (window as any).__NEXT_DATA__?.runtimeConfig?.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    }
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  };

  useEffect(() => {
    // This code runs only on the client side
    const checkAuth = () => {
      // Check both localStorage and cookies
      const token = localStorage.getItem('token') || 
                   document.cookie.split('; ').find(row => row.startsWith('adminToken='))?.split('=')[1];
      
      if (token) {
        // Ensure the token is in both places for consistency
        localStorage.setItem('token', token);
        document.cookie = `adminToken=${token}; path=/; max-age=86400; samesite=lax`;
        
        setIsAuthenticated(true);
        router.replace(redirectTo);
      } else {
        setLoading(false);
      }
    };

    // Only run on client side
    if (typeof window !== 'undefined') {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, [redirectTo, router]);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error('Please enter both username and password');
      return;
    }
    
    setLoading(true);
    
    try {
      const apiUrl = getApiUrl();
      console.log('Logging in to:', `${apiUrl}/api/auth/login`);
      
      const response = await fetch(`${apiUrl.trim()}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
        mode: 'cors',
      });

      const data = await response.json();
      console.log('Login response:', { status: response.status, data });

      if (response.ok && data.token) {
        // Store the token in both localStorage and cookies
        localStorage.setItem('token', data.token);
        
        // Set the token in cookies for server-side auth (middleware)
        document.cookie = `adminToken=${data.token}; path=/; max-age=86400; samesite=lax`;
        
        setIsAuthenticated(true);
        toast.success('Login successful!');
        router.replace(redirectTo);
      } else {
        const errorMessage = data.message || 'Login failed. Please check your credentials.';
        console.error('Login failed:', errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Login error:', errorMessage);
      toast.error('Connection error. Please check your network and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (typeof window === 'undefined' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-700">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Lock className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <p className="text-gray-600">Access the Tourismo admin dashboard</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}