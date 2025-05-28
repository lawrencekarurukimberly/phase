// frontend/src/pages/NotFoundPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)] text-center bg-gray-50">
      <h1 className="text-9xl font-extrabold text-gray-700">404</h1>
      <p className="text-2xl md:text-3xl font-light leading-normal mb-8">
        Sorry, the page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="px-6 py-3 text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-300"
      >
        Go Home
      </Link>
    </div>
  );
}

export default NotFoundPage;