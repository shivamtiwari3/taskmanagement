import { useState, useMemo } from 'react';
import { Search, ChevronUp, ChevronDown } from 'lucide-react';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import TaskDetailModal from './TaskDetailModal';
import EmptyState from './EmptyState';
import { formatDate, getUniquePlatforms, getUniqueProjects, getUniqueStatuses, getUniquePriorities, getUniqueDevelopers, platformIcons } from '../utils/helpers';

export default function SheetView({ tasks }) {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    platform: '',
    project: '',
    status: '',
    priority: '',
    dev: '',
  });
  const [sortField, setSortField] = useState('startDate');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedTask, setSelectedTask] = useState(null);

  const filteredAndSorted = useMemo(() => {
    let result = tasks.filter(task => {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        task.title.toLowerCase().includes(searchLower) ||
        task.project.toLowerCase().includes(searchLower) ||
        task.dev.toLowerCase().includes(searchLower) ||
        task.blocker.toLowerCase().includes(searchLower);

      const matchesFilters =
        (!filters.platform || task.platform === filters.platform) &&
        (!filters.project || task.project === filters.project) &&
        (!filters.status || task.status === filters.status) &&
        (!filters.priority || task.priority === filters.priority) &&
        (!filters.dev || task.dev === filters.dev);

      return matchesSearch && matchesFilters;
    });

    // Sort
    result.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === 'mandays') {
        aVal = parseFloat(aVal) || 0;
        bVal = parseFloat(bVal) || 0;
      } else if (sortField === 'startDate' || sortField === 'endDate') {
        aVal = new Date(aVal || 0).getTime();
        bVal = new Date(bVal || 0).getTime();
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [tasks, search, filters, sortField, sortOrder]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronDown className="w-4 h-4 text-muted-foreground" />;
    return sortOrder === 'asc' ? (
      <ChevronUp className="w-4 h-4 text-primary" />
    ) : (
      <ChevronDown className="w-4 h-4 text-primary" />
    );
  };

  if (tasks.length === 0) {
    return <EmptyState title="No tasks" message="No tasks available. Check back soon!" />;
  }

  return (
    <>
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tasks by title, project, dev, or blocker..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <select
            value={filters.platform}
            onChange={(e) => setFilters({ ...filters, platform: e.target.value })}
            className="px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
          >
            <option value="">All Platforms</option>
            {getUniquePlatforms(tasks).map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>

          <select
            value={filters.project}
            onChange={(e) => setFilters({ ...filters, project: e.target.value })}
            className="px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
          >
            <option value="">All Projects</option>
            {getUniqueProjects(tasks).map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
          >
            <option value="">All Statuses</option>
            {getUniqueStatuses(tasks).map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
            className="px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
          >
            <option value="">All Priorities</option>
            {getUniquePriorities(tasks).map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>

          <select
            value={filters.dev}
            onChange={(e) => setFilters({ ...filters, dev: e.target.value })}
            className="px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
          >
            <option value="">All Developers</option>
            {getUniqueDevelopers(tasks).map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          {Object.values(filters).some(v => v) && (
            <button
              onClick={() => setFilters({ platform: '', project: '', status: '', priority: '', dev: '' })}
              className="px-3 py-2 text-sm text-primary hover:bg-secondary rounded-lg transition"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground">
          Showing {filteredAndSorted.length} of {tasks.length} tasks
        </p>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-border bg-card shadow-sm">
          <table className="w-full">
            <thead className="bg-secondary border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left">
                  <button onClick={() => handleSort('platform')} className="flex items-center gap-2 font-semibold text-foreground hover:text-primary">
                    Platform <SortIcon field="platform" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button onClick={() => handleSort('project')} className="flex items-center gap-2 font-semibold text-foreground hover:text-primary">
                    Project <SortIcon field="project" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button onClick={() => handleSort('title')} className="flex items-center gap-2 font-semibold text-foreground hover:text-primary">
                    Task <SortIcon field="title" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button onClick={() => handleSort('dev')} className="flex items-center gap-2 font-semibold text-foreground hover:text-primary">
                    Developer <SortIcon field="dev" />
                  </button>
                </th>
                <th className="px-4 py-3 text-center">
                  <button onClick={() => handleSort('status')} className="flex items-center gap-2 font-semibold text-foreground hover:text-primary mx-auto">
                    Status <SortIcon field="status" />
                  </button>
                </th>
                <th className="px-4 py-3 text-center">
                  <button onClick={() => handleSort('mandays')} className="flex items-center gap-2 font-semibold text-foreground hover:text-primary mx-auto">
                    Days <SortIcon field="mandays" />
                  </button>
                </th>
                <th className="px-4 py-3 text-center">
                  <button onClick={() => handleSort('priority')} className="flex items-center gap-2 font-semibold text-foreground hover:text-primary mx-auto">
                    Priority <SortIcon field="priority" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button onClick={() => handleSort('startDate')} className="flex items-center gap-2 font-semibold text-foreground hover:text-primary">
                    Dates <SortIcon field="startDate" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSorted.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center text-muted-foreground">
                    No tasks match your filters
                  </td>
                </tr>
              ) : (
                filteredAndSorted.map((task) => (
                  <tr
                    key={task.id}
                    onClick={() => setSelectedTask(task)}
                    className="border-b border-border hover:bg-secondary cursor-pointer transition"
                  >
                    <td className="px-4 py-3 text-foreground">{platformIcons[task.platform] || '📦'} {task.platform}</td>
                    <td className="px-4 py-3 text-foreground">{task.project}</td>
                    <td className="px-4 py-3 font-medium text-foreground">{task.title}</td>
                    <td className="px-4 py-3 text-foreground">{task.dev}</td>
                    <td className="px-4 py-3 text-center"><StatusBadge status={task.status} /></td>
                    <td className="px-4 py-3 text-center text-foreground">{task.mandays}</td>
                    <td className="px-4 py-3 text-center"><PriorityBadge priority={task.priority} /></td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {task.startDate && formatDate(task.startDate)}
                      {task.endDate && <><br/>{formatDate(task.endDate)}</>}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetailModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </>
  );
}
