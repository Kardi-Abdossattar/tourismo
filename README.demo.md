# Tourismo - Static Demo Version 🌍

This is a **static/demo version** of the Tourismo website designed for portfolio showcasing and deployment on Netlify without requiring any backend services.

## 🎯 Demo Features

### ✅ **Fully Static & Self-Contained**
- No backend, database, or API dependencies
- Uses JSON file as mock database (`data/targets.json`)
- Fully deployable on static hosting platforms like Netlify

### 🎨 **Complete UI/UX Preservation**
- Identical look and feel to the main version
- All animations, styling, and interactions preserved
- Responsive design for all device sizes
- Full navigation and routing functionality

### 📱 **Demo Content**
- **6 Example Destinations**: Santorini, Bali, Swiss Alps, Maldives, Tokyo, Tuscany
- **Realistic Data**: Prices, ratings, amenities, descriptions, image galleries
- **High-Quality Images**: Curated Unsplash photos with proper URLs
- **Complete Information**: Duration, reviews, categories, what's included

## 🔧 **Technical Implementation**

### **JSON-Based Data System**
- `data/targets.json` - Contains all destination data
- `lib/static-api.ts` - Service layer that reads from JSON
- Full filtering, sorting, and search functionality
- Maintains same API interface as live version

### **Static Generation**
- Pre-built pages for all target routes (`/target/[id]`)
- Pre-built booking pages (`/booking/[id]`)
- Uses Next.js `generateStaticParams` for optimal performance
- Smart fallbacks for missing data

### **Netlify-Ready Configuration**
- `netlify.toml` - Deployment configuration
- `public/_redirects` - SPA routing support
- Optimized headers for performance and security
- Static export configuration in `next.config.js`

## 🚀 **Deployment Instructions**

### **Option 1: Netlify (Recommended)**
1. **Connect Repository**: Link your GitHub repo to Netlify
2. **Build Settings**: 
   - Build command: `npm run build`
   - Publish directory: `out`
3. **Deploy**: Netlify will automatically build and deploy

### **Option 2: Manual Build**
```bash
# Install dependencies
npm install

# Build static version
npm run build

# The 'out' directory contains the static site
# Deploy the 'out' folder to any static hosting service
```

## 📁 **Demo-Specific Files**

### **Core Demo Files**
- `data/targets.json` - Mock database with destination data
- `lib/static-api.ts` - Static API service layer
- `README.demo.md` - This documentation
- `netlify.toml` - Netlify deployment configuration
- `public/_redirects` - SPA routing configuration

### **Updated Components**
- `app/page.tsx` - Uses StaticApiService instead of live API
- `app/target/[id]/page.tsx` - Static generation with JSON data
- `app/target/[id]/TargetDetailClient.tsx` - Static data fetching
- `app/booking/[id]/page.tsx` - Static booking pages
- `types/index.ts` - Enhanced with demo-specific fields

## 🎮 **Demo Functionality**

### **Working Features**
- ✅ Browse destinations with filtering and sorting
- ✅ Search functionality across all fields
- ✅ View detailed destination pages with galleries
- ✅ Navigate to booking pages (demo mode)
- ✅ Responsive design and animations
- ✅ All UI interactions and hover effects

### **Demo Limitations**
- 🔒 Admin features disabled (no backend)
- 🔒 Actual bookings not processed (demo mode)
- 🔒 No real payment processing
- 🔒 No user authentication
- 🔒 No database persistence

## 🌟 **Demo Destinations**

### **Featured Destinations**
1. **Santorini Paradise Resort** (`67890abcdef1234567890001`)
   - Price: $450/night | Rating: 4.9/5 | Reviews: 1,247
   - Luxury resort with sunset views and infinity pool

2. **Bali Tropical Villa** (`67890abcdef1234567890002`)
   - Price: $320/night | Rating: 4.8/5 | Reviews: 892
   - Private villa in Ubud with jungle views

3. **Swiss Alpine Chalet** (`67890abcdef1234567890003`)
   - Price: $280/night | Rating: 4.7/5 | Reviews: 654
   - Mountain chalet in Zermatt with Matterhorn views

4. **Maldives Overwater Bungalow** (`67890abcdef1234567890004`)
   - Price: $650/night | Rating: 5.0/5 | Reviews: 423
   - Luxury overwater villa with direct ocean access

5. **Tokyo Modern Apartment** (`67890abcdef1234567890005`)
   - Price: $180/night | Rating: 4.6/5 | Reviews: 1,156
   - City apartment in Shibuya with modern amenities

6. **Tuscany Wine Estate** (`67890abcdef1234567890006`)
   - Price: $380/night | Rating: 4.8/5 | Reviews: 743
   - Historic villa with wine tastings and cooking classes

## 🔗 **Demo URLs**

### **Direct Links** (Replace `your-demo-site.netlify.app` with your actual URL)
- **Home**: `https://your-demo-site.netlify.app/`
- **Santorini**: `https://your-demo-site.netlify.app/target/67890abcdef1234567890001/`
- **Bali Villa**: `https://your-demo-site.netlify.app/target/67890abcdef1234567890002/`
- **Booking**: `https://your-demo-site.netlify.app/booking/67890abcdef1234567890001/`

## 📊 **Performance**

### **Optimizations**
- Static generation for instant loading
- Optimized images from Unsplash CDN
- Minimal JavaScript bundle
- Efficient caching headers
- No external API dependencies

### **Expected Lighthouse Scores**
- Performance: 95+
- Accessibility: 90+
- Best Practices: 95+
- SEO: 90+

## 🛠 **Development**

### **Local Development**
```bash
# Run in development mode
npm run dev

# Build static version
npm run build

# Preview built static site
npx serve out
```

### **Data Management**
- Edit `data/targets.json` to modify destinations
- Add new destinations by following the existing structure
- Images should use Unsplash URLs for consistency
- All IDs should be unique MongoDB-style ObjectIds

## 📝 **Notes**

- This demo version is completely separate from the main project
- No modifications to the main codebase or backend required
- All demo data is fictional and for showcase purposes only
- Images are sourced from Unsplash with proper licensing
- Perfect for portfolio presentations and client demos

## 🔄 **Switching Between Versions**

### **To Demo Version**
```bash
git checkout demo
npm install
npm run build
```

### **Back to Main Version**
```bash
git checkout main
npm install
npm run dev
```

---

**Built with ❤️ for portfolio showcasing**
