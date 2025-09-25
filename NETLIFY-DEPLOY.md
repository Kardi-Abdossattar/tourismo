# 🚀 Quick Netlify Deployment Guide

## ✅ Pre-Deployment Checklist

Run this command to verify everything is ready:
```bash
npm run deploy-check
```

## 🔧 Netlify Settings

### **Build Settings**
- **Branch**: `demo`
- **Build command**: `npm run build`
- **Publish directory**: `out`
- **Node version**: 18.x or higher

### **Environment Variables**
No environment variables needed! ✨

## 📋 Step-by-Step Deployment

### 1. **Push to GitHub**
```bash
git push origin demo
```

### 2. **Connect to Netlify**
1. Go to [netlify.com](https://netlify.com)
2. Click "New site from Git"
3. Choose GitHub → Your repo → `demo` branch
4. Build settings will auto-configure from `netlify.toml`

### 3. **Deploy!**
Click "Deploy site" - Netlify will:
- ✅ Install dependencies
- ✅ Build static site (`npm run build`)
- ✅ Deploy to CDN
- ✅ Configure SPA routing
- ✅ Apply performance headers

## 🎯 What Gets Deployed

- **22 Static Pages** including:
  - Home page with full functionality
  - 6 destination detail pages
  - 6 booking pages
  - Admin pages (demo mode)
  - About/Contact pages

- **Features Working**:
  - ✅ Search and filtering
  - ✅ Responsive design
  - ✅ All animations
  - ✅ SPA routing
  - ✅ Fast loading (static)

## 🌐 Demo URLs

Once deployed, you'll have:
- **Home**: `https://your-site.netlify.app/`
- **Santorini**: `https://your-site.netlify.app/target/67890abcdef1234567890001/`
- **Booking**: `https://your-site.netlify.app/booking/67890abcdef1234567890001/`

## 🔍 Troubleshooting

### Build Fails?
```bash
# Test locally first
npm run deploy-check
```

### Routes Don't Work?
- Check `public/_redirects` exists
- Verify `netlify.toml` configuration

### Slow Loading?
- Should be very fast (static site)
- Check Netlify Analytics for insights

## 📊 Expected Performance

- **Lighthouse Score**: 95+ across all metrics
- **Load Time**: < 2 seconds
- **Bundle Size**: Optimized and cached
- **SEO**: Fully indexed static pages

---

**Your Tourismo demo is ready for the world! 🌍✨**
