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
    location: string;
    rating: number;
  };
}

export default function TargetCard({ target }: TargetCardProps) {
  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={target.image}
          alt={target.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute top-4 right-4">
          <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center space-x-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{target.rating}</span>
          </div>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-center space-x-2 text-gray-500 text-sm mb-2">
          <MapPin className="w-4 h-4" />
          <span>{target.location}</span>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {target.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {target.description}
        </p>
        
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">
            ${target.price}
            <span className="text-sm text-gray-500 font-normal"> ETH</span>
          </div>
          
          <Link href={`/target/${target._id}`}>
            <Button 
              size="sm" 
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}