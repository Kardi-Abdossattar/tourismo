"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getPage } from '@/lib/api';

interface PageData {
  _id: string;
  slug: 'about' | 'contact';
  title: string;
  content: string;
}

export default function ContactPage() {
  const [page, setPage] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const data = await getPage('contact');
        setPage(data);
      } catch (err) {
        console.error('Failed to load Contact page', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="container mx-auto px-4 py-16">
        <p className="text-gray-600">Contact page is not available.</p>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">{page.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <p className="whitespace-pre-line text-gray-700 leading-relaxed">
                {page.content}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
