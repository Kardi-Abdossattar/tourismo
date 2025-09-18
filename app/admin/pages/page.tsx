"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PageForm from '@/components/PageForm';

interface PageData {
  _id: string;
  slug: 'about' | 'contact';
  title: string;
  content: string;
}

export default function AdminPages() {
  const router = useRouter();
  const [about, setAbout] = useState<PageData | null>(null);
  const [contact, setContact] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<'about' | 'contact' | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const [aboutRes, contactRes] = await Promise.all([
        fetch('http://localhost:5000/api/pages/about'),
        fetch('http://localhost:5000/api/pages/contact'),
      ]);
      const aboutData = await aboutRes.json();
      const contactData = await contactRes.json();
      setAbout(aboutData);
      setContact(contactData);
    } catch (e) {
      console.error('Failed to fetch pages', e);
    } finally {
      setLoading(false);
    }
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
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Pages</h1>
            <p className="text-gray-600 mt-2">Edit static pages content</p>
          </div>
          <Button variant="outline" onClick={() => router.push('/admin/dashboard')}>Back to Dashboard</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* About Card */}
          <Card>
            <CardHeader>
              <CardTitle>About Page</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-800 font-semibold mb-2">{about?.title}</p>
              <p className="text-gray-600 line-clamp-4 whitespace-pre-line">{about?.content}</p>
              <div className="mt-4">
                <Button onClick={() => setEditing('about')} variant="outline">Edit</Button>
              </div>
            </CardContent>
          </Card>

          {/* Contact Card */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Page</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-800 font-semibold mb-2">{contact?.title}</p>
              <p className="text-gray-600 line-clamp-4 whitespace-pre-line">{contact?.content}</p>
              <div className="mt-4">
                <Button onClick={() => setEditing('contact')} variant="outline">Edit</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {editing && (
          <PageForm
            page={editing === 'about' ? about : contact}
            onSubmit={() => {
              setEditing(null);
              fetchPages();
            }}
            onCancel={() => setEditing(null)}
          />
        )}
      </div>
    </div>
  );
}
