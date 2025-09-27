import TargetDetailClient from './TargetDetailClient';
import getConfig from 'next/config';

interface Target {
  _id: string;
  title: string;
  description: string;
  price: number;
  thumbnailImage?: string;
  heroImage: string;
  location: string;
  rating: number;
  amenities: string[];
  whatsIncluded?: string[];
  duration: string;
}

interface PageProps {
  params: { id: string };
}

export const dynamic = 'force-dynamic';

function getApiUrl() {
  // Get the public runtime config
  const { publicRuntimeConfig } = getConfig();
  
  // In the browser, use the value from publicRuntimeConfig or fallback
  if (typeof window !== 'undefined') {
    return publicRuntimeConfig.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  }
  
  // On the server, use environment variable or fallback
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
}

export default async function TargetDetailPage({ params }: PageProps) {
  const apiUrl = getApiUrl();
  
  try {
    console.log(`Fetching from: ${apiUrl}/api/targets/${params.id}`);
    
    const res = await fetch(`${apiUrl}/api/targets/${params.id}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch target: ${res.status} ${res.statusText}`);
    }
    
    const target: Target = await res.json();
    return <TargetDetailClient initialTarget={target} id={params.id} />;
  } catch (error) {
    console.error('Error loading target:', error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Error loading target</h1>
          <p className="text-gray-600">The requested target could not be loaded. Please try again later.</p>
          <p className="mt-2 text-sm text-red-500">API URL: {apiUrl}</p>
        </div>
      </div>
    );
  }
}