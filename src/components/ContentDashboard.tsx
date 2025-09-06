'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Post {
  slug: string;
  title: string;
  category: string;
  tags: string[];
  date: string;
  summary?: string;
  word_count: number;
  status: 'published' | 'draft';
}

interface WorkflowResult {
  success: boolean;
  workflow_steps?: string[];
  analysis?: any;
  optimization_score?: number;
  recommendations?: string[];
}

/**
 * Advanced Content Management Dashboard
 * Demonstrates how React components can provide sophisticated
 * interfaces for content operations powered by Node.js APIs
 */
export default function ContentDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<string>('');
  const [workflowRunning, setWorkflowRunning] = useState(false);
  const [workflowResults, setWorkflowResults] = useState<WorkflowResult | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'optimize' | 'series' | 'analytics'>('overview');
  
  const router = useRouter();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/posts');
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts || []);
      }
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const runWorkflow = async (action: string, options: any = {}) => {
    setWorkflowRunning(true);
    setWorkflowResults(null);
    
    try {
      const response = await fetch('/api/workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...options })
      });
      
      const result = await response.json();
      setWorkflowResults(result);
    } catch (error) {
      console.error('Workflow failed:', error);
      setWorkflowResults({ 
        success: false, 
        workflow_steps: ['❌ Workflow failed: ' + (error as Error).message] 
      });
    } finally {
      setWorkflowRunning(false);
    }
  };

  const optimizePost = () => {
    if (!selectedPost) {
      alert('Please select a post to optimize');
      return;
    }
    runWorkflow('optimize_post', { 
      slug: selectedPost, 
      options: { enhance_readability: true, auto_apply: false } 
    });
  };

  const generateSeries = () => {
    const topic = prompt('Enter topic for content series:');
    if (topic) {
      runWorkflow('generate_series', { 
        topic, 
        target_audience: 'developers',
        post_count: 5,
        style: 'tutorial'
      });
    }
  };

  const performAudit = () => {
    runWorkflow('performance_audit');
  };

  const crossReference = () => {
    runWorkflow('cross_reference');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Content Management Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">
                Advanced content operations powered by React & Node.js
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => router.push('/editor')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                ✏️ Open Editor
              </button>
              <button
                onClick={() => router.push('/')}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                🏠 View Site
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {[
              { id: 'overview', name: 'Overview', icon: '📊' },
              { id: 'optimize', name: 'Optimize', icon: '🚀' },
              { id: 'series', name: 'Series', icon: '📚' },
              { id: 'analytics', name: 'Analytics', icon: '📈' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">📝 Content Overview</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-blue-600">{posts.length}</div>
                      <div className="text-sm text-blue-600">Total Posts</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-green-600">
                        {new Set(posts.map(p => p.category)).size}
                      </div>
                      <div className="text-sm text-green-600">Categories</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-purple-600">
                        {Math.round(posts.reduce((acc, p) => acc + p.word_count, 0) / posts.length) || 0}
                      </div>
                      <div className="text-sm text-purple-600">Avg Words</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {posts.slice(0, 5).map((post) => (
                      <div key={post.slug} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                        <div>
                          <h3 className="font-medium text-gray-900">{post.title}</h3>
                          <p className="text-sm text-gray-500">
                            {post.category} • {post.word_count} words • {new Date(post.date).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() => router.push(`/posts/${post.slug}`)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          View →
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'optimize' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">🚀 Content Optimization</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Post to Optimize
                      </label>
                      <select
                        value={selectedPost}
                        onChange={(e) => setSelectedPost(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Choose a post...</option>
                        {posts.map((post) => (
                          <option key={post.slug} value={post.slug}>
                            {post.title} ({post.word_count} words)
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button
                        onClick={optimizePost}
                        disabled={workflowRunning || !selectedPost}
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {workflowRunning ? '⏳ Optimizing...' : '🚀 Optimize Post'}
                      </button>
                      
                      <button
                        onClick={crossReference}
                        disabled={workflowRunning}
                        className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                      >
                        {workflowRunning ? '⏳ Analyzing...' : '🔗 Cross Reference'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'series' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">📚 Content Series</h2>
                  
                  <div className="space-y-4">
                    <button
                      onClick={generateSeries}
                      disabled={workflowRunning}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                    >
                      {workflowRunning ? '⏳ Generating...' : '📚 Generate Series Plan'}
                    </button>
                    
                    <p className="text-sm text-gray-500">
                      Create a comprehensive content series plan with SEO strategy and publication timeline.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">📈 Performance Analytics</h2>
                  
                  <button
                    onClick={performAudit}
                    disabled={workflowRunning}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
                  >
                    {workflowRunning ? '⏳ Auditing...' : '📊 Run Performance Audit'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Workflow Results */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🤖 Workflow Results</h3>
              
              {workflowRunning && (
                <div className="flex items-center space-x-3 mb-4">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  <span className="text-sm text-gray-600">Processing workflow...</span>
                </div>
              )}
              
              {workflowResults && (
                <div className="space-y-4">
                  {workflowResults.workflow_steps && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Progress Steps:</h4>
                      <div className="space-y-1">
                        {workflowResults.workflow_steps.map((step, index) => (
                          <div key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                            <span className="mt-0.5">•</span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {workflowResults.optimization_score && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Optimization Score:</h4>
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="text-2xl font-bold text-blue-600">
                          {workflowResults.optimization_score}/100
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {workflowResults.recommendations && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Recommendations:</h4>
                      <div className="space-y-2">
                        {workflowResults.recommendations.slice(0, 5).map((rec, index) => (
                          <div key={index} className="text-sm text-gray-600 bg-yellow-50 p-2 rounded">
                            {rec}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {!workflowRunning && !workflowResults && (
                <p className="text-gray-500 text-sm italic">
                  Run a workflow to see results here...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
