import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDir = path.join(process.cwd(), 'content', 'posts');
const eventsDir = path.join(process.cwd(), 'content', 'events');
const creativeDir = path.join(process.cwd(), 'content', 'creative');
const tasksDir = path.join(process.cwd(), 'content', 'tasks');

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  summary?: string;
  tags?: string[];
  published?: boolean;
  category?: string;
  featured?: boolean;
  featured_image?: string;
  meta_description?: string;
  content_type?: 'post' | 'event' | 'creative' | 'task';
};

export type EventMeta = PostMeta & {
  content_type: 'event';
  event_type?: string;
  event_date?: string;
  duration?: number;
  timezone?: string;
  location_type?: string;
  location?: any;
  rsvp_required?: boolean;
  max_capacity?: number;
  rsvp_contact?: any;
  organizer?: any;
  agenda?: any[];
  requirements?: string[];
  prep_materials?: any[];
  reminders?: any;
};

export type CreativeMeta = PostMeta & {
  content_type: 'creative';
  creative_type?: string;
  hero_media?: any;
  gallery?: any[];
  videos?: any[];
  interactive?: any;
  related_posts?: any[];
  collaborators?: any[];
  creation?: any;
  interaction?: any;
};

export type TaskMeta = PostMeta & {
  content_type: 'task';
  priority?: string;
  due_date?: string;
  status?: string;
  completion_percentage?: number;
  completion_date?: string;
  project?: string;
  tasks?: any[];
  checkup?: any;
  checkup_history?: any[];
  alerts?: any;
  time_tracking?: any;
  dependencies?: any[];
  resources?: any[];
  visibility?: string;
};

export function ensureContentDirs() {
  if (!fs.existsSync(postsDir)) fs.mkdirSync(postsDir, { recursive: true });
  if (!fs.existsSync(eventsDir)) fs.mkdirSync(eventsDir, { recursive: true });
  if (!fs.existsSync(creativeDir)) fs.mkdirSync(creativeDir, { recursive: true });
  if (!fs.existsSync(tasksDir)) fs.mkdirSync(tasksDir, { recursive: true });
}

export function getAllPostsMeta(): PostMeta[] {
  ensureContentDirs();
  
  const allContent: PostMeta[] = [];
  
  // Get regular posts
  if (fs.existsSync(postsDir)) {
    const posts = fs.readdirSync(postsDir)
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
          published: data.published !== false,
          category: data.category || 'Personal',
          featured: data.featured || false,
          featured_image: data.featured_image || '',
          meta_description: data.meta_description || '',
          content_type: 'post'
        } as PostMeta;
      });
    allContent.push(...posts);
  }
  
  // Get events
  if (fs.existsSync(eventsDir)) {
    const events = fs.readdirSync(eventsDir)
      .filter(f => f.endsWith('.md') || f.endsWith('.mdx'))
      .map(f => {
        const full = fs.readFileSync(path.join(eventsDir, f), 'utf8');
        const { data } = matter(full);
        return {
          slug: f.replace(/\.(md|mdx)$/,'').toLowerCase(),
          title: data.title || 'Untitled Event',
          date: data.date || data.event_date || new Date().toISOString(),
          summary: data.summary || '',
          tags: data.tags || [],
          published: data.published !== false,
          category: 'Events',
          featured: data.featured || false,
          featured_image: data.featured_image || '',
          meta_description: data.meta_description || '',
          content_type: 'event'
        } as PostMeta;
      });
    allContent.push(...events);
  }
  
  // Get creative posts
  if (fs.existsSync(creativeDir)) {
    const creative = fs.readdirSync(creativeDir)
      .filter(f => f.endsWith('.md') || f.endsWith('.mdx'))
      .map(f => {
        const full = fs.readFileSync(path.join(creativeDir, f), 'utf8');
        const { data } = matter(full);
        return {
          slug: f.replace(/\.(md|mdx)$/,'').toLowerCase(),
          title: data.title || 'Untitled Creative',
          date: data.date || new Date().toISOString(),
          summary: data.summary || '',
          tags: data.tags || [],
          published: data.published !== false,
          category: data.category || 'Creative',
          featured: data.featured || false,
          featured_image: data.featured_image || data.hero_media?.image || '',
          meta_description: data.meta_description || '',
          content_type: 'creative'
        } as PostMeta;
      });
    allContent.push(...creative);
  }

  // Get tasks
  if (fs.existsSync(tasksDir)) {
    const tasks = fs.readdirSync(tasksDir)
      .filter(f => f.endsWith('.md') || f.endsWith('.mdx'))
      .map(f => {
        const full = fs.readFileSync(path.join(tasksDir, f), 'utf8');
        const { data } = matter(full);
        return {
          slug: f.replace(/\.(md|mdx)$/,'').toLowerCase(),
          title: data.title || 'Untitled Task List',
          date: data.date || new Date().toISOString(),
          summary: data.summary || '',
          tags: data.tags || [],
          published: data.published !== false,
          category: data.project || 'Tasks',
          featured: data.featured || false,
          featured_image: data.featured_image || '',
          meta_description: data.meta_description || '',
          content_type: 'task'
        } as PostMeta;
      });
    allContent.push(...tasks);
  }
  
  return allContent
    .filter(p => p.published)
    .sort((a,b)=> new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostsByCategory(category: string): PostMeta[] {
  return getAllPostsMeta().filter(p => p.category === category);
}

export function getFeaturedPosts(): PostMeta[] {
  return getAllPostsMeta().filter(p => p.featured);
}

export function getAllCategories(): string[] {
  const posts = getAllPostsMeta();
  const categories = [...new Set(posts.map(p => p.category).filter(Boolean))] as string[];
  return categories.sort();
}

export function getPostBySlug(slug: string, contentType: 'post' | 'event' | 'creative' | 'task' = 'post') {
  ensureContentDirs();
  
  let searchDir = postsDir;
  if (contentType === 'event') searchDir = eventsDir;
  if (contentType === 'creative') searchDir = creativeDir;
  if (contentType === 'task') searchDir = tasksDir;
  if (contentType === 'creative') searchDir = creativeDir;
  
  const filePath = ['.md', '.mdx'].map(ext => path.join(searchDir, slug + ext)).find(p => fs.existsSync(p));
  if (!filePath) return null;
  
  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);
  return { meta: { slug, content_type: contentType, ...(data as any) }, content };
}

// Enhanced functions for new content types
export function getAllEventsMeta(): EventMeta[] {
  ensureContentDirs();
  if (!fs.existsSync(eventsDir)) return [];
  
  return fs.readdirSync(eventsDir)
    .filter(f => f.endsWith('.md') || f.endsWith('.mdx'))
    .map(f => {
      const full = fs.readFileSync(path.join(eventsDir, f), 'utf8');
      const { data } = matter(full);
      return {
        slug: f.replace(/\.(md|mdx)$/,'').toLowerCase(),
        title: data.title || 'Untitled Event',
        date: data.date || data.event_date || new Date().toISOString(),
        summary: data.summary || '',
        tags: data.tags || [],
        published: data.published !== false,
        category: 'Events',
        featured: data.featured || false,
        featured_image: data.featured_image || '',
        meta_description: data.meta_description || '',
        content_type: 'event',
        event_type: data.event_type,
        event_date: data.event_date,
        duration: data.duration,
        timezone: data.timezone,
        location_type: data.location_type,
        location: data.location,
        rsvp_required: data.rsvp_required,
        max_capacity: data.max_capacity,
        rsvp_contact: data.rsvp_contact,
        organizer: data.organizer,
        agenda: data.agenda,
        requirements: data.requirements,
        prep_materials: data.prep_materials,
        reminders: data.reminders
      } as EventMeta;
    })
    .filter(e => e.published)
    .sort((a,b) => new Date(b.event_date || b.date).getTime() - new Date(a.event_date || a.date).getTime());
}

export function getAllCreativeMeta(): CreativeMeta[] {
  ensureContentDirs();
  if (!fs.existsSync(creativeDir)) return [];
  
  return fs.readdirSync(creativeDir)
    .filter(f => f.endsWith('.md') || f.endsWith('.mdx'))
    .map(f => {
      const full = fs.readFileSync(path.join(creativeDir, f), 'utf8');
      const { data } = matter(full);
      return {
        slug: f.replace(/\.(md|mdx)$/,'').toLowerCase(),
        title: data.title || 'Untitled Creative',
        date: data.date || new Date().toISOString(),
        summary: data.summary || '',
        tags: data.tags || [],
        published: data.published !== false,
        category: data.category || 'Creative',
        featured: data.featured || false,
        featured_image: data.featured_image || data.hero_media?.image || '',
        meta_description: data.meta_description || '',
        content_type: 'creative',
        creative_type: data.creative_type,
        hero_media: data.hero_media,
        gallery: data.gallery,
        videos: data.videos,
        interactive: data.interactive,
        related_posts: data.related_posts,
        collaborators: data.collaborators,
        creation: data.creation,
        interaction: data.interaction
      } as CreativeMeta;
    })
    .filter(c => c.published)
    .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getUpcomingEvents(): EventMeta[] {
  const now = new Date();
  return getAllEventsMeta().filter(event => {
    const eventDate = new Date(event.event_date || event.date);
    return eventDate >= now;
  });
}

export function getAllTasksMeta(): TaskMeta[] {
  ensureContentDirs();
  if (!fs.existsSync(tasksDir)) return [];
  
  return fs.readdirSync(tasksDir)
    .filter(f => f.endsWith('.md') || f.endsWith('.mdx'))
    .map(f => {
      const full = fs.readFileSync(path.join(tasksDir, f), 'utf8');
      const { data } = matter(full);
      return {
        slug: f.replace(/\.(md|mdx)$/,'').toLowerCase(),
        title: data.title || 'Untitled Task List',
        date: data.date || new Date().toISOString(),
        summary: data.summary || '',
        tags: data.tags || [],
        published: data.published !== false,
        category: data.project || 'Tasks',
        featured: data.featured || false,
        featured_image: data.featured_image || '',
        meta_description: data.meta_description || '',
        content_type: 'task',
        priority: data.priority,
        due_date: data.due_date,
        status: data.status,
        completion_percentage: data.completion_percentage,
        completion_date: data.completion_date,
        project: data.project,
        tasks: data.tasks,
        checkup: data.checkup,
        checkup_history: data.checkup_history,
        alerts: data.alerts,
        time_tracking: data.time_tracking,
        dependencies: data.dependencies,
        resources: data.resources,
        visibility: data.visibility
      } as TaskMeta;
    })
    .filter(t => t.published)
    .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getActiveTasksMeta(): TaskMeta[] {
  return getAllTasksMeta().filter(task => 
    task.status === 'active' || task.status === 'planning'
  );
}

export function getOverdueTasksMeta(): TaskMeta[] {
  const now = new Date();
  return getAllTasksMeta().filter(task => {
    if (!task.due_date) return false;
    const dueDate = new Date(task.due_date);
    return dueDate < now && task.status !== 'completed';
  });
}

export function getTasksNeedingCheckup(): TaskMeta[] {
  const now = new Date();
  return getAllTasksMeta().filter(task => {
    if (!task.checkup?.required || !task.checkup?.next_date) return false;
    const nextCheckup = new Date(task.checkup.next_date);
    return nextCheckup <= now && task.status !== 'completed';
  });
}

export function getTasksByProject(project: string): TaskMeta[] {
  return getAllTasksMeta().filter(task => task.project === project);
}

export function getTasksByStatus(status: string): TaskMeta[] {
  return getAllTasksMeta().filter(task => task.status === status);
}

export function getContentByType(type: 'post' | 'event' | 'creative' | 'task'): PostMeta[] {
  return getAllPostsMeta().filter(item => item.content_type === type);
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
