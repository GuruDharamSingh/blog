'use client';

interface EventCardProps {
  event: {
    slug: string;
    title: string;
    event_date?: string;
    event_type?: string;
    location_type?: string;
    summary?: string;
    duration?: number;
    rsvp_required?: boolean;
    max_capacity?: number;
    featured_image?: string;
  };
}

export default function EventCard({ event }: EventCardProps) {
  const eventDate = new Date(event.event_date || Date.now());
  const isUpcoming = eventDate > new Date();
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEventIcon = (type?: string) => {
    switch (type) {
      case 'meeting': return '📋';
      case 'social': return '🎉';
      case 'workshop': return '🎓';
      case 'announcement': return '📢';
      case 'activity': return '🏃';
      default: return '📅';
    }
  };

  const getLocationIcon = (type?: string) => {
    switch (type) {
      case 'in_person': return '🏢';
      case 'virtual': return '💻';
      case 'hybrid': return '🔄';
      default: return '📍';
    }
  };

  return (
    <div className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
      isUpcoming ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
    }`}>
      {event.featured_image && (
        <img 
          src={event.featured_image} 
          alt={event.title}
          className="w-full h-32 object-cover rounded mb-3"
        />
      )}
      
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{getEventIcon(event.event_type)}</span>
          <span className="text-sm font-medium text-gray-600 capitalize">
            {event.event_type?.replace('_', ' ') || 'Event'}
          </span>
        </div>
        {isUpcoming && (
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
            Upcoming
          </span>
        )}
      </div>

      <h3 className="font-semibold text-lg mb-2 hover:text-blue-600">
        <a href={`/events/${event.slug}`}>
          {event.title}
        </a>
      </h3>

      <div className="space-y-1 text-sm text-gray-600 mb-3">
        <div className="flex items-center space-x-2">
          <span>🗓️</span>
          <span>{formatDate(eventDate)}</span>
        </div>
        
        {event.duration && (
          <div className="flex items-center space-x-2">
            <span>⏱️</span>
            <span>{event.duration} minutes</span>
          </div>
        )}
        
        <div className="flex items-center space-x-2">
          <span>{getLocationIcon(event.location_type)}</span>
          <span className="capitalize">
            {event.location_type?.replace('_', ' ') || 'Location TBD'}
          </span>
        </div>

        {event.rsvp_required && (
          <div className="flex items-center space-x-2">
            <span>✉️</span>
            <span>RSVP Required</span>
            {event.max_capacity && (
              <span className="text-xs">
                (Max {event.max_capacity})
              </span>
            )}
          </div>
        )}
      </div>

      {event.summary && (
        <p className="text-gray-700 text-sm mb-3 line-clamp-2">
          {event.summary}
        </p>
      )}

      <div className="flex items-center justify-between">
        <a 
          href={`/events/${event.slug}`}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          View Details →
        </a>
        
        {isUpcoming && event.rsvp_required && (
          <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors">
            RSVP
          </button>
        )}
      </div>
    </div>
  );
}
