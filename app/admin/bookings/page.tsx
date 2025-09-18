"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Booking {
  _id: string;
  targetId: {
    _id: string;
    title: string;
    location: string;
  };
  guestName: string;
  email: string;
  walletAddress: string;
  txHash: string;
  bookingId?: number;
  amount: number;
  paid?: boolean;
  createdAt: string;
}

interface PaymentStatus {
  user: string;
  amountWei: string;
  amountEth: string;
  paid: boolean;
}

export default function AdminBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statuses, setStatuses] = useState<Record<string, PaymentStatus | null>>({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/bookings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data: Booking[] = await res.json();
      setBookings(data);

      // fetch on-chain status for those with bookingId
      const statusEntries: Record<string, PaymentStatus | null> = {};
      await Promise.all(
        data.map(async (b) => {
          if (typeof b.bookingId === 'number') {
            try {
              const sres = await fetch(`http://localhost:5000/api/payment/status/${b.bookingId}`);
              const sdata: PaymentStatus = await sres.json();
              statusEntries[b._id] = sdata;
            } catch {
              statusEntries[b._id] = null;
            }
          } else {
            statusEntries[b._id] = null;
          }
        })
      );
      setStatuses(statusEntries);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch bookings', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
            <p className="text-gray-600 mt-2">View reservation and payment status</p>
          </div>
          <Button variant="outline" onClick={() => router.push('/admin/dashboard')}>Back to Dashboard</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((b) => {
            const status = statuses[b._id];
            const paid = status?.paid || b.paid;
            return (
              <Card key={b._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{b.targetId?.title || 'Destination'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div><span className="font-semibold">Guest:</span> {b.guestName}</div>
                    <div><span className="font-semibold">Email:</span> {b.email}</div>
                    <div><span className="font-semibold">Wallet:</span> {b.walletAddress.slice(0,6)}...{b.walletAddress.slice(-4)}</div>
                    <div><span className="font-semibold">Amount:</span> {b.amount} ETH</div>
                    {typeof b.bookingId === 'number' && (
                      <div><span className="font-semibold">Booking ID:</span> {b.bookingId}</div>
                    )}
                    <div className={paid ? 'text-green-700' : 'text-red-700'}>
                      <span className="font-semibold">Status:</span> {paid ? 'Paid' : 'Unpaid'}
                    </div>
                    {status && (
                      <div className="text-xs text-gray-500">
                        On-chain: {status.amountEth} ETH {status.user ? `from ${status.user.slice(0,6)}...${status.user.slice(-4)}` : ''}
                      </div>
                    )}
                    <div className="break-all text-xs text-gray-500">
                      Tx: {b.txHash}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
