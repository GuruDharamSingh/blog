This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

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
