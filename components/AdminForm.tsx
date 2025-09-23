"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { X, Upload, Link, Image } from 'lucide-react';

interface Target {
  _id: string;
  title: string;
  description: string;
  price: number;
  thumbnailImage?: string;
  heroImage: string;
  location: string;
  rating: number;
  country?: string;
  whatsIncluded?: string[];
}

interface AdminFormProps {
  target?: Target | null;
  onSubmit: () => void;
  onCancel: () => void;
}

export default function AdminForm({ target, onSubmit, onCancel }: AdminFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    thumbnailImage: '',
    heroImage: '',
    location: '',
    rating: '',
    country: '',
    whatsIncluded: '',
  });
  const [loading, setLoading] = useState(false);
  
  // Image upload states
  const [heroImageMode, setHeroImageMode] = useState<'url' | 'upload'>('url');
  const [thumbnailImageMode, setThumbnailImageMode] = useState<'url' | 'upload'>('url');
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [thumbnailImageFile, setThumbnailImageFile] = useState<File | null>(null);
  const [heroImagePreview, setHeroImagePreview] = useState<string>('');
  const [thumbnailImagePreview, setThumbnailImagePreview] = useState<string>('');
  
  const heroFileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (target) {
      setFormData({
        title: target.title,
        description: target.description,
        price: target.price.toString(),
        thumbnailImage: target.thumbnailImage || '',
        heroImage: target.heroImage,
        location: target.location,
        rating: target.rating.toString(),
        country: target.country || '',
        whatsIncluded: target.whatsIncluded ? target.whatsIncluded.join('\n') : '',
      });
    }
  }, [target]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (type: 'hero' | 'thumbnail', file: File | null) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    if (type === 'hero') {
      setHeroImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setHeroImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setThumbnailImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setThumbnailImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5000/api/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const data = await response.json();
    return data.imageUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let heroImageUrl = formData.heroImage;
      let thumbnailImageUrl = formData.thumbnailImage;

      // Upload hero image if file is selected
      if (heroImageMode === 'upload' && heroImageFile) {
        heroImageUrl = await uploadImage(heroImageFile);
      }

      // Upload thumbnail image if file is selected
      if (thumbnailImageMode === 'upload' && thumbnailImageFile) {
        thumbnailImageUrl = await uploadImage(thumbnailImageFile);
      }

      const token = localStorage.getItem('token');
      const url = target
        ? `http://localhost:5000/api/targets/${target._id}`
        : 'http://localhost:5000/api/targets';

      const method = target ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          rating: parseFloat(formData.rating),
          country: formData.country || undefined,
          heroImage: heroImageUrl,
          thumbnailImage: thumbnailImageUrl || undefined,
          whatsIncluded: formData.whatsIncluded ? formData.whatsIncluded.split('\n').filter(item => item.trim()) : [],
        }),
      });

      if (response.ok) {
        toast.success(target ? 'Target updated successfully!' : 'Target created successfully!');
        onSubmit();
      } else {
        toast.error('Failed to save target');
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Failed to save target');
    } finally {
      setLoading(false);
    }
  };

  const ImageInput = ({ 
    type, 
    label, 
    recommendation, 
    required = false 
  }: { 
    type: 'hero' | 'thumbnail'; 
    label: string; 
    recommendation: string; 
    required?: boolean; 
  }) => {
    const mode = type === 'hero' ? heroImageMode : thumbnailImageMode;
    const setMode = type === 'hero' ? setHeroImageMode : setThumbnailImageMode;
    const fileInputRef = type === 'hero' ? heroFileInputRef : thumbnailFileInputRef;
    const preview = type === 'hero' ? heroImagePreview : thumbnailImagePreview;
    const urlValue = type === 'hero' ? formData.heroImage : formData.thumbnailImage;

    return (
      <div className="space-y-3">
        <Label className="text-sm sm:text-base">
          {label}
          <span className="text-xs text-gray-500 ml-2">({recommendation})</span>
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        
        {/* Mode Toggle */}
        <div className="flex gap-2">
          <Button
            type="button"
            variant={mode === 'url' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode('url')}
            className="flex items-center gap-2"
          >
            <Link className="w-4 h-4" />
            URL
          </Button>
          <Button
            type="button"
            variant={mode === 'upload' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode('upload')}
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload
          </Button>
        </div>

        {/* URL Input */}
        {mode === 'url' && (
          <Input
            name={type === 'hero' ? 'heroImage' : 'thumbnailImage'}
            type="url"
            value={urlValue}
            onChange={handleChange}
            placeholder={`https://example.com/${type}-image.jpg`}
            className="min-h-[44px] text-sm sm:text-base"
            required={required}
          />
        )}

        {/* File Upload */}
        {mode === 'upload' && (
          <div className="space-y-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(type, e.target.files?.[0] || null)}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full min-h-[44px] flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Choose Image File
            </Button>
            
            {/* Preview */}
            {preview && (
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-lg border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    if (type === 'hero') {
                      setHeroImageFile(null);
                      setHeroImagePreview('');
                    } else {
                      setThumbnailImageFile(null);
                      setThumbnailImagePreview('');
                    }
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="absolute top-2 right-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">
            {target ? 'Edit Target' : 'Add New Target'}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel} className="min-h-[40px] min-w-[40px]">
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 pt-0">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <Label htmlFor="title" className="text-sm sm:text-base">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter destination title"
                className="mt-1 min-h-[44px] text-sm sm:text-base"
                required
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-sm sm:text-base">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter destination description"
                rows={3}
                className="mt-1 min-h-[80px] text-sm sm:text-base resize-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <Label htmlFor="price" className="text-sm sm:text-base">Price (ETH)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="mt-1 min-h-[44px] text-sm sm:text-base"
                  required
                />
              </div>

              <div>
                <Label htmlFor="rating" className="text-sm sm:text-base">Rating (1-5)</Label>
                <Input
                  id="rating"
                  name="rating"
                  type="number"
                  step="0.1"
                  min="1"
                  max="5"
                  value={formData.rating}
                  onChange={handleChange}
                  placeholder="4.5"
                  className="mt-1 min-h-[44px] text-sm sm:text-base"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="location" className="text-sm sm:text-base">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="City, landmark, etc."
                  className="min-h-[44px] text-sm sm:text-base"
                  required
                />
              </div>
              
              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="country" className="text-sm sm:text-base">Country <span className="text-red-500">*</span></Label>
                <select
                  id="country"
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm sm:text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="">Select a country</option>
                  {[
                    'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 
                    'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 
                    'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 
                    'Cabo Verde', 'Cambodia', 'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 
                    'Comoros', 'Congo', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 
                    'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 
                    'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 
                    'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 
                    'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Korea, North', 
                    'Korea, South', 'Kosovo', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 
                    'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 
                    'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 
                    'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 
                    'Norway', 'Oman', 'Pakistan', 'Palau', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 
                    'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 
                    'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 
                    'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 
                    'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 
                    'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 
                    'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
                  ].sort().map(country => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <ImageInput
              type="hero"
              label="Hero Image"
              recommendation="Required - Recommended: 1200x800px for detail page"
              required={true}
            />

            <ImageInput
              type="thumbnail"
              label="Thumbnail Image"
              recommendation="Optional - Recommended: 400x300px for grid cards"
              required={false}
            />

            <div>
              <Label htmlFor="whatsIncluded" className="text-sm sm:text-base">What's Included</Label>
              <Textarea
                id="whatsIncluded"
                name="whatsIncluded"
                value={formData.whatsIncluded}
                onChange={handleChange}
                placeholder="Enter each item on a new line:&#10;Free WiFi&#10;Breakfast included&#10;Airport transfer&#10;Tour guide"
                rows={4}
                className="mt-1 min-h-[100px] text-sm sm:text-base resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">Enter each included item on a separate line</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 min-h-[44px] text-sm sm:text-base order-2 sm:order-1"
              >
                {loading ? 'Saving...' : (target ? 'Update Target' : 'Create Target')}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1 min-h-[44px] text-sm sm:text-base order-1 sm:order-2"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}