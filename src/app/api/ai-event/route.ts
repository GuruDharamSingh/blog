import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// POST { title, description, event_type?, location_type? } -> { enhanced_event_data }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      title = '', 
      description = '', 
      event_type = 'meeting',
      location_type = 'virtual'
    } = body;

    if (!title || !description) {
      return NextResponse.json({ 
        error: 'Title and description are required' 
      }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error('Missing OPENAI_API_KEY');

    const client = new OpenAI({ apiKey });
    
    const prompt = `You are an event planning assistant. Based on this event information, generate structured event data.

EVENT TITLE: ${title}
DESCRIPTION: ${description}
EVENT TYPE: ${event_type}
LOCATION TYPE: ${location_type}

Return JSON with:
- summary (engaging 2-3 sentence summary)
- agenda (array of topic objects with topic, duration, speaker)
- requirements (array of items participants should bring)
- prep_materials (array of helpful resources)
- tags (relevant event tags)
- estimated_duration (in minutes)
- suggested_capacity (recommended max attendees)
- follow_up_actions (post-event tasks)

Make suggestions practical and helpful for a ${event_type} that is ${location_type}.`;

    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { 
          role: 'system', 
          content: 'You are a professional event coordinator. Generate practical, actionable event data. Return valid JSON only.' 
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const raw = completion.choices[0]?.message?.content || '';
    
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const eventData = JSON.parse(jsonMatch[0]);
        return NextResponse.json({ 
          event_data: eventData,
          ai_suggestions: true
        });
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
    }

    // Fallback response
    return NextResponse.json({
      event_data: {
        summary: `${title}: ${description}`,
        agenda: [
          { topic: "Welcome & Introductions", duration: 10, speaker: "Organizer" },
          { topic: "Main Discussion", duration: 30, speaker: "All" },
          { topic: "Next Steps", duration: 10, speaker: "Organizer" }
        ],
        requirements: ["Notebook", "Pen"],
        prep_materials: [],
        tags: [event_type, location_type],
        estimated_duration: 60,
        suggested_capacity: location_type === 'virtual' ? 50 : 20,
        follow_up_actions: ["Send summary", "Schedule follow-up"]
      },
      ai_suggestions: false
    });

  } catch (e: any) {
    console.error('AI event error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
