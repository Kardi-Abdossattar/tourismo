'use client';

import { useState } from 'react';

export const useDemoPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [feature, setFeature] = useState('');
  const [description, setDescription] = useState('');

  const showDemoPopup = (featureName: string, customDescription?: string) => {
    setFeature(featureName);
    setDescription(customDescription || '');
    setIsOpen(true);
  };

  const closeDemoPopup = () => {
    setIsOpen(false);
    setFeature('');
    setDescription('');
  };

  return {
    isOpen,
    feature,
    description,
    showDemoPopup,
    closeDemoPopup,
  };
};
