// frontend/src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    if (result.success) {
      // AuthContext's onAuthStateChanged will handle profile fetch and redirect
      // For now, just navigate to home, the PrivateRoute will handle actual access
      navigate('/');
    } else {
      setError(result.error || 'Failed to log in. Please check your credentials.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900 flex justify-center items-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -right-4 w-96 h-96 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 -left-8 w-80 h-80 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-20 animate-bounce" style={{animationDuration: '3s'}}></div>
        <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full opacity-20 animate-ping" style={{animationDuration: '4s'}}></div>
      </div>

      <div className="bg-white/95 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-md relative z-10 transform hover:scale-105 transition-all duration-500 border border-white/20">
        {/* Header with animated icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mb-4 animate-pulse">
            <span className="text-2xl">🐕</span>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="text-gray-600 mt-2">Sign in to your PetPals account</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg animate-shake">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="group">
            <label className="block text-gray-700 text-sm font-semibold mb-2 group-focus-within:text-emerald-600 transition-colors duration-300" htmlFor="email">
              Email Address
            </label>
            <input
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300 bg-gray-50 focus:bg-white transform focus:scale-105"
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="group">
            <label className="block text-gray-700 text-sm font-semibold mb-2 group-focus-within:text-emerald-600 transition-colors duration-300" htmlFor="password">
              Password
            </label>
            <input
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300 bg-gray-50 focus:bg-white transform focus:scale-105"
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
            type="submit"
            disabled={loading}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-teal-600 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="relative z-10 flex items-center justify-center">
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </span>
          </button>

          <div className="text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 hover:underline"
              >
                Create Account
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

export default LoginPage;