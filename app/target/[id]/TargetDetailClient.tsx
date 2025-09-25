"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Star, Calendar, Users, Wifi } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Target } from '@/types';
import { StaticApiService } from '@/lib/static-api';

interface TargetDetailClientProps {
  initialTarget: Target | null;
  id: string;
}

export default function TargetDetailClient({ initialTarget, id }: TargetDetailClientProps) {
  const [target, setTarget] = useState<Target | null>(initialTarget);
  const [loading, setLoading] = useState(!initialTarget);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch if we don't have initial data or need to refresh
    const fetchLatest = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const fresh = await StaticApiService.getTargetById(id);
        
        if (!fresh) {
          throw new Error('Target not found');
        }
        
        setTarget(fresh);
      } catch (e) {
        console.error('Error fetching target:', e);
        setError(e instanceof Error ? e.message : 'Failed to load target');
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if we don't have initial data
    if (!initialTarget) {
      fetchLatest();
    }
  }, [id, initialTarget]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-pulse text-gray-500">Loading target details...</div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !target) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {error || 'Failed to load target details. Please try again later.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="relative h-64 md:h-96 rounded-lg overflow-hidden mb-6">
          <img
            src={target.heroImage || target.image}
            alt={target.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to the main image if heroImage fails to load
              if (target.image && e.currentTarget.src !== target.image) {
                e.currentTarget.src = target.image;
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">About this destination</h2>
                <p className="text-gray-600 leading-relaxed">{target.description}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">What's included</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(target.whatsIncluded && target.whatsIncluded.length > 0 
                    ? target.whatsIncluded 
                    : target.amenities || []
                  ).map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full flex-shrink-0"></div>
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                  {(!target.whatsIncluded || target.whatsIncluded.length === 0) && 
                   (!target.amenities || target.amenities.length === 0) && (
                    <p className="text-gray-500 italic">No items listed yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-3xl font-bold text-gray-900">${target.price}</span>
                    <span className="text-gray-600 ml-2">ETH</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{target.rating}</span>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar className="w-5 h-5" />
                    <span>Duration: {target.duration || '7 days'}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Users className="w-5 h-5" />
                    <span>Up to 4 guests</span>
                  </div>
                </div>

                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg" size="lg">
                  <Link href={`/booking/${target._id}`}>Book with MetaMask</Link>
                </Button>
                <p className="text-sm text-gray-500 text-center mt-4">Secure payment with cryptocurrency</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
