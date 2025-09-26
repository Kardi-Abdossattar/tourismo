'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info, Zap, Database, CreditCard, Settings } from 'lucide-react';

interface DemoPopupProps {
  isOpen: boolean;
  onClose: () => void;
  feature: string;
  description?: string;
}

const getFeatureIcon = (feature: string) => {
  const featureLower = feature.toLowerCase();
  
  if (featureLower.includes('payment') || featureLower.includes('booking')) {
    return <CreditCard className="w-8 h-8 text-blue-500" />;
  }
  if (featureLower.includes('admin') || featureLower.includes('edit') || featureLower.includes('create')) {
    return <Settings className="w-8 h-8 text-purple-500" />;
  }
  if (featureLower.includes('database') || featureLower.includes('save')) {
    return <Database className="w-8 h-8 text-green-500" />;
  }
  
  return <Zap className="w-8 h-8 text-orange-500" />;
};

const getFeatureDescription = (feature: string) => {
  const featureLower = feature.toLowerCase();
  
  if (featureLower.includes('payment')) {
    return 'In the full version, this would process real ETH payments via smart contracts, integrate with MetaMask, and store transaction records on the blockchain.';
  }
  if (featureLower.includes('booking')) {
    return 'In the full version, this would create real reservations, send confirmation emails, integrate with payment systems, and manage availability calendars.';
  }
  if (featureLower.includes('admin') || featureLower.includes('edit')) {
    return 'In the full version, this would allow real-time editing with database persistence, image uploads, and content management capabilities.';
  }
  if (featureLower.includes('create')) {
    return 'In the full version, this would save new content to the database, handle file uploads, and update the live website immediately.';
  }
  
  return 'In the full version, this feature would be fully functional with backend integration, database storage, and real-time processing.';
};

export default function DemoPopup({ isOpen, onClose, feature, description }: DemoPopupProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white relative">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <div className="flex items-center space-x-3">
                  {getFeatureIcon(feature)}
                  <div>
                    <h3 className="text-xl font-bold">Demo Mode</h3>
                    <p className="text-blue-100 text-sm">Static Demonstration</p>
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <div className="flex items-start space-x-3 mb-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Info className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      "{feature}" is not available in demo mode
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {description || getFeatureDescription(feature)}
                    </p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-100">
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap className="w-4 h-4 text-orange-500" />
                    <span className="font-medium text-gray-900 text-sm">Full Version Features:</span>
                  </div>
                  <ul className="text-xs text-gray-600 space-y-1 ml-6">
                    <li>• Real-time backend integration</li>
                    <li>• Database persistence</li>
                    <li>• User authentication & authorization</li>
                    <li>• File uploads & media management</li>
                    <li>• Email notifications</li>
                    <li>• Payment processing</li>
                  </ul>
                </div>
              </div>
              
              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 flex justify-end">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Got it!
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
