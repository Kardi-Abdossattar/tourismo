'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { AnimatePresence, motion } from 'framer-motion';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Filter, X, Search, DollarSign, Star, Globe, ArrowUpDown, ArrowUp, ArrowDown, Award, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';

type PriceRange = [number, number];
type RatingRange = [number, number];

export interface FilterState {
  search: string;
  priceRange: PriceRange;
  ratingRange: RatingRange;
  countries: string[];
  sortBy: 'title' | 'price' | 'rating' | 'location' | 'createdAt';
  sortOrder: 'asc' | 'desc';
  featured: boolean | null; // null = all, true = featured only, false = non-featured only
}

interface AttractionFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  allCountries: string[];
  maxPrice: number;
  onMenuToggle?: (isOpen: boolean) => void;
}

export function AttractionFilters({ 
  onFilterChange, 
  allCountries, 
  maxPrice,
  onMenuToggle 
}: AttractionFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterState>({
    search: '',
    priceRange: [0, maxPrice],
    ratingRange: [0, 5],
    countries: [],
    sortBy: 'createdAt',
    sortOrder: 'desc',
    featured: null,
  });

  // Add mounted state to prevent hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Update local filters when maxPrice changes
  useEffect(() => {
    setLocalFilters(prev => ({
      ...prev,
      priceRange: [0, maxPrice]
    }));
  }, [maxPrice]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = { ...localFilters, search: e.target.value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const toggleMenu = (isOpen: boolean) => {
    setIsOpen(isOpen);
    onFilterChange(localFilters);
    if (onMenuToggle) {
      onMenuToggle(isOpen);
    }
  };

  const handlePriceChange = (value: number[]) => {
    const newFilters = { ...localFilters, priceRange: [value[0], value[1]] as PriceRange };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleRatingChange = (value: number[]) => {
    const newFilters = { ...localFilters, ratingRange: [value[0], value[1]] as RatingRange };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSortChange = (sortBy: FilterState['sortBy'], sortOrder: FilterState['sortOrder']) => {
    const newFilters = { ...localFilters, sortBy, sortOrder };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleFeaturedChange = (featured: boolean | null) => {
    const newFilters = { ...localFilters, featured };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const toggleCountry = (country: string) => {
    const newCountries = localFilters.countries.includes(country)
      ? localFilters.countries.filter(c => c !== country)
      : [...localFilters.countries, country];
    
    const newFilters = { ...localFilters, countries: newCountries };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const newFilters: FilterState = {
      search: '',
      priceRange: [0, maxPrice] as PriceRange,
      ratingRange: [0, 5] as RatingRange,
      countries: [],
      sortBy: 'createdAt',
      sortOrder: 'desc',
      featured: null,
    };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const hasActiveFilters = 
    localFilters.search || 
    localFilters.ratingRange[0] > 0 || localFilters.ratingRange[1] < 5 ||
    localFilters.countries.length > 0 ||
    localFilters.priceRange[0] > 0 || 
    localFilters.priceRange[1] < maxPrice ||
    localFilters.sortBy !== 'createdAt' || localFilters.sortOrder !== 'desc' ||
    localFilters.featured !== null;

  // Don't render anything during SSR to prevent hydration issues
  if (!isMounted) return null;

  return (
    <div className="relative">
      <Button
        onClick={() => toggleMenu(!isOpen)}
        variant={hasActiveFilters ? "default" : "outline"}
        className="shadow-lg transition-all duration-300 rounded-lg justify-start"
        style={{
          padding: '12px 20px',
          width: isOpen ? '350px' : '200px',
        }}
      >
        <Filter className="h-4 w-4 mr-2" />
        {isOpen ? 'Hide Filters' : 'Show Filters'}
        {hasActiveFilters && !isOpen && (
          <span className="ml-auto h-5 w-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">
            {[
              localFilters.search ? 1 : 0,
              localFilters.ratingRange[0] > 0 || localFilters.ratingRange[1] < 5 ? 1 : 0,
              localFilters.countries.length,
              localFilters.priceRange[0] > 0 || localFilters.priceRange[1] < maxPrice ? 1 : 0,
              localFilters.sortBy !== 'createdAt' || localFilters.sortOrder !== 'desc' ? 1 : 0,
              localFilters.featured !== null ? 1 : 0
            ].reduce((a, b) => a + b, 0)}
          </span>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden mt-2"
            style={{ width: '350px' }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => toggleMenu(false)}
                  className="text-gray-500 hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="space-y-6">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search by title, location, or description..."
                    className="pl-10 w-full"
                    value={localFilters.search}
                    onChange={handleSearchChange}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-700">Filter & Sort Options</h4>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearFilters}
                    disabled={!hasActiveFilters}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    Clear all
                  </Button>
                </div>
                
                <Separator />
                
                {/* Sort Options */}
                <div>
                  <h5 className="text-sm font-medium mb-3 flex items-center">
                    <ArrowUpDown className="h-4 w-4 mr-2 text-purple-600" />
                    Sort By
                  </h5>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {[
                      { key: 'title', label: 'Title', icon: '📝' },
                      { key: 'price', label: 'Price', icon: '💰' },
                      { key: 'rating', label: 'Rating', icon: '⭐' },
                      { key: 'location', label: 'Location', icon: '📍' },
                      { key: 'createdAt', label: 'Date Added', icon: '📅' }
                    ].map((option) => (
                      <Button
                        key={option.key}
                        variant={localFilters.sortBy === option.key ? 'default' : 'outline'}
                        size="sm"
                        className="justify-start text-xs"
                        onClick={() => handleSortChange(option.key as FilterState['sortBy'], localFilters.sortOrder)}
                      >
                        <span className="mr-1">{option.icon}</span>
                        {option.label}
                      </Button>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant={localFilters.sortOrder === 'asc' ? 'default' : 'outline'}
                      size="sm"
                      className="flex-1"
                      onClick={() => handleSortChange(localFilters.sortBy, 'asc')}
                    >
                      <ArrowUp className="h-3 w-3 mr-1" />
                      Ascending
                    </Button>
                    <Button
                      variant={localFilters.sortOrder === 'desc' ? 'default' : 'outline'}
                      size="sm"
                      className="flex-1"
                      onClick={() => handleSortChange(localFilters.sortBy, 'desc')}
                    >
                      <ArrowDown className="h-3 w-3 mr-1" />
                      Descending
                    </Button>
                  </div>
                </div>
                
                <Separator />
                
                {/* Price Range */}
                <div>
                  <h5 className="text-sm font-medium mb-2 flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-blue-600" />
                    Price Range (ETH)
                  </h5>
                  <div className="px-2">
                    <Slider
                      min={0}
                      max={maxPrice}
                      step={0.1}
                      value={localFilters.priceRange}
                      onValueChange={handlePriceChange}
                      minStepsBetweenThumbs={1}
                      className="py-4"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>{localFilters.priceRange[0].toFixed(1)} ETH</span>
                      <span>{localFilters.priceRange[1].toFixed(1)} ETH</span>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                {/* Rating Range */}
                <div>
                  <h5 className="text-sm font-medium mb-2 flex items-center">
                    <Star className="h-4 w-4 mr-2 text-yellow-500 fill-yellow-500" />
                    Rating Range
                  </h5>
                  <div className="px-2">
                    <Slider
                      min={0}
                      max={5}
                      step={0.1}
                      value={localFilters.ratingRange}
                      onValueChange={handleRatingChange}
                      minStepsBetweenThumbs={1}
                      className="py-4"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>{localFilters.ratingRange[0].toFixed(1)} ⭐</span>
                      <span>{localFilters.ratingRange[1].toFixed(1)} ⭐</span>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                {/* Featured Filter */}
                <div>
                  <h5 className="text-sm font-medium mb-2 flex items-center">
                    <Award className="h-4 w-4 mr-2 text-orange-600" />
                    Featured Status
                  </h5>
                  <div className="flex space-x-2">
                    <Button
                      variant={localFilters.featured === null ? 'default' : 'outline'}
                      size="sm"
                      className="flex-1"
                      onClick={() => handleFeaturedChange(null)}
                    >
                      All
                    </Button>
                    <Button
                      variant={localFilters.featured === true ? 'default' : 'outline'}
                      size="sm"
                      className="flex-1"
                      onClick={() => handleFeaturedChange(true)}
                    >
                      Featured
                    </Button>
                    <Button
                      variant={localFilters.featured === false ? 'default' : 'outline'}
                      size="sm"
                      className="flex-1"
                      onClick={() => handleFeaturedChange(false)}
                    >
                      Regular
                    </Button>
                  </div>
                </div>
                
                <Separator />
                
                {/* Countries */}
                <div>
                  <h5 className="text-sm font-medium mb-2 flex items-center">
                    <Globe className="h-4 w-4 mr-2 text-green-600" />
                    Countries
                  </h5>
                  <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
                    {allCountries.map((country) => (
                      <div key={country} className="flex items-center space-x-2">
                        <Checkbox
                          id={`country-${country}`}
                          checked={localFilters.countries.includes(country)}
                          onCheckedChange={() => toggleCountry(country)}
                        />
                        <label
                          htmlFor={`country-${country}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {country}
                        </label>
                      </div>
                    ))}
                    {allCountries.length === 0 && (
                      <p className="text-sm text-gray-500">No countries available</p>
                    )}
                  </div>
                </div>
                
                {/* Active filters inside the panel */}
                {hasActiveFilters && (
                  <>
                    <Separator />
                    <div>
                      <h5 className="text-sm font-medium mb-2">Active Filters</h5>
                      <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
                        {localFilters.search && (
                          <div className="inline-flex items-center bg-gray-100 text-xs rounded-full px-2 py-1">
                            <span className="text-gray-700">Search: {localFilters.search.slice(0, 10)}{localFilters.search.length > 10 ? '...' : ''}</span>
                            <button 
                              onClick={() => {
                                const newFilters = { ...localFilters, search: '' };
                                setLocalFilters(newFilters);
                                onFilterChange(newFilters);
                              }}
                              className="ml-2 text-gray-500 hover:text-gray-700"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                        
                        {(localFilters.sortBy !== 'createdAt' || localFilters.sortOrder !== 'desc') && (
                          <div className="inline-flex items-center bg-purple-100 text-xs rounded-full px-2 py-1">
                            <span className="text-purple-700">
                              Sort: {localFilters.sortBy} ({localFilters.sortOrder === 'asc' ? '↑' : '↓'})
                            </span>
                            <button 
                              onClick={() => {
                                const newFilters = { ...localFilters, sortBy: 'createdAt' as FilterState['sortBy'], sortOrder: 'desc' as FilterState['sortOrder'] };
                                setLocalFilters(newFilters);
                                onFilterChange(newFilters);
                              }}
                              className="ml-2 text-purple-500 hover:text-purple-700"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                        
                        {(localFilters.priceRange[0] > 0 || localFilters.priceRange[1] < maxPrice) && (
                          <div className="inline-flex items-center bg-blue-100 text-xs rounded-full px-2 py-1">
                            <span className="text-blue-700">
                              Price: {localFilters.priceRange[0].toFixed(1)} - {localFilters.priceRange[1].toFixed(1)} ETH
                            </span>
                            <button 
                              onClick={() => {
                                const newFilters = { ...localFilters, priceRange: [0, maxPrice] as PriceRange };
                                setLocalFilters(newFilters);
                                onFilterChange(newFilters);
                              }}
                              className="ml-2 text-blue-500 hover:text-blue-700"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                        
                        {(localFilters.ratingRange[0] > 0 || localFilters.ratingRange[1] < 5) && (
                          <div className="inline-flex items-center bg-yellow-100 text-xs rounded-full px-2 py-1">
                            <span className="text-yellow-700">
                              Rating: {localFilters.ratingRange[0].toFixed(1)} - {localFilters.ratingRange[1].toFixed(1)} ⭐
                            </span>
                            <button 
                              onClick={() => {
                                const newFilters = { ...localFilters, ratingRange: [0, 5] as RatingRange };
                                setLocalFilters(newFilters);
                                onFilterChange(newFilters);
                              }}
                              className="ml-2 text-yellow-500 hover:text-yellow-700"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                        
                        {localFilters.featured !== null && (
                          <div className="inline-flex items-center bg-orange-100 text-xs rounded-full px-2 py-1">
                            <span className="text-orange-700">
                              {localFilters.featured ? 'Featured Only' : 'Regular Only'}
                            </span>
                            <button 
                              onClick={() => {
                                const newFilters = { ...localFilters, featured: null };
                                setLocalFilters(newFilters);
                                onFilterChange(newFilters);
                              }}
                              className="ml-2 text-orange-500 hover:text-orange-700"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                        
                        {localFilters.countries.map((country) => (
                          <div key={country} className="inline-flex items-center bg-green-100 text-xs rounded-full px-2 py-1">
                            <span className="text-green-700">{country}</span>
                            <button 
                              onClick={() => {
                                const newCountries = localFilters.countries.filter(c => c !== country);
                                const newFilters = { ...localFilters, countries: newCountries };
                                setLocalFilters(newFilters);
                                onFilterChange(newFilters);
                              }}
                              className="ml-2 text-green-500 hover:text-green-700"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  );
}
