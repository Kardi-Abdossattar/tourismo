import BookingClient, { Target } from './BookingClient';
import { StaticApiService } from '@/lib/static-api';

export async function generateStaticParams() {
  try {
    const targets = await StaticApiService.getTargets();
    
    // Return the actual target IDs for static generation
    return targets.map((t) => ({
      id: t._id,
    }));
  } catch (e) {
    console.error('Error during booking static generation:', e);
    // Return some default paths as fallback
    return [
      { id: '67890abcdef1234567890001' },
      { id: '67890abcdef1234567890002' },
      { id: '67890abcdef1234567890003' },
    ];
  }
}

export default async function BookingPage({ params }: { params: { id: string } }) {
  try {
    const target = await StaticApiService.getTargetById(params.id);
    
    if (!target) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl text-gray-600 mb-4">Target not found</p>
            <p className="text-sm text-gray-500">The booking target you're looking for doesn't exist.</p>
          </div>
        </div>
      );
    }
    
    return <BookingClient target={target} />;
  } catch (error) {
    console.error('Error fetching target for booking:', error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Error loading booking</p>
          <p className="text-sm text-gray-500">Please try again later.</p>
        </div>
      </div>
    );
  }
}