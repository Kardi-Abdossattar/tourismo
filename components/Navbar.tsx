"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Menu, X, ChevronDown, Mail, Phone, User, Info, Lock, Shield, Home } from 'lucide-react';
import { getPage } from '@/lib/api';
import { toast } from 'sonner';

interface PageData {
  _id: string;
  slug: 'about' | 'contact';
  title: string;
  content: string;
}

interface NavbarProps {
  onDestinationsClick?: () => void;
}

export default function Navbar({ onDestinationsClick }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [aboutModal, setAboutModal] = useState(false);
  const [contactModal, setContactModal] = useState(false);
  const [adminModal, setAdminModal] = useState(false);
  const [aboutData, setAboutData] = useState<PageData | null>(null);
  const [contactData, setContactData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Admin login state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const router = useRouter();

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchPageData = async (slug: 'about' | 'contact') => {
    setLoading(true);
    try {
      const data = await getPage(slug);
      if (slug === 'about') {
        setAboutData(data);
      } else {
        setContactData(data);
      }
    } catch (error) {
      console.error(`Failed to load ${slug} page:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleAboutClick = async () => {
    if (!aboutData) {
      await fetchPageData('about');
    }
    setAboutModal(true);
    setIsOpen(false);
  };

  const handleContactClick = async () => {
    if (!contactData) {
      await fetchPageData('contact');
    }
    setContactModal(true);
    setIsOpen(false);
  };

  const handleDestinationsClick = () => {
    if (onDestinationsClick) {
      onDestinationsClick();
    }
    setIsOpen(false);
  };

  const handleAdminClick = () => {
    setAdminModal(true);
    setIsOpen(false);
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        toast.success('Login successful!');
        setAdminModal(false);
        setUsername('');
        setPassword('');
        router.push('/admin/dashboard');
      } else {
        toast.error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  const closeModals = () => {
    setAboutModal(false);
    setContactModal(false);
    setAdminModal(false);
    setUsername('');
    setPassword('');
  };

  return (
    <>
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className={`transition-all duration-500 ease-out ${
          scrolled 
            ? 'px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32' 
            : 'mx-6 px-6'
        }`}>
          <div className={`flex items-center transition-all duration-500 ease-out ${
            scrolled 
              ? 'h-14 justify-center bg-white/95 backdrop-blur-lg shadow-xl rounded-b-2xl border-b border-l border-r border-gray-200/50' 
              : 'h-20 justify-between px-6 rounded-2xl bg-white/10 backdrop-blur-md shadow-2xl border border-white/20 hover:bg-white/15 mt-4'
          }`}>
            
            {/* Logo - Only show when not scrolled */}
            {!scrolled && (
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl group-hover:from-blue-600 group-hover:to-blue-700 transition-all duration-300 shadow-lg">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white drop-shadow-lg">
                  Tourismo
                </span>
              </Link>
            )}

            {/* Desktop Navigation - Responsive layout when scrolled */}
            <div className={`hidden md:flex items-center ${
              scrolled 
                ? 'justify-center w-full space-x-1 sm:space-x-2 lg:space-x-4' 
                : 'space-x-1'
            }`}>
              <Button
                variant="ghost"
                size={scrolled ? "sm" : "default"}
                className={`transition-all duration-500 font-medium border ${
                  scrolled 
                    ? 'px-2 sm:px-3 lg:px-4 py-2 text-gray-800 hover:text-blue-600 hover:bg-blue-50 bg-gray-50/50 rounded-xl shadow-sm border-gray-200/50' 
                    : 'px-4 py-2 text-white hover:text-blue-200 hover:bg-white/10 border-transparent'
                }`}
                onClick={handleDestinationsClick}
              >
                <MapPin className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Destinations</span>
                <span className="sm:hidden">Dest</span>
              </Button>
              
              <Button
                variant="ghost"
                size={scrolled ? "sm" : "default"}
                className={`transition-all duration-500 font-medium border ${
                  scrolled 
                    ? 'px-2 sm:px-3 lg:px-4 py-2 text-gray-800 hover:text-blue-600 hover:bg-blue-50 bg-gray-50/50 rounded-xl shadow-sm border-gray-200/50' 
                    : 'px-4 py-2 text-white hover:text-blue-200 hover:bg-white/10 border-transparent'
                }`}
                onClick={handleAboutClick}
              >
                <Info className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">About</span>
                <span className="sm:hidden">Info</span>
              </Button>

              {/* Home Icon - Only show when scrolled, centered between buttons */}
              {scrolled && (
                <Link href="/" className="group mx-1 sm:mx-2">
                  <div className="p-2 sm:p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl group-hover:from-blue-600 group-hover:to-blue-700 transition-all duration-300 shadow-md group-hover:scale-110 group-hover:shadow-lg">
                    <Home className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                </Link>
              )}
              
              <Button
                variant="ghost"
                size={scrolled ? "sm" : "default"}
                className={`transition-all duration-500 font-medium border ${
                  scrolled 
                    ? 'px-2 sm:px-3 lg:px-4 py-2 text-gray-800 hover:text-blue-600 hover:bg-blue-50 bg-gray-50/50 rounded-xl shadow-sm border-gray-200/50' 
                    : 'px-4 py-2 text-white hover:text-blue-200 hover:bg-white/10 border-transparent'
                }`}
                onClick={handleContactClick}
              >
                <Mail className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Contact</span>
                <span className="sm:hidden">Mail</span>
              </Button>
              
              <div className={scrolled ? '' : 'ml-4'}>
                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={handleAdminClick}
                  className={`transition-all duration-500 border ${
                    scrolled 
                      ? 'px-2 sm:px-3 lg:px-4 py-2 border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 bg-blue-50/30 rounded-xl shadow-sm' 
                      : 'border-white/20 text-white hover:bg-white/10 hover:border-white/40 bg-transparent'
                  }`}
                >
                  <Shield className="w-4 h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Admin</span>
                  <span className="sm:hidden">Adm</span>
                </Button>
              </div>
            </div>

            {/* Mobile Menu Button - Always visible on mobile */}
            <button
              className={`md:hidden p-2 rounded-lg transition-all duration-300 ${
                scrolled 
                  ? 'text-gray-800 hover:bg-gray-100' 
                  : 'text-white hover:bg-white/10'
              }`}
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className={`md:hidden overflow-hidden mt-4 mx-6 rounded-2xl backdrop-blur-md shadow-xl border ${
                  scrolled 
                    ? 'bg-white/95 border-gray-200' 
                    : 'bg-white/10 border-white/20'
                }`}
              >
                <div className="py-4 px-4 space-y-2">
                  <Button
                    variant="ghost"
                    className={`w-full justify-start transition-all duration-300 ${
                      scrolled 
                        ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50' 
                        : 'text-white hover:text-blue-200 hover:bg-white/10'
                    }`}
                    onClick={handleDestinationsClick}
                  >
                    <MapPin className="w-4 h-4 mr-3" />
                    Destinations
                  </Button>
                  
                  <Button
                    variant="ghost"
                    className={`w-full justify-start transition-all duration-300 ${
                      scrolled 
                        ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50' 
                        : 'text-white hover:text-blue-200 hover:bg-white/10'
                    }`}
                    onClick={handleAboutClick}
                  >
                    <Info className="w-4 h-4 mr-3" />
                    About
                  </Button>
                  
                  <Button
                    variant="ghost"
                    className={`w-full justify-start transition-all duration-300 ${
                      scrolled 
                        ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50' 
                        : 'text-white hover:text-blue-200 hover:bg-white/10'
                    }`}
                    onClick={handleContactClick}
                  >
                    <Mail className="w-4 h-4 mr-3" />
                    Contact
                  </Button>
                  
                  <div className="pt-2">
                    <Button 
                      variant="ghost"
                      size="sm" 
                      onClick={handleAdminClick}
                      className={`w-full transition-all duration-300 border ${
                        scrolled 
                          ? 'border-blue-200/50 text-blue-600 hover:bg-blue-50 hover:border-blue-300 bg-transparent' 
                          : 'border-white/20 text-white hover:bg-white/10 hover:border-white/40 bg-transparent'
                      }`}
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Admin
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* About Modal */}
      <AnimatePresence>
        {aboutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModals}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Info className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {aboutData?.title || 'About'}
                  </h2>
                </div>
                <button
                  onClick={closeModals}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-line text-gray-700 leading-relaxed">
                      {aboutData?.content || 'About content is not available.'}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Modal */}
      <AnimatePresence>
        {contactModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModals}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Mail className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {contactData?.title || 'Contact'}
                  </h2>
                </div>
                <button
                  onClick={closeModals}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-line text-gray-700 leading-relaxed">
                      {contactData?.content || 'Contact information is not available.'}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Login Modal */}
      <AnimatePresence>
        {adminModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModals}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Admin Login</h2>
                </div>
                <button
                  onClick={closeModals}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6">
                <p className="text-gray-600 mb-6 text-center">Access the Tourismo admin dashboard</p>
                
                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="admin-username">Username</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="admin-username"
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
                    <Label htmlFor="admin-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="admin-password"
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
                    disabled={loginLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 mt-6"
                  >
                    {loginLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
                
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 text-center">
                    Demo credentials: admin / Admin123!
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}