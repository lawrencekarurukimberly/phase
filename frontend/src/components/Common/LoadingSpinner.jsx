// frontend/src/components/Common/LoadingSpinner.jsx
import React from 'react';

function LoadingSpinner({ fullScreen = false }) {
  const spinnerClass = "animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500";
  const containerClass = fullScreen
    ? "fixed inset-0 flex justify-center items-center bg-gray-200 bg-opacity-75 z-50"
    : "flex justify-center items-center py-8";

  return (
    <div className={containerClass}>
      <div className={spinnerClass}></div>
      {fullScreen && <p className="ml-4 text-lg text-gray-700">Loading...</p>}
    </div>
  );
}

export default LoadingSpinner;