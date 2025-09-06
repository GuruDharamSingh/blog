import { notFound } from 'next/navigation';
import { getPostBySlug, getAllEventsMeta } from '@/lib/posts';
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

interface EventPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const events = getAllEventsMeta();
  return events.map((event) => ({
    slug: event.slug,
  }));
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;
  const event = getPostBySlug(slug, 'event');
  
  if (!event) {
    notFound();
  }

  const { meta, content } = event;
  const eventDate = new Date(meta.event_date || meta.date);
  const isUpcoming = eventDate > new Date();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className={`border rounded-lg p-6 mb-8 ${
        isUpcoming ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-gray-50'
      }`}>
        <div className="flex items-center space-x-3 mb-4">
          <span className="text-2xl">{getEventIcon(meta.event_type)}</span>
          <div>
            <span className="text-sm font-medium text-gray-600 capitalize">
              {meta.event_type?.replace('_', ' ') || 'Event'}
            </span>
            {isUpcoming && (
              <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                Upcoming
              </span>
            )}
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">{meta.title}</h1>
        
        {meta.summary && (
          <p className="text-lg text-gray-700 mb-4">{meta.summary}</p>
        )}
      </div>

      {/* Event Details */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2">
          {meta.featured_image && (
            <img 
              src={meta.featured_image} 
              alt={meta.title}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
          )}
          
          <div className="prose max-w-none">
            <MDXRemote source={content} components={components} />
          </div>

          {/* Agenda */}
          {meta.agenda && meta.agenda.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">📋 Agenda</h3>
              <div className="space-y-3">
                {meta.agenda.map((item: any, index: number) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{item.topic}</h4>
                        {item.speaker && (
                          <p className="text-sm text-gray-600">Led by: {item.speaker}</p>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">{item.duration}min</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Requirements */}
          {meta.requirements && meta.requirements.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">🎒 What to Bring</h3>
              <ul className="list-disc list-inside space-y-1">
                {meta.requirements.map((item: string, index: number) => (
                  <li key={index} className="text-gray-700">{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Prep Materials */}
          {meta.prep_materials && meta.prep_materials.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">📚 Preparation Materials</h3>
              <div className="space-y-2">
                {meta.prep_materials.map((material: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <h4 className="font-medium">{material.name}</h4>
                      {material.required && (
                        <span className="text-xs text-red-600">Required</span>
                      )}
                    </div>
                    {material.link && (
                      <a 
                        href={material.link}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Event Info */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-4">Event Details</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <span>🗓️</span>
                <div>
                  <div className="font-medium">{formatDate(eventDate)}</div>
                  {meta.timezone && (
                    <div className="text-gray-600">{meta.timezone}</div>
                  )}
                </div>
              </div>
              
              {meta.duration && (
                <div className="flex items-center space-x-2">
                  <span>⏱️</span>
                  <span>{meta.duration} minutes</span>
                </div>
              )}
              
              <div className="flex items-start space-x-2">
                <span>{getLocationIcon(meta.location_type)}</span>
                <div>
                  <div className="font-medium capitalize">
                    {meta.location_type?.replace('_', ' ') || 'Location TBD'}
                  </div>
                  {meta.location?.address && (
                    <div className="text-gray-600">{meta.location.address}</div>
                  )}
                  {meta.location?.virtual_link && (
                    <a 
                      href={meta.location.virtual_link}
                      className="text-blue-600 hover:text-blue-800"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Join Virtual Meeting
                    </a>
                  )}
                  {meta.location?.access_code && (
                    <div className="text-gray-600">Code: {meta.location.access_code}</div>
                  )}
                  {meta.location?.instructions && (
                    <div className="text-gray-600 text-xs mt-1">
                      {meta.location.instructions}
                    </div>
                  )}
                </div>
              </div>

              {meta.max_capacity && (
                <div className="flex items-center space-x-2">
                  <span>👥</span>
                  <span>Max {meta.max_capacity} attendees</span>
                </div>
              )}
            </div>
          </div>

          {/* RSVP Section */}
          {meta.rsvp_required && isUpcoming && (
            <div className="border rounded-lg p-4 bg-blue-50">
              <h3 className="font-semibold mb-4">🎯 RSVP Required</h3>
              
              {meta.rsvp_contact?.form_link ? (
                <a 
                  href={meta.rsvp_contact.form_link}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors block text-center"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  RSVP Now
                </a>
              ) : (
                <div className="space-y-2 text-sm">
                  {meta.rsvp_contact?.email && (
                    <div>
                      <span className="font-medium">Email:</span>{' '}
                      <a href={`mailto:${meta.rsvp_contact.email}`} className="text-blue-600">
                        {meta.rsvp_contact.email}
                      </a>
                    </div>
                  )}
                  {meta.rsvp_contact?.phone && (
                    <div>
                      <span className="font-medium">Phone:</span>{' '}
                      <a href={`tel:${meta.rsvp_contact.phone}`} className="text-blue-600">
                        {meta.rsvp_contact.phone}
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Organizer */}
          {meta.organizer && (
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-4">👨‍💼 Organizer</h3>
              <div className="text-sm">
                <div className="font-medium">{meta.organizer.name}</div>
                {meta.organizer.email && (
                  <a href={`mailto:${meta.organizer.email}`} className="text-blue-600">
                    {meta.organizer.email}
                  </a>
                )}
                {meta.organizer.bio && (
                  <p className="text-gray-600 mt-2">{meta.organizer.bio}</p>
                )}
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
                    className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
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
