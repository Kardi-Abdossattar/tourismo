"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import AdminForm from '@/components/AdminForm';
import { Plus, Edit, Trash2, Eye, LogOut } from 'lucide-react';

interface Target {
  _id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  location: string;
  rating: number;
}

export default function AdminDashboard() {
  const [targets, setTargets] = useState<Target[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTarget, setEditingTarget] = useState<Target | null>(null);
  const [page, setPage] = useState(1);
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
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/targets', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setTargets(data);
    } catch (error) {
      console.error('Error fetching targets:', error);
      toast.error('Failed to fetch targets');
    } finally {
      setLoading(false);
    }
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your travel destinations</p>
          </div>
          <div className="flex space-x-4">
            <Button
              onClick={() => router.push('/admin/pages')}
              variant="outline"
            >
              Pages
            </Button>
            <Button
              onClick={() => router.push('/admin/bookings')}
              variant="outline"
            >
              Bookings
            </Button>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Target
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Targets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {targets.slice((page - 1) * perPage, page * perPage).map((target) => (
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

        {/* Pagination */}
        {targets.length > perPage && (
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
              Page {page} of {Math.ceil(targets.length / perPage)}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(Math.ceil(targets.length / perPage), p + 1))}
              disabled={page >= Math.ceil(targets.length / perPage)}
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