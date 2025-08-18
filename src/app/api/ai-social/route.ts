import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// POST { title, content, style? } -> { social_posts }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title = '', content = '', style = 'engaging' } = body;

    if (!title || !content) {
      return NextResponse.json({ 
        error: 'Title and content are required' 
      }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error('Missing OPENAI_API_KEY');

    const client = new OpenAI({ apiKey });
    
    const prompt = `Create social media posts to promote this blog post.

BLOG TITLE: ${title}
BLOG CONTENT: ${content.slice(0, 2000)}
STYLE: ${style}

Generate JSON with:
- twitter (280 chars max, engaging, with hashtags)
- linkedin (professional tone, longer form)
- instagram (visual-focused, emoji-rich)
- facebook (conversational, shareable)
- threads (casual, discussion-starting)

Each should be compelling and drive traffic to the blog.
`;

    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { 
          role: 'system', 
          content: 'You are a social media expert. Create engaging posts that drive traffic. Return valid JSON only.' 
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 800
    });

    const raw = completion.choices[0]?.message?.content || '';
    
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const socialPosts = JSON.parse(jsonMatch[0]);
        return NextResponse.json({ social_posts: socialPosts });
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
    }

    // Fallback response
    return NextResponse.json({
      social_posts: {
        twitter: `📝 New blog post: "${title}" - check it out! #blogging #content`,
        linkedin: `I just published a new article: "${title}". Would love to hear your thoughts!`,
        instagram: `📖 New blog post is live! "${title}" ✨ Link in bio`,
        facebook: `Just shared some thoughts on "${title}" - what do you think?`,
        threads: `Wrote about "${title}" - curious about your experiences with this topic?`
      }
    });

  } catch (e: any) {
    console.error('AI social error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
