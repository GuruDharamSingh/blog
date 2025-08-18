import { getPostBySlug, getAllTasksMeta } from '@/lib/posts';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { Callout } from '@/components/mdx/Callout';
import { InteractiveChart } from '@/components/mdx/InteractiveChart';
import Link from 'next/link';

const components = {
  Callout,
  InteractiveChart,
};

interface TaskPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const tasks = getAllTasksMeta();
  return tasks.map((task) => ({
    slug: task.slug,
  }));
}

export default async function TaskPage({ params }: TaskPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug, 'task');
  
  if (!post) {
    notFound();
  }

  const { meta, content } = post;
  const task = meta as any; // TaskMeta type

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

  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed';
  const needsCheckup = task.checkup?.required && task.checkup?.next_date && 
    new Date(task.checkup.next_date) <= new Date() && task.status !== 'completed';

  const completedTasksCount = task.tasks?.filter((t: any) => t.completed).length || 0;
  const totalTasksCount = task.tasks?.length || 0;

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* Back Link */}
      <Link href="/tasks" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
        ← Back to Tasks
      </Link>

      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className={`px-3 py-1 rounded-full text-sm ${getPriorityColor(task.priority)}`}>
            {task.priority || 'medium'} priority
          </span>
          <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(task.status)}`}>
            {task.status || 'planning'}
          </span>
          {task.project && (
            <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800">
              📁 {task.project}
            </span>
          )}
        </div>

        <h1 className="text-4xl font-bold mb-4">{task.title}</h1>
        
        {task.summary && (
          <p className="text-xl text-gray-600 mb-4">{task.summary}</p>
        )}

        {/* Alerts */}
        {(isOverdue || needsCheckup) && (
          <div className="space-y-2 mb-4">
            {isOverdue && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                <span className="text-red-600">⚠️</span>
                <span className="text-red-800">This task list is overdue! Due date was {new Date(task.due_date).toLocaleDateString()}</span>
              </div>
            )}
            {needsCheckup && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center gap-2">
                <span className="text-yellow-600">🔍</span>
                <span className="text-yellow-800">Check-up is due! Last check-up: {task.checkup.last_date ? new Date(task.checkup.last_date).toLocaleDateString() : 'Never'}</span>
              </div>
            )}
          </div>
        )}

        {/* Meta Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <span className="text-sm text-gray-600">Created</span>
            <div className="font-medium">{new Date(task.date).toLocaleDateString()}</div>
          </div>
          {task.due_date && (
            <div>
              <span className="text-sm text-gray-600">Due Date</span>
              <div className={`font-medium ${isOverdue ? 'text-red-600' : ''}`}>
                {new Date(task.due_date).toLocaleDateString()}
              </div>
            </div>
          )}
          {task.completion_percentage !== undefined && (
            <div>
              <span className="text-sm text-gray-600">Progress</span>
              <div className="font-medium">{task.completion_percentage}%</div>
            </div>
          )}
        </div>
      </header>

      {/* Progress Bar */}
      {task.completion_percentage !== undefined && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Overall Progress</h2>
            <span className="text-lg font-bold">{task.completion_percentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="bg-blue-600 h-4 rounded-full transition-all duration-300" 
              style={{ width: `${task.completion_percentage}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Task List */}
      {task.tasks && task.tasks.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            📋 Task Items ({completedTasksCount}/{totalTasksCount} complete)
          </h2>
          <div className="space-y-3">
            {task.tasks.map((taskItem: any, index: number) => (
              <div key={index} className={`border rounded-lg p-4 ${taskItem.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
                <div className="flex items-start gap-3">
                  <span className={`text-lg ${taskItem.completed ? '✅' : '⬜'}`}>
                    {taskItem.completed ? '✅' : '⬜'}
                  </span>
                  <div className="flex-1">
                    <div className={`font-medium ${taskItem.completed ? 'line-through text-gray-500' : ''}`}>
                      {taskItem.description}
                    </div>
                    
                    {(taskItem.estimated_time || taskItem.actual_time) && (
                      <div className="text-sm text-gray-600 mt-1">
                        {taskItem.estimated_time && (
                          <span>⏱️ Est: {taskItem.estimated_time}</span>
                        )}
                        {taskItem.actual_time && (
                          <span className="ml-3">⏰ Actual: {taskItem.actual_time}</span>
                        )}
                      </div>
                    )}

                    {taskItem.notes && (
                      <div className="text-sm text-gray-600 mt-1 italic">
                        💭 {taskItem.notes}
                      </div>
                    )}

                    {taskItem.subtasks && taskItem.subtasks.length > 0 && (
                      <div className="mt-2 pl-4 border-l-2 border-gray-200">
                        {taskItem.subtasks.map((subtask: any, subIndex: number) => (
                          <div key={subIndex} className="flex items-center gap-2 text-sm">
                            <span>{subtask.completed ? '✅' : '⬜'}</span>
                            <span className={subtask.completed ? 'line-through text-gray-500' : ''}>
                              {subtask.description}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {taskItem.priority && (
                    <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(taskItem.priority)}`}>
                      {taskItem.priority}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Check-up History */}
      {task.checkup_history && task.checkup_history.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">🔍 Check-up History</h2>
          <div className="space-y-4">
            {task.checkup_history.map((checkup: any, index: number) => (
              <div key={index} className="border rounded-lg p-4 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{new Date(checkup.date).toLocaleDateString()}</span>
                  <span className={`px-2 py-1 rounded text-sm ${
                    checkup.progress === 'excellent' ? 'bg-green-100 text-green-800' :
                    checkup.progress === 'on_track' ? 'bg-blue-100 text-blue-800' :
                    checkup.progress === 'behind' ? 'bg-yellow-100 text-yellow-800' :
                    checkup.progress === 'blocked' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {checkup.progress}
                  </span>
                </div>
                
                {checkup.completion_at_checkup !== undefined && (
                  <div className="text-sm text-gray-600 mb-2">
                    Progress: {checkup.completion_at_checkup}%
                  </div>
                )}

                {checkup.accomplishments && (
                  <div className="mb-2">
                    <span className="font-medium text-green-700">✅ Accomplished:</span>
                    <p className="text-gray-700">{checkup.accomplishments}</p>
                  </div>
                )}

                {checkup.challenges && (
                  <div className="mb-2">
                    <span className="font-medium text-red-700">⚠️ Challenges:</span>
                    <p className="text-gray-700">{checkup.challenges}</p>
                  </div>
                )}

                {checkup.next_steps && (
                  <div className="mb-2">
                    <span className="font-medium text-blue-700">🎯 Next Steps:</span>
                    <p className="text-gray-700">{checkup.next_steps}</p>
                  </div>
                )}

                {checkup.mood && (
                  <div className="text-sm text-gray-600">
                    Mood: {checkup.mood}
                  </div>
                )}

                {checkup.notes && (
                  <div className="mt-2 text-sm text-gray-600 italic">
                    💭 {checkup.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Dependencies */}
      {task.dependencies && task.dependencies.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">🔗 Dependencies</h2>
          <div className="space-y-2">
            {task.dependencies.map((dep: any, index: number) => (
              <div key={index} className={`border rounded-lg p-3 ${
                dep.status === 'resolved' ? 'bg-green-50 border-green-200' :
                dep.status === 'blocked' ? 'bg-red-50 border-red-200' :
                'bg-white border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-medium">{dep.description}</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    dep.status === 'resolved' ? 'bg-green-100 text-green-800' :
                    dep.status === 'blocked' ? 'bg-red-100 text-red-800' :
                    dep.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {dep.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600">Type: {dep.type}</div>
                {dep.expected_date && (
                  <div className="text-sm text-gray-600">Expected: {new Date(dep.expected_date).toLocaleDateString()}</div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Resources */}
      {task.resources && task.resources.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">📚 Resources</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {task.resources.map((resource: any, index: number) => (
              <div key={index} className="border rounded-lg p-3 bg-white">
                <div className="font-medium">{resource.name}</div>
                <div className="text-sm text-gray-600">Type: {resource.type}</div>
                {resource.description && (
                  <div className="text-sm text-gray-700 mt-1">{resource.description}</div>
                )}
                {resource.url && (
                  <a href={resource.url} target="_blank" rel="noopener noreferrer" 
                     className="text-blue-600 hover:text-blue-800 text-sm">
                    🔗 Open Resource
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Time Tracking */}
      {task.time_tracking && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">⏰ Time Tracking</h2>
          <div className="bg-gray-50 rounded-lg p-4">
            {task.time_tracking.estimated_total && (
              <div className="mb-2">
                <span className="font-medium">Estimated Total: </span>
                {task.time_tracking.estimated_total}
              </div>
            )}
            {task.time_tracking.actual_total && (
              <div className="mb-2">
                <span className="font-medium">Actual Total: </span>
                {task.time_tracking.actual_total}
              </div>
            )}
            
            {task.time_tracking.sessions && task.time_tracking.sessions.length > 0 && (
              <div className="mt-4">
                <h3 className="font-medium mb-2">Time Sessions</h3>
                <div className="space-y-2">
                  {task.time_tracking.sessions.map((session: any, index: number) => (
                    <div key={index} className="bg-white rounded p-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span>{new Date(session.date).toLocaleDateString()}</span>
                        <span className="font-medium">{session.duration}</span>
                      </div>
                      <div className="text-gray-600">{session.description}</div>
                      <div className="text-gray-500">Productivity: {session.productivity}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {task.tags.map((tag: string, index: number) => (
            <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className="prose prose-lg max-w-none mb-8">
        <MDXRemote source={content} components={components} />
      </div>

      {/* Footer */}
      <footer className="border-t pt-8 mt-8">
        <div className="flex justify-between items-center">
          <Link href="/tasks" className="text-blue-600 hover:text-blue-800">
            ← Back to all tasks
          </Link>
          {task.visibility !== 'private' && (
            <div className="text-sm text-gray-500">
              Visibility: {task.visibility || 'public'}
            </div>
          )}
        </div>
      </footer>
    </article>
  );
}
