'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { AnimatePresence, motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, X, Search, DollarSign, Star, Globe, ArrowUpDown, ArrowUp, ArrowDown, Award, Calendar, Plus, Minus } from 'lucide-react';
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
  featured?: boolean | null; // null = all, true = featured only, false = non-featured only
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

  const handleCountryChange = (country: string) => {
    if (country === 'all') {
      const newFilters = { ...localFilters, countries: [] };
      setLocalFilters(newFilters);
      onFilterChange(newFilters);
    } else {
      const newFilters = { ...localFilters, countries: [country] };
      setLocalFilters(newFilters);
      onFilterChange(newFilters);
    }
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
    localFilters.sortBy !== 'createdAt' || localFilters.sortOrder !== 'desc';

  // Don't render anything during SSR to prevent hydration issues
  if (!isMounted) return null;

  return (
    <div className="relative">
      <Button
        onClick={() => toggleMenu(!isOpen)}
        variant={hasActiveFilters ? "default" : "outline"}
        className="shadow-lg transition-all duration-300 rounded-lg justify-start w-full sm:w-auto"
        style={{
          padding: '8px 16px',
          minHeight: '44px',
          width: isOpen ? (typeof window !== 'undefined' && window.innerWidth < 640 ? '100%' : '350px') : (typeof window !== 'undefined' && window.innerWidth < 640 ? '100%' : '200px'),
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
              localFilters.sortBy !== 'createdAt' || localFilters.sortOrder !== 'desc' ? 1 : 0
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
            className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden mt-2 w-full sm:w-[350px] max-w-full"
          >
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Filters</h3>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => toggleMenu(false)}
                  className="text-gray-500 hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="space-y-4 sm:space-y-6">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search destinations..."
                    className="pl-10 w-full text-sm sm:text-base min-h-[44px]"
                    value={localFilters.search}
                    onChange={handleSearchChange}
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <h4 className="text-sm sm:text-base font-medium text-gray-700">Filter & Sort Options</h4>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearFilters}
                    disabled={!hasActiveFilters}
                    className="text-blue-600 hover:text-blue-700 w-full sm:w-auto text-xs sm:text-sm min-h-[36px]"
                  >
                    Clear all
                  </Button>
                </div>
                
                <Separator />
                
                {/* Sort Options */}
                <div>
                  <h5 className="text-xs sm:text-sm font-medium mb-2 sm:mb-3 flex items-center">
                    <ArrowUpDown className="h-3 h-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-purple-600" />
                    Sort By
                  </h5>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 sm:gap-2 mb-2 sm:mb-3">
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
                        className="justify-start text-xs min-h-[32px] px-2"
                        onClick={() => handleSortChange(option.key as FilterState['sortBy'], localFilters.sortOrder)}
                      >
                        <span className="mr-1 text-xs">{option.icon}</span>
                        <span className="hidden sm:inline">{option.label}</span>
                        <span className="sm:hidden text-xs">{option.label.slice(0, 4)}</span>
                      </Button>
                    ))}
                  </div>
                  <div className="flex space-x-1 sm:space-x-2">
                    <Button
                      variant={localFilters.sortOrder === 'asc' ? 'default' : 'outline'}
                      size="sm"
                      className="flex-1 text-xs min-h-[32px]"
                      onClick={() => handleSortChange(localFilters.sortBy, 'asc')}
                    >
                      <ArrowUp className="h-3 w-3 mr-1" />
                      <span className="hidden sm:inline">Ascending</span>
                      <span className="sm:hidden">Asc</span>
                    </Button>
                    <Button
                      variant={localFilters.sortOrder === 'desc' ? 'default' : 'outline'}
                      size="sm"
                      className="flex-1 text-xs min-h-[32px]"
                      onClick={() => handleSortChange(localFilters.sortBy, 'desc')}
                    >
                      <ArrowDown className="h-3 w-3 mr-1" />
                      <span className="hidden sm:inline">Descending</span>
                      <span className="sm:hidden">Desc</span>
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
                  <div className="space-y-3">
                    {/* Min Price Controls */}
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">Minimum Price</label>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newMin = Math.max(0, localFilters.priceRange[0] - 0.5);
                            if (newMin < localFilters.priceRange[1]) {
                              handlePriceChange([newMin, localFilters.priceRange[1]]);
                            }
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Input
                          type="number"
                          min="0"
                          max={localFilters.priceRange[1]}
                          step="0.1"
                          value={localFilters.priceRange[0].toFixed(1)}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value) || 0;
                            if (value >= 0 && value < localFilters.priceRange[1]) {
                              handlePriceChange([value, localFilters.priceRange[1]]);
                            }
                          }}
                          className="h-8 text-center text-sm"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newMin = Math.min(maxPrice, localFilters.priceRange[0] + 0.5);
                            if (newMin < localFilters.priceRange[1]) {
                              handlePriceChange([newMin, localFilters.priceRange[1]]);
                            }
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Max Price Controls */}
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">Maximum Price</label>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newMax = Math.max(localFilters.priceRange[0] + 0.1, localFilters.priceRange[1] - 0.5);
                            if (newMax > localFilters.priceRange[0]) {
                              handlePriceChange([localFilters.priceRange[0], newMax]);
                            }
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Input
                          type="number"
                          min={localFilters.priceRange[0]}
                          max={maxPrice}
                          step="0.1"
                          value={localFilters.priceRange[1].toFixed(1)}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value) || maxPrice;
                            if (value <= maxPrice && value > localFilters.priceRange[0]) {
                              handlePriceChange([localFilters.priceRange[0], value]);
                            }
                          }}
                          className="h-8 text-center text-sm"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newMax = Math.min(maxPrice, localFilters.priceRange[1] + 0.5);
                            if (newMax > localFilters.priceRange[0]) {
                              handlePriceChange([localFilters.priceRange[0], newMax]);
                            }
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Slider for visual feedback */}
                    <div className="px-2">
                      <Slider
                        min={0}
                        max={maxPrice}
                        step={0.1}
                        value={localFilters.priceRange}
                        onValueChange={handlePriceChange}
                        minStepsBetweenThumbs={1}
                        className="py-2"
                      />
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
                  <div className="space-y-3">
                    {/* Min Rating Controls */}
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">Minimum Rating</label>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newMin = Math.max(0, localFilters.ratingRange[0] - 0.5);
                            if (newMin < localFilters.ratingRange[1]) {
                              handleRatingChange([newMin, localFilters.ratingRange[1]]);
                            }
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Input
                          type="number"
                          min="0"
                          max={localFilters.ratingRange[1]}
                          step="0.1"
                          value={localFilters.ratingRange[0].toFixed(1)}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value) || 0;
                            if (value >= 0 && value < localFilters.ratingRange[1]) {
                              handleRatingChange([value, localFilters.ratingRange[1]]);
                            }
                          }}
                          className="h-8 text-center text-sm"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newMin = Math.min(5, localFilters.ratingRange[0] + 0.5);
                            if (newMin < localFilters.ratingRange[1]) {
                              handleRatingChange([newMin, localFilters.ratingRange[1]]);
                            }
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Max Rating Controls */}
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">Maximum Rating</label>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newMax = Math.max(localFilters.ratingRange[0] + 0.1, localFilters.ratingRange[1] - 0.5);
                            if (newMax > localFilters.ratingRange[0]) {
                              handleRatingChange([localFilters.ratingRange[0], newMax]);
                            }
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Input
                          type="number"
                          min={localFilters.ratingRange[0]}
                          max="5"
                          step="0.1"
                          value={localFilters.ratingRange[1].toFixed(1)}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value) || 5;
                            if (value <= 5 && value > localFilters.ratingRange[0]) {
                              handleRatingChange([localFilters.ratingRange[0], value]);
                            }
                          }}
                          className="h-8 text-center text-sm"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newMax = Math.min(5, localFilters.ratingRange[1] + 0.5);
                            if (newMax > localFilters.ratingRange[0]) {
                              handleRatingChange([localFilters.ratingRange[0], newMax]);
                            }
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Slider for visual feedback */}
                    <div className="px-2">
                      <Slider
                        min={0}
                        max={5}
                        step={0.1}
                        value={localFilters.ratingRange}
                        onValueChange={handleRatingChange}
                        minStepsBetweenThumbs={1}
                        className="py-2"
                      />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                {/* Countries */}
                <div>
                  <h5 className="text-sm font-medium mb-2 flex items-center">
                    <Globe className="h-4 w-4 mr-2 text-green-600" />
                    Countries
                  </h5>
                  <Select
                    value={localFilters.countries.length > 0 ? localFilters.countries[0] : 'all'}
                    onValueChange={handleCountryChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Countries</SelectItem>
                      {allCountries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                        
                        
                        {localFilters.countries.length > 0 && (
                          <div className="inline-flex items-center bg-green-100 text-xs rounded-full px-2 py-1">
                            <span className="text-green-700">Country: {localFilters.countries[0]}</span>
                            <button 
                              onClick={() => {
                                const newFilters = { ...localFilters, countries: [] };
                                setLocalFilters(newFilters);
                                onFilterChange(newFilters);
                              }}
                              className="ml-2 text-green-500 hover:text-green-700"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        )}
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
