import TargetDetailClient from './TargetDetailClient';
import { Target } from '@/types';

// This function runs at build time to generate static paths
export async function generateStaticParams() {
  // If we don't have an API URL during build, return some default paths
  if (!process.env.NEXT_PUBLIC_API_URL) {
    console.warn('No API URL found. Using default paths for static generation.');
    // Return some default paths that are likely to exist
    return [
      { id: '1' },
      { id: '2' },
      { id: '3' },
    ];
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/targets`, {
      next: { revalidate: 3600 } // Revalidate every hour
    });
    
    if (!res.ok) {
      console.error('Failed to fetch targets for static generation:', res.statusText);
      // Return some default paths as fallback
      return [
        { id: '1' },
        { id: '2' },
        { id: '3' },
      ];
    }
    
    const targets: Target[] = await res.json();
    
    // If no targets, return default paths
    if (!targets || targets.length === 0) {
      return [
        { id: '1' },
        { id: '2' },
        { id: '3' },
      ];
    }
    
    // Return the actual target IDs for static generation
    return targets.map((t) => ({
      id: t._id,
    }));
  } catch (e) {
    console.error('Error during static generation:', e);
    // Return some default paths as fallback
    return [
      { id: '1' },
      { id: '2' },
      { id: '3' },
    ];
  }
}

// This tells Next.js to revalidate this page every 60 seconds
export const revalidate = 60;

export default async function TargetDetailPage({ params }: { params: { id: string } }) {
  // If we don't have an API URL, show a loading state that will trigger client-side fetch
  if (!process.env.NEXT_PUBLIC_API_URL) {
    return <TargetDetailClient initialTarget={null} id={params.id} />;
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/targets/${params.id}`, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });
    
    if (!res.ok) {
      console.error(`Failed to fetch target ${params.id}:`, res.statusText);
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-xl text-gray-600">Target not found</p>
        </div>
      );
    }
    
    const target: Target = await res.json();
    return <TargetDetailClient initialTarget={target} id={params.id} />;
  } catch (error) {
    console.error('Error fetching target:', error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Error loading target. Please try again later.</p>
      </div>
    );
  }
}