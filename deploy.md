# 🚀 Netlify Deployment Guide for Tourismo Demo

## Step-by-Step Deployment Instructions

### 1. **Push Demo Branch to GitHub**
```bash
# Make sure you're on the demo branch
git branch

# If not on demo branch, switch to it
git checkout demo

# Push the demo branch to GitHub
git push origin demo
```

### 2. **Connect to Netlify**

#### **Option A: GitHub Integration (Recommended)**
1. Go to [netlify.com](https://netlify.com) and sign in
2. Click **"New site from Git"**
3. Choose **GitHub** as your Git provider
4. Select your **tourismo repository**
5. Choose the **demo branch** (important!)
6. Configure build settings:
   - **Branch to deploy**: `demo`
   - **Build command**: `npm run build`
   - **Publish directory**: `out`
7. Click **"Deploy site"**

#### **Option B: Manual Deploy**
1. Run `npm run build` locally
2. Drag and drop the `out` folder to Netlify

### 3. **Netlify Build Settings**

The `netlify.toml` file will automatically configure:
- ✅ Build command: `npm run build`
- ✅ Publish directory: `out`
- ✅ SPA routing with redirects
- ✅ Performance headers
- ✅ Security headers

### 4. **Environment Variables**
No environment variables needed! The demo version is completely static.

### 5. **Custom Domain (Optional)**
1. In Netlify dashboard, go to **Domain settings**
2. Add your custom domain
3. Netlify will provide SSL certificate automatically

## 🔧 **Troubleshooting**

### **Build Fails?**
```bash
# Test build locally first
npm install
npm run build

# Check if 'out' directory is created
ls -la out/
```

### **Routes Not Working?**
- Ensure `public/_redirects` file exists
- Check that `netlify.toml` has the redirect rules

### **Images Not Loading?**
- All images use Unsplash URLs (external)
- No local images to worry about

### **Performance Issues?**
- The site is fully static and should be very fast
- Check Netlify's performance tab for insights

## 📊 **Expected Results**

### **Build Output**
- ✅ 22 static pages generated
- ✅ All target pages pre-rendered
- ✅ All booking pages pre-rendered
- ✅ Optimized bundle sizes

### **Performance Scores**
- 🚀 Lighthouse Performance: 95+
- ♿ Accessibility: 90+
- 🔒 Best Practices: 95+
- 🎯 SEO: 90+

### **Demo URLs Structure**
- Home: `https://your-site.netlify.app/`
- Destinations: `https://your-site.netlify.app/target/67890abcdef1234567890001/`
- Bookings: `https://your-site.netlify.app/booking/67890abcdef1234567890001/`

## 🎯 **Post-Deployment Checklist**

- [ ] Home page loads correctly
- [ ] All 6 destinations are accessible
- [ ] Filtering and search work
- [ ] Booking pages load
- [ ] Mobile responsive design works
- [ ] All animations and interactions work
- [ ] No console errors

## 🔄 **Updates**

To update the demo:
1. Make changes on the demo branch
2. Commit and push: `git push origin demo`
3. Netlify will auto-deploy the changes

## 📞 **Support**

If you encounter issues:
1. Check Netlify build logs
2. Test build locally first
3. Ensure you're on the demo branch
4. Verify all files are committed

---

**Your static Tourismo demo will be live and ready for portfolio showcasing!** 🌍✨
