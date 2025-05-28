// frontend/src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('adopter'); // Default role
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await register(email, password, name, role);
    if (result.success) {
      // AuthContext's onAuthStateChanged will handle profile fetch and redirect
      navigate('/');
    } else {
      setError(result.error || 'Failed to register. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-800 to-indigo-900 flex justify-center items-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-96 h-96 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 -right-8 w-80 h-80 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full opacity-20 animate-bounce" style={{animationDuration: '3s'}}></div>
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-20 animate-ping" style={{animationDuration: '4s'}}></div>
      </div>

      <div className="bg-white/95 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-md relative z-10 transform hover:scale-105 transition-all duration-500 border border-white/20">
        {/* Header with animated icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4 animate-spin" style={{animationDuration: '3s'}}>
            <span className="text-2xl">🐾</span>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Join PetPals
          </h2>
          <p className="text-gray-600 mt-2">Find your perfect companion</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg animate-shake">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="group">
            <label className="block text-gray-700 text-sm font-semibold mb-2 group-focus-within:text-purple-600 transition-colors duration-300" htmlFor="name">
              Your Name
            </label>
            <input
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 bg-gray-50 focus:bg-white transform focus:scale-105"
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="group">
            <label className="block text-gray-700 text-sm font-semibold mb-2 group-focus-within:text-purple-600 transition-colors duration-300" htmlFor="email">
              Email Address
            </label>
            <input
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 bg-gray-50 focus:bg-white transform focus:scale-105"
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="group">
            <label className="block text-gray-700 text-sm font-semibold mb-2 group-focus-within:text-purple-600 transition-colors duration-300" htmlFor="password">
              Password
            </label>
            <input
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 bg-gray-50 focus:bg-white transform focus:scale-105"
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="group">
            <label className="block text-gray-700 text-sm font-semibold mb-2 group-focus-within:text-purple-600 transition-colors duration-300" htmlFor="role">
              I am a:
            </label>
            <select
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 bg-gray-50 focus:bg-white transform focus:scale-105"
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="adopter">🏠 Adopter (looking for a pet)</option>
              <option value="shelter">🏢 Shelter/Rescue (listing pets)</option>
            </select>
          </div>

          <button
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
            type="submit"
            disabled={loading}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="relative z-10 flex items-center justify-center">
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </span>
          </button>

          <div className="text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}

export default RegisterPage;