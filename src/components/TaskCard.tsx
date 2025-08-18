import Link from 'next/link';
import { TaskMeta } from '@/lib/posts';

interface TaskCardProps {
  task: TaskMeta;
}

export default function TaskCard({ task }: TaskCardProps) {
  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'planning': return 'bg-purple-100 text-purple-800';
      case 'on_hold': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityIcon = (priority?: string) => {
    switch (priority) {
      case 'urgent': return '🔥';
      case 'high': return '📋';
      case 'medium': return '📝';
      case 'low': return '💭';
      default: return '📝';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'completed': return '✅';
      case 'active': return '🎯';
      case 'planning': return '📝';
      case 'on_hold': return '⏸️';
      case 'overdue': return '⚠️';
      case 'cancelled': return '❌';
      default: return '📝';
    }
  };

  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed';
  const needsCheckup = task.checkup?.required && task.checkup?.next_date && 
    new Date(task.checkup.next_date) <= new Date() && task.status !== 'completed';

  const completedTasksCount = task.tasks?.filter(t => t.completed).length || 0;
  const totalTasksCount = task.tasks?.length || 0;

  return (
    <Link href={`/tasks/${task.slug}`}>
      <div className={`bg-white rounded-lg shadow-sm border transition-all duration-200 hover:shadow-md hover:scale-[1.02] p-6 h-full ${
        isOverdue ? 'border-red-200 bg-red-50' : 
        needsCheckup ? 'border-yellow-200 bg-yellow-50' : 
        'border-gray-200 hover:border-gray-300'
      }`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">{getPriorityIcon(task.priority)}</span>
            <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
              {task.priority || 'medium'}
            </span>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(task.status)}`}>
            {getStatusIcon(task.status)} {task.status || 'planning'}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-gray-900">
          {task.title}
        </h3>

        {/* Summary */}
        {task.summary && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {task.summary}
          </p>
        )}

        {/* Progress Bar */}
        {task.completion_percentage !== undefined && (
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-600">Progress</span>
              <span className="text-xs font-medium">{task.completion_percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${task.completion_percentage}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Task Count */}
        {totalTasksCount > 0 && (
          <div className="mb-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>📋</span>
              <span>{completedTasksCount}/{totalTasksCount} tasks complete</span>
            </div>
          </div>
        )}

        {/* Alerts */}
        <div className="space-y-1 mb-3">
          {isOverdue && (
            <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
              <span>⚠️</span>
              <span>Overdue</span>
            </div>
          )}
          {needsCheckup && (
            <div className="flex items-center gap-2 text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
              <span>🔍</span>
              <span>Check-up due</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500 mt-auto pt-3 border-t">
          <span>{task.project || 'Personal'}</span>
          {task.due_date && (
            <span className={isOverdue ? 'text-red-600' : ''}>
              Due: {new Date(task.due_date).toLocaleDateString()}
            </span>
          )}
        </div>

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {task.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
            {task.tags.length > 3 && (
              <span className="text-xs text-gray-500">
                +{task.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
