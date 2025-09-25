'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Star, MapPin, ArrowUpDown, DollarSign, X } from 'lucide-react';

export type SortOption = 'price-asc' | 'price-desc' | 'rating-desc' | 'title-asc' | 'title-desc';

interface TargetFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  sortBy: SortOption;
  setSortBy: (value: SortOption) => void;
  priceRange: [number, number];
  setPriceRange: (value: [number, number]) => void;
  maxPrice: number;
  selectedLocations: string[];
  setSelectedLocations: (locations: string[]) => void;
  allLocations: string[];
  minRating: number;
  setMinRating: (value: number) => void;
  clearFilters: () => void;
}

export function TargetFilters({
  search,
  setSearch,
  sortBy,
  setSortBy,
  priceRange,
  setPriceRange,
  maxPrice,
  selectedLocations,
  setSelectedLocations,
  allLocations,
  minRating,
  setMinRating,
  clearFilters
}: TargetFiltersProps) {
  const toggleLocation = (location: string) => {
    setSelectedLocations(
      selectedLocations.includes(location)
        ? selectedLocations.filter(loc => loc !== location)
        : [...selectedLocations, location]
    );
  };

  const hasActiveFilters = 
    search || 
    sortBy !== 'rating-desc' || 
    priceRange[1] !== maxPrice || 
    selectedLocations.length > 0 ||
    minRating > 0;

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-lg font-semibold">Filter & Sort</h2>
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            <X className="w-4 h-4 mr-1" />
            Clear all filters
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <Input
            placeholder="Search destinations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {/* Sort By */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Sort by</label>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating-desc">
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-2 text-yellow-500 fill-yellow-500" />
                Highest Rated
              </div>
            </SelectItem>
            <SelectItem value="price-asc">
              <div className="flex items-center">
                <DollarSign className="w-4 h-4 mr-2 text-green-500" />
                Price: Low to High
              </div>
            </SelectItem>
            <SelectItem value="price-desc">
              <div className="flex items-center">
                <DollarSign className="w-4 h-4 mr-2 text-green-500" />
                Price: High to Low
              </div>
            </SelectItem>
            <SelectItem value="title-asc">
              <div className="flex items-center">
                <ArrowUpDown className="w-4 h-4 mr-2 text-blue-500" />
                Name: A to Z
              </div>
            </SelectItem>
            <SelectItem value="title-desc">
              <div className="flex items-center">
                <ArrowUpDown className="w-4 h-4 mr-2 text-blue-500" />
                Name: Z to A
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm font-medium text-gray-700">Price Range</label>
          <span className="text-sm text-gray-500">
            ${priceRange[0]} - ${priceRange[1]}
          </span>
        </div>
        <Slider
          value={priceRange}
          onValueChange={(value) => setPriceRange(value as [number, number])}
          max={maxPrice}
          step={10}
          minStepsBetweenThumbs={10}
          className="py-4"
        />
      </div>

      {/* Minimum Rating */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Rating</label>
        <div className="flex items-center space-x-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setMinRating(star)}
              className={`p-1 rounded-full ${minRating >= star ? 'text-yellow-500' : 'text-gray-300'}`}
            >
              <Star className={`w-5 h-5 ${minRating >= star ? 'fill-current' : ''}`} />
            </button>
          ))}
          {minRating > 0 && (
            <button 
              onClick={() => setMinRating(0)}
              className="ml-2 text-sm text-gray-500 hover:text-gray-700"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Locations */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Locations</label>
        <div className="space-y-2">
          {allLocations.map((location) => (
            <div key={location} className="flex items-center">
              <input
                type="checkbox"
                id={`location-${location}`}
                checked={selectedLocations.includes(location)}
                onChange={() => toggleLocation(location)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor={`location-${location}`}
                className="ml-2 text-sm text-gray-700 flex items-center"
              >
                <MapPin className="w-3.5 h-3.5 mr-1.5 text-gray-500" />
                {location}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
