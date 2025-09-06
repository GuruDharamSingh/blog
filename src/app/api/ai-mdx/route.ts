import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// POST { title, content, category?, tags?, summary? } -> { mdx_content }
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { 
    title = '', 
    content = '', 
    category = 'Personal', 
    tags = '', 
    summary = ''
  } = body;

  try {
    if (!title || !content) {
      return NextResponse.json({ 
        error: 'Title and content are required' 
      }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error('Missing OPENAI_API_KEY');

    const client = new OpenAI({ apiKey });
    
    const currentDate = new Date().toISOString().split('T')[0];
    
    const prompt = `Convert this blog content into clean MDX format with proper frontmatter.

REQUIREMENTS:
- Add YAML frontmatter with title, date, category, tags, summary
- Use clean markdown with proper heading hierarchy
- Keep the original meaning intact
- Ensure proper markdown syntax

AVAILABLE MDX COMPONENTS (use sparingly, only when they genuinely enhance content):
- <Callout type="info|warning|success|error|tip|note" title="Optional Title">content</Callout>
- <Alert variant="default|destructive|success|warning|info" dismissible={true}>content</Alert>
- <Card><CardHeader><CardTitle>Title</CardTitle></CardHeader><CardContent>content</CardContent></Card>
- <Progress value={50} max={100} showValue={true} variant="success" />
- <CodeBlock language="javascript" title="Example">code here</CodeBlock>
- <Button variant="default|outline|ghost">Click me</Button>

Only suggest components if they genuinely improve the content presentation.

TITLE: ${title}
CATEGORY: ${category}
TAGS: ${tags}
SUMMARY: ${summary}

CONTENT:
${content}

Return properly formatted MDX with frontmatter:`;

    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { 
          role: 'system', 
          content: 'You are an expert MDX formatter. Create clean, structured blog posts with YAML frontmatter and proper markdown.' 
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });

    let mdx_content = completion.choices[0]?.message?.content || '';

    // Validate MDX structure
    const hasFrontmatter = mdx_content.startsWith('---') && mdx_content.indexOf('---', 3) > 0;
    
    if (!hasFrontmatter) {
      // Create fallback MDX structure
      const tagArray = tags ? tags.split(',').map((tag: string) => `"${tag.trim()}"`).join(', ') : '';
      mdx_content = `---
title: "${title}"
date: "${currentDate}"
category: "${category}"
tags: [${tagArray}]
summary: "${summary || 'A blog post about ' + title}"
---

# ${title}

${content}`;
    }

    return NextResponse.json({ 
      mdx_content,
      generated_by: 'ai',
      word_count: mdx_content.split(/\s+/).length
    });

  } catch (e: any) {
    console.error('AI MDX error:', e);
    
    // Emergency fallback
    const currentDate = new Date().toISOString().split('T')[0];
    const tagArray = tags ? tags.split(',').map((tag: string) => `"${tag.trim()}"`).join(', ') : '';
    const emergencyMDX = `---
title: "${title}"
date: "${currentDate}"
category: "${category}"
tags: [${tagArray}]
summary: "${summary || 'A blog post about ' + title}"
---

# ${title}

${content}`;

    return NextResponse.json({ 
      mdx_content: emergencyMDX,
      generated_by: 'fallback'
    });
  }
}