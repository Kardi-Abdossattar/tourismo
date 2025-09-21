"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { connectWallet, isMetaMaskAvailable, ensureGanacheNetwork, sendEth } from '@/lib/web3';
import { createPayment } from '@/lib/api';
import { Wallet, CreditCard, Shield } from 'lucide-react';
import Navbar from '@/components/Navbar';

export interface Target {
  _id: string;
  title: string;
  price: number;
  image: string;
  location: string;
}

export default function BookingClient({ target }: { target: Target }) {
  const [currentTarget, setCurrentTarget] = useState<Target>(target);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [guestName, setGuestName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [txStatus, setTxStatus] = useState<'idle' | 'pending' | 'confirmed'>('idle');

  // IMPORTANT: Fixed receiver (must be a valid 0x + 40-hex address)
  const FIXED_RECEIVER = '0x2f5Be95f0D697d9b778540B010AfDB26c87C828F';

  // Refetch latest target to ensure updated image/price/etc. are shown immediately
  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/targets/${target._id}`, {
          cache: 'no-store',
        });
        if (res.ok) {
          const fresh = await res.json();
          setCurrentTarget(fresh);
        }
      } catch (_) {
        // ignore, keep initial
      }
    };
    fetchLatest();
  }, [target._id]);

  const handleConnectWallet = async () => {
    try {
      if (!isMetaMaskAvailable()) {
        toast.warning('MetaMask is not installed. Please install MetaMask to continue.');
        return;
      }
      // Ensure Ganache network
      await ensureGanacheNetwork();
      const address = await connectWallet();
      setWalletAddress(address);
      setConnected(true);
      toast.success('Wallet connected successfully!');
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error('Failed to connect wallet');
    }
  };

  const handleBooking = async () => {
    if (!currentTarget || !walletAddress || !guestName || !email) {
      toast.error('Please fill in all fields and connect your wallet');
      return;
    }

    // Validate receiver (address should be 42 chars)
    if (!FIXED_RECEIVER || !/^0x[a-fA-F0-9]{40}$/.test(FIXED_RECEIVER)) {
      toast.error('Configured receiver is not a valid Ethereum address. Please update FIXED_RECEIVER.');
      return;
    }

    setLoading(true);
    setTxStatus('pending');

    try {
      const bookingId = Math.floor(Date.now() / 1000);
      // Send ETH directly to fixed receiver via MetaMask on Ganache
      const tx = await sendEth(FIXED_RECEIVER, String(currentTarget.price));
      setTxHash(tx.hash);

      await tx.wait();
      setTxStatus('confirmed');

      const bookingData = {
        targetId: currentTarget._id,
        guestName,
        email,
        walletAddress,
        txHash: tx.hash,
        bookingId,
        amount: currentTarget.price,
        paid: true,
        date: new Date().toISOString(),
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        toast.success('Booking confirmed! Transaction successful.');
      } else {
        throw new Error('Failed to save booking');
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Booking failed. Please try again.');
    } finally {
      setLoading(false);
      if (txStatus === 'pending') setTxStatus('idle');
    }
  };

  const handleTestPayment = async () => {
    try {
      if (!isMetaMaskAvailable()) {
        toast.warning('MetaMask is not installed.');
        return;
      }
      if (!connected) {
        await handleConnectWallet();
      }
      if (!/^0x[a-fA-F0-9]{40}$/.test(FIXED_RECEIVER)) {
        toast.error('Configured receiver is not a valid Ethereum address.');
        return;
      }
      setTxStatus('pending');
      const tx = await sendEth(FIXED_RECEIVER, '0.01');
      setTxHash(tx.hash);
      await tx.wait();
      setTxStatus('confirmed');
      toast.success('Test payment sent successfully');
    } catch (e) {
      console.error(e);
      toast.error('Test payment failed');
      setTxStatus('idle');
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Booking Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="w-6 h-6" />
            <span>Complete Your Booking</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Guest Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Guest Information</h3>
            <div>
              <Label htmlFor="guestName">Full Name</Label>
              <Input id="guestName" value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder="Enter your full name" />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
            </div>
          </div>

          {/* Wallet Connection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Wallet Connection</h3>
            {!connected ? (
              <Button onClick={handleConnectWallet} className="w-full" variant="outline">
                <Wallet className="w-5 h-5 mr-2" />
                Connect MetaMask Wallet
              </Button>
            ) : (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2 text-green-800">
                  <Shield className="w-5 h-5" />
                  <span className="font-medium">Wallet Connected</span>
                </div>
                <p className="text-sm text-green-600 mt-1">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </p>
              </div>
            )}
          </div>

          {/* Book Button */}
          <Button onClick={handleBooking} disabled={loading || !connected} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3" size="lg">
            {loading ? 'Processing...' : `Pay ${currentTarget.price} ETH`}
          </Button>

          {/* Test Payment Button */}
          <Button onClick={handleTestPayment} variant="outline" className="w-full mt-3">
            Send Test Payment (0.01 ETH)
          </Button>

          {/* Transaction Status */}
          {txStatus !== 'idle' || txHash ? (
            <div className="mt-4 p-3 rounded-lg border">
              <p className="text-sm text-gray-700">
                Status: {txStatus === 'pending' ? 'Pending confirmation' : txStatus === 'confirmed' ? 'Confirmed' : 'Idle'}
              </p>
              {txHash && (
                <p className="text-sm text-gray-700 break-all mt-1">Tx Hash: {txHash}</p>
              )}
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Booking Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <img src={currentTarget.image} alt={currentTarget.title} className="w-full h-48 object-cover rounded-lg" />
            <div>
              <h3 className="text-xl font-bold">{currentTarget.title}</h3>
              <p className="text-gray-600">{currentTarget.location}</p>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-2">
                <span>Price per booking:</span>
                <span className="font-semibold">{currentTarget.price} ETH</span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total:</span>
                <span>{currentTarget.price} ETH</span>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Payment Security</h4>
              <p className="text-sm text-blue-700">
                Your payment is processed securely through the Ethereum blockchain. Transaction details will be recorded permanently.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
          </div>
        </div>
      </div>
    </>
  );
}
