import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import OpenAI from 'openai';
import matter from 'gray-matter';

/**
 * Advanced Workflow API - Orchestrates multi-step content operations
 * This demonstrates how Node.js can coordinate complex workflows that
 * combine AI, file operations, and data processing
 */
export async function POST(request: NextRequest) {
  try {
    const { action, slug, options = {} } = await request.json();

    // Initialize OpenAI client inside the function to avoid build-time issues
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    switch (action) {
      case 'optimize_post':
        return await optimizePost(openai, slug, options);
      case 'generate_series':
        return await generateSeries(openai, options);
      case 'cross_reference':
        return await crossReferenceContent(openai);
      case 'performance_audit':
        return await performanceAudit(openai);
      default:
        return NextResponse.json({ error: 'Unknown workflow action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Workflow API error:', error);
    return NextResponse.json({ 
      error: 'Workflow failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

/**
 * Optimize a specific post through multiple AI passes
 */
async function optimizePost(openai: OpenAI, slug: string, options: any) {
  const postsDir = path.join(process.cwd(), 'content', 'posts');
  const filePath = path.join(postsDir, `${slug}.mdx`);
  
  try {
    const fileContent = await fs.readFile(filePath, 'utf8');
    const { data: frontmatter, content } = matter(fileContent);
    
    // Multi-step optimization
    const steps = [];
    
    // Step 1: Content Analysis
    steps.push('🔍 Analyzing content structure and quality...');
    const analysisResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{
        role: 'user',
        content: `Analyze this blog post for improvements:

Title: ${frontmatter.title}
Content: ${content}

Provide analysis for:
1. Content structure and flow
2. SEO optimization opportunities  
3. Reader engagement potential
4. Technical accuracy
5. Accessibility considerations

Format as JSON with structured recommendations.`
      }],
      response_format: { type: "json_object" }
    });
    
    const analysis = JSON.parse(analysisResponse.choices[0].message.content || '{}');
    steps.push('✅ Content analysis complete');
    
    // Step 2: SEO Enhancement
    steps.push('🔍 Optimizing for search engines...');
    const seoResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{
        role: 'user',
        content: `Optimize this content for SEO:

Title: ${frontmatter.title}
Content: ${content}

Generate:
1. Improved meta description (150-160 chars)
2. Better title variations (3 options)
3. Header structure improvements
4. Internal linking suggestions
5. Schema markup recommendations

Return as JSON.`
      }],
      response_format: { type: "json_object" }
    });
    
    const seoSuggestions = JSON.parse(seoResponse.choices[0].message.content || '{}');
    steps.push('✅ SEO optimization complete');
    
    // Step 3: Readability Enhancement
    if (options.enhance_readability) {
      steps.push('📖 Improving readability and flow...');
      const readabilityResponse = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{
          role: 'user',
          content: `Improve the readability of this content while maintaining its meaning and tone:

${content}

Focus on:
- Shorter sentences where appropriate
- Better paragraph breaks
- Transition improvements
- Clarity enhancements
- Maintaining technical accuracy

Return only the improved content.`
        }]
      });
      
      const improvedContent = readabilityResponse.choices[0].message.content;
      steps.push('✅ Readability enhancement complete');
      
      // Optionally save improved version
      if (options.auto_apply && improvedContent) {
        const newFrontmatter = { ...frontmatter };
        if (seoSuggestions.meta_description) {
          newFrontmatter.meta_description = seoSuggestions.meta_description;
        }
        
        const newFileContent = matter.stringify(improvedContent, newFrontmatter);
        await fs.writeFile(filePath, newFileContent, 'utf8');
        steps.push('✅ Improvements applied to file');
      }
    }
    
    // Step 4: Generate Enhancement Report
    steps.push('📊 Generating optimization report...');
    
    return NextResponse.json({
      success: true,
      workflow_steps: steps,
      analysis: analysis,
      seo_suggestions: seoSuggestions,
      optimization_score: calculateOptimizationScore(analysis, seoSuggestions),
      recommendations: generateActionableRecommendations(analysis, seoSuggestions),
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    return NextResponse.json({ 
      error: 'Post optimization failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

/**
 * Generate a content series based on a topic
 */
async function generateSeries(openai: OpenAI, options: any) {
  const { topic, target_audience = 'developers', post_count = 5, style = 'tutorial' } = options;
  
  const seriesResponse = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{
      role: 'user',
      content: `Create a ${post_count}-part blog series about "${topic}" for ${target_audience}.

Style: ${style}

Generate:
1. Series overview and learning path
2. Individual post titles and descriptions
3. Key topics for each post
4. Suggested internal linking structure
5. Call-to-action recommendations

Format as JSON with detailed series plan.`
    }],
    response_format: { type: "json_object" }
  });
  
  const seriesPlan = JSON.parse(seriesResponse.choices[0].message.content || '{}');
  
  return NextResponse.json({
    success: true,
    series_plan: seriesPlan,
    estimated_completion: calculateSeriesTimeline(post_count),
    seo_strategy: generateSeriesSEOStrategy(topic, seriesPlan),
    content_calendar: generateContentCalendar(seriesPlan, post_count)
  });
}

/**
 * Cross-reference all content for internal linking opportunities
 */
async function crossReferenceContent(openai: OpenAI) {
  const postsDir = path.join(process.cwd(), 'content', 'posts');
  const files = await fs.readdir(postsDir);
  const posts = [];
  
  // Read all posts
  for (const file of files) {
    if (file.endsWith('.mdx')) {
      const filePath = path.join(postsDir, file);
      const fileContent = await fs.readFile(filePath, 'utf8');
      const { data: frontmatter, content } = matter(fileContent);
      
      posts.push({
        slug: file.replace('.mdx', ''),
        title: frontmatter.title,
        category: frontmatter.category,
        tags: frontmatter.tags || [],
        content: content.substring(0, 500), // First 500 chars for analysis
        word_count: content.split(' ').length
      });
    }
  }
  
  // Analyze relationships
  const relationshipResponse = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{
      role: 'user',
      content: `Analyze these blog posts for internal linking opportunities:

${JSON.stringify(posts, null, 2)}

Generate:
1. Related post clusters
2. Specific linking suggestions (post A should link to post B because...)
3. Content gap analysis
4. Topic expansion opportunities
5. SEO internal linking strategy

Return as JSON with actionable linking recommendations.`
    }],
    response_format: { type: "json_object" }
  });
  
  const relationships = JSON.parse(relationshipResponse.choices[0].message.content || '{}');
  
  return NextResponse.json({
    success: true,
    total_posts: posts.length,
    relationships: relationships,
    linking_opportunities: relationships.linking_suggestions?.length || 0,
    content_clusters: relationships.clusters || [],
    seo_score: calculateInternalLinkingSEO(relationships)
  });
}

/**
 * Performance audit of content strategy
 */
async function performanceAudit(openai: OpenAI) {
  const postsDir = path.join(process.cwd(), 'content', 'posts');
  const files = await fs.readdir(postsDir);
  
  const auditData = {
    total_posts: files.filter(f => f.endsWith('.mdx')).length,
    categories: new Set<string>(),
    tags: new Set<string>(),
    word_counts: [] as number[],
    publishing_pattern: [] as Date[],
    content_gaps: [] as string[]
  };
  
  // Analyze all posts
  for (const file of files) {
    if (file.endsWith('.mdx')) {
      const filePath = path.join(postsDir, file);
      const fileContent = await fs.readFile(filePath, 'utf8');
      const { data: frontmatter, content } = matter(fileContent);
      
      if (frontmatter.category) auditData.categories.add(frontmatter.category);
      if (frontmatter.tags) frontmatter.tags.forEach((tag: string) => auditData.tags.add(tag));
      
      auditData.word_counts.push(content.split(' ').length);
      
      if (frontmatter.date) {
        auditData.publishing_pattern.push(new Date(frontmatter.date));
      }
    }
  }
  
  // AI-powered audit analysis
  const auditResponse = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{
      role: 'user',
      content: `Analyze this blog performance data:

Total Posts: ${auditData.total_posts}
Categories: ${Array.from(auditData.categories).join(', ')}
Tags: ${Array.from(auditData.tags).join(', ')}
Average Word Count: ${auditData.word_counts.reduce((a, b) => a + b, 0) / auditData.word_counts.length}
Word Count Range: ${Math.min(...auditData.word_counts)} - ${Math.max(...auditData.word_counts)}

Provide:
1. Content strategy assessment
2. Publishing frequency analysis
3. Topic diversity evaluation
4. Recommended improvements
5. Growth opportunities

Format as JSON with actionable insights.`
    }],
    response_format: { type: "json_object" }
  });
  
  const audit = JSON.parse(auditResponse.choices[0].message.content || '{}');
  
  return NextResponse.json({
    success: true,
    audit_data: {
      ...auditData,
      categories: Array.from(auditData.categories),
      tags: Array.from(auditData.tags),
      avg_word_count: Math.round(auditData.word_counts.reduce((a, b) => a + b, 0) / auditData.word_counts.length),
      word_count_range: [Math.min(...auditData.word_counts), Math.max(...auditData.word_counts)]
    },
    performance_analysis: audit,
    recommendations: audit.recommendations || [],
    optimization_score: calculateContentScore(auditData, audit)
  });
}

// Helper functions
function calculateOptimizationScore(analysis: any, seo: any): number {
  let score = 0;
  if (analysis.structure_score) score += analysis.structure_score * 0.3;
  if (seo.seo_score) score += seo.seo_score * 0.4;
  if (analysis.engagement_score) score += analysis.engagement_score * 0.3;
  return Math.min(100, Math.max(0, score));
}

function generateActionableRecommendations(analysis: any, seo: any): string[] {
  const recommendations = [];
  
  if (analysis.structure_issues) {
    recommendations.push(...analysis.structure_issues.map((issue: string) => `Structure: ${issue}`));
  }
  
  if (seo.improvement_suggestions) {
    recommendations.push(...seo.improvement_suggestions.map((suggestion: string) => `SEO: ${suggestion}`));
  }
  
  return recommendations;
}

function calculateSeriesTimeline(postCount: number): string {
  const weeksPerPost = 1.5; // Assuming 1.5 weeks per quality post
  const totalWeeks = Math.ceil(postCount * weeksPerPost);
  return `${totalWeeks} weeks (${postCount} posts at ~1.5 weeks each)`;
}

function generateSeriesSEOStrategy(topic: string, plan: any): any {
  return {
    primary_keyword: topic.toLowerCase().replace(/\s+/g, '-'),
    long_tail_opportunities: plan.topics?.slice(0, 3) || [],
    internal_linking_strategy: 'Sequential with hub page',
    content_cluster_approach: 'Topic authority building'
  };
}

function generateContentCalendar(plan: any, postCount: number): any[] {
  const calendar = [];
  const startDate = new Date();
  
  for (let i = 0; i < postCount; i++) {
    const publishDate = new Date(startDate);
    publishDate.setDate(publishDate.getDate() + (i * 10)); // 10 days apart
    
    calendar.push({
      week: i + 1,
      publish_date: publishDate.toISOString().split('T')[0],
      title: plan.posts?.[i]?.title || `Part ${i + 1}`,
      status: 'planned'
    });
  }
  
  return calendar;
}

function calculateInternalLinkingSEO(relationships: any): number {
  const opportunityCount = relationships.linking_suggestions?.length || 0;
  const clusterCount = relationships.clusters?.length || 0;
  
  // Simple scoring based on opportunities and organization
  return Math.min(100, (opportunityCount * 10) + (clusterCount * 15));
}

function calculateContentScore(data: any, audit: any): number {
  let score = 0;
  
  // Volume score (20%)
  const volumeScore = Math.min(100, (data.total_posts / 50) * 100);
  score += volumeScore * 0.2;
  
  // Diversity score (30%)
  const diversityScore = (data.categories.size * 10) + (data.tags.size * 2);
  score += Math.min(100, diversityScore) * 0.3;
  
  // Quality score (50%) - based on word count consistency
  const avgWordCount = data.avg_word_count;
  const qualityScore = avgWordCount > 800 ? 90 : (avgWordCount / 800) * 90;
  score += qualityScore * 0.5;
  
  return Math.round(score);
}
