"use client";
import { useState, useRef } from 'react';
import { useAuth } from './AuthProvider';

export function EditorClient() {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [summary, setSummary] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [slug, setSlug] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
    } finally { setLoading(false); }
  }

  async function quickPublishToFiles() {
    setSaving(true);
    try {
      const s = slug || deriveSlug(title);
      setSlug(s);
      const res = await fetch('/api/posts/publish-to-files', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: s, title, body, summary, tags })
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
          <input value={title} onChange={e=>{setTitle(e.target.value);}} className="w-full border rounded px-3 py-2" placeholder="Post title" />
        </div>
        <div className="w-60">
          <label className="block text-sm font-medium mb-1">Slug</label>
            <input value={slug} onChange={e=>setSlug(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="auto-generated" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Body (Markdown / MDX)</label>
        <textarea value={body} onChange={e=>setBody(e.target.value)} className="w-full h-64 font-mono border rounded px-3 py-2" placeholder="# Heading\nWrite here..." />
      </div>
      <div className="flex gap-2 flex-wrap">
        <button type="button" onClick={enrich} disabled={loading} className="bg-black text-white px-4 py-2 rounded disabled:opacity-50">{loading? 'Enriching...' : 'AI Enrich'}</button>
        <button type="button" onClick={quickPublishToFiles} disabled={saving} className="border px-4 py-2 rounded disabled:opacity-50">{saving? 'Saving...' : 'Quick Publish (files)'}</button>
        <button type="button" onClick={downloadMDX} className="border px-4 py-2 rounded">Download MDX</button>
        <label className="border px-4 py-2 rounded cursor-pointer relative overflow-hidden">
          <span>{uploading? 'Uploading...' : 'Add Image'}</span>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
        </label>
      </div>
      {summary && (
        <div className="p-4 border border-neutral-300 rounded bg-white">
          <h3 className="font-semibold mb-2 text-neutral-900">Suggested Summary</h3>
          <p className="text-sm mb-2 text-neutral-900">{summary}</p>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map(t=> (
                <span key={t} className="text-xs bg-neutral-100 text-neutral-800 border border-neutral-300 rounded px-2 py-1">{t}</span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
