// frontend/src/pages/NotFoundPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br-purple-900-blue-800-indigo-900 relative overflow-hidden flex items-center justify-center">
      {/* Dynamic background elements */}
      <div className="absolute inset-0">
        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-cyan-400/30 bg-blue-500/30 rounded-full animate-pulse blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-pink-400/30 bg-purple-500/30 rounded-full animate-bounce" style={{animationDuration: '4s'}}></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-emerald-400/30 bg-teal-500/30 rounded-full animate-ping blur-xl" style={{animationDuration: '6s'}}></div>
        
        {/* Interactive mouse follower */}
        <div 
          className="absolute w-32 h-32 bg-gradient-to-r-white-10-purple-300-20 rounded-full blur-2xl transition-all duration-300 ease-out pointer-events-none"
          style={{
            left: mousePosition.x - 64,
            top: mousePosition.y - 64,
            transform: `scale(${isHovering ? 1.5 : 1})`
          }}
        ></div>

        {/* Floating particles */}
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/40 rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${2 + Math.random() * 4}s`
            }}
          ></div>
        ))}

        {/* Geometric shapes */}
        <div className="absolute top-1/4 right-1/4 w-24 h-24 border-2 border-white/20 rotate-45 animate-spin" style={{animationDuration: '20s'}}></div>
        <div className="absolute bottom-1/3 left-1/3 w-16 h-16 border-2 border-purple-300/30 rotate-12 animate-pulse"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Animated 404 */}
        <div className="mb-12">
          <h1 className="glitch-404-base md-glitch-404-base relative">
            404
            
            {/* Glitch effect overlay */}
            <span className="glitch-404-overlay cyan">
              404
            </span>
            <span className="glitch-404-overlay pink">
              404
            </span>
          </h1>
        </div>

        {/* Cute pet illustration */}
        <div className="mb-12">
          <div className="inline-block relative">
            <div className="text-8xl md-text-9xl animate-bounce" style={{animationDuration: '2s'}}>
              🐕‍🦺
            </div>
            
            {/* Floating hearts around the pet */}
            <div className="absolute -top-4 -left-4 text-2xl animate-pulse text-pink-400">💖</div>
            <div className="absolute -top-2 -right-6 text-xl animate-pulse delay-500 text-red-400">❤️</div>
            <div className="absolute -bottom-4 -left-2 text-lg animate-pulse delay-1000 text-purple-400">💜</div>
            <div className="absolute -bottom-2 -right-4 text-xl animate-pulse delay-1500 text-blue-400">💙</div>
          </div>
        </div>

        {/* Error message */}
        <div className="mb-12 space-y-6">
          <h2 className="text-4xl md-text-6xl font-bold text-white mb-4">
            <span className="inline-block animate-bounce delay-100">O</span>
            <span className="inline-block animate-bounce delay-200">o</span>
            <span className="inline-block animate-bounce delay-300">p</span>
            <span className="inline-block animate-bounce delay-400">s</span>
            <span className="inline-block animate-bounce delay-500">!</span>
          </h2>
          
          <p className="text-xl md-text-2xl text-white/90 font-medium leading-relaxed max-w-2xl mx-auto">
            Looks like this pet ran away! 🏃‍♂️💨<br />
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <p className="text-lg text-white/70 font-medium">
            Don't worry, we'll help you find your way back home! 🏠
          </p>
        </div>

        {/* Interactive buttons */}
        <div className="space-y-6">
          <Link
            to="/" // Use Link for navigation
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className="group relative inline-flex items-center justify-center w-full bg-gradient-to-r-emerald-500-teal-500-cyan-500 text-white font-bold py-4 px-12 rounded-2xl text-xl transition-all duration-500 transform hover-scale-110 hover-shadow-2xl overflow-hidden border-2 border-white/20"
          >
            {/* Button glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r-emerald-400-teal-400-cyan-400 opacity-0 group-hover-opacity-30 blur-xl transition-opacity duration-300"></div>
            
            <div className="relative z-10 flex items-center">
              <span className="mr-3 text-2xl group-hover-animate-bounce">🏠</span>
              <span>Take Me Home</span>
              <span className="ml-3 text-2xl group-hover-animate-bounce delay-100">🐾</span>
            </div>

            {/* Shimmer effect */}
            <div className="absolute inset-0 -top-px bg-gradient-to-r-white-30-transparent skew-x-12 transform translate-x-[-100%] group-hover-translate-x-100 transition-transform duration-1000"></div>
          </Link>

          {/* Alternative navigation options */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {[
              { text: '🔍 Search Pets', action: 'search' },
              { text: '📞 Contact Support', action: 'contact' },
              { text: '📱 Report Issue', action: 'report' }
            ].map((button, index) => (
              <button
                key={index}
                onClick={() => alert(`${button.action} clicked!`)} // Using alert as per original, but consider custom modal
                className="bg-white/10 backdrop-blur-sm hover-bg-white-20 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover-scale-105 border border-white/20 hover-border-white-40"
              >
                {button.text}
              </button>
            ))}
          </div>
        </div>

        {/* Fun facts section */}
        <div className="mt-16 bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20">
          <h3 className="text-2xl font-bold text-white mb-6">
            <span className="mr-3">🎉</span>
            Fun Fact While You're Here!
            <span className="ml-3">🎉</span>
          </h3>
          <div className="grid grid-cols-1 md-grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-500/20 bg-purple-500/20 rounded-2xl border border-white/20">
              <div className="text-4xl mb-3">🐕</div>
              <p className="text-white/90 font-medium">Dogs can learn over 150 words!</p>
            </div>
            <div className="text-center p-4 bg-pink-500/20 bg-red-500/20 rounded-2xl border border-white/20">
              <div className="text-4xl mb-3">🐱</div>
              <p className="text-white/90 font-medium">Cats spend 70% of their lives sleeping!</p>
            </div>
            <div className="text-center p-4 bg-emerald-500/20 bg-teal-500/20 rounded-2xl border border-white/20">
              <div className="text-4xl mb-3">❤️</div>
              <p className="text-white/90 font-medium">Pets can reduce stress by 68%!</p>
            </div>
          </div>
        </div>

        {/* Easter egg */}
        <div className="mt-12 text-center">
          <button
            onClick={() => {
              const pets = ['🐕', '🐱', '🐰', '🐹', '🐦', '🐢'];
              const randomPet = pets[Math.floor(Math.random() * pets.length)];
              alert(`You found a wild ${randomPet}! It's super effective! ✨`); // Using alert as per original
            }}
            className="text-white/50 hover-text-white-80 text-sm font-medium transition-colors duration-300"
          >
            🎮 Click here for a surprise! 🎮
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
