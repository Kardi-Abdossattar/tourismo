import TargetDetailClient from './TargetDetailClient';
import { Target } from '@/types';

// This function runs at build time to generate static paths
export async function generateStaticParams() {
  // If we don't have an API URL during build, return an empty array
  if (!process.env.NEXT_PUBLIC_API_URL) {
    return [];
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/targets`);
    if (!res.ok) {
      console.error('Failed to fetch targets for static generation');
      return [];
    }
    const targets: Target[] = await res.json();
    return targets.map((t) => ({
      id: t._id,
    }));
  } catch (e) {
    console.error('Error during static generation:', e);
    return [];
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