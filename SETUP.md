# Task Dashboard - Setup Guide

## ⚡ 5-Minute Setup

### Step 1: Prepare Your Google Sheet

1. **Publish Your Sheet to Web**
   - Open your Google Sheet
   - Click `File` → `Share` → `Publish to web`
   - Select the sheet and click "Publish"
   - Copy the published URL (you'll need the Sheet ID)

2. **Get Your Sheet ID**
   - In your browser URL bar, find the Sheet ID
   - Example: `https://docs.google.com/spreadsheets/d/**13a0oDaQWOT8Wjsc_RtH-Bkkp_ZHLAsdDsTEnH7IcDDU**/edit`
   - The ID is between `/d/` and `/edit`

### Step 2: Configure Dashboard

1. **Create `.env.local` file**
   ```bash
   cp .env.example .env.local
   ```

2. **Add Your Sheet ID**
   ```
   VITE_GOOGLE_SHEET_ID=13a0oDaQWOT8Wjsc_RtH-Bkkp_ZHLAsdDsTEnH7IcDDU
   VITE_GOOGLE_SHEET_NAME=Tasks
   ```

### Step 3: Run Locally

```bash
npm install
npm run dev
```

Visit `http://localhost:5173` and you'll see the dashboard!

### Step 4: Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Follow the prompts. Your dashboard will be live in seconds!

## Expected Sheet Structure

Your Google Sheet should have these columns:

| Column | Type | Example | Notes |
|--------|------|---------|-------|
| Platform | Text | Website, App, Backend | Required |
| Project | Text | Dashboard Redesign | Required |
| Task | Text | Create landing page | Required |
| Dev | Text | Alice | Developer name |
| Status | Text | In Progress, Backlog, Completed, Blocked | Required |
| Mandays | Number | 5 | Hours/days to complete |
| Priority | Text | P0, P1, P2, P3 | P0 = highest |
| Start Date | Date | 2025-12-01 | YYYY-MM-DD |
| End Date | Date | 2025-12-10 | YYYY-MM-DD |
| Blocker | Text | Waiting for API docs | Leave blank if none |
| Go-Live | Date | 2025-12-15 | Target launch date |
| Impact | Text | Increase conversion by 20% | Business metrics |

## Column Names (Case-Insensitive)

The dashboard is flexible with column names:
- ✅ `Platform` or `PLATFORM` or `platform`
- ✅ `Dev`, `Developer`, `Assigned Dev`
- ✅ `Mandays`, `MANDAYS`, `Estimated Days`
- etc.

If your columns don't match, edit `src/services/googleSheets.js` to map them.

## What Each View Does

### 📊 Sheet View
**Best for**: Finding specific tasks, bulk views
- Search across all tasks
- Filter by platform, project, status, priority, dev
- Sort by any column
- Click task for full details

### 📅 Timeline View
**Best for**: Identifying bottlenecks, seeing what's when
- Visual Gantt chart of tasks
- Group by developer or project
- Spot overlapping tasks
- Zoom with expandable groups

### 👥 Workload View
**Best for**: Answering "who is free?"
- **Available Developers** section at top
- Capacity utilization % per dev
- Visual progress bars
- 🟢 Free | 🟡 Available | 🔴 Overloaded

## Common Questions

### Q: How often does the dashboard refresh?
**A:** Every 30 seconds automatically. Click the refresh icon for instant update.

### Q: Can I edit tasks in the dashboard?
**A:** Not in MVP. Edit in Google Sheet → Dashboard auto-updates.

### Q: Do I need to share the sheet with anyone?
**A:** No! Publish to web makes it public (read-only). No sharing needed.

### Q: How many tasks can it handle?
**A:** Tested with 1000+ tasks. Performance depends on your internet speed.

### Q: Can I use this offline?
**A:** No. Dashboard needs internet to fetch from Google Sheet.

### Q: Can I customize the colors/branding?
**A:** Yes! Edit `tailwind.config.js` and `src/utils/helpers.js`

## Environment Variables

### Local Development
```bash
# .env.local
VITE_GOOGLE_SHEET_ID=your-sheet-id-here
VITE_GOOGLE_SHEET_NAME=Tasks
```

### Vercel/Production
Add these in Vercel Dashboard → Settings → Environment Variables:
```
VITE_GOOGLE_SHEET_ID
VITE_GOOGLE_SHEET_NAME (optional)
```

## Troubleshooting

### Dashboard shows mock data, not my sheet
❌ **Problem**: Column names don't match
✅ **Solution**:
- Edit `src/services/googleSheets.js`
- Update the column mapping to match your sheet

### "Failed to load tasks" error
❌ **Problem**: Sheet not published to web
✅ **Solution**:
- Open your Sheet
- File → Share → Publish to web
- Select the sheet and publish

### Dashboard loads but no data appears
❌ **Problem**: CORS error (check browser console)
✅ **Solution**:
- Verify Sheet ID is correct
- Sheet must be published to web (not just shared)
- Try incognito mode to clear cache

### Column data mapping wrong
❌ **Problem**: Wrong column showing in wrong place
✅ **Solution**:
- Edit `src/services/googleSheets.js`
- Find the `parseCSV` function
- Update column names in the mapping

## Performance Tips

1. **Keep your sheet clean**
   - Archive completed tasks to separate sheet
   - Delete test rows
   - Fewer rows = faster refresh

2. **Use specific filters**
   - Filter by status first
   - Then by dev or project
   - Reduces what needs to be displayed

3. **Mobile optimization**
   - Dashboard is responsive
   - Use Sheet View on mobile (easier than Timeline)
   - Workload View works great on mobile

## Advanced Customization

### Change Auto-Refresh Rate
Edit `src/App.jsx`:
```javascript
const { tasks, loading, error, lastUpdated, refetch } = useSheetData(30000); // 30000ms = 30 seconds
```

### Change Colors
Edit `src/utils/helpers.js`:
```javascript
export const statusColors = {
  'In Progress': 'bg-blue-100 text-blue-800',
  'Backlog': 'bg-gray-100 text-gray-800',
  // ... etc
};
```

### Change Dashboard Title
Edit `src/App.jsx` header section.

## Security Notes

⚠️ **Important**:
- Sheet ID is visible in `.env` (client-side)
- Dashboard reads data publicly (after publishing sheet)
- Don't store sensitive data in sheet if it's published
- This is a read-only tool (no modifications)

## Next Steps

1. ✅ Publish your Google Sheet
2. ✅ Set up `.env.local` with your Sheet ID
3. ✅ Run `npm run dev` locally to test
4. ✅ Deploy to Vercel with `vercel`
5. ✅ Share link with your team!

## Support

Having issues? Check:
1. Browser console for errors (F12 → Console)
2. Network tab to see if Sheet is loading (F12 → Network)
3. Sheet is published to web
4. Column names match your sheet
5. Sheet ID is correct

## Done! 🎉

Your dashboard is ready. Visit it now and share with your team!

Need help? Open an issue or contact support.
