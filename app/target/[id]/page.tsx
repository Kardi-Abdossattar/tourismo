import TargetDetailClient from './TargetDetailClient';

interface Target {
  _id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  location: string;
  rating: number;
  amenities: string[];
  duration: string;
}

export async function generateStaticParams() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/targets`);
    const targets: Target[] = await res.json();
    return targets.map((t) => ({ id: t._id }));
  } catch (e) {
    return [];
  }
}

export default async function TargetDetailPage({ params }: { params: { id: string } }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/targets/${params.id}`, { cache: 'force-cache' });
  if (!res.ok) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Target not found</p>
      </div>
    );
  }
  const target: Target = await res.json();

  return <TargetDetailClient initialTarget={target} id={params.id} />;
}