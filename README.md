# Clean Blog with Decap CMS

A minimal, clean blogging setup using **Decap CMS** (formerly Netlify CMS) for content management and **OpenAI** for content enhancement.

## ✨ Features

- **🎯 Simple & Clean**: Focused solely on Decap CMS - no custom editors or Firebase
- **🤖 AI-Powered**: OpenAI integration for content enrichment and improvement
- **📝 Git-Based**: All content stored in Git, managed through Decap CMS
- **🚀 Static**: Next.js static site generation for fast loading
- **📱 Responsive**: Clean, minimal design

## 🏗️ Structure

```
├── content/posts/          # Blog posts (MDX files)
├── public/admin/           # Decap CMS admin interface
│   ├── index.html         # Clean admin page
│   └── config.yml         # Simplified CMS config
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── ai-enrich/ # AI metadata generation
│   │   │   └── ai-improve/ # AI content improvement
│   │   ├── posts/[slug]/  # Blog post pages
│   │   └── admin/         # Admin redirect
│   ├── components/
│   │   └── SiteHeader.tsx # Simple navigation
│   └── lib/
│       └── posts.ts       # Post utilities
```

## 🚀 Getting Started

1. **Clone and Install**
   ```bash
   npm install
   ```

2. **Set up OpenAI**
   ```bash
   # Add to .env.local
   OPENAI_API_KEY=your_openai_api_key_here
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Access Admin**
   - Go to `/admin/` for Decap CMS interface
   - Authenticate with Netlify Identity or Git Gateway

## 🤖 AI Features

### AI Enrich
- Generates summary, tags, category, and meta description
- Accessible via "🤖 AI Enrich" button in Decap CMS

### AI Improve
- Enhances content for better readability and flow
- Fixes grammar and improves structure
- Accessible in the admin interface

## 📝 Content Management

- **Create Posts**: Use `/admin/` interface
- **Edit Content**: Simple markdown editor with preview
- **Publish**: Git-based workflow with editorial review
- **Media**: Upload images directly through CMS

## 🎨 Clean Features

- ✅ No Firebase dependencies
- ✅ No custom authentication
- ✅ No complex state management
- ✅ Simple, focused UI
- ✅ Clean preview (no raw HTML visible)
- ✅ Minimal configuration

## 🔧 Deployment

Deploy to Netlify with:
- Build command: `npm run build`
- Publish directory: `out` (if using static export) or `.next`
- Environment variables: `OPENAI_API_KEY`

The site uses Decap CMS with Git Gateway for seamless content management.

# Blog

## Admin (Decap CMS)
- Admin URL: `/admin`
- Requires Netlify Identity + Git Gateway enabled
- Media uploads go to `public/uploads`

### Deploy to Netlify
1. Push this repo to GitHub (done).
2. In Netlify, New site from Git → pick this repo.
3. Build settings: Build command `npm run build` (default), leave Publish dir blank (Next.js plugin manages it).
4. After first deploy, go to Site settings → Identity → Enable Identity (Registration: Invite only).
5. Identity → Services → Enable Git Gateway.
6. Identity → Invite users → invite `gurudharamsingh@gmail.com`.
7. Visit `/admin` on your site, accept the invite, and log in.

Env variables (only if you use these features):
- OPENAI_API_KEY: required for the AI enrich API at `/api/ai-enrich`.
- NEXT_PUBLIC_FIREBASE_*: only needed if using Firebase auth/analytics or the upload endpoint.

Notes:
- Decap CMS writes to `content/posts` and saves media in `public/uploads`.
- The Netlify Next.js plugin is enabled via `netlify.toml`.
