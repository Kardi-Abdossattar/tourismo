import BookingClient, { Target } from './BookingClient';

export async function generateStaticParams() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/targets`);
    const targets: Target[] = await res.json();
    return targets.map((t) => ({ id: t._id }));
  } catch (e) {
    return [];
  }
}

export default async function BookingPage({ params }: { params: { id: string } }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/targets/${params.id}`, {
    cache: 'force-cache',
  });
  if (!res.ok) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  const target: Target = await res.json();

  return <BookingClient target={target} />;
}