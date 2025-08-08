import type { NextConfig } from "next";
import createMDX from '@next/mdx';

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [require('remark-gfm')],
    rehypePlugins: [require('rehype-slug'), require('rehype-autolink-headings')],
  }
});

const nextConfig: NextConfig = {
  pageExtensions: ['ts','tsx','md','mdx'],
  eslint: {
    // Netlify build should not fail on lint errors; fix them incrementally
    ignoreDuringBuilds: true,
  },
};

export default withMDX(nextConfig);
