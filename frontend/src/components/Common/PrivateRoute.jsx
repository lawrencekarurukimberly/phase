// frontend/src/components/Common/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Ensure correct path
import LoadingSpinner from './LoadingSpinner';

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { currentUser, userProfile, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen />; // Show a full-screen loading spinner while checking auth status
  }

  // If not authenticated by Firebase, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // If Firebase authenticated but user profile (role) is still loading from backend
  // This can happen briefly if the backend profile fetch is slow.
  if (currentUser && !userProfile) {
    return <LoadingSpinner fullScreen />;
  }

  // If authenticated and profile loaded, check roles if specified
  if (allowedRoles.length > 0 && !allowedRoles.includes(userProfile?.role)) {
    // If user doesn't have the required role, redirect to home or an unauthorized page
    console.warn(`User ${userProfile?.email} with role ${userProfile?.role} attempted to access restricted route. Redirecting.`);
    return <Navigate to="/" replace />; // Or a dedicated /unauthorized page
  }

  // If all checks pass, render the children (the protected component)
  return children;
};

export default PrivateRoute;