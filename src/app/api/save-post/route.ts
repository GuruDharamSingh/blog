import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

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

    const contentPath = path.join(process.cwd(), 'content', contentDir);
    const filePath = path.join(contentPath, fullFilename);

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

    // Ensure directory exists
    await fs.mkdir(contentPath, { recursive: true });

    // Write file
    await fs.writeFile(filePath, finalContent, 'utf8');

    return NextResponse.json({ 
      success: true,
      filename: fullFilename,
      path: `content/${contentDir}/${fullFilename}`,
      published
    });

  } catch (error: any) {
    console.error('Save error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to save post'
    }, { status: 500 });
  }
}
