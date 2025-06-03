// frontend/src/components/Layout/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Ensure this path is correct based on your file structure

function Header() {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    // Assuming logout function from useAuth handles success/failure internally
    await logout();
    navigate('/login'); // Redirect to login after logout
    // No need for result.success check here if logout always navigates or handles errors gracefully internally
  };

  return (
    <header className="bg-blue-700  p-4 shadow-lg sticky top-0 z-40"> {/* Darker blue, stronger shadow, sticky */}
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-3xl font-extrabold tracking-wide"> {/* Larger, bolder title */}
          PetPals
        </Link>
        <nav className="flex items-center space-x-6"> {/* Use flex and space-x for better alignment */}
          <li> {/* Wrap Home link in li for consistent styling if needed */}
            <Link to="/" className="bg-blue-800 hover:bg-blue-900  font-semibold px-4 py-2 rounded-md transition-colors duration-200 shadow-md"> {/* Larger text, smoother transition */}
              Home
            </Link>
          </li>
          {currentUser && userProfile?.role === 'shelter' && (
            <li> {/* Wrap Dashboard link in li */}
              <Link to="/dashboard" className="text-lg hover:text-blue-200 transition-colors duration-200">
                Dashboard
              </Link>
            </li>
          )}
          {/* --- THIS IS THE 'ADD NEW PET' LINK YOU NEED --- */}
          {currentUser && userProfile?.role === 'shelter' && ( // Only show if logged in AND is a shelter
            <li>
              <Link
                to="/add-pet"
                className="bg-blue-800 hover:bg-blue-900  font-semibold px-4 py-2 rounded-md transition-colors duration-200 shadow-md"
              >
                Add New Pet
              </Link>
            </li>
          )}
          {/* --- END OF 'ADD NEW PET' LINK --- */}
          {currentUser ? (
            <>
              <span className="text-md font-medium text-blue-100"> {/* Adjusted text size and color */}
                Welcome, {userProfile?.name || currentUser.email.split('@')[0]}! {/* Display name or part of email */}
              </span>
              <button
                onClick={handleLogout}
                className="bg-blue-800 hover:bg-blue-900  font-semibold px-4 py-2 rounded-md transition-colors duration-200 shadow-md"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <li> {/* Wrap Login link in li */}
                <Link to="/login" className="bg-blue-800 hover:bg-blue-900  font-semibold px-4 py-2 rounded-md transition-colors duration-200 shadow-md">
                  Login
                </Link>
              </li>
              <li> {/* Wrap Sign Up link in li */}
                <Link
                  to="/register"
                  className="bg-blue-800 hover:bg-blue-900  font-semibold px-4 py-2 rounded-md transition-colors duration-200 shadow-md"
                >
                  Sign Up
                </Link>
              </li>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;