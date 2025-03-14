
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-app-blue">404</h1>
        <p className="text-2xl font-medium text-gray-700 mb-6">Page Not Found</p>
        <p className="text-gray-500 mb-8">The page you are looking for doesn't exist or has been moved.</p>
        <Link to="/" className="px-6 py-3 bg-app-blue text-white rounded-lg font-medium hover:bg-blue-600 transition-colors">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
