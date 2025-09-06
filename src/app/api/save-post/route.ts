import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Helper: Commit content to GitHub (used in production where filesystem is read-only)
async function commitToGitHub(params: {
  owner: string;
  repo: string;
  branch: string;
  filePath: string; // repo-relative path e.g. content/posts/2025-09-06-foo.mdx
  content: string; // raw text content
  message: string;
  token: string;
}) {
  const { owner, repo, branch, filePath, content, message, token } = params;
  const apiBase = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURI(filePath)}`;

  // Check if file exists to get its sha (required for updates)
  let existingSha: string | undefined;
  const getRes = await fetch(`${apiBase}?ref=${encodeURIComponent(branch)}`);
  if (getRes.ok) {
    const json = await getRes.json();
    if (json && json.sha) existingSha = json.sha;
  }

  const body = {
    message,
    content: Buffer.from(content, 'utf8').toString('base64'),
    branch,
    sha: existingSha,
    // Optional committer to make history clean; falls back to token user otherwise
    committer: {
      name: 'Site Publisher',
      email: 'noreply@users.noreply.github.com',
    },
  } as any;

  const putRes = await fetch(apiBase, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: JSON.stringify(body),
  });

  if (!putRes.ok) {
    const text = await putRes.text();
    throw new Error(`GitHub commit failed (${putRes.status}): ${text}`);
  }

  const result = await putRes.json();
  return result;
}

// POST { title, content, category, tags, summary, published } -> { success, filename }
export async function POST(req: NextRequest) {
  try {
    const { title, content, category, tags, summary, published = false } = await req.json();

    if (!title || !content) {
      return NextResponse.json({ 
        error: 'Title and content are required' 
      }, { status: 400 });
    }

    // Create filename from title
    const filename = title.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
    
    const currentDate = new Date().toISOString().split('T')[0];
    const fullFilename = `${currentDate}-${filename}.mdx`;

    // Determine content directory based on category
    let contentDir = 'posts'; // default
    if (category === 'Events') contentDir = 'events';
    if (category === 'Creative') contentDir = 'creative';
    if (category === 'Tasks') contentDir = 'tasks';

  const repoRelativeDir = path.posix.join('content', contentDir);
  const repoRelativePath = path.posix.join(repoRelativeDir, fullFilename);

    // Ensure content has frontmatter
    let finalContent = content;
    if (!content.startsWith('---')) {
      const tagArray = tags ? tags.split(',').map((tag: string) => tag.trim()) : [];
      const frontmatter = `---
title: "${title}"
date: "${currentDate}"
category: "${category}"
tags: ${JSON.stringify(tagArray)}
summary: "${summary || ''}"
published: ${published}
---

`;
      finalContent = frontmatter + content;
    }

    const isProd = !!(process.env.NETLIFY || process.env.VERCEL);

    if (isProd) {
      // In production (Netlify), filesystem is read-only. Commit to GitHub instead.
      const token = process.env.GITHUB_TOKEN || process.env.GITHUB_PERSONAL_TOKEN || '';
      if (!token) {
        throw new Error('Missing GITHUB_TOKEN in environment for publishing from production');
      }

      const repoEnv = process.env.GITHUB_REPOSITORY || 'GuruDharamSingh/blog';
      const [owner, repo] = repoEnv.split('/') as [string, string];
      const branch = process.env.GITHUB_BRANCH || 'main';

      await commitToGitHub({
        owner,
        repo,
        branch,
        filePath: repoRelativePath,
        content: finalContent,
        message: `${published ? 'chore(publish):' : 'chore(draft):'} ${fullFilename}`,
        token,
      });

      return NextResponse.json({
        success: true,
        filename: fullFilename,
        path: repoRelativePath,
        published,
        mode: 'github-commit',
      });
    } else {
      // Local/dev environment: write directly to filesystem
      const contentPath = path.join(process.cwd(), 'content', contentDir);
      const filePath = path.join(contentPath, fullFilename);

      await fs.mkdir(contentPath, { recursive: true });
      await fs.writeFile(filePath, finalContent, 'utf8');

      return NextResponse.json({ 
        success: true,
        filename: fullFilename,
        path: repoRelativePath,
        published,
        mode: 'local-fs',
      });
    }

  } catch (error: any) {
    console.error('Save error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to save post'
    }, { status: 500 });
  }
}
