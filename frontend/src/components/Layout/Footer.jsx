// frontend/src/components/Layout/Footer.jsx
import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-800  p-6 mt-12 border-t border-gray-700"> {/* Increased padding, added top border */}
      <div className="container mx-auto text-center text-sm">
        <p className="mb-2">&copy; {new Date().getFullYear()} PetPals. All rights reserved.</p>
        <nav className="space-x-4">
          <a href="#" className="hover:text-blue-400 transition-colors duration-200">Privacy Policy</a>
          <a href="#" className="hover:text-blue-400 transition-colors duration-200">Terms of Service</a>
          <a href="#" className="hover:text-blue-400 transition-colors duration-200">Contact Us</a>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;