# Deployment Guide for CodeJams

This guide will help you deploy CodeJams to your custom domain `codejams.dev`.

## Option 1: Vercel (Recommended) ⭐

Vercel is the easiest and fastest way to deploy your React app with custom domain support.

### Prerequisites
- GitHub account
- Vercel account (free at [vercel.com](https://vercel.com))
- Your domain `codejams.dev` registered

### Steps

#### 1. Push to GitHub (if not already done)
```bash
cd codejams
git add .
git commit -m "Prepare for deployment"
git push origin main
```

#### 2. Deploy to Vercel

**Option A: Via Vercel CLI (Fastest)**
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? [Your account]
# - Link to existing project? No
# - Project name? codejams
# - Directory? ./
# - Auto-detected settings? Yes

# Deploy to production
vercel --prod
```

**Option B: Via Vercel Dashboard (Easiest)**
1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Project"
3. Select your GitHub repository: `SaiKrishna-KK/CodeJams`
4. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `codejams`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click "Deploy"

#### 3. Add Custom Domain

1. Go to your project dashboard on Vercel
2. Click "Settings" → "Domains"
3. Add domain: `codejams.dev`
4. Vercel will provide DNS records

#### 4. Configure DNS (at your domain registrar)

Add these DNS records to your domain registrar (where you bought `codejams.dev`):

**A Record:**
```
Type: A
Name: @
Value: 76.76.21.21
```

**CNAME Record (for www):**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

#### 5. Wait for DNS Propagation
- DNS changes can take 1-48 hours
- Vercel will auto-generate SSL certificate
- Your site will be live at `https://codejams.dev`

---

## Option 2: Cloudflare Pages

Cloudflare Pages is another great option with excellent performance.

### Steps

1. **Login to Cloudflare**
   - Go to [dash.cloudflare.com](https://dash.cloudflare.com)

2. **Create Pages Project**
   - Pages → Create a project
   - Connect to GitHub
   - Select repository: `SaiKrishna-KK/CodeJams`
   - Build settings:
     - **Build command**: `cd codejams && npm run build`
     - **Build output directory**: `codejams/dist`
     - **Root directory**: `/`

3. **Add Custom Domain**
   - Project Settings → Custom domains
   - Add `codejams.dev`
   - If domain is managed by Cloudflare, it will auto-configure

4. **Transfer Domain to Cloudflare (Optional but Recommended)**
   - Domains → Transfer domain
   - Follow transfer process
   - Automatic DNS configuration

---

## Option 3: GitHub Pages with Custom Domain

### Steps

#### 1. Update package.json
Add deployment script:
```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

#### 2. Install gh-pages
```bash
npm install --save-dev gh-pages
```

#### 3. Update vite.config.js
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/' // Important for custom domain
})
```

#### 4. Deploy
```bash
npm run deploy
```

#### 5. Configure GitHub Pages
1. Go to repository Settings → Pages
2. Source: Deploy from branch `gh-pages`
3. Custom domain: `codejams.dev`
4. Check "Enforce HTTPS"

#### 6. Configure DNS
Add these records at your domain registrar:

**A Records (add all 4):**
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

**CNAME Record:**
```
Type: CNAME
Name: www
Value: [your-username].github.io
```

---

## Option 4: Netlify

### Steps

1. **Login to Netlify**
   - Go to [app.netlify.com](https://app.netlify.com)

2. **Import from GitHub**
   - Add new site → Import from Git
   - Select repository
   - Build settings:
     - **Base directory**: `codejams`
     - **Build command**: `npm run build`
     - **Publish directory**: `codejams/dist`

3. **Add Custom Domain**
   - Site settings → Domain management
   - Add custom domain: `codejams.dev`

4. **Configure DNS**
   - Follow Netlify's DNS instructions
   - Usually points to Netlify's load balancer

---

## Recommended Choice: Vercel

**Why Vercel?**
- ✅ Easiest setup
- ✅ Automatic SSL certificates
- ✅ Best custom domain experience
- ✅ Zero configuration needed
- ✅ Excellent performance
- ✅ Free tier is generous
- ✅ Instant deployments on git push
- ✅ Preview deployments for PRs

---

## Post-Deployment Checklist

- [ ] Site loads at `https://codejams.dev`
- [ ] SSL certificate is active (https works)
- [ ] www redirect works (`www.codejams.dev` → `codejams.dev`)
- [ ] All routes work (test `/github.com/facebook/react`)
- [ ] API calls work (OpenAI, GitHub)
- [ ] Test on mobile devices
- [ ] Update README with live demo link

---

## Environment Variables

Since your app uses client-side API keys stored in localStorage, you don't need to set environment variables on the hosting platform. Users will enter their own OpenAI API keys.

However, if you want to provide a demo API key (not recommended for security):
1. Add environment variable on hosting platform
2. Update code to use it as fallback

---

## Troubleshooting

### Routes not working (404 on refresh)
- **Vercel**: Add `vercel.json` (already included)
- **Netlify**: Add `_redirects` file
- **GitHub Pages**: May have issues with client-side routing

### SSL not working
- Wait 24-48 hours for DNS propagation
- Ensure DNS records are correct
- Force SSL renewal on hosting platform

### Build fails
- Check Node.js version (use 16+)
- Ensure all dependencies are in package.json
- Check build logs for errors

---

## Need Help?

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Cloudflare Pages**: [developers.cloudflare.com/pages](https://developers.cloudflare.com/pages)
- **Netlify Docs**: [docs.netlify.com](https://docs.netlify.com)
- **GitHub Pages**: [docs.github.com/pages](https://docs.github.com/pages)
