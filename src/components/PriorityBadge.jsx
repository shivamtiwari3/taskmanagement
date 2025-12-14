import { priorityColors } from '../utils/helpers';

export default function PriorityBadge({ priority }) {
  const baseClasses = 'inline-flex items-center justify-center w-10 h-10 rounded-lg font-bold text-sm';
  const colorMap = {
    'P0': 'bg-red-100 text-red-700',
    'P1': 'bg-orange-100 text-orange-700',
    'P2': 'bg-yellow-100 text-yellow-700',
    'P3': 'bg-gray-100 text-gray-700',
  };

  return (
    <div className={`${baseClasses} ${colorMap[priority] || 'bg-gray-100 text-gray-700'}`} title={priority}>
      {priority}
    </div>
  );
}
