import AdminClient from './AdminClient';

export const metadata = { title: 'Admin - New Post' };

// Force dynamic rendering to avoid Firebase auth init during build
export const dynamic = 'force-dynamic';

export default function AdminPage() {
  return <AdminClient />;
}
