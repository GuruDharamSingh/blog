export default function AdminPage() {
  return (
    <div className="mx-auto max-w-3xl py-12 px-4 space-y-4">
      <h1 className="text-2xl font-bold">Blog Admin</h1>
      <p>Go to <a href="/admin/" className="text-blue-600 underline">/admin/</a> to access the Decap CMS interface.</p>
      <script dangerouslySetInnerHTML={{
        __html: `
          if (typeof window !== 'undefined') {
            window.location.href = '/admin/';
          }
        `
      }} />
    </div>
  );
}
