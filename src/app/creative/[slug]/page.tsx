import { notFound } from 'next/navigation';
import { getPostBySlug, getAllCreativeMeta } from '@/lib/posts';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { 
  InteractiveChart,
  Callout,
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
  Button,
  CodeBlock,
  Progress,
  Alert, AlertTitle, AlertDescription,
  Tabs, TabsList, TabsTrigger, TabsContent,
  Accordion, AccordionItem, AccordionTrigger, AccordionContent
} from '@/components/mdx';

const components = {
  InteractiveChart,
  Callout,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  CodeBlock,
  Progress,
  Alert,
  AlertTitle,
  AlertDescription,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
};

interface CreativePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const creative = getAllCreativeMeta();
  return creative.map((item) => ({
    slug: item.slug,
  }));
}

export default async function CreativePage({ params }: CreativePageProps) {
  const { slug } = await params;
  const creative = getPostBySlug(slug, 'creative');
  
  if (!creative) {
    notFound();
  }

  const { meta, content } = creative;

  const getCreativeIcon = (type?: string) => {
    switch (type) {
      case 'photo_story': return '📸';
      case 'video_showcase': return '🎬';
      case 'art_project': return '🎨';
      case 'music_audio': return '🎵';
      case 'creative_writing': return '📝';
      case 'project_showcase': return '💡';
      default: return '🔗';
    }
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-orange-100 text-orange-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="border rounded-lg p-6 mb-8 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{getCreativeIcon(meta.creative_type)}</span>
            <span className="text-sm font-medium text-gray-600 capitalize">
              {meta.creative_type?.replace('_', ' ') || 'Creative'}
            </span>
          </div>
          
          {meta.creation?.difficulty && (
            <span className={`text-sm px-3 py-1 rounded-full ${getDifficultyColor(meta.creation.difficulty)}`}>
              {meta.creation.difficulty}
            </span>
          )}
        </div>
        
        <h1 className="text-4xl font-bold mb-4">{meta.title}</h1>
        
        {meta.summary && (
          <p className="text-lg text-gray-700 mb-4">{meta.summary}</p>
        )}

        {/* Quick Stats */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <span>📅 {new Date(meta.date).toLocaleDateString()}</span>
          {meta.creation?.time_spent && (
            <span>⏱️ {meta.creation.time_spent}</span>
          )}
          {meta.creation?.budget && (
            <span>💰 {meta.creation.budget}</span>
          )}
          {meta.collaborators && meta.collaborators.length > 0 && (
            <span>👥 {meta.collaborators.length} collaborator{meta.collaborators.length > 1 ? 's' : ''}</span>
          )}
        </div>
      </div>

      {/* Hero Media */}
      {meta.hero_media && (
        <div className="mb-8">
          {meta.hero_media.video ? (
            <div className="aspect-video">
              <iframe
                src={meta.hero_media.video}
                className="w-full h-full rounded-lg"
                allowFullScreen
                title={meta.title}
              />
            </div>
          ) : meta.hero_media.image ? (
            <img 
              src={meta.hero_media.image}
              alt={meta.hero_media.alt_text || meta.title}
              className="w-full h-96 object-cover rounded-lg"
            />
          ) : null}
        </div>
      )}

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="prose max-w-none mb-8">
            <MDXRemote source={content} components={components} />
          </div>

          {/* Gallery */}
          {meta.gallery && meta.gallery.length > 0 && (
            <div className="mb-8">
              <h3 className="text-2xl font-semibold mb-4">📸 Gallery</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {meta.gallery.map((item: any, index: number) => (
                  <div key={index} className="group">
                    <img 
                      src={item.image}
                      alt={item.caption || `Gallery image ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg group-hover:scale-105 transition-transform"
                    />
                    {item.caption && (
                      <p className="text-sm text-gray-600 mt-2">{item.caption}</p>
                    )}
                    {item.credit && (
                      <p className="text-xs text-gray-500">Credit: {item.credit}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Videos */}
          {meta.videos && meta.videos.length > 0 && (
            <div className="mb-8">
              <h3 className="text-2xl font-semibold mb-4">🎬 Videos</h3>
              <div className="space-y-6">
                {meta.videos.map((video: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">{video.title}</h4>
                    {video.description && (
                      <p className="text-gray-600 text-sm mb-3">{video.description}</p>
                    )}
                    <div className="aspect-video mb-2">
                      <iframe
                        src={video.url}
                        className="w-full h-full rounded"
                        allowFullScreen
                        title={video.title}
                      />
                    </div>
                    {video.duration && (
                      <p className="text-xs text-gray-500">Duration: {video.duration}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Elements */}
          {meta.interactive && (
            <div className="mb-8">
              <h3 className="text-2xl font-semibold mb-4">🎮 Interactive</h3>
              
              {/* Poll */}
              {meta.interactive.poll && (
                <div className="border rounded-lg p-4 mb-4">
                  <h4 className="font-medium mb-3">{meta.interactive.poll.question}</h4>
                  <div className="space-y-2">
                    {meta.interactive.poll.options?.map((option: string, index: number) => (
                      <button 
                        key={index}
                        className="w-full text-left p-2 border rounded hover:bg-gray-50 transition-colors"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Embeds */}
              {meta.interactive.embeds && meta.interactive.embeds.length > 0 && (
                <div className="space-y-4">
                  {meta.interactive.embeds.map((embed: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2 capitalize">{embed.type} Embed</h4>
                      <div dangerouslySetInnerHTML={{ __html: embed.code }} />
                    </div>
                  ))}
                </div>
              )}

              {/* CTA */}
              {meta.interactive.cta && (
                <div className="text-center mt-6">
                  <a 
                    href={meta.interactive.cta.link}
                    className={`inline-block px-6 py-3 rounded-lg font-medium transition-colors ${
                      meta.interactive.cta.style === 'primary' 
                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                        : meta.interactive.cta.style === 'secondary'
                        ? 'bg-gray-600 text-white hover:bg-gray-700'
                        : 'border border-purple-600 text-purple-600 hover:bg-purple-50'
                    }`}
                  >
                    {meta.interactive.cta.text}
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Discussion Questions */}
          {meta.interaction?.questions && meta.interaction.questions.length > 0 && (
            <div className="mb-8">
              <h3 className="text-2xl font-semibold mb-4">💭 Discussion</h3>
              <div className="space-y-3">
                {meta.interaction.questions.map((question: string, index: number) => (
                  <div key={index} className="border-l-4 border-purple-500 pl-4 py-2">
                    <p className="text-gray-700">{question}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Challenge */}
          {meta.interaction?.challenge && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
              <h3 className="text-xl font-semibold mb-2">🎯 Challenge</h3>
              <p className="text-gray-700">{meta.interaction.challenge}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Creation Details */}
          {meta.creation && (
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-4">🛠️ Creation Details</h3>
              
              <div className="space-y-3 text-sm">
                {meta.creation.tools && meta.creation.tools.length > 0 && (
                  <div>
                    <span className="font-medium">Tools Used:</span>
                    <ul className="list-disc list-inside text-gray-600 mt-1">
                      {meta.creation.tools.map((tool: string, index: number) => (
                        <li key={index}>{tool}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {meta.creation.time_spent && (
                  <div>
                    <span className="font-medium">Time Spent:</span>
                    <span className="text-gray-600 ml-2">{meta.creation.time_spent}</span>
                  </div>
                )}
                
                {meta.creation.budget && (
                  <div>
                    <span className="font-medium">Budget:</span>
                    <span className="text-gray-600 ml-2">{meta.creation.budget}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Collaborators */}
          {meta.collaborators && meta.collaborators.length > 0 && (
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-4">👥 Collaborators</h3>
              <div className="space-y-3">
                {meta.collaborators.map((collab: any, index: number) => (
                  <div key={index} className="text-sm">
                    <div className="font-medium">{collab.name}</div>
                    <div className="text-gray-600">{collab.role}</div>
                    {collab.link && (
                      <a 
                        href={collab.link}
                        className="text-purple-600 hover:text-purple-800"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Visit Profile →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Posts */}
          {meta.related_posts && meta.related_posts.length > 0 && (
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-4">🔗 Related</h3>
              <div className="space-y-3">
                {meta.related_posts.map((post: any, index: number) => (
                  <div key={index} className="text-sm">
                    <a 
                      href={post.url}
                      className="font-medium text-purple-600 hover:text-purple-800"
                    >
                      {post.title}
                    </a>
                    <div className="text-gray-600 capitalize">{post.relationship}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {meta.tags && meta.tags.length > 0 && (
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-4">🏷️ Tags</h3>
              <div className="flex flex-wrap gap-2">
                {meta.tags.map((tag: string, index: number) => (
                  <span 
                    key={index}
                    className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
