# Clean Blog with Mobile MDX Editor

This repo is a Next.js blog with a built-in, mobile-friendly MDX editor. In production on Netlify, publishing commits the post to GitHub and triggers an automatic deploy.

## Core Flow
- Write at `/editor` (mobile friendly)
- Editor calls `/api/save-post`
- In production, the API commits `content/<type>/<date>-<slug>.mdx` to your GitHub repo
- Netlify detects the commit and auto-deploys your site

## Requirements
- Netlify connected to this GitHub repo (auto-deploys from `main`)
- Environment variables on Netlify:
   - `GITHUB_TOKEN` (repo write)
   - Optional: `GITHUB_REPOSITORY` (default: `GuruDharamSingh/blog`)
   - Optional: `GITHUB_BRANCH` (default: `main`)
   - `OPENAI_API_KEY` for AI features

## Commands
- Dev: `npm run dev`
- Build: `npm run build`
- Start: `npm start`

## Structure
- `content/` MDX content
- `src/app/editor/` editor UI
- `src/app/api/save-post/` publish endpoint (GitHub commit in prod, local FS in dev)
- `src/components/mdx/` MDX components

## Notes
- No external CMS. `/admin` redirects to `/editor`.
- Runtime filesystem on Netlify is read-only; content must be written to Git.
