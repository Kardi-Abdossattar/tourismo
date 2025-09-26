import TargetCard from './TargetCard';
import { Target } from '@/types/target';

interface GridLayoutProps {
  targets: Target[];
  loading: boolean;
}

export default function GridLayout({ targets, loading }: GridLayoutProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-4 sm:gap-6">
        {Array.from({ length: 9 }).map((_, index) => (
          <div key={index} className="overflow-hidden rounded-xl border bg-white shadow-sm">
            <div className="relative aspect-video">
              <div className="absolute inset-0 animate-pulse bg-gray-200" />
            </div>
            <div className="p-4 sm:p-6 space-y-2 sm:space-y-3">
              <div className="h-3 sm:h-4 w-20 sm:w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 sm:h-5 w-3/4 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 sm:h-4 w-full bg-gray-200 rounded animate-pulse" />
              <div className="flex justify-between items-center pt-1">
                <div className="h-5 sm:h-6 w-20 sm:w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-8 sm:h-9 w-24 sm:w-28 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (targets.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12 px-4">
        <p className="text-lg sm:text-xl text-gray-600 mb-3 sm:mb-4">No destinations available</p>
        <p className="text-sm sm:text-base text-gray-500">Check back later for amazing travel opportunities!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-4 sm:gap-6">
      {targets.map((target) => (
        <TargetCard key={target._id} target={target} />
      ))}
    </div>
  );
}