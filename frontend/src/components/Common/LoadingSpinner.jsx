// frontend/src/components/Common/LoadingSpinner.jsx
import React from 'react';

function LoadingSpinner({ fullScreen = false }) {
  const spinnerClass = "animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"; // Increased border for prominence
  const containerClass = fullScreen
    ? "fixed inset-0 flex flex-col justify-center items-center bg-gray-100 bg-opacity-90 z-50 transition-opacity duration-300 ease-in-out" // Added opacity and transition for smoother appearance
    : "flex justify-center items-center py-8";

  return (
    <div className={containerClass}>
      <div className={spinnerClass}></div>
      {fullScreen && <p className="mt-4 text-xl font-semibold text-gray-700">Loading...</p>} {/* Larger text for full screen */}
    </div>
  );
}

export default LoadingSpinner;
