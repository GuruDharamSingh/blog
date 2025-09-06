"use client";
import Link from "next/link";
import { useState } from "react";

export default function PrivatePage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "agreenhouse") {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password");
      setPassword("");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-6 py-12">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
          <h1 className="text-2xl font-light mb-6 text-center">Private Access</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm text-gray-400 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-black border border-gray-700 rounded focus:border-gray-500 focus:outline-none text-white"
                placeholder="Enter password"
                autoFocus
              />
            </div>
            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}
            <button
              type="submit"
              className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded transition-colors border border-gray-700"
            >
              Access Private Area
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-light mb-4">Private Dashboard</h1>
        <p className="text-gray-400">Content management and administration</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
        <Link 
          href="/editor"
          className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors group"
        >
          <h2 className="text-xl font-medium mb-2 group-hover:text-gray-300">✏️ Mobile Editor</h2>
          <p className="text-gray-400 text-sm mb-4">
            Clean, mobile-friendly MDX editor for quick posting
          </p>
          <span className="text-emerald-400 text-sm">Write Post →</span>
        </Link>

        {/* CMS removed; keeping a card pointing to Mobile Editor instead */}
        <Link 
          href="/editor"
          className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors group"
        >
          <h2 className="text-xl font-medium mb-2 group-hover:text-gray-300">Mobile Editor</h2>
          <p className="text-gray-400 text-sm mb-4">
            Create and edit posts using the built-in MDX editor
          </p>
          <span className="text-emerald-400 text-sm">Open Editor →</span>
        </Link>

        <Link 
          href="/dashboard"
          className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors group"
        >
          <h2 className="text-xl font-medium mb-2 group-hover:text-gray-300">App Dashboard</h2>
          <p className="text-gray-400 text-sm mb-4">
            Custom dashboard with full content management
          </p>
          <span className="text-green-400 text-sm">Open Dashboard →</span>
        </Link>
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={() => setIsAuthenticated(false)}
          className="text-gray-500 hover:text-gray-300 text-sm border-b border-transparent hover:border-gray-600 transition-all"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
