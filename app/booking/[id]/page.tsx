import BookingClient, { Target } from './BookingClient';

export async function generateStaticParams() {
  // If we don't have an API URL during build, return some default paths
  if (!process.env.NEXT_PUBLIC_API_URL) {
    console.warn('No API URL found for booking page. Using default paths for static generation.');
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
      console.error('Failed to fetch targets for booking static generation:', res.statusText);
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
    console.error('Error during booking static generation:', e);
    // Return some default paths as fallback
    return [
      { id: '1' },
      { id: '2' },
      { id: '3' },
    ];
  }
}

export default async function BookingPage({ params }: { params: { id: string } }) {
  // If we don't have an API URL, show a loading state that will trigger client-side fetch
  if (!process.env.NEXT_PUBLIC_API_URL) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/targets/${params.id}`, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });
    
    if (!res.ok) {
      console.error(`Failed to fetch target ${params.id} for booking:`, res.statusText);
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl text-gray-600 mb-4">Target not found</p>
            <p className="text-sm text-gray-500">The booking target you're looking for doesn't exist.</p>
          </div>
        </div>
      );
    }
    
    const target: Target = await res.json();
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