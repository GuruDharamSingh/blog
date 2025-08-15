"use client";
import { useState, useRef } from 'react';
import { useAuth } from './AuthProvider';

export function EditorClient() {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [summary, setSummary] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [category, setCategory] = useState('Personal');
  const [metaDescription, setMetaDescription] = useState('');
  const [slug, setSlug] = useState('');
  const [loading, setLoading] = useState(false);
  const [improving, setImproving] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const categories = ['Personal', 'Tech', 'Travel', 'Life', 'Thoughts', 'Projects'];

  function deriveSlug(t: string) {
    return t.toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,80);
  }

  async function enrich() {
    setLoading(true);
    try {
      const res = await fetch('/api/ai-enrich', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content: body })
      });
      const data = await res.json();
      if (data.summary) setSummary(data.summary);
      if (data.tags) setTags(data.tags);
      if (data.category) setCategory(data.category);
      if (data.meta_description) setMetaDescription(data.meta_description);
    } finally { setLoading(false); }
  }

  async function improveContent(mode: 'improve' | 'simplify' | 'expand' | 'summarize') {
    setImproving(true);
    try {
      const res = await fetch('/api/ai-improve', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: body, mode })
      });
      const data = await res.json();
      if (data.improved_content) {
        setBody(data.improved_content);
      }
    } finally { setImproving(false); }
  }

  async function quickPublishToFiles() {
    setSaving(true);
    try {
      const s = slug || deriveSlug(title);
      setSlug(s);
      const res = await fetch('/api/posts/publish-to-files', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          slug: s, 
          title, 
          body, 
          summary, 
          tags, 
          category, 
          meta_description: metaDescription 
        })
      });
      const data = await res.json();
      if (data.ok) {
        alert('Post saved to content/posts as ' + data.slug + '.mdx');
      } else if (data.error) {
        alert('Failed: ' + data.error);
      }
    } finally { setSaving(false); }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (data.url) { setBody(prev => prev + `\n\n![${file.name}](${data.url})\n`); }
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  function downloadMDX() {
    const frontMatter = ['---', `title: ${title || 'Untitled'}`, `date: ${new Date().toISOString().split('T')[0]}`, `summary: ${summary}`, `tags: [${tags.join(', ')}]`, 'published: true', '---'].join('\n');
    const fileContent = `${frontMatter}\n\n${body}\n`;
    const blob = new Blob([fileContent], { type: 'text/markdown' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = (slug || deriveSlug(title) || 'post') + '.mdx';
    a.click();
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[240px]">
          <label className="block text-sm font-medium mb-1">Title</label>
          <input 
            value={title} 
            onChange={e=>{setTitle(e.target.value);}} 
            className="w-full border rounded px-3 py-2" 
            placeholder="Post title" 
          />
        </div>
        <div className="w-40">
          <label className="block text-sm font-medium mb-1">Category</label>
          <select 
            value={category} 
            onChange={e=>setCategory(e.target.value)} 
            className="w-full border rounded px-3 py-2"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="w-60">
          <label className="block text-sm font-medium mb-1">Slug</label>
          <input 
            value={slug} 
            onChange={e=>setSlug(e.target.value)} 
            className="w-full border rounded px-3 py-2" 
            placeholder="auto-generated" 
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Body (Markdown / MDX)</label>
        <textarea 
          value={body} 
          onChange={e=>setBody(e.target.value)} 
          className="w-full h-64 font-mono border rounded px-3 py-2" 
          placeholder="# Heading\nWrite here..." 
        />
      </div>

      <div className="flex gap-2 flex-wrap">
        <button 
          type="button" 
          onClick={enrich} 
          disabled={loading} 
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-blue-700"
        >
          {loading ? 'Enriching...' : '🤖 AI Enrich Metadata'}
        </button>
        
        <button 
          type="button" 
          onClick={() => improveContent('improve')} 
          disabled={improving} 
          className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-green-700"
        >
          {improving ? 'Improving...' : '✨ Improve Content'}
        </button>
        
        <button 
          type="button" 
          onClick={() => improveContent('simplify')} 
          disabled={improving} 
          className="bg-yellow-600 text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-yellow-700"
        >
          📝 Simplify
        </button>
        
        <button 
          type="button" 
          onClick={() => improveContent('expand')} 
          disabled={improving} 
          className="bg-purple-600 text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-purple-700"
        >
          📈 Expand
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button 
          type="button" 
          onClick={quickPublishToFiles} 
          disabled={saving} 
          className="bg-black text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-gray-800"
        >
          {saving ? 'Saving...' : '💾 Quick Publish (files)'}
        </button>
        
        <button 
          type="button" 
          onClick={downloadMDX} 
          className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-50"
        >
          📥 Download MDX
        </button>
        
        <label className="border border-gray-300 px-4 py-2 rounded cursor-pointer hover:bg-gray-50 relative overflow-hidden">
          <span>{uploading ? 'Uploading...' : '🖼️ Add Image'}</span>
          <input 
            ref={fileInputRef} 
            type="file" 
            accept="image/*" 
            onChange={handleUpload} 
            className="absolute inset-0 opacity-0 cursor-pointer" 
          />
        </label>
      </div>

      {/* Enhanced Metadata Display */}
      {(summary || tags.length > 0 || metaDescription) && (
        <div className="p-4 border border-neutral-300 rounded bg-gradient-to-r from-blue-50 to-indigo-50">
          <h3 className="font-semibold mb-3 text-neutral-900 flex items-center">
            🤖 AI-Generated Metadata
          </h3>
          
          {summary && (
            <div className="mb-3">
              <label className="block text-sm font-medium text-neutral-700 mb-1">Summary</label>
              <textarea 
                value={summary} 
                onChange={e=>setSummary(e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm"
                rows={2}
              />
            </div>
          )}
          
          {metaDescription && (
            <div className="mb-3">
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Meta Description (SEO)
              </label>
              <textarea 
                value={metaDescription} 
                onChange={e=>setMetaDescription(e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm"
                rows={2}
                maxLength={160}
              />
              <div className="text-xs text-neutral-500 mt-1">
                {metaDescription.length}/160 characters
              </div>
            </div>
          )}
          
          {tags.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Tags</label>
              <div className="flex flex-wrap gap-2">
                {tags.map((t, i) => (
                  <span 
                    key={i} 
                    className="text-xs bg-white border border-neutral-300 rounded px-2 py-1 flex items-center gap-1"
                  >
                    {t}
                    <button 
                      onClick={() => setTags(tags.filter((_, idx) => idx !== i))}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
