import TargetDetailClient from './TargetDetailClient';

interface Target {
  _id: string;
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  heroImage: string;
  thumbnailImage: string;
  location: string;
  rating: number;
  country: string;
  whatsIncluded: string[];
  amenities: string[];
  duration: string;
  updatedAt: string;
}

export async function generateStaticParams() {
  try {
    // Load static data for generating paths
    const response = await fetch('http://localhost:3000/data/tourismo.targets.json');
    const targets = await response.json();
    return targets.map((t: any) => ({ 
      id: t._id?.$oid || t._id || t.id 
    }));
  } catch (e) {
    console.error('Error generating static params:', e);
    return [];
  }
}

export default async function TargetDetailPage({ params }: { params: { id: string } }) {
  try {
    // Load static data
    const response = await fetch('http://localhost:3000/data/tourismo.targets.json');
    const targetsData = await response.json();
    
    // Find the target by ID
    const target = targetsData.find((t: any) => {
      const targetId = t._id?.$oid || t._id || t.id;
      return targetId === params.id;
    });

    if (!target) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Destination Not Found</h1>
            <p className="text-lg text-gray-600 mb-4">This is a static demo version.</p>
            <p className="text-sm text-gray-500">The requested destination may not be available in the demo dataset.</p>
          </div>
        </div>
      );
    }

    // Transform the data to match expected format
    const transformedTarget: Target = {
      _id: target._id?.$oid || target._id || target.id,
      id: target._id?.$oid || target._id || target.id,
      title: target.title,
      description: target.description,
      price: target.price,
      image: target.image,
      heroImage: target.heroImage || target.image,
      thumbnailImage: target.thumbnailImage || target.smallImage || target.image,
      location: target.location,
      rating: target.rating,
      country: target.country,
      whatsIncluded: target.whatsIncluded || [],
      amenities: target.amenities || ['WiFi', 'Parking', 'Restaurant', 'Tour Guide'], // Default amenities for demo
      duration: target.duration || '1-3 days', // Default duration for demo
      updatedAt: target.updatedAt?.$date || target.updatedAt || new Date().toISOString(),
    };

    return <TargetDetailClient initialTarget={transformedTarget} id={params.id} />;
  } catch (error) {
    console.error('Error loading target:', error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Loading destination</h1>
          <p className="text-lg text-gray-600 mb-4">This is a static demo version.</p>
          <p className="text-sm text-gray-500">There was an error loading the destination data.</p>
        </div>
      </div>
    );
  }
}