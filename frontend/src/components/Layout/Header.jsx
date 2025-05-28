// frontend/src/components/Layout/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Header() {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate('/login'); // Redirect to login after logout
    } else {
      alert(result.error); // Show error if logout failed
    }
  };

  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          PetPals
        </Link>
        <nav className="space-x-4">
          <Link to="/" className="hover:text-blue-200 transition-colors">
            Home
          </Link>
          {currentUser && userProfile?.role === 'shelter' && (
            <Link to="/dashboard" className="hover:text-blue-200 transition-colors">
              Dashboard
            </Link>
          )}
          {currentUser ? (
            <>
              <span className="text-sm">Welcome, {userProfile?.name || currentUser.email}!</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-200 transition-colors">
                Login
              </Link>
              <Link to="/register" className="bg-blue-800 hover:bg-blue-700 px-3 py-1 rounded transition-colors">
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;