import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// POST { content, title? } -> { questions: string[] }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { content = '', title = '' } = body;

    if (!content || content.length < 100) {
      return NextResponse.json({ 
        error: 'Content must be at least 100 characters long to generate meaningful questions' 
      }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error('Missing OPENAI_API_KEY');

    const client = new OpenAI({ apiKey });
    
    const prompt = `Based on this blog post content, generate exactly 2 thoughtful, open-ended questions that would encourage readers to engage, reflect, or share their own experiences.

The questions should:
- Be genuinely curious and thought-provoking
- Relate directly to the content themes
- Encourage personal reflection or sharing
- Be the kind of questions that spark interesting discussions
- Avoid yes/no questions
- Be suitable for social media or blog comments

${title ? `TITLE: ${title}` : ''}

CONTENT:
${content.slice(0, 4000)}

Return only a JSON array with exactly 2 strings:
["Question 1 here?", "Question 2 here?"]`;

    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { 
          role: 'system', 
          content: 'You are a skilled community manager who knows how to craft engaging questions that get people talking. Return only valid JSON array with exactly 2 questions.' 
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.8, // Higher creativity for questions
      max_tokens: 300
    });

    const raw = completion.choices[0]?.message?.content || '';
    
    try {
      // Extract JSON array from response
      const jsonMatch = raw.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const questions = JSON.parse(jsonMatch[0]);
        if (Array.isArray(questions) && questions.length === 2) {
          return NextResponse.json({ questions });
        }
      }
      
      // Fallback parsing - try to extract questions manually
      const lines = raw.split('\n').filter(line => line.trim() && line.includes('?'));
      if (lines.length >= 2) {
        const questions = lines.slice(0, 2).map(line => 
          line.replace(/^["\-\d\.\s]*/, '').replace(/["]*$/, '').trim()
        );
        return NextResponse.json({ questions });
      }
      
      throw new Error('Could not parse questions from AI response');
      
    } catch (parseError) {
      console.error('Question parsing error:', parseError);
      return NextResponse.json({ 
        questions: [
          "What's your take on this topic?",
          "Have you had a similar experience? Tell us about it!"
        ]
      });
    }

  } catch (e: any) {
    console.error('AI questions error:', e);
    return NextResponse.json({ 
      error: e.message,
      questions: [
        "What are your thoughts on this?",
        "How does this relate to your own experience?"
      ]
    }, { status: 500 });
  }
}
