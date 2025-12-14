# Deploy Your Dashboard Now - Two Options

## ✅ Option 1: Automatic Deployment (Recommended)

Vercel CLI is installed. To deploy:

```bash
cd task-dashboard
npx vercel
```

Then follow the interactive prompts:
1. **Connect to GitHub** (optional, for auto-deploy)
2. **Project name** (defaults to "task-dashboard")
3. **Root directory** (leave blank, defaults to current)
4. **Build command** - already set to `npm run build`
5. **Output directory** - already set to `dist`

Vercel will:
- Build your app
- Deploy to a live URL
- Show you the URL (something like `https://task-dashboard-xyz.vercel.app`)
- Show deployment status

**Done!** Your dashboard is live. Share the URL with your team.

---

## ✅ Option 2: Manual Deployment via Vercel Web

If you prefer not to use the CLI:

1. **Go to** [vercel.com](https://vercel.com)
2. **Sign up** (free account)
3. **Create new project** → Import Git repo
4. **Connect your GitHub** (if you push the code)
5. **Add Environment Variable**:
   - Name: `VITE_GOOGLE_SHEET_ID`
   - Value: `your-sheet-id-here`
6. **Click Deploy**

Vercel will auto-deploy every time you push to GitHub.

---

## 📋 Pre-Deployment Checklist

Before deploying, make sure:

- [ ] Google Sheet is **published to web**
  - File → Share → Publish to web

- [ ] Sheet ID is correct
  - From URL: `https://docs.google.com/spreadsheets/d/[ID]/edit`

- [ ] Column names in your sheet match expected format:
  - Platform, Project, Task, Dev, Status, Mandays, Priority, Start Date, End Date, Blocker, Go-Live, Impact

- [ ] `.env.local` has your Sheet ID (for local testing)
  - `VITE_GOOGLE_SHEET_ID=your-id-here`

- [ ] Dashboard builds successfully
  - Run: `npm run build`
  - Check: `dist/` folder created with files

---

## 🚀 Deploy Steps (Quick Version)

```bash
# From task-dashboard directory
cd task-dashboard

# Deploy to Vercel
npx vercel

# Follow prompts (mostly hit Enter for defaults)

# Get your live URL!
```

That's it! Your dashboard is live in seconds.

---

## 🔗 After Deployment

1. **Copy the URL** Vercel gives you
2. **Add Environment Variable**:
   - Go to Vercel Project Settings
   - Environment Variables
   - Add: `VITE_GOOGLE_SHEET_ID=your-sheet-id`
   - Redeploy

3. **Share with Team**:
   - Copy the URL
   - Send to team
   - Add to bookmarks

4. **Test**:
   - Visit your live URL
   - Check dashboard loads
   - Verify data shows
   - Try filtering/searching

---

## 🆘 Deployment Issues?

### "Command not found: vercel"
```bash
npx vercel
# Add "npx" before vercel
```

### "Build failed"
```bash
npm run build
# Check this works locally first
```

### "No data showing"
- [ ] Check VITE_GOOGLE_SHEET_ID is set in Vercel
- [ ] Sheet must be published to web
- [ ] Check column names match

### "Can't connect to sheet"
- [ ] Verify sheet is public
- [ ] Check Sheet ID in environment variables
- [ ] Try incognito mode to clear cache

---

## 📊 What Happens Next

1. Vercel builds your project
2. Deploys to CDN
3. Gives you a live URL (like `task-dashboard-abc123.vercel.app`)
4. Updates automatically if you push new code

Your dashboard is now:
- ✅ Live on the internet
- ✅ Accessible from anywhere
- ✅ Shareable with your team
- ✅ Auto-syncs with Google Sheet every 30 seconds

---

## 🎉 You're Ready!

Everything is set up. Just run:

```bash
npx vercel
```

And your dashboard will be live in 2 minutes!

---

## 💡 Pro Tips

- **Redeploy anytime**: Make changes locally, push to GitHub, Vercel auto-deploys
- **Custom domain**: Add your own domain in Vercel project settings
- **Monitor**: Vercel has built-in analytics and error tracking
- **Rollback**: Can revert to previous deployments from Vercel dashboard

---

**Ready? Run:** `npx vercel` 🚀
