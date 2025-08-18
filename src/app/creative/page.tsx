import { getAllCreativeMeta } from '@/lib/posts';
import CreativeCard from '@/components/CreativeCard';

export default function CreativePage() {
  const allCreative = getAllCreativeMeta();
  
  // Group by creative type
  const creativeByType = allCreative.reduce((acc, item) => {
    const type = item.creative_type || 'mixed_media';
    if (!acc[type]) acc[type] = [];
    acc[type].push(item);
    return acc;
  }, {} as Record<string, typeof allCreative>);

  const getTypeInfo = (type: string) => {
    switch (type) {
      case 'photo_story': return { icon: '📸', name: 'Photo Stories', description: 'Visual narratives and photography projects' };
      case 'video_showcase': return { icon: '🎬', name: 'Video Showcases', description: 'Video content and multimedia presentations' };
      case 'art_project': return { icon: '🎨', name: 'Art Projects', description: 'Creative artwork and artistic endeavors' };
      case 'music_audio': return { icon: '🎵', name: 'Music & Audio', description: 'Musical compositions and audio projects' };
      case 'creative_writing': return { icon: '📝', name: 'Creative Writing', description: 'Stories, poetry, and literary works' };
      case 'project_showcase': return { icon: '💡', name: 'Project Showcases', description: 'Technical and creative project demonstrations' };
      default: return { icon: '🔗', name: 'Mixed Media', description: 'Multi-format creative content' };
    }
  };

  const featuredCreative = allCreative.filter(item => item.featured);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">🎨 Creative Works</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Explore my creative projects, artistic endeavors, and multimedia content. 
          From photography and video to interactive experiences and collaborative works.
        </p>
      </div>

      {/* Featured Creative */}
      {featuredCreative.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">⭐ Featured</h2>
            <span className="bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full">
              {featuredCreative.length} featured
            </span>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCreative.map((creative) => (
              <CreativeCard key={creative.slug} creative={creative} />
            ))}
          </div>
        </section>
      )}

      {/* Creative by Type */}
      {Object.keys(creativeByType).length > 0 ? (
        <div className="space-y-12">
          {Object.entries(creativeByType).map(([type, items]) => {
            const typeInfo = getTypeInfo(type);
            return (
              <section key={type}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{typeInfo.icon}</span>
                    <div>
                      <h2 className="text-2xl font-semibold">{typeInfo.name}</h2>
                      <p className="text-gray-600 text-sm">{typeInfo.description}</p>
                    </div>
                  </div>
                  <span className="text-gray-600 text-sm">
                    {items.length} item{items.length !== 1 ? 's' : ''}
                  </span>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((creative) => (
                    <CreativeCard key={creative.slug} creative={creative} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎨</div>
          <h3 className="text-xl font-semibold mb-2">No Creative Works Yet</h3>
          <p className="text-gray-600 mb-6">
            Creative projects and artistic works will appear here once they're created.
          </p>
          <a 
            href="/admin"
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Create First Creative Work
          </a>
        </div>
      )}

      {/* Creative Stats */}
      {allCreative.length > 0 && (
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-600">{allCreative.length}</div>
            <div className="text-sm text-gray-600">Total Works</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">
              {allCreative.filter(c => c.creative_type === 'photo_story').length}
            </div>
            <div className="text-sm text-gray-600">Photo Stories</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">
              {allCreative.filter(c => c.creative_type === 'video_showcase').length}
            </div>
            <div className="text-sm text-gray-600">Videos</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-orange-600">
              {allCreative.filter(c => c.creative_type === 'project_showcase').length}
            </div>
            <div className="text-sm text-gray-600">Projects</div>
          </div>
        </div>
      )}

      {/* Creative Types Guide */}
      <div className="mt-12 bg-gray-50 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">🎯 Creative Content Types</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          {[
            'photo_story', 'video_showcase', 'art_project', 
            'music_audio', 'creative_writing', 'project_showcase'
          ].map(type => {
            const info = getTypeInfo(type);
            return (
              <div key={type} className="flex items-center space-x-3 p-3 bg-white rounded">
                <span className="text-xl">{info.icon}</span>
                <div>
                  <div className="font-medium">{info.name}</div>
                  <div className="text-gray-600 text-xs">{info.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
