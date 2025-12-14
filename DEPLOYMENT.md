# Deployment Guide

## Deploy to Vercel (Recommended)

Vercel is the fastest way to deploy. Takes 2 minutes.

### Option A: Using Vercel CLI

```bash
# 1. Install Vercel CLI (if not already)
npm install -g vercel

# 2. From your project directory
cd task-dashboard

# 3. Deploy
vercel
```

The CLI will:
- Ask a few questions (defaults are fine)
- Build the project
- Deploy to Vercel
- Give you a live URL

**Done!** Your dashboard is live.

### Option B: GitHub + Vercel (Auto-Deploy)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Task dashboard"
   git remote add origin https://github.com/yourusername/task-dashboard.git
   git push -u origin main
   ```

2. **Import on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Paste your GitHub repo URL
   - Click "Import"

3. **Set Environment Variables**
   - In Vercel Project Settings → Environment Variables
   - Add: `VITE_GOOGLE_SHEET_ID` = your sheet ID

4. **Deploy**
   - Click "Deploy"
   - Vercel auto-deploys on every git push

## Environment Variables

### For Vercel

In your Vercel project dashboard:

1. Go to **Settings** → **Environment Variables**
2. Click **Add**
3. Add these variables:

```
Name: VITE_GOOGLE_SHEET_ID
Value: 13a0oDaQWOT8Wjsc_RtH-Bkkp_ZHLAsdDsTEnH7IcDDU
Environment: Production, Preview, Development
```

(Optional)
```
Name: VITE_GOOGLE_SHEET_NAME
Value: Tasks
```

4. Click **Save**
5. Re-deploy for changes to take effect

## Custom Domain

To use your own domain (e.g., `tasks.yourcompany.com`):

1. In Vercel Project Settings → **Domains**
2. Click **Add Domain**
3. Enter your domain
4. Update your domain's DNS records (Vercel shows instructions)
5. Wait ~10 minutes for SSL cert

## Post-Deployment Checklist

- [ ] Visit live URL and verify it loads
- [ ] Check that data is showing (not mock data)
- [ ] Test all 3 views (Sheet, Timeline, Workload)
- [ ] Try filtering and searching
- [ ] Click a task to see details
- [ ] Check that "Last updated" timestamp updates (wait 30 seconds)
- [ ] Share URL with team

## Alternative Deployment Options

### Netlify

```bash
npm run build
# Then drag & drop the 'dist' folder to Netlify
```

Or connect GitHub:
1. Go to [netlify.com](https://netlify.com)
2. Click "New site from Git"
3. Select your GitHub repo
4. Set build command: `npm run build`
5. Set publish directory: `dist`
6. Add environment variable: `VITE_GOOGLE_SHEET_ID`
7. Deploy

### GitHub Pages

⚠️ **Not recommended** for this use case (harder to set env vars)

```bash
npm run build
# Copy dist/ folder to gh-pages branch
```

### Self-Hosted (Docker)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
CMD ["npm", "run", "preview"]
EXPOSE 4173
```

## Monitoring

### Vercel Analytics
Vercel automatically provides:
- Build metrics
- Performance monitoring
- Error tracking
- Deploy history

View in Vercel Dashboard → **Analytics**

### Performance Tips

1. **Bundle Size**: Currently ~174 KB gzipped
2. **First Load**: ~2 seconds
3. **Data Refresh**: Every 30 seconds

If slow:
- Check Sheet size (fewer tasks = faster)
- Check your internet speed
- Use a filter to reduce data loaded

## Troubleshooting

### Build fails on Vercel
```
error: Cannot find module '@tailwindcss/postcss'
```
**Solution**: Vercel needs to reinstall. Go to Project Settings → Deployments and redeploy.

### Dashboard shows "Loading..." forever
**Problem**: Sheet ID wrong or not published to web
**Solution**:
1. Check VITE_GOOGLE_SHEET_ID in Vercel env vars
2. Verify sheet is published to web
3. Check browser console for errors (F12)

### Data not updating
**Problem**: Sheet wasn't published to web
**Solution**:
1. Open Google Sheet
2. File → Share → Publish to web
3. Redeploy dashboard

### Page shows "No tasks"
**Problem**: Column names don't match
**Solution**:
1. Check your sheet column names
2. Edit `src/services/googleSheets.js` to match them
3. Redeploy

## Rollback

To revert to a previous version:

**On Vercel**:
1. Go to **Deployments**
2. Find the previous version
3. Click the 3-dot menu
4. Click "Promote to Production"

**On GitHub + Vercel**:
1. Revert the commit: `git revert <commit-hash>`
2. Push: `git push`
3. Vercel auto-redeploys

## Updating the Dashboard

### New Version Available?

To update dependencies:
```bash
npm update
npm run build
git add .
git commit -m "Update dependencies"
git push
```

Vercel auto-deploys if using GitHub integration.

## Scaling

Current setup handles:
- ✅ 100 tasks
- ✅ 500 tasks
- ✅ 1000+ tasks

For larger sheets:
- Filter data before displaying
- Archive old tasks to separate sheet
- Consider fetching only active tasks

## Cost

**Vercel Free Tier**:
- ✅ Unlimited projects
- ✅ Unlimited bandwidth
- ✅ Unlimited builds
- ✅ Custom domains (with limitations)

No costs unless you exceed free tier limits (unlikely).

## Summary

```bash
# Quick deploy
npm install -g vercel
vercel

# Your dashboard is now live!
```

That's it! 🎉

Share the URL with your team and you're done.
