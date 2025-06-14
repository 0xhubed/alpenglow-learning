# Schweizer Lernspiel - Deployment Guide

## 🚀 **Recommended: Vercel (Best for Next.js)**

### Why Vercel:
- **Built for Next.js** - Created by the Next.js team
- **Zero configuration** - Deploy with one command
- **Global CDN** - Fast loading worldwide
- **Automatic HTTPS** - Secure by default
- **Free tier** - Perfect for educational projects
- **Custom domains** - Easy to add your own domain

### Deployment Steps:
```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. From your frontend directory
cd /home/hubed/projects/alpenglow-learning/schweizer-lernspiel/frontend

# 3. Deploy (first time)
vercel

# 4. Follow prompts:
# - Link to existing project? No
# - What's your project's name? schweizer-lernspiel
# - In which directory is your code located? ./
# - Want to override settings? No

# 5. Future deployments
vercel --prod
```

### Alternative: GitHub Integration
1. Push your code to GitHub
2. Connect GitHub repo to Vercel dashboard
3. Automatic deployments on every push

---

## 🌐 **Alternative Options**

### **Netlify** (Also excellent for React/Next.js)
- **Drag & drop deployment** - Upload build folder
- **Git integration** - Auto-deploy from GitHub
- **Free tier** with custom domains
- **Global CDN** and form handling

```bash
# Build your app
npm run build

# Deploy build folder to Netlify
# Or connect GitHub repo at netlify.com
```

### **Railway** (Full-stack friendly)
- **Database hosting** - PostgreSQL/Redis included
- **Docker support** - For complex deployments  
- **Environment variables** - Easy configuration
- **Custom domains** - Professional URLs

### **DigitalOcean App Platform**
- **Managed hosting** - Less server management
- **Scalable** - Grows with your needs
- **Database add-ons** - PostgreSQL/Redis available
- **$5/month** starter tier

---

## 📋 **Pre-Deployment Checklist**

### 1. **Environment Configuration**
```bash
# Create production environment file
cp .env.local .env.production

# Update for production
NEXT_PUBLIC_API_URL=https://your-domain.com/api
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### 2. **Build Test**
```bash
# Test production build locally
npm run build
npm start

# Check for errors
npm run lint
```

### 3. **Performance Optimization**
```bash
# Optimize images and assets
npm run build

# Check bundle size
npx @next/bundle-analyzer
```

---

## 🏫 **Educational/School Deployment**

### **For Schools/Educational Use:**

1. **GitHub Pages** (Free for public repos)
   - Export static version: `npm run export`
   - Deploy to GitHub Pages
   - Perfect for educational projects

2. **School Servers**
   - Build static version: `npm run build && npm run export`
   - Upload to school's web server
   - Works with any web hosting

3. **Local Network Deployment**
   - Run on school computer: `npm start`
   - Access via local IP: `http://192.168.1.100:3000`
   - Great for classroom use

---

## 🔧 **Backend Considerations**

Since your app currently uses **localStorage** for data persistence, you have options:

### **Current Setup (No Backend Needed)**
- ✅ Works with static hosting
- ✅ No server costs
- ✅ Fast deployment
- ❌ Data not shared between devices

### **If You Want User Accounts/Progress Sync:**
```bash
# Add backend deployment
# Recommended: Vercel + PlanetScale (MySQL) or Railway (PostgreSQL)

# 1. Deploy frontend to Vercel
# 2. Deploy backend API to Railway/Render
# 3. Use PostgreSQL for user data
# 4. Connect via API routes in Next.js
```

---

## 💰 **Cost Breakdown**

| Platform | Free Tier | Paid Plans | Best For |
|----------|-----------|------------|----------|
| **Vercel** | 100GB bandwidth/month | $20/month | Next.js apps |
| **Netlify** | 100GB bandwidth/month | $19/month | Static sites |
| **Railway** | $5 credit/month | $5-20/month | Full-stack |
| **GitHub Pages** | Unlimited (public repos) | Free | Open source |

---

## 🎯 **My Recommendation**

For your Swiss learning game:

1. **Start with Vercel** (free tier)
2. **Use your current localStorage approach** (simple, works great)
3. **Add custom domain** when ready (like `schweizer-lernspiel.ch`)
4. **Consider backend later** if you need user accounts

### Quick Deploy Command:
```bash
cd frontend
npx vercel
```

Your app will be live at a URL like: `https://schweizer-lernspiel-abc123.vercel.app`

---

## 📱 **Mobile App Considerations**

If you want to create mobile apps from your web app:

### **Progressive Web App (PWA)**
- Add PWA manifest to your Next.js app
- Users can "install" from browser
- Works offline with service workers
- No app store needed

### **Capacitor (Cross-platform mobile)**
```bash
# Install Capacitor
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android @capacitor/ios

# Build and add platforms
npm run build
npx cap add android
npx cap add ios
npx cap open android
```

### **Expo/React Native (Native mobile)**
- Rewrite components for React Native
- Native performance and features
- App store distribution

---

## 🛡️ **Security & Privacy**

### **For Educational Use:**
- No user registration required (current setup)
- All data stored locally on device
- GDPR compliant (no data collection)
- Safe for children

### **If Adding User Accounts:**
- Use authentication providers (Auth0, Supabase)
- Implement proper data protection
- Add privacy policy
- Consider parental consent requirements

---

## 🔄 **Deployment Workflow**

### **Development to Production:**
```bash
# 1. Local development
npm run dev

# 2. Test build
npm run build
npm start

# 3. Deploy to staging
vercel

# 4. Test staging environment
# Visit preview URL

# 5. Deploy to production
vercel --prod

# 6. Test production
# Visit production URL
```

### **Continuous Deployment:**
1. Connect GitHub repo to Vercel
2. Every push to `main` branch auto-deploys
3. Pull requests get preview deployments
4. Automatic rollbacks if deployment fails

---

## 📞 **Support & Monitoring**

### **Monitoring Tools:**
- **Vercel Analytics** - Built-in performance monitoring
- **Google Analytics** - User behavior tracking (if needed)
- **Sentry** - Error tracking and reporting
- **Lighthouse** - Performance auditing

### **Getting Help:**
- **Vercel Discord** - Community support
- **Next.js Documentation** - Technical guides
- **GitHub Issues** - Bug reports and feature requests

---

## 🌍 **Custom Domain Setup**

### **Steps to add your own domain:**

1. **Buy domain** (recommended Swiss domains: `.ch`, `.swiss`)
2. **In Vercel dashboard:**
   - Go to your project
   - Click "Domains"
   - Add your domain
3. **Update DNS records** at your domain provider:
   - Add CNAME record pointing to Vercel
4. **SSL certificate** automatically provisioned

### **Recommended Swiss domains:**
- `schweizer-lernspiel.ch`
- `swiss-learning-game.ch`
- `alpenglow-learning.ch`

---

## 🎓 **Educational Institution Setup**

### **For Swiss Schools:**
1. **Contact your IT department** about hosting requirements
2. **Consider data residency** requirements (Swiss data centers)
3. **Check accessibility** compliance needs
4. **Plan for multiple language** support (German, French, Italian)

### **Scaling for Multiple Schools:**
- **Multi-tenant architecture** with school codes
- **Centralized deployment** with school customization
- **Analytics dashboard** for teachers and administrators
- **Content management** system for educators

This deployment guide should help you get your Swiss learning game live and accessible to students!