import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// POST { title, creative_type, description, media_count? } -> { creative_suggestions }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      title = '', 
      creative_type = 'mixed_media', 
      description = '',
      media_count = 1
    } = body;

    if (!title) {
      return NextResponse.json({ 
        error: 'Title is required' 
      }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error('Missing OPENAI_API_KEY');

    const client = new OpenAI({ apiKey });
    
    const prompt = `You are a creative content strategist. Based on this creative project, suggest enhanced content structure.

PROJECT TITLE: ${title}
CREATIVE TYPE: ${creative_type}
DESCRIPTION: ${description}
MEDIA COUNT: ${media_count}

Return JSON with:
- summary (compelling summary that hooks readers)
- story_structure (array of section objects with title, purpose, content_type)
- interactive_ideas (array of engagement suggestions)
- collaboration_opportunities (ways others could contribute)
- tools_recommended (array of creative tools/software)
- engagement_hooks (questions or challenges for audience)
- hashtags (social media hashtags)
- cross_promotion (related content ideas)
- technical_notes (production tips or considerations)

Focus on making the ${creative_type} content engaging and shareable.`;

    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { 
          role: 'system', 
          content: 'You are a creative director who excels at multimedia storytelling. Generate engaging content strategies. Return valid JSON only.' 
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 1200
    });

    const raw = completion.choices[0]?.message?.content || '';
    
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const creativeData = JSON.parse(jsonMatch[0]);
        return NextResponse.json({ 
          creative_suggestions: creativeData,
          ai_enhanced: true
        });
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
    }

    // Fallback response based on creative type
    const fallbackData = {
      photo_story: {
        story_structure: [
          { title: "Opening Shot", purpose: "Hook the viewer", content_type: "hero_image" },
          { title: "The Journey", purpose: "Document the process", content_type: "gallery" },
          { title: "Behind the Scenes", purpose: "Show your perspective", content_type: "narrative" },
          { title: "Final Result", purpose: "Showcase the outcome", content_type: "featured_image" }
        ],
        interactive_ideas: ["Ask viewers to guess the location", "Photo scavenger hunt challenge"],
        tools_recommended: ["Camera/Phone", "Photo editing app", "Lightroom"]
      },
      video_showcase: {
        story_structure: [
          { title: "Intro Hook", purpose: "Grab attention in first 3 seconds", content_type: "video" },
          { title: "Main Content", purpose: "Deliver value", content_type: "video" },
          { title: "Call to Action", purpose: "Engage audience", content_type: "interactive" }
        ],
        interactive_ideas: ["Ask for video responses", "Create a series", "Live Q&A follow-up"],
        tools_recommended: ["Video editor", "Good microphone", "Stable lighting"]
      },
      mixed_media: {
        story_structure: [
          { title: "Visual Introduction", purpose: "Set the scene", content_type: "image" },
          { title: "Story Development", purpose: "Build narrative", content_type: "text" },
          { title: "Interactive Element", purpose: "Engage audience", content_type: "poll" },
          { title: "Rich Conclusion", purpose: "Leave impact", content_type: "mixed" }
        ],
        interactive_ideas: ["Multi-format storytelling", "Choose your own adventure", "Community creation"],
        tools_recommended: ["Various media tools", "Content planning app", "Social platforms"]
      }
    };

    const typeData = fallbackData[creative_type as keyof typeof fallbackData] || fallbackData.mixed_media;

    return NextResponse.json({
      creative_suggestions: {
        summary: `${title}: A ${creative_type.replace('_', ' ')} exploration`,
        story_structure: typeData.story_structure,
        interactive_ideas: typeData.interactive_ideas,
        collaboration_opportunities: ["Guest contributions", "Community challenges", "Cross-creator features"],
        tools_recommended: typeData.tools_recommended,
        engagement_hooks: ["What would you create?", "Share your version", "What's your favorite part?"],
        hashtags: [`#${creative_type}`, "#creative", "#content", "#storytelling"],
        cross_promotion: ["Behind-the-scenes content", "Process tutorials", "Community features"],
        technical_notes: ["Consider lighting", "Plan your shots", "Keep backups"]
      },
      ai_enhanced: false
    });

  } catch (e: any) {
    console.error('AI creative error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
