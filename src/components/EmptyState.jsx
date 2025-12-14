import { AlertCircle } from 'lucide-react';

export default function EmptyState({ title = 'No data', message = 'There\'s nothing to show here yet.' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="text-gray-500 mt-2">{message}</p>
    </div>
  );
}
