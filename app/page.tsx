"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import GridLayout from '@/components/GridLayout';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { MapPin, Globe, Star } from 'lucide-react';
import { getTargets } from '@/lib/api';
import { AttractionFilters, FilterState } from '@/components/AttractionFilters';
import { isMetaMaskAvailable, ensureGanacheNetwork, connectWallet, sendEth } from '@/lib/web3';
import { toast } from 'sonner';

interface Target {
  _id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  location: string;
  country?: string;
  rating: number;
  featured?: boolean;
  createdAt?: string;
}

export default function Home() {
  const [targets, setTargets] = useState<Target[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    priceRange: [0, 10],
    ratingRange: [0, 5],
    countries: [],
    sortBy: 'createdAt',
    sortOrder: 'desc',
    featured: null,
  });
  const [page, setPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const perPage = 9;
  const destRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchTargets();
  }, []);

  const fetchTargets = async (filterParams?: any) => {
    try {
      setLoading(true);
      const data = await getTargets(filterParams);
      
      // Handle both old format (array) and new format (object with targets)
      if (Array.isArray(data)) {
        setTargets(data);
      } else {
        setTargets(data.targets || []);
      }
    } catch (error) {
      console.error('Error fetching targets:', error);
    } finally {
      setLoading(false);
    }
  };

  // Use server-side filtering - targets are already filtered
  const filtered = targets;

  // Paginate filtered list
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * perPage;
  const paginated = filtered.slice(start, start + perPage);

  const handleExploreClick = () => {
    destRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleFilterChange = async (newFilters: FilterState) => {
    setFilters(newFilters);
    setPage(1);
    
    // Convert FilterState to API parameters
    const apiParams = {
      search: newFilters.search || undefined,
      minPrice: newFilters.priceRange[0] > 0 ? newFilters.priceRange[0] : undefined,
      maxPrice: newFilters.priceRange[1] < 10 ? newFilters.priceRange[1] : undefined,
      minRating: newFilters.ratingRange[0] > 0 ? newFilters.ratingRange[0] : undefined,
      maxRating: newFilters.ratingRange[1] < 5 ? newFilters.ratingRange[1] : undefined,
      countries: newFilters.countries.length > 0 ? newFilters.countries : undefined,
      featured: newFilters.featured,
      sortBy: newFilters.sortBy,
      sortOrder: newFilters.sortOrder,
      limit: 50 // Get more results for client-side pagination
    };

    await fetchTargets(apiParams);
  };

  const handleTestPayment = async () => {
    try {
      const FIXED_RECEIVER = '0x2f5Be95f0D697d9b778540B010AfDB26c87C828F';
      if (!/^0x[a-fA-F0-9]{40}$/.test(FIXED_RECEIVER)) {
        toast.error('Configured receiver address is invalid. Please update it to a 42-character 0x... address.');
        return;
      }
      if (!isMetaMaskAvailable()) {
        toast.warning('MetaMask is not installed.');
        return;
      }
      await ensureGanacheNetwork();
      await connectWallet();
      const tx = await sendEth(FIXED_RECEIVER, '0.01');
      toast.message('Transaction sent', { description: tx.hash });
      await tx.wait();
      toast.success('Test payment confirmed');
    } catch (e) {
      console.error(e);
      toast.error('Test payment failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      <Navbar onDestinationsClick={handleExploreClick} />
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[560px] w-full overflow-hidden text-white">
        {/* Cinematic background image with slow zoom */}
        <motion.img
          src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2000&auto=format&fit=crop"
          alt="Cinematic destination"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ scale: 1.05, opacity: 0.9 }}
          animate={{ scale: 1.15, opacity: 1 }}
          transition={{ duration: 18, ease: 'easeOut' }}
        />
        {/* Gradient overlays for depth and legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(59,130,246,.35),transparent_35%),radial-gradient(circle_at_80%_90%,rgba(16,185,129,.25),transparent_35%)]" />
        {/* Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-4 text-center">
            <motion.h1
              className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6"
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              Discover the World with
              <span className="text-blue-400"> Tourismo</span>
            </motion.h1>
            <motion.p
              className="text-lg md:text-2xl mb-10 text-blue-100 max-w-3xl mx-auto"
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.9, ease: 'easeOut', delay: 0.1 }}
            >
              Premium destinations. Seamless crypto-secured bookings. Travel, elevated.
            </motion.p>
            <motion.div
              className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4"
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
            >
              <Button
                onClick={handleExploreClick}
                size="lg"
                className="px-8 py-3 text-lg bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20"
              >
                Explore Destinations
              </Button>
              <Button
                onClick={handleTestPayment}
                variant="outline"
                size="lg"
                className="px-8 py-3 text-lg bg-white/10 hover:bg-white/15 text-white border-white/30 backdrop-blur-md shadow-lg"
              >
                Send Test Payment (0.01 ETH)
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Globe className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-3xl font-bold text-gray-900 mb-2">150+</h3>
              <p className="text-gray-600">Destinations</p>
            </div>
            <div className="flex flex-col items-center">
              <Star className="w-12 h-12 text-orange-500 mb-4" />
              <h3 className="text-3xl font-bold text-gray-900 mb-2">4.9</h3>
              <p className="text-gray-600">Average Rating</p>
            </div>
            <div className="flex flex-col items-center">
              <MapPin className="w-12 h-12 text-emerald-600 mb-4" />
              <h3 className="text-3xl font-bold text-gray-900 mb-2">50k+</h3>
              <p className="text-gray-600">Happy Travelers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-16" ref={destRef}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Popular Destinations
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose from our carefully curated collection of breathtaking destinations
            </p>
          </div>
          {/* Filters and Grid Layout */}
          <div className={`flex gap-6 items-start transition-all duration-300 ${isFilterOpen ? '' : 'relative'}`}>
            {/* Advanced Filters - Left Side */}
            <div className={`${isFilterOpen ? 'flex-shrink-0' : 'absolute top-0 left-0 z-50'}`}>
              <AttractionFilters
                onFilterChange={handleFilterChange}
                allCountries={Array.from(new Set(targets.map(t => t.country).filter((country): country is string => Boolean(country)))).sort()}
                maxPrice={Math.max(...targets.map(t => t.price), 10)}
                onMenuToggle={(isOpen) => {
                  setIsFilterOpen(isOpen);
                }}
              />
            </div>

            {/* Grid - Right Side */}
            <div className="flex-1 min-w-0">
              <GridLayout targets={paginated} loading={loading} />
            </div>
          </div>

          {/* Pagination */}
          {!loading && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <Button
                variant="outline"
                disabled={currentPage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Prev
              </Button>
              <div className="text-sm text-gray-700 px-3">Page {currentPage} of {totalPages}</div>
              <Button
                variant="outline"
                disabled={currentPage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}