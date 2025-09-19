"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import GridLayout from '@/components/GridLayout';
import { Button } from '@/components/ui/button';
import { MapPin, Globe, Star } from 'lucide-react';
import { getTargets } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { isMetaMaskAvailable, ensureGanacheNetwork, connectWallet, sendEth } from '@/lib/web3';
import { toast } from 'sonner';

interface Target {
  _id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  location: string;
  rating: number;
}

export default function Home() {
  const [targets, setTargets] = useState<Target[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 9;
  const destRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchTargets();
  }, []);

  const fetchTargets = async () => {
    try {
      const data = await getTargets();
      setTargets(data);
    } catch (error) {
      console.error('Error fetching targets:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter targets by title, location, or description
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return targets;
    return targets.filter((t) =>
      [t.title, t.location, t.description].some((f) => f?.toLowerCase().includes(q))
    );
  }, [targets, search]);

  // Paginate filtered list
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * perPage;
  const paginated = filtered.slice(start, start + perPage);

  const handleExploreClick = () => {
    destRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-emerald-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-24 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            Discover the World with 
            <span className="text-orange-400"> Tourismo</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Book amazing travel destinations and pay with cryptocurrency. Your adventure awaits!
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4">
            <Button onClick={handleExploreClick} size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg">
              Explore Destinations
            </Button>
            <Button onClick={handleTestPayment} variant="outline" size="lg" className="bg-white/10 backdrop-blur border-white/30 text-white">
              Send Test Payment (0.01 ETH)
            </Button>
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
          {/* Search / Filter */}
          <div className="max-w-3xl mx-auto mb-8">
            <Input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by title, location, or description..."
              className="bg-white"
            />
          </div>

          {/* Grid */}
          <GridLayout targets={paginated} loading={loading} />

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