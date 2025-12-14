# Task Management Dashboard MVP

A lightweight, real-time dashboard for task visibility. Reads data from your Google Sheet and provides three powerful views: Sheet, Timeline, and Workload.

**Live Dashboard**: [Deploy to Vercel](#deployment)

## Features

### 📊 Sheet View
- Advanced filtering by platform, project, status, priority, and developer
- Multi-column sorting
- Full-text search
- Color-coded status and priority badges
- Click any task to see full details

### 📅 Timeline View (Gantt)
- Visual timeline of all tasks by dates
- Group by developer or project
- Color-coded by status
- Identify overlapping tasks and bottlenecks
- Expandable/collapsible groups

### 👥 Workload View
- **"Available Developers" section** - Auto-identifies free developers
- Developer capacity utilization (%)
- 🟢 Free | 🟡 Available | 🔴 Overloaded status indicators
- Workload breakdown per developer
- Capacity visualization charts

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone and install
cd task-dashboard
npm install

# Development
npm run dev

# Production build
npm run build
```

### Configuration

1. Copy `.env.example` to `.env.local`
2. Update `VITE_GOOGLE_SHEET_ID` with your Google Sheet ID
3. Make sure your Google Sheet is **published to the web** (File → Share → Publish to web)

The dashboard auto-refreshes every 30 seconds.

## Architecture

```
Google Sheet (Source of Truth)
        ↓
Google Sheets API (CSV export)
        ↓
React Dashboard (Visualization)
        ↓
Sheet View | Timeline View | Workload View
```

## Tech Stack

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts
- **Icons**: Lucide React
- **Data**: Google Sheets API (read-only, CSV export)

## Project Structure

```
src/
├── components/
│   ├── SheetView.jsx       # Table with filtering/sorting
│   ├── TimelineView.jsx    # Gantt chart visualization
│   ├── WorkloadView.jsx    # Developer capacity dashboard
│   ├── TaskDetailModal.jsx # Task details modal
│   └── UI components
├── services/
│   └── googleSheets.js     # Google Sheets data fetching
├── hooks/
│   └── useSheetData.js     # Data fetching hook with auto-refresh
├── utils/
│   └── helpers.js          # Utility functions & colors
└── App.jsx                 # Main layout
```

## Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

Or push to GitHub and connect to Vercel for auto-deployment.

### Environment Variables

In Vercel, add:
```
VITE_GOOGLE_SHEET_ID=your-sheet-id-here
```

## Google Sheet Setup

### Step 1: Publish Sheet to Web
1. Open your Google Sheet
2. Click **File → Share → Publish to web**
3. Select the sheet/tab and publish

### Step 2: Get Sheet ID
Your Sheet ID is in the URL:
```
https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit
```

### Step 3: Column Names (Expected)
The dashboard expects these columns:
- Platform
- Project
- Task
- Dev
- Status
- Mandays
- Priority
- Start Date
- End Date
- Blocker
- Go-Live
- Impact

The column names are case-insensitive.

## UI Design

Asana-inspired design with:
- Smooth animations and transitions
- Color-coded status & priority badges
- Responsive layout (mobile-friendly)
- Smooth shadows and rounded corners
- Dark status indicators

## Tips & Tricks

### "Who is free?" in <5 seconds
- Go to **Workload View**
- Look for developers with 🟢 status
- They're in the "Available Developers" section at the top

### Identify bottlenecks
- Go to **Timeline View**
- Look for overlapping tasks
- Group by developer to see individual workload

### Sort by priority
- Go to **Sheet View**
- Click the "Priority" column header to sort

### Find specific tasks
- Use the search bar in **Sheet View**
- Search by title, project, developer, or blocker

## Keyboard Shortcuts

- `Tab` - Navigate between views
- `Escape` - Close task details modal

## Auto-Refresh

The dashboard checks for new data every 30 seconds. You can:
- Click the refresh icon (top-right) for instant refresh
- Last update timestamp shows when data was synced

## Performance

- Built with Vite for fast builds
- Lazy loads components
- Client-side filtering (no server load)
- Gzip-compressed (~174 KB)

## Troubleshooting

### Sheet not loading
- ✓ Verify Sheet is published to web
- ✓ Check VITE_GOOGLE_SHEET_ID environment variable
- ✓ Check browser console for CORS errors

### Wrong column mapping
- ✓ Check column names in Google Sheet
- ✓ Column names are case-insensitive
- ✓ Edit helpers.js to map custom column names

### Dashboard slow
- ✓ Check network tab for slow API calls
- ✓ Reduce number of tasks in sheet
- ✓ Clear browser cache

## Future Enhancements

- Real-time syncing with WebSockets
- Edit tasks directly in dashboard
- Slack/email notifications
- Task analytics and trends
- Multi-sheet support
- Dark mode
- Mobile app

## License

MIT

## Support

- 📧 Email support
- 💬 Slack integration coming soon
- 🐛 Report bugs on GitHub Issues
