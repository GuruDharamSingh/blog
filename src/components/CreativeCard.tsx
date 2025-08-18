'use client';

interface CreativeCardProps {
  creative: {
    slug: string;
    title: string;
    date: string;
    creative_type?: string;
    summary?: string;
    hero_media?: {
      image?: string;
      video?: string;
      alt_text?: string;
    };
    gallery?: Array<{
      image: string;
      caption?: string;
    }>;
    collaborators?: Array<{
      name: string;
      role: string;
    }>;
    creation?: {
      tools?: string[];
      difficulty?: string;
      time_spent?: string;
    };
    tags?: string[];
  };
}

export default function CreativeCard({ creative }: CreativeCardProps) {
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

  const heroImage = creative.hero_media?.image || creative.gallery?.[0]?.image;
  const hasVideo = creative.hero_media?.video;

  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white">
      {/* Hero Media Section */}
      <div className="relative">
        {heroImage && (
          <img 
            src={heroImage}
            alt={creative.hero_media?.alt_text || creative.title}
            className="w-full h-48 object-cover"
          />
        )}
        
        {hasVideo && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs flex items-center space-x-1">
            <span>🎬</span>
            <span>Video</span>
          </div>
        )}

        {creative.gallery && creative.gallery.length > 1 && (
          <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs flex items-center space-x-1">
            <span>📷</span>
            <span>{creative.gallery.length}</span>
          </div>
        )}
      </div>

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{getCreativeIcon(creative.creative_type)}</span>
            <span className="text-sm font-medium text-gray-600 capitalize">
              {creative.creative_type?.replace('_', ' ') || 'Creative'}
            </span>
          </div>
          
          {creative.creation?.difficulty && (
            <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(creative.creation.difficulty)}`}>
              {creative.creation.difficulty}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-lg mb-2 hover:text-purple-600">
          <a href={`/creative/${creative.slug}`}>
            {creative.title}
          </a>
        </h3>

        {/* Summary */}
        {creative.summary && (
          <p className="text-gray-700 text-sm mb-3 line-clamp-2">
            {creative.summary}
          </p>
        )}

        {/* Meta Information */}
        <div className="space-y-2 text-xs text-gray-600 mb-3">
          {creative.creation?.time_spent && (
            <div className="flex items-center space-x-2">
              <span>⏱️</span>
              <span>Time: {creative.creation.time_spent}</span>
            </div>
          )}
          
          {creative.creation?.tools && creative.creation.tools.length > 0 && (
            <div className="flex items-center space-x-2">
              <span>🛠️</span>
              <span>Tools: {creative.creation.tools.slice(0, 2).join(', ')}{creative.creation.tools.length > 2 ? '...' : ''}</span>
            </div>
          )}
          
          {creative.collaborators && creative.collaborators.length > 0 && (
            <div className="flex items-center space-x-2">
              <span>👥</span>
              <span>With: {creative.collaborators.map(c => c.name).join(', ')}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {creative.tags && creative.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {creative.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
            {creative.tags.length > 3 && (
              <span className="text-xs text-gray-500">
                +{creative.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {new Date(creative.date).toLocaleDateString()}
          </span>
          
          <a 
            href={`/creative/${creative.slug}`}
            className="text-purple-600 hover:text-purple-800 text-sm font-medium"
          >
            Explore →
          </a>
        </div>
      </div>
    </div>
  );
}
