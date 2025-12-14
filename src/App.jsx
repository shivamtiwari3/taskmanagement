import { useState } from 'react';
import { LayoutGrid, BarChart3, Users, RefreshCw, ExternalLink } from 'lucide-react';
import { useSheetData } from './hooks/useSheetData';
import SheetView from './components/SheetView';
import TimelineView from './components/TimelineView';
import WorkloadView from './components/WorkloadView';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const [activeView, setActiveView] = useState('sheet');
  const { tasks, loading, error, lastUpdated, refetch } = useSheetData(30000);

  const formatLastUpdated = () => {
    if (!lastUpdated) return 'Never';
    const now = new Date();
    const diff = Math.floor((now - lastUpdated) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return lastUpdated.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">⚡</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Task Dashboard</h1>
                <p className="text-sm text-muted-foreground">Real-time task visibility</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">Last updated</p>
                <p className="text-xs text-muted-foreground">{formatLastUpdated()}</p>
              </div>
              <button
                onClick={refetch}
                className="p-2 hover:bg-secondary rounded-lg transition text-muted-foreground hover:text-foreground"
                title="Refresh data"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <a
                href="https://docs.google.com/spreadsheets/d/13a0oDaQWOT8Wjsc_RtH-Bkkp_ZHLAsdDsTEnH7IcDDU/edit"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-secondary rounded-lg transition text-muted-foreground hover:text-foreground"
                title="Open source sheet"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 bg-card rounded-lg p-1 shadow-sm border border-border w-fit">
          <button
            onClick={() => setActiveView('sheet')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition ${
              activeView === 'sheet'
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'text-foreground hover:bg-secondary'
            }`}
          >
            <LayoutGrid className="w-5 h-5" />
            Sheet View
          </button>
          <button
            onClick={() => setActiveView('timeline')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition ${
              activeView === 'timeline'
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'text-foreground hover:bg-secondary'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            Timeline
          </button>
          <button
            onClick={() => setActiveView('workload')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition ${
              activeView === 'workload'
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'text-foreground hover:bg-secondary'
            }`}
          >
            <Users className="w-5 h-5" />
            Workload
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-8 p-4 bg-destructive/10 border border-destructive rounded-lg">
            <p className="text-destructive font-medium">Error loading tasks</p>
            <p className="text-destructive/90 text-sm mt-1">{error}</p>
            <button
              onClick={refetch}
              className="mt-3 text-destructive hover:text-destructive/80 font-medium text-sm underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && tasks.length === 0 ? (
          <div className="bg-card rounded-lg shadow-sm border border-border p-12">
            <LoadingSpinner />
            <p className="text-center text-muted-foreground mt-4">Loading tasks from Google Sheet...</p>
          </div>
        ) : (
          /* Content */
          <div className="bg-card rounded-lg shadow-sm border border-border p-6 animate-fadeIn">
            {activeView === 'sheet' && <SheetView tasks={tasks} />}
            {activeView === 'timeline' && <TimelineView tasks={tasks} />}
            {activeView === 'workload' && <WorkloadView tasks={tasks} />}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground text-sm">
          <p>
            Dashboard syncs with{' '}
            <a
              href="https://docs.google.com/spreadsheets/d/13a0oDaQWOT8Wjsc_RtH-Bkkp_ZHLAsdDsTEnH7IcDDU/edit"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 font-medium underline"
            >
              your Google Sheet
            </a>
            {' '}every 30 seconds
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
