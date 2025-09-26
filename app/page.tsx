"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import GridLayout from '@/components/GridLayout';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { MapPin, Globe, Star } from 'lucide-react';
import { getTargets } from '@/lib/static-api';
import { AttractionFilters, FilterState } from '@/components/AttractionFilters';
import { toast } from 'sonner';
import DemoPopup from '@/components/DemoPopup';
import { useDemoPopup } from '@/hooks/useDemoPopup';
import { Target } from '@/types/target';

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
  const [isAnyModalOpen, setIsAnyModalOpen] = useState(false);
  const perPage = 9;
  const destRef = useRef<HTMLDivElement | null>(null);
  const { isOpen, feature, description, showDemoPopup, closeDemoPopup } = useDemoPopup();

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

  const handleTestPayment = () => {
    showDemoPopup(
      'Blockchain Payment System',
      'In the full version, this would connect to MetaMask, process ETH payments via smart contracts, and store transaction records on the blockchain. This demo showcases the UI/UX without actual blockchain integration.'
    );
  };

  const handleModalStateChange = (isModalOpen: boolean) => {
    setIsAnyModalOpen(isModalOpen);
    // Close filters when modal opens
    if (isModalOpen && isFilterOpen) {
      setIsFilterOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      <Navbar onDestinationsClick={handleExploreClick} onModalStateChange={handleModalStateChange} />
      {/* Hero Section */}
      <section className="relative h-[100vh] sm:h-[90vh] md:h-[80vh] min-h-[500px] sm:min-h-[560px] w-full overflow-hidden text-white">
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
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 sm:mb-6 px-2"
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              Discover the World with
              <span className="text-blue-400"> Tourismo</span>
            </motion.h1>
            <motion.p
              className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 md:mb-10 text-blue-100 max-w-xs sm:max-w-2xl lg:max-w-3xl mx-auto px-4"
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.9, ease: 'easeOut', delay: 0.1 }}
            >
              Premium destinations. Seamless crypto-secured bookings. Travel, elevated.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4"
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
            >
              <Button
                onClick={handleExploreClick}
                size="lg"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 text-base sm:text-lg bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 min-h-[48px]"
              >
                Explore Destinations
              </Button>
              <Button
                onClick={handleTestPayment}
                variant="outline"
                size="lg"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 text-base sm:text-lg bg-white/10 hover:bg-white/15 text-white border-white/30 backdrop-blur-md shadow-lg min-h-[48px]"
              >
                <span className="hidden sm:inline">Send Test Payment (0.01 ETH)</span>
                <span className="sm:hidden">Test Payment</span>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 sm:py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center">
            <div className="flex flex-col items-center p-4 sm:p-6">
              <Globe className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600 mb-3 sm:mb-4" />
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">150+</h3>
              <p className="text-sm sm:text-base text-gray-600">Destinations</p>
            </div>
            <div className="flex flex-col items-center p-4 sm:p-6">
              <Star className="w-10 h-10 sm:w-12 sm:h-12 text-orange-500 mb-3 sm:mb-4" />
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">4.9</h3>
              <p className="text-sm sm:text-base text-gray-600">Average Rating</p>
            </div>
            <div className="flex flex-col items-center p-4 sm:p-6">
              <MapPin className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-600 mb-3 sm:mb-4" />
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">50k+</h3>
              <p className="text-sm sm:text-base text-gray-600">Happy Travelers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-8 sm:py-12 md:py-16" ref={destRef}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
              Popular Destinations
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-sm sm:max-w-xl md:max-w-2xl mx-auto px-4">
              Choose from our carefully curated collection of breathtaking destinations
            </p>
          </div>
          {/* Filters and Grid Layout */}
          <div className={`flex flex-col lg:flex-row gap-4 lg:gap-6 items-start transition-all duration-300 ${isFilterOpen ? '' : 'relative'}`}>
            {/* Advanced Filters - Left Side - Hidden when modals are open */}
            {!isAnyModalOpen && (
              <div className={`w-full lg:w-auto ${isFilterOpen ? 'flex-shrink-0' : 'absolute top-0 left-0 z-50'}`}>
                <AttractionFilters
                  onFilterChange={handleFilterChange}
                  allCountries={Array.from(new Set(targets.map(t => t.country).filter((country): country is string => Boolean(country)))).sort()}
                  maxPrice={Math.max(...targets.map(t => t.price), 10)}
                  onMenuToggle={(isOpen) => {
                    setIsFilterOpen(isOpen);
                  }}
                />
              </div>
            )}

            {/* Grid - Right Side */}
            <div className="flex-1 min-w-0 w-full">
              <GridLayout targets={paginated} loading={loading} />
            </div>
          </div>

          {/* Pagination */}
          {!loading && (
            <div className="flex items-center justify-center gap-2 mt-6 sm:mt-8 md:mt-10 px-4">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="min-h-[40px] px-3 sm:px-4"
              >
                <span className="hidden sm:inline">Previous</span>
                <span className="sm:hidden">Prev</span>
              </Button>
              <div className="text-xs sm:text-sm text-gray-700 px-2 sm:px-3 text-center">
                <span className="hidden sm:inline">Page {currentPage} of {totalPages}</span>
                <span className="sm:hidden">{currentPage}/{totalPages}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="min-h-[40px] px-3 sm:px-4"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Demo Popup */}
      <DemoPopup
        isOpen={isOpen}
        onClose={closeDemoPopup}
        feature={feature}
        description={description}
      />
    </div>
  );
}