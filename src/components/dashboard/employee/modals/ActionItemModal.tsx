import { useState } from 'react';
import { X, Calendar, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ActionItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (actionItem: {
    title: string;
    description: string;
    dueDate: string;
    priority: 'low' | 'medium' | 'high';
  }) => void;
  feedbackMessage?: string;
}

export default function ActionItemModal({
  isOpen,
  onClose,
  onSubmit,
  feedbackMessage
}: ActionItemModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      dueDate,
      priority
    });
    setTitle('');
    setDescription('');
    setDueDate('');
    setPriority('medium');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-lg p-6 bg-gray-800 rounded-lg shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Create Action Item</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {feedbackMessage && (
          <div className="p-3 mb-4 text-sm text-blue-400 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <p className="font-medium">Related Feedback:</p>
            <p className="mt-1 text-gray-300">{feedbackMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-300">
              Due Date
            </label>
            <div className="relative mt-1">
              <input
                type="date"
                id="dueDate"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">
              Priority
            </label>
            <div className="flex gap-2 mt-1">
              <button
                type="button"
                onClick={() => setPriority('low')}
                className={cn(
                  "flex-1 px-3 py-2 text-sm font-medium rounded-lg border",
                  priority === 'low'
                    ? "bg-green-500/10 text-green-500 border-green-500/20"
                    : "bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600"
                )}
              >
                Low
              </button>
              <button
                type="button"
                onClick={() => setPriority('medium')}
                className={cn(
                  "flex-1 px-3 py-2 text-sm font-medium rounded-lg border",
                  priority === 'medium'
                    ? "bg-orange-500/10 text-orange-500 border-orange-500/20"
                    : "bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600"
                )}
              >
                Medium
              </button>
              <button
                type="button"
                onClick={() => setPriority('high')}
                className={cn(
                  "flex-1 px-3 py-2 text-sm font-medium rounded-lg border",
                  priority === 'high'
                    ? "bg-red-500/10 text-red-500 border-red-500/20"
                    : "bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600"
                )}
              >
                High
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700"
            >
              Create Action Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 