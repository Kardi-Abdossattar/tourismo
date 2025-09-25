import TargetDetailClient from './TargetDetailClient';
import { Target } from '@/types';
import { StaticApiService } from '@/lib/static-api';

// This function runs at build time to generate static paths
export async function generateStaticParams() {
  try {
    const targets = await StaticApiService.getTargets();
    
    // Return the actual target IDs for static generation
    return targets.map((t) => ({
      id: t._id,
    }));
  } catch (e) {
    console.error('Error during static generation:', e);
    // Return some default paths as fallback
    return [
      { id: '67890abcdef1234567890001' },
      { id: '67890abcdef1234567890002' },
      { id: '67890abcdef1234567890003' },
    ];
  }
}

// This tells Next.js to revalidate this page every 60 seconds
export const revalidate = 60;

export default async function TargetDetailPage({ params }: { params: { id: string } }) {
  try {
    const target = await StaticApiService.getTargetById(params.id);
    
    if (!target) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-xl text-gray-600">Target not found</p>
        </div>
      );
    }
    
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