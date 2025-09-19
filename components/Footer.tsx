import Link from 'next/link';
import { MapPin, Mail, Phone, Facebook, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <MapPin className="w-8 h-8 text-blue-400" />
              <span className="text-2xl font-bold">Tourismo</span>
            </div>
            <p className="text-gray-400 text-sm">
              Discover the world's most amazing destinations and pay with cryptocurrency. 
              Your adventure awaits!
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm">
                Home
              </Link>
              <Link href="/destinations" className="text-gray-400 hover:text-white transition-colors text-sm">
                Destinations
              </Link>
              <Link href="/about" className="text-gray-400 hover:text-white transition-colors text-sm">
                About Us
              </Link>
              <Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">
                Contact
              </Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <div className="space-y-2">
              <Link href="/help" className="text-gray-400 hover:text-white transition-colors text-sm">
                Help Center
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link href="/faq" className="text-gray-400 hover:text-white transition-colors text-sm">
                FAQ
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="text-gray-200 text-sm font-semibold">Abdossattar Kardi</div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-blue-400" />
                <span className="text-gray-400 text-sm">kardi.abdossattar.2002@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-blue-400" />
                <span className="text-gray-400 text-sm">+212693255394</span>
              </div>
              <div className="flex space-x-4 mt-4">
                <Facebook className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Twitter className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Instagram className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 Tourismo. All rights reserved. Built with Next.js & Ethereum.
          </p>
        </div>
      </div>
    </footer>
  );
}