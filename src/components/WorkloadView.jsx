import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { getUniqueDevelopers, calculateWorkload, statusColors } from '../utils/helpers';
import EmptyState from './EmptyState';

export default function WorkloadView({ tasks }) {
  const developers = getUniqueDevelopers(tasks);
  const weeklyCapacity = 40; // Standard week in mandays

  const workloadData = useMemo(() => {
    return developers.map(dev => {
      const workload = calculateWorkload(tasks, dev, weeklyCapacity);
      return {
        dev,
        assigned: workload.totalMandays,
        available: Math.max(0, weeklyCapacity - workload.totalMandays),
        utilizationPercent: workload.utilizationPercent,
        tasks: workload.tasks.length,
        status: workload.status,
        statusEmoji: workload.emoji,
      };
    }).sort((a, b) => b.assigned - a.assigned);
  }, [tasks, developers]);

  const availableDevelopers = developers.filter(dev => {
    const workload = calculateWorkload(tasks, dev, weeklyCapacity);
    return workload.tasks.length === 0;
  });

  if (developers.length === 0) {
    return <EmptyState title="No developers" message="Assign tasks to developers to see workload data." />;
  }

  return (
    <div className="space-y-6">
      {/* Available Developers Section */}
      {availableDevelopers.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-green-900 mb-4">🟢 Available Developers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableDevelopers.map(dev => (
              <div
                key={dev}
                className="bg-white border border-green-200 rounded-lg p-4 hover:shadow-md transition"
              >
                <p className="font-semibold text-gray-900">{dev}</p>
                <p className="text-sm text-green-600 mt-1">Ready for new tasks</p>
                <p className="text-xs text-gray-500 mt-2">Capacity: {weeklyCapacity} mandays available</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Workload Chart */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Capacity Utilization</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={workloadData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="dev" />
            <YAxis label={{ value: 'Mandays', angle: -90, position: 'insideLeft' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Bar dataKey="assigned" stackId="a" fill="#6366F1" name="Assigned" />
            <Bar dataKey="available" stackId="a" fill="#D1D5DB" name="Available" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Workload Cards */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-gray-900">Developer Workload Details</h3>
        <div className="grid grid-cols-1 gap-4">
          {workloadData.map(dev => {
            const getUtilizationColor = (percent) => {
              if (percent <= 30) return 'bg-green-100';
              if (percent <= 70) return 'bg-yellow-100';
              return 'bg-red-100';
            };

            return (
              <div
                key={dev.dev}
                className={`${getUtilizationColor(dev.utilizationPercent)} border border-gray-200 rounded-lg p-4 hover:shadow-md transition`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{dev.statusEmoji} {dev.dev}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {dev.tasks} active task{dev.tasks !== 1 ? 's' : ''} • {dev.assigned} / {weeklyCapacity} mandays
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`text-3xl font-bold ${dev.utilizationPercent <= 30 ? 'text-green-600' : dev.utilizationPercent <= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {dev.utilizationPercent}%
                    </div>
                    <p className="text-sm font-medium text-gray-600 mt-1">{dev.status}</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full transition-all ${dev.utilizationPercent <= 30 ? 'bg-green-500' : dev.utilizationPercent <= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${Math.min(100, dev.utilizationPercent)}%` }}
                  ></div>
                </div>

                {/* Status Description */}
                <div className="mt-3 p-3 bg-white rounded-lg">
                  {dev.utilizationPercent <= 30 && (
                    <p className="text-sm text-green-700 font-medium">✓ Developer is free and available for new work</p>
                  )}
                  {dev.utilizationPercent > 30 && dev.utilizationPercent <= 70 && (
                    <p className="text-sm text-yellow-700 font-medium">⚠ Developer has some capacity remaining</p>
                  )}
                  {dev.utilizationPercent > 70 && (
                    <p className="text-sm text-red-700 font-medium">✕ Developer is overloaded, consider redistributing work</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-sm text-blue-600 font-semibold mb-2">Total Tasks</p>
          <p className="text-3xl font-bold text-blue-900">{tasks.length}</p>
        </div>
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
          <p className="text-sm text-indigo-600 font-semibold mb-2">Active Developers</p>
          <p className="text-3xl font-bold text-indigo-900">{developers.length}</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <p className="text-sm text-purple-600 font-semibold mb-2">Available for Work</p>
          <p className="text-3xl font-bold text-purple-900">{availableDevelopers.length}</p>
        </div>
      </div>
    </div>
  );
}
