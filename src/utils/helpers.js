/**
 * Utility helpers for task management
 */

export const statusColors = {
  'In Progress': 'bg-blue-100 text-blue-800',
  'Backlog': 'bg-gray-100 text-gray-800',
  'Blocked': 'bg-red-100 text-red-800',
  'Completed': 'bg-green-100 text-green-800',
};

export const statusBgColors = {
  'In Progress': 'bg-blue-50',
  'Backlog': 'bg-gray-50',
  'Blocked': 'bg-red-50',
  'Completed': 'bg-green-50',
};

export const priorityColors = {
  'P0': 'text-red-600 font-bold',
  'P1': 'text-orange-600 font-semibold',
  'P2': 'text-yellow-600',
  'P3': 'text-gray-600',
};

export const platformIcons = {
  'Website': '🌐',
  'App': '📱',
  'Backend': '⚙️',
  'Infra': '🖥️',
};

export const parseDate = (dateStr) => {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  return isNaN(date) ? null : date;
};

export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const getDaysRemaining = (endDate) => {
  const end = parseDate(endDate);
  if (!end) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
  return days;
};

export const getWorkloadStatus = (utilizationPercent) => {
  if (utilizationPercent <= 30) {
    return { status: 'Free', color: 'text-green-600', bg: 'bg-green-50', emoji: '🟢' };
  } else if (utilizationPercent <= 70) {
    return { status: 'Available', color: 'text-yellow-600', bg: 'bg-yellow-50', emoji: '🟡' };
  } else {
    return { status: 'Overloaded', color: 'text-red-600', bg: 'bg-red-50', emoji: '🔴' };
  }
};

export const calculateWorkload = (tasks, dev, weeklyCapacity = 40) => {
  const devTasks = tasks.filter(t => t.dev === dev && t.status !== 'Completed');
  const totalMandays = devTasks.reduce((sum, t) => sum + t.mandays, 0);
  const utilizationPercent = (totalMandays / weeklyCapacity) * 100;

  return {
    tasks: devTasks,
    totalMandays,
    utilizationPercent: Math.round(utilizationPercent),
    ...getWorkloadStatus(utilizationPercent),
  };
};

export const getUniqueDevelopers = (tasks) => {
  const devs = new Set();
  tasks.forEach(t => {
    if (t.dev) devs.add(t.dev);
  });
  return Array.from(devs).sort();
};

export const getUniquePlatforms = (tasks) => {
  const platforms = new Set();
  tasks.forEach(t => {
    if (t.platform) platforms.add(t.platform);
  });
  return Array.from(platforms).sort();
};

export const getUniqueProjects = (tasks) => {
  const projects = new Set();
  tasks.forEach(t => {
    if (t.project) projects.add(t.project);
  });
  return Array.from(projects).sort();
};

export const getUniqueStatuses = (tasks) => {
  const statuses = new Set();
  tasks.forEach(t => {
    if (t.status) statuses.add(t.status);
  });
  return Array.from(statuses).sort();
};

export const getUniquePriorities = (tasks) => {
  const priorities = new Set();
  tasks.forEach(t => {
    if (t.priority) priorities.add(t.priority);
  });
  return Array.from(priorities).sort((a, b) => {
    const order = { 'P0': 0, 'P1': 1, 'P2': 2, 'P3': 3 };
    return (order[a] || 999) - (order[b] || 999);
  });
};
