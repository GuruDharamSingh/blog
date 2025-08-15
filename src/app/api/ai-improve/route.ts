import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// POST { content } -> { improved_content }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { content = '' } = body;

    if (!content || content.length < 50) {
      return NextResponse.json({ error: 'Content must be at least 50 characters long' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error('Missing OPENAI_API_KEY');

    const client = new OpenAI({ apiKey });
    
    const prompt = `Improve this blog post content by:
- Fixing grammar and spelling
- Improving flow and readability
- Making it more engaging
- Keeping the original meaning and tone
- Using proper markdown formatting

Return only the improved content:

${content}`;

    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a skilled blog editor. Improve the content while preserving the author\'s voice and intent.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const improved_content = completion.choices[0]?.message?.content || content;

    return NextResponse.json({ 
      improved_content, 
      original_length: content.length, 
      new_length: improved_content.length 
    });
  } catch (e: any) {
    console.error('AI improve error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
