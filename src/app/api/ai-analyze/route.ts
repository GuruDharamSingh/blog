import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// POST { content, targetAudience?, tone?, length? } -> { suggestions }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      content = '', 
      targetAudience = 'general', 
      tone = 'professional',
      length = 'medium'
    } = body;

    if (!content || content.length < 100) {
      return NextResponse.json({ 
        error: 'Content must be at least 100 characters long' 
      }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error('Missing OPENAI_API_KEY');

    const client = new OpenAI({ apiKey });
    
    const prompt = `Analyze this blog post content and provide specific improvement suggestions.

TARGET AUDIENCE: ${targetAudience}
DESIRED TONE: ${tone}
DESIRED LENGTH: ${length}

CONTENT:
${content}

Return JSON with:
- readability_score (1-10)
- suggestions (array of specific improvements)
- tone_analysis (current tone vs desired)
- structure_improvements (heading, paragraph suggestions)
- engagement_tips (ways to make it more engaging)
- seo_suggestions (keyword and meta improvements)
`;

    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { 
          role: 'system', 
          content: 'You are a professional content strategist. Provide actionable, specific suggestions for blog improvement. Return valid JSON only.' 
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 1000
    });

    const raw = completion.choices[0]?.message?.content || '';
    
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysis = JSON.parse(jsonMatch[0]);
        return NextResponse.json({ 
          analysis,
          word_count: content.split(' ').length,
          reading_time: Math.ceil(content.split(' ').length / 200) // avg reading speed
        });
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
    }

    // Fallback response
    return NextResponse.json({
      analysis: {
        readability_score: 7,
        suggestions: ["Consider adding more specific examples", "Break up long paragraphs"],
        tone_analysis: `Current tone appears ${tone}-friendly`,
        structure_improvements: ["Add subheadings for better readability"],
        engagement_tips: ["Ask questions to engage readers", "Add relevant examples"],
        seo_suggestions: ["Include target keywords naturally", "Optimize meta description"]
      },
      word_count: content.split(' ').length,
      reading_time: Math.ceil(content.split(' ').length / 200)
    });

  } catch (e: any) {
    console.error('AI analyze error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
