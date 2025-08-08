import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDir = path.join(process.cwd(), 'content', 'posts');

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  summary?: string;
  tags?: string[];
  published?: boolean;
};

export function ensureContentDirs() {
  if (!fs.existsSync(postsDir)) fs.mkdirSync(postsDir, { recursive: true });
}

export function getAllPostsMeta(): PostMeta[] {
  ensureContentDirs();
  return fs.readdirSync(postsDir)
    .filter(f => f.endsWith('.md') || f.endsWith('.mdx'))
    .map(f => {
      const full = fs.readFileSync(path.join(postsDir, f), 'utf8');
      const { data } = matter(full);
      return {
        slug: f.replace(/\.(md|mdx)$/,'').toLowerCase(),
        title: data.title || 'Untitled',
        date: data.date || new Date().toISOString(),
        summary: data.summary || '',
        tags: data.tags || [],
        published: data.published !== false
      } as PostMeta;
    })
    .filter(p => p.published)
    .sort((a,b)=> new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string) {
  ensureContentDirs();
  const filePath = ['.md', '.mdx'].map(ext => path.join(postsDir, slug + ext)).find(p => fs.existsSync(p));
  if (!filePath) return null;
  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);
  return { meta: { slug, ...(data as any) }, content };
}

export function createPostFile(slug: string, frontMatter: any, body: string) {
  ensureContentDirs();
  const safe = slug.toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
  const file = path.join(postsDir, `${safe}.mdx`);
  const fm = {
    title: frontMatter.title || 'Untitled',
    date: frontMatter.date || new Date().toISOString().split('T')[0],
    summary: frontMatter.summary || '',
    tags: frontMatter.tags || [],
    published: frontMatter.published ?? true,
  };
  const fmStr = '---\n' + matter.stringify('', fm).split('---\n')[1];
  fs.writeFileSync(file, fmStr + '\n\n' + body + '\n', 'utf8');
  return { path: file, slug: safe };
}
