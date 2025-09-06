import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// POST { content, style? } -> { embellished_content }
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { content = '', style = 'engaging' } = body;

  try {
    if (!content || content.length < 50) {
      return NextResponse.json({ 
        error: 'Content must be at least 50 characters long' 
      }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error('Missing OPENAI_API_KEY');

    const client = new OpenAI({ apiKey });
    
    const stylePrompts = {
      engaging: 'Subtly enhance engagement while maintaining the natural tone',
      vivid: 'Add selective descriptive touches without overwhelming the content',
      conversational: 'Gently make it more conversational and relatable',
      professional: 'Lightly enhance with refined yet accessible language',
      creative: 'Add tasteful creative touches while preserving clarity'
    };

    const selectedStyle = stylePrompts[style as keyof typeof stylePrompts] || stylePrompts.engaging;
    
    const prompt = `Lightly enhance this blog content with restrained improvements:

STYLE GOAL: ${selectedStyle}

ENHANCEMENT GUIDELINES (REDUCED INTENSITY):
- Make SUBTLE improvements - enhance, don't transform
- Add descriptive language SPARINGLY and only where it truly helps
- Keep 70% of the original wording intact
- Focus on clarity and flow over dramatic changes
- Maintain the author's authentic voice completely
- Use light touches of enhancement - avoid over-embellishment
- Preserve all original meaning and structure
- Keep any existing markdown formatting
- Aim for 10-20% content expansion maximum, not 50%+

IMPORTANT: The goal is gentle refinement, not dramatic rewriting. Stay very close to the original.

ORIGINAL CONTENT:
${content}

Return only the lightly enhanced content with proper markdown formatting:`;

    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { 
          role: 'system', 
          content: 'You are a skilled content enhancer who adds life and vibrancy to writing while preserving the author\'s authentic voice and intent. Focus on descriptive language and engagement.' 
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.5, // Reduced from 0.75 for more conservative enhancement
      max_tokens: Math.min(3000, Math.max(800, content.length * 2)) // Dynamic token limit
    });

    const embellished_content = completion.choices[0]?.message?.content || content;

    // Calculate enhancement metrics
    const originalWords = content.split(/\s+/).length;
    const newWords = embellished_content.split(/\s+/).length;
    const enhancement_ratio = ((newWords - originalWords) / originalWords * 100).toFixed(1);

    return NextResponse.json({ 
      embellished_content,
      original_word_count: originalWords,
      new_word_count: newWords,
      enhancement_ratio: `+${enhancement_ratio}%`,
      style_applied: style
    });

  } catch (e: any) {
    console.error('AI embellish error:', e);
    return NextResponse.json({ 
      error: e.message,
      embellished_content: content // Return original on error
    }, { status: 500 });
  }
}
