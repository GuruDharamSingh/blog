import { NextResponse } from 'next/server';

// GET /api/health
// Reports presence of required env vars and basic environment context.
// Does NOT expose secret values.
export async function GET() {
  const hasGithubToken = Boolean(process.env.GITHUB_TOKEN || process.env.GITHUB_PERSONAL_TOKEN);
  const repo = process.env.GITHUB_REPOSITORY || 'GuruDharamSingh/blog';
  const branch = process.env.GITHUB_BRANCH || 'main';
  const env = {
    NETLIFY: Boolean(process.env.NETLIFY),
    VERCEL: Boolean(process.env.VERCEL),
    NODE_ENV: process.env.NODE_ENV || 'development',
  };
  const ai = {
    hasOpenAIKey: Boolean(process.env.OPENAI_API_KEY),
  };

  return NextResponse.json(
    {
      ok: true,
      github: { hasGithubToken, repo, branch },
      ai,
      env,
      time: new Date().toISOString(),
    },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}
