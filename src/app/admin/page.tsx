"use client";

export default function AdminPage() {
  return (
    <div className="max-w-md mx-auto px-6 py-12 text-center">
      <h1 className="text-2xl font-light mb-6">CMS Access</h1>
      <p className="text-gray-400 mb-6">Click below to access the Decap CMS interface:</p>
      
      <a 
        href="/admin/"
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded transition-colors"
      >
        Open Decap CMS
      </a>
      
      <p className="text-sm text-gray-500 mt-6">
        This will take you to the content management system where you can create and edit posts.
      </p>
    </div>
  );
}
