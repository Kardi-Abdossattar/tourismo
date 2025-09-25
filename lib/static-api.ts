import { Target } from '@/types';
import targetsData from '@/data/targets.json';

// Static API service that uses JSON data instead of live API calls
export class StaticApiService {
  private static targets: Target[] = targetsData.targets;

  // Get all targets with optional filtering
  static async getTargets(filters?: {
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    maxRating?: number;
    countries?: string[];
    featured?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    limit?: number;
  }): Promise<Target[]> {
    let filtered = [...this.targets];

    if (filters) {
      // Apply search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(target => 
          target.title.toLowerCase().includes(searchLower) ||
          target.description.toLowerCase().includes(searchLower) ||
          target.location.toLowerCase().includes(searchLower) ||
          target.country?.toLowerCase().includes(searchLower)
        );
      }

      // Apply price filters
      if (filters.minPrice !== undefined) {
        filtered = filtered.filter(target => target.price >= filters.minPrice!);
      }
      if (filters.maxPrice !== undefined) {
        filtered = filtered.filter(target => target.price <= filters.maxPrice!);
      }

      // Apply rating filters
      if (filters.minRating !== undefined) {
        filtered = filtered.filter(target => target.rating >= filters.minRating!);
      }
      if (filters.maxRating !== undefined) {
        filtered = filtered.filter(target => target.rating <= filters.maxRating!);
      }

      // Apply country filter
      if (filters.countries && filters.countries.length > 0) {
        filtered = filtered.filter(target => 
          target.country && filters.countries!.includes(target.country)
        );
      }

      // Apply featured filter
      if (filters.featured !== undefined && filters.featured !== null) {
        filtered = filtered.filter(target => target.featured === filters.featured);
      }

      // Apply sorting
      if (filters.sortBy) {
        filtered.sort((a, b) => {
          let aValue: any = a[filters.sortBy as keyof Target];
          let bValue: any = b[filters.sortBy as keyof Target];

          // Handle special sort cases
          if (filters.sortBy === 'createdAt') {
            aValue = new Date(aValue || 0).getTime();
            bValue = new Date(bValue || 0).getTime();
          }

          if (typeof aValue === 'string') {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
          }

          if (filters.sortOrder === 'desc') {
            return bValue > aValue ? 1 : bValue < aValue ? -1 : 0;
          } else {
            return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
          }
        });
      }

      // Apply limit
      if (filters.limit) {
        filtered = filtered.slice(0, filters.limit);
      }
    }

    return filtered;
  }

  // Get a single target by ID
  static async getTargetById(id: string): Promise<Target | null> {
    const target = this.targets.find(t => t._id === id);
    return target || null;
  }

  // Get featured targets
  static async getFeaturedTargets(): Promise<Target[]> {
    return this.targets.filter(target => target.featured);
  }

  // Get targets by country
  static async getTargetsByCountry(country: string): Promise<Target[]> {
    return this.targets.filter(target => target.country === country);
  }

  // Get all unique countries
  static async getCountries(): Promise<string[]> {
    const countries = this.targets
      .map(target => target.country)
      .filter((country): country is string => Boolean(country));
    return Array.from(new Set(countries)).sort();
  }

  // Get price range
  static async getPriceRange(): Promise<{ min: number; max: number }> {
    const prices = this.targets.map(target => target.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  }

  // Search targets
  static async searchTargets(query: string): Promise<Target[]> {
    return this.getTargets({ search: query });
  }
}

// Export a default instance for convenience
export const staticApi = StaticApiService;
