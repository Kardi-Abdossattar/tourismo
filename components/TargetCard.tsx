"use client";

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Star } from 'lucide-react';

interface TargetCardProps {
  target: {
    _id: string;
    title: string;
    description: string;
    price: number;
    image: string;
    thumbnailImage?: string;
    heroImage?: string;
    location: string;
    rating: number;
  };
}

export default function TargetCard({ target }: TargetCardProps) {
  return (
    <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2 h-full flex flex-col">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={target.thumbnailImage || target.heroImage || target.image}
          alt={target.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            // Fallback to the main image if both thumbnail and hero images fail to load
            const img = e.target as HTMLImageElement;
            if (img.src !== target.image) {
              img.src = target.image;
            }
          }}
        />
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Rating badge */}
        <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
          <div className="bg-white/90 backdrop-blur-sm px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full flex items-center space-x-1 shadow-sm">
            <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-xs sm:text-sm font-medium">{target.rating}</span>
          </div>
        </div>

        {/* Price badge */}
        <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4">
          <div className="bg-blue-600/90 text-white backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold shadow">
            {target.price} ETH
          </div>
        </div>

        {/* Location chip */}
        <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 hidden md:block">
          <div className="bg-white/90 backdrop-blur-sm px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm text-gray-800 shadow flex items-center gap-1 sm:gap-1.5">
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
            <span className="max-w-[100px] sm:max-w-[140px] truncate">{target.location}</span>
          </div>
        </div>
      </div>
      <CardContent className="p-4 sm:p-6 flex-1 flex flex-col">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
          {target.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 sm:mb-5 line-clamp-2 flex-1">{target.description}</p>
        <div className="flex flex-col gap-3 mt-auto">
          {/* Mobile and tablet: stacked layout */}
          <div className="flex flex-col gap-3 lg:hidden">
            <div className="text-xs sm:text-sm text-gray-500 flex items-center gap-1">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="truncate max-w-[200px]">{target.location}</span>
            </div>
            <Link href={`/target/${target._id}`} className="w-full">
              <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow min-h-[40px] sm:min-h-[36px] text-sm font-medium">
                <span className="hidden sm:inline">View Details</span>
                <span className="sm:hidden">View</span>
              </Button>
            </Link>
          </div>
          
          {/* Large screens: location left, button right */}
          <div className="hidden lg:flex items-center justify-between gap-3">
            <div className="text-sm text-gray-500 flex items-center gap-1 flex-1 min-w-0">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{target.location}</span>
            </div>
            <Link href={`/target/${target._id}`} className="flex-shrink-0">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white shadow min-h-[36px] text-sm font-medium px-4">
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}