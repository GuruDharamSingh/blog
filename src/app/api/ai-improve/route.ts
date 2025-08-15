import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// POST { content, mode } -> { improved_content }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { content = '', mode = 'improve' } = body;

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error('Missing OPENAI_API_KEY');

    const client = new OpenAI({ apiKey });
    
    const prompts = {
      improve: `Improve this blog post content while keeping the original meaning and tone. Make it more engaging, fix grammar, and improve flow. Return only the improved content:

${content}`,
      
      simplify: `Rewrite this blog post content to be simpler and more accessible. Use shorter sentences and common words. Keep the same meaning but make it easier to read:

${content}`,
      
      expand: `Expand on this blog post content. Add more details, examples, and depth while maintaining the original tone and message:

${content}`,
      
      summarize: `Create a concise summary of this blog post content that captures the key points:

${content}`
    };

    const selectedPrompt = prompts[mode as keyof typeof prompts] || prompts.improve;

    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a skilled editor helping improve blog content. Return only the requested content without additional commentary.' },
        { role: 'user', content: selectedPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const improved_content = completion.choices[0]?.message?.content || content;

    return NextResponse.json({ improved_content, original_length: content.length, new_length: improved_content.length });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
