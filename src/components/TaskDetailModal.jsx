import { X, AlertCircle, Target } from 'lucide-react';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import { formatDate, getDaysRemaining, platformIcons } from '../utils/helpers';

export default function TaskDetailModal({ task, onClose }) {
  const daysRemaining = getDaysRemaining(task.endDate);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fadeIn">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-6 flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{platformIcons[task.platform] || '📦'}</span>
              <span className="text-sm opacity-90">{task.platform}</span>
            </div>
            <h2 className="text-2xl font-bold">{task.title}</h2>
            <p className="text-indigo-100 mt-1">{task.project}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status and Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">Status</label>
              <StatusBadge status={task.status} />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">Priority</label>
              <PriorityBadge priority={task.priority} />
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-gray-900">Timeline</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Start Date</p>
                <p className="font-semibold text-gray-900">{task.startDate ? formatDate(task.startDate) : 'TBD'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">End Date</p>
                <p className="font-semibold text-gray-900">{task.endDate ? formatDate(task.endDate) : 'TBD'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Days Remaining</p>
                <p className={`font-semibold ${daysRemaining !== null && daysRemaining < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                  {daysRemaining !== null ? `${daysRemaining} days` : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Task Details */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">Assigned Developer</label>
              <p className="text-gray-900 font-medium">{task.dev || 'Unassigned'}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">Estimated Mandays</label>
              <p className="text-gray-900 font-medium">{task.mandays} days</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">Go-Live Date</label>
              <p className="text-gray-900 font-medium">{task.goLiveDate ? formatDate(task.goLiveDate) : 'TBD'}</p>
            </div>
          </div>

          {/* Description */}
          {task.description && (
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">Description</label>
              <div className="bg-gray-50 rounded-lg p-4 text-gray-700 whitespace-pre-wrap">
                {task.description}
              </div>
            </div>
          )}

          {/* Impact */}
          {task.impact && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">Impact & Metrics</h4>
                  <p className="text-blue-800">{task.impact}</p>
                </div>
              </div>
            </div>
          )}

          {/* Blocker */}
          {task.blocker && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-900 mb-1">Blocker</h4>
                  <p className="text-red-800">{task.blocker}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-200 p-4 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
