import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { formatDate, parseDate, statusColors } from '../utils/helpers';
import EmptyState from './EmptyState';
import TaskDetailModal from './TaskDetailModal';

export default function TimelineView({ tasks }) {
  const [groupBy, setGroupBy] = useState('dev');
  const [expandedGroups, setExpandedGroups] = useState(new Set());
  const [selectedTask, setSelectedTask] = useState(null);

  const tasksWithDates = tasks.filter(t => t.startDate && t.endDate);

  const dateRange = useMemo(() => {
    if (tasksWithDates.length === 0) {
      return { start: new Date(), end: new Date() };
    }

    const dates = tasksWithDates.flatMap(t => [parseDate(t.startDate), parseDate(t.endDate)]).filter(d => d);
    const start = new Date(Math.min(...dates));
    const end = new Date(Math.max(...dates));

    // Add padding
    start.setDate(start.getDate() - 7);
    end.setDate(end.getDate() + 7);

    return { start, end };
  }, [tasksWithDates]);

  const getDaysBetween = (start, end) => {
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  };

  const getTaskPosition = (task) => {
    const taskStart = parseDate(task.startDate);
    const taskEnd = parseDate(task.endDate);
    const rangeStart = dateRange.start;
    const rangeEnd = dateRange.end;

    const leftPercent = ((taskStart - rangeStart) / (rangeEnd - rangeStart)) * 100;
    const widthPercent = ((taskEnd - taskStart) / (rangeEnd - rangeStart)) * 100;

    return {
      left: Math.max(0, leftPercent),
      width: Math.max(2, widthPercent),
    };
  };

  const groupedTasks = useMemo(() => {
    const groups = {};

    tasksWithDates.forEach(task => {
      const groupKey = groupBy === 'dev' ? task.dev : task.project;
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(task);
    });

    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [tasksWithDates, groupBy]);

  const toggleGroup = (groupKey) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupKey)) {
      newExpanded.delete(groupKey);
    } else {
      newExpanded.add(groupKey);
    }
    setExpandedGroups(newExpanded);
  };

  const getStatusColor = (status) => {
    const colorMap = {
      'In Progress': 'bg-blue-500',
      'Backlog': 'bg-gray-400',
      'Blocked': 'bg-red-500',
      'Completed': 'bg-green-500',
    };
    return colorMap[status] || 'bg-gray-400';
  };

  const dayCount = getDaysBetween(dateRange.start, dateRange.end);
  const weeksCount = Math.ceil(dayCount / 7);

  if (tasksWithDates.length === 0) {
    return <EmptyState title="No timeline data" message="Add start and end dates to tasks to see them in the timeline view." />;
  }

  return (
    <>
      <div className="space-y-4">
        {/* Controls */}
        <div className="flex items-center gap-4">
          <label className="text-sm font-semibold text-gray-700">Group by:</label>
          <div className="flex gap-2">
            <button
              onClick={() => setGroupBy('dev')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                groupBy === 'dev'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Developer
            </button>
            <button
              onClick={() => setGroupBy('project')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                groupBy === 'project'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Project
            </button>
          </div>
        </div>

        {/* Timeline */}
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="min-w-max">
            {/* Header */}
            <div className="flex border-b border-gray-200">
              <div className="w-32 flex-shrink-0 p-4 bg-gray-50 border-r border-gray-200">
                <p className="text-sm font-semibold text-gray-900">{groupBy === 'dev' ? 'Developer' : 'Project'}</p>
              </div>
              <div className="flex-1 flex border-l border-gray-200">
                {Array.from({ length: weeksCount }).map((_, i) => {
                  const weekStart = new Date(dateRange.start);
                  weekStart.setDate(weekStart.getDate() + i * 7);
                  return (
                    <div
                      key={i}
                      className="flex-1 border-r border-gray-200 p-4 text-center text-xs font-semibold text-gray-600 bg-gray-50"
                    >
                      {formatDate(weekStart)}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Groups and Tasks */}
            {groupedTasks.map(([groupKey, groupTasks]) => (
              <div key={groupKey}>
                {/* Group Header */}
                <div
                  onClick={() => toggleGroup(groupKey)}
                  className="flex border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition"
                >
                  <div className="w-32 flex-shrink-0 p-4 bg-gray-50 border-r border-gray-200 flex items-center gap-2">
                    {expandedGroups.has(groupKey) ? (
                      <ChevronUp className="w-4 h-4 text-gray-600" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-600" />
                    )}
                    <p className="text-sm font-semibold text-gray-900">{groupKey}</p>
                  </div>
                  <div className="flex-1 border-l border-gray-200 p-4 flex items-center">
                    <span className="text-xs text-gray-600">{groupTasks.length} tasks</span>
                  </div>
                </div>

                {/* Tasks in Group */}
                {expandedGroups.has(groupKey) &&
                  groupTasks.map((task) => {
                    const { left, width } = getTaskPosition(task);
                    return (
                      <div
                        key={task.id}
                        className="flex border-b border-gray-200 hover:bg-gray-50 transition"
                      >
                        <div className="w-32 flex-shrink-0 p-4 border-r border-gray-200">
                          <p className="text-sm text-gray-700 truncate" title={task.title}>
                            {task.title}
                          </p>
                        </div>
                        <div className="flex-1 border-l border-gray-200 relative p-2">
                          <div
                            className={`absolute top-2 h-8 rounded-md cursor-pointer transition hover:shadow-lg hover:z-10 ${getStatusColor(task.status)}`}
                            style={{
                              left: `${left}%`,
                              width: `${width}%`,
                            }}
                            onClick={() => setSelectedTask(task)}
                            title={`${task.title} (${formatDate(task.startDate)} to ${formatDate(task.endDate)})`}
                          >
                            <div className="px-2 py-1 text-xs font-medium text-white truncate">
                              {task.title}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-sm text-gray-700">In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-400 rounded"></div>
            <span className="text-sm text-gray-700">Backlog</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-sm text-gray-700">Blocked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-700">Completed</span>
          </div>
        </div>
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetailModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </>
  );
}
