"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import AdminForm from '@/components/AdminForm';
import { Plus, Edit, Trash2, Eye, LogOut } from 'lucide-react';
import { AttractionFilters, FilterState } from '@/components/AttractionFilters';

interface Target {
  _id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  location: string;
  rating: number;
  country?: string;
}

export default function AdminDashboard() {
  const [targets, setTargets] = useState<Target[]>([]);
  const [allTargets, setAllTargets] = useState<Target[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTarget, setEditingTarget] = useState<Target | null>(null);
  const [page, setPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    priceRange: [0, 10],
    ratingRange: [0, 5],
    countries: [],
    sortBy: 'createdAt',
    sortOrder: 'desc',
    featured: null,
  });
  const perPage = 9;
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    fetchTargets();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/admin/login');
    }
  };

  const fetchTargets = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/targets', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      
      // Handle both old format (array) and new format (object with targets)
      let targetsData: Target[] = [];
      if (Array.isArray(data)) {
        targetsData = data;
      } else {
        targetsData = data.targets || [];
      }
      
      setAllTargets(targetsData);
      applyFilters(targetsData, filters);
    } catch (error) {
      console.error('Error fetching targets:', error);
      toast.error('Failed to fetch targets');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (targetsData: Target[], currentFilters: FilterState) => {
    let result = [...targetsData];

    // Search filter
    if (currentFilters.search.trim()) {
      const q = currentFilters.search.trim().toLowerCase();
      result = result.filter((t) =>
        [t.title, t.location, t.description, t.country].some((f) => f?.toLowerCase().includes(q))
      );
    }

    // Price range filter
    result = result.filter((t) => 
      t.price >= currentFilters.priceRange[0] && t.price <= currentFilters.priceRange[1]
    );

    // Rating range filter
    result = result.filter((t) => 
      t.rating >= currentFilters.ratingRange[0] && t.rating <= currentFilters.ratingRange[1]
    );

    // Country filter
    if (currentFilters.countries.length > 0) {
      result = result.filter((t) => 
        t.country && currentFilters.countries.includes(t.country)
      );
    }

    // Sorting
    result.sort((a, b) => {
      let aVal: any, bVal: any;
      
      switch (currentFilters.sortBy) {
        case 'title':
          aVal = a.title.toLowerCase();
          bVal = b.title.toLowerCase();
          break;
        case 'price':
          aVal = a.price;
          bVal = b.price;
          break;
        case 'rating':
          aVal = a.rating;
          bVal = b.rating;
          break;
        case 'location':
          aVal = a.location.toLowerCase();
          bVal = b.location.toLowerCase();
          break;
        case 'createdAt':
        default:
          aVal = new Date().getTime(); // Admin doesn't have createdAt, use current time
          bVal = new Date().getTime();
          break;
      }
      
      if (aVal < bVal) return currentFilters.sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return currentFilters.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setTargets(result);
  };

  const handleFilterChange = async (newFilters: FilterState) => {
    setFilters(newFilters);
    setPage(1);
    applyFilters(allTargets, newFilters);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/admin/login');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this target?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/targets/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success('Target deleted successfully');
        fetchTargets();
      } else {
        toast.error('Failed to delete target');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete target');
    }
  };

  const handleEdit = (target: Target) => {
    setEditingTarget(target);
    setShowForm(true);
  };

  const handleFormSubmit = () => {
    setShowForm(false);
    setEditingTarget(null);
    fetchTargets();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col space-y-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your travel destinations</p>
            </div>
            <div className="flex flex-wrap justify-end gap-3">
              <Button
                onClick={() => router.push('/admin/pages')}
                variant="outline"
                size="sm"
                className="whitespace-nowrap"
              >
                Pages
              </Button>
              <Button
                onClick={() => router.push('/admin/bookings')}
                variant="outline"
                size="sm"
                className="whitespace-nowrap"
              >
                Bookings
              </Button>
              <Button
                onClick={() => setShowForm(true)}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Target
              </Button>
            </div>
          </div>
          <div className="border-t border-gray-200"></div>
        </div>

        {/* Filters and Targets Layout */}
        <div className={`flex gap-6 items-start transition-all duration-300 ${isFilterOpen ? '' : 'relative'}`}>
          {/* Advanced Filters - Left Side */}
          <div className={`${isFilterOpen ? 'flex-shrink-0' : 'absolute top-0 left-0 z-50'}`}>
            <AttractionFilters
              onFilterChange={handleFilterChange}
              allCountries={Array.from(new Set(allTargets.map(t => t.country).filter((country): country is string => Boolean(country)))).sort()}
              maxPrice={Math.max(...allTargets.map(t => t.price), 10)}
              onMenuToggle={(isOpen: boolean) => {
                setIsFilterOpen(isOpen);
              }}
            />
          </div>

          {/* Targets Grid - Right Side */}
          <div className="flex-1 min-w-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(targets || []).slice((page - 1) * perPage, page * perPage).map((target) => (
                <Card key={target._id} className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={target.image}
                      alt={target.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
              <CardHeader className="flex-grow">
                <CardTitle className="text-lg">{target.title}</CardTitle>
                <p className="text-sm text-gray-600">{target.location}</p>
              </CardHeader>
              <CardContent className="mt-auto">
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {target.description}
                </p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-blue-600">
                    ${target.price} ETH
                  </span>
                  <div className="flex items-center text-sm text-gray-500">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                    {target.rating}/5
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => router.push(`/target/${target._id}`)}
                    className="flex-1"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(target)}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(target._id)}
                    className="text-red-600 hover:text-red-700 flex-1"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
            </div>
          </div>
        </div>

        {/* Pagination */}
        {(targets || []).length > perPage && (
          <div className="flex justify-center mt-8 space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <div className="flex items-center px-4 text-sm text-gray-600">
              Page {page} of {Math.ceil((targets || []).length / perPage)}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(Math.ceil((targets || []).length / perPage), p + 1))}
              disabled={page >= Math.ceil((targets || []).length / perPage)}
            >
              Next
            </Button>
          </div>
        )}

        {/* Form Modal */}
        {showForm && (
          <AdminForm
            target={editingTarget}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingTarget(null);
            }}
          />
        )}
      </div>
    </div>
  );
}