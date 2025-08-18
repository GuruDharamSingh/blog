import { getAllEventsMeta, getUpcomingEvents } from '@/lib/posts';
import EventCard from '@/components/EventCard';

export default function EventsPage() {
  const allEvents = getAllEventsMeta();
  const upcomingEvents = getUpcomingEvents();
  const pastEvents = allEvents.filter(event => {
    const eventDate = new Date(event.event_date || event.date);
    return eventDate < new Date();
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">📅 Events & Meetings</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Join me for meetings, workshops, social events, and community gatherings. 
          Stay updated on upcoming events and explore past event summaries.
        </p>
      </div>

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">🎯 Upcoming Events</h2>
            <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
              {upcomingEvents.length} upcoming
            </span>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <EventCard key={event.slug} event={event} />
            ))}
          </div>
        </section>
      )}

      {/* All Events */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">
            {upcomingEvents.length > 0 ? '📚 All Events' : '📋 Recent Events'}
          </h2>
          <span className="text-gray-600 text-sm">
            {allEvents.length} total event{allEvents.length !== 1 ? 's' : ''}
          </span>
        </div>
        
        {allEvents.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allEvents.map((event) => (
              <EventCard key={event.slug} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold mb-2">No Events Yet</h3>
            <p className="text-gray-600 mb-6">
              Events and meetings will appear here once they're created.
            </p>
            <a 
              href="/admin"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create First Event
            </a>
          </div>
        )}
      </section>

      {/* Quick Stats */}
      {allEvents.length > 0 && (
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">{upcomingEvents.length}</div>
            <div className="text-sm text-gray-600">Upcoming</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-600">{pastEvents.length}</div>
            <div className="text-sm text-gray-600">Past Events</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-600">
              {allEvents.filter(e => e.event_type === 'meeting').length}
            </div>
            <div className="text-sm text-gray-600">Meetings</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">
              {allEvents.filter(e => e.event_type === 'workshop').length}
            </div>
            <div className="text-sm text-gray-600">Workshops</div>
          </div>
        </div>
      )}
    </div>
  );
}
