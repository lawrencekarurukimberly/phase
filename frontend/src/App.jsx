import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PetDetailsPage from './pages/PetDetailsPage';
import ApplyPage from './pages/ApplyPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import PrivateRoute from './components/Common/PrivateRoute';
import { useAuth } from './context/AuthContext';
import LoadingSpinner from './components/Common/LoadingSpinner';
import AddPetForm from './pages/AddPetForm';
import './pages/HomePage.css';

function App() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/pets/:id" element={<PetDetailsPage />} />

            {/* Public routes accessible only if NOT logged in */}
            <Route
              path="/login"
              element={currentUser ? <Navigate to="/" replace /> : <LoginPage />}
            />
            <Route
              path="/register"
              element={currentUser ? <Navigate to="/" replace /> : <RegisterPage />}
            />

            {/* Protected routes */}
            <Route
              path="/pets/:id/apply"
              element={
                <PrivateRoute allowedRoles={['adopter']}>
                  <ApplyPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute allowedRoles={['shelter']}>
                  <DashboardPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/add-pet"
              element={
                <PrivateRoute allowedRoles={['shelter']}>
                  <AddPetForm />
                </PrivateRoute>
              }
            />

            {/* Catch-all route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;