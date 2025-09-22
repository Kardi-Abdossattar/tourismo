"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Star, Calendar, Users, Wifi } from 'lucide-react';
import Navbar from '@/components/Navbar';

interface Target {
  _id: string;
  title: string;
  description: string;
  price: number;
  thumbnailImage?: string;
  heroImage: string;
  location: string;
  rating: number;
  amenities: string[];
  whatsIncluded?: string[];
  duration: string;
}

export default function TargetDetailClient({ initialTarget, id }: { initialTarget: Target; id: string }) {
  const [target, setTarget] = useState<Target>(initialTarget);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Refetch latest target to reflect dynamic updates (image, etc.)
    const fetchLatest = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/targets/${id}`, { cache: 'no-store' });
        if (res.ok) {
          const fresh = await res.json();
          setTarget(fresh);
        }
      } catch (e) {
        // silent fail, keep initial
      } finally {
        setLoading(false);
      }
    };
    fetchLatest();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden mb-8">
          <img src={target.heroImage} alt={target.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          <div className="absolute bottom-6 left-6 text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">{target.title}</h1>
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <span className="text-lg">{target.location}</span>
            </div>
          </div>
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
