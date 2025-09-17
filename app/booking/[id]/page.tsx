"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { connectWallet, payWithEthereum } from '@/lib/web3';
import { Wallet, CreditCard, Shield } from 'lucide-react';

interface Target {
  _id: string;
  title: string;
  price: number;
  image: string;
  location: string;
}

export default function BookingPage() {
  const params = useParams();
  const [target, setTarget] = useState<Target | null>(null);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [guestName, setGuestName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchTarget(params.id as string);
    }
  }, [params.id]);

  const fetchTarget = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/targets/${id}`);
      const data = await response.json();
      setTarget(data);
    } catch (error) {
      console.error('Error fetching target:', error);
      toast.error('Failed to load destination details');
    }
  };

  const handleConnectWallet = async () => {
    try {
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
    if (!target || !walletAddress || !guestName || !email) {
      toast.error('Please fill in all fields and connect your wallet');
      return;
    }

    setLoading(true);
    
    try {
      // Process payment
      const txHash = await payWithEthereum(target.price, walletAddress);
      
      // Save booking to database
      const bookingData = {
        targetId: target._id,
        guestName,
        email,
        walletAddress,
        txHash,
        amount: target.price,
        date: new Date().toISOString(),
      };

      const response = await fetch('http://localhost:5000/api/bookings', {
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
    }
  };

  if (!target) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
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
                  <Input
                    id="guestName"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Wallet Connection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Wallet Connection</h3>
                {!connected ? (
                  <Button 
                    onClick={handleConnectWallet}
                    className="w-full"
                    variant="outline"
                  >
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
              <Button
                onClick={handleBooking}
                disabled={loading || !connected}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                size="lg"
              >
                {loading ? 'Processing...' : `Pay ${target.price} ETH`}
              </Button>
            </CardContent>
          </Card>

          {/* Booking Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <img
                  src={target.image}
                  alt={target.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div>
                  <h3 className="text-xl font-bold">{target.title}</h3>
                  <p className="text-gray-600">{target.location}</p>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span>Price per booking:</span>
                    <span className="font-semibold">{target.price} ETH</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total:</span>
                    <span>{target.price} ETH</span>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Payment Security</h4>
                  <p className="text-sm text-blue-700">
                    Your payment is processed securely through the Ethereum blockchain. 
                    Transaction details will be recorded permanently.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}