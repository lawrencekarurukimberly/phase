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
      navigate('/');
    } else {
      setError(result.error || 'Failed to log in. Please check your credentials.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex justify-center items-center p-4 relative overflow-hidden">
      {/* Enhanced animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-80 h-80 bg-gradient-to-r from-violet-500/30 to-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/4 -left-10 w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-bounce" style={{animationDuration: '4s'}}></div>
        <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-gradient-to-r from-pink-500/25 to-rose-500/25 rounded-full blur-3xl animate-ping" style={{animationDuration: '6s'}}></div>
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/40 rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Main login card */}
      <div className="bg-white/1110 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-md relative z-10 border border-white/20 transform hover:scale-[1.02] transition-all duration-700">
        {/* Header with enhanced styling */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 rounded-full mb-6 shadow-lg">
            <div className="w-16 h-16 bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-inner">
              <span className="text-3xl animate-bounce" style={{animationDuration: '2s'}}>🔑</span>
            </div>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text mb-2">
            Welcome Back!
          </h2>
          <p className="text-white/80 text-lg">Sign in to find your perfect companion</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/50 text-red-100 px-4 py-3 rounded-xl relative animate-shake" role="alert">
              <div className="flex items-center">
                <span className="text-red-400 mr-2">⚠️</span>
                <div>
                  <strong className="font-semibold">Error!</strong> {error}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-semibold mb-2">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                className="w-full px-4 py-4 bg-white/10 backdrop-blur-sm border border-blue rounded-xl shadow-lg focus:ring-2 focus:ring-purple-400/50 focus:border-transparent placeholder-white/50 transition-all duration-300 hover:bg-white/15"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                <span className="text-white/1110">📧</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-semibold text-white/0 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                id="password"
                className="w-full px-4 py-4 bg-white/10  rounded-xl shadow-lg focus:ring-2 focus:ring-purple-400/50 focus:border-transparent text-white placeholder-white/50 transition-all duration-300 hover:bg-white/15"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                <span className="text-white/1110">🔒</span>
              </div>
            </div>
          </div>

          <button
            className="w-full bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 hover:from-violet-700 hover:via-purple-700 hover:to-pink-700  font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
            type="submit"
            disabled={loading}
          >
            {/* Button shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            
            <span className="relative z-10 flex items-center justify-center">
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span className="mr-2">✨</span>
                  <span>Sign In</span>
                  <span className="ml-2">🚀</span>
                </>
              )}
            </span>
          </button>

          <div className="text-center pt-4">
            <p className=" text-sm mb-4">
              Don't have an account?
            </p>
            <Link
              to="/register"
              className="inline-flex items-center font-bold  bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text hover:from-violet-300 hover:to-pink-300 transition-all duration-300 text-lg group"
            >
              <span className="mr-2 group-hover:animate-bounce">🌟</span>
              Create Account
              <span className="ml-2 group-hover:animate-bounce">🌟</span>
            </Link>
          </div>
        </form>

        {/* Decorative bottom border */}
        <div className="mt-8 flex justify-center">
          <div className="w-16 h-1 bg-gradient-to-r from-violet-500 to-pink-500 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
