import { getAllTasksMeta, getActiveTasksMeta, getOverdueTasksMeta, getTasksNeedingCheckup } from '@/lib/posts';
import TaskCard from '@/components/TaskCard';

export default function TasksPage() {
  const allTasks = getAllTasksMeta();
  const activeTasks = getActiveTasksMeta();
  const overdueTasks = getOverdueTasksMeta();
  const needingCheckup = getTasksNeedingCheckup();
  const completedTasks = allTasks.filter(task => task.status === 'completed');

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">✅ Tasks & To-Do Lists</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Track your progress with structured task lists, check-ups, and commentary. 
          Stay organized and reflect on your journey.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600">{activeTasks.length}</div>
          <div className="text-sm text-blue-800">Active Tasks</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-red-600">{overdueTasks.length}</div>
          <div className="text-sm text-red-800">Overdue</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-yellow-600">{needingCheckup.length}</div>
          <div className="text-sm text-yellow-800">Need Check-up</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600">{completedTasks.length}</div>
          <div className="text-sm text-green-800">Completed</div>
        </div>
      </div>

      {/* Overdue Tasks Alert */}
      {overdueTasks.length > 0 && (
        <section className="mb-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-red-800">⚠️ Overdue Tasks</h2>
              <span className="bg-red-100 text-red-800 text-sm px-3 py-1 rounded-full">
                {overdueTasks.length} overdue
              </span>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {overdueTasks.map((task) => (
                <TaskCard key={task.slug} task={task} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Tasks Needing Check-up */}
      {needingCheckup.length > 0 && (
        <section className="mb-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-yellow-800">🔍 Check-up Required</h2>
              <span className="bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-full">
                {needingCheckup.length} pending
              </span>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {needingCheckup.map((task) => (
                <TaskCard key={task.slug} task={task} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Active Tasks */}
      {activeTasks.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">🎯 Active Tasks</h2>
            <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
              {activeTasks.length} active
            </span>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeTasks.map((task) => (
              <TaskCard key={task.slug} task={task} />
            ))}
          </div>
        </section>
      )}

      {/* All Tasks */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">📋 All Task Lists</h2>
          <span className="text-gray-600 text-sm">
            {allTasks.length} total list{allTasks.length !== 1 ? 's' : ''}
          </span>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allTasks.map((task) => (
            <TaskCard key={task.slug} task={task} />
          ))}
        </div>
      </section>

      {allTasks.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold mb-2">No task lists yet</h3>
          <p className="text-gray-600 mb-4">Start organizing your tasks and tracking your progress!</p>
          <a 
            href="/admin"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Your First Task List
          </a>
        </div>
      )}
    </div>
  );
}
