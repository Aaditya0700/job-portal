import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-extrabold text-gray-100 select-none">404</div>
        <div className="-mt-6 relative">
          <h1 className="text-2xl font-bold text-gray-900">Page Not Found</h1>
          <p className="text-gray-500 mt-3">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <Link to="/" className="btn-primary flex items-center justify-center gap-2 px-6 py-2.5">
            <ArrowLeft className="w-4 h-4" /> Go Home
          </Link>
          <Link to="/jobs" className="btn-secondary flex items-center justify-center gap-2 px-6 py-2.5">
            <Search className="w-4 h-4" /> Browse Jobs
          </Link>
        </div>
      </div>
    </div>
  );
}