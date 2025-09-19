import TargetCard from './TargetCard';

interface Target {
  _id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  location: string;
  rating: number;
}

interface GridLayoutProps {
  targets: Target[];
  loading: boolean;
}

export default function GridLayout({ targets, loading }: GridLayoutProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, index) => (
          <div key={index} className="overflow-hidden rounded-xl border bg-white">
            <div className="relative aspect-video">
              <div className="absolute inset-0 animate-pulse bg-gray-200" />
            </div>
            <div className="p-6 space-y-3">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              <div className="flex justify-between items-center pt-1">
                <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-9 w-28 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (targets.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-600 mb-4">No destinations available</p>
        <p className="text-gray-500">Check back later for amazing travel opportunities!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {targets.map((target) => (
        <TargetCard key={target._id} target={target} />
      ))}
    </div>
  );
}