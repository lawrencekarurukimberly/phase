// frontend/src/pages/HomePage.jsx
import React, { useEffect, useState } from 'react';
import { getPets } from '../api/petpalsApi';
import PetCard from '../components/PetCard';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

// Define the base URL for your static files
const STATIC_FILES_BASE_URL = 'http://127.0.0.1:8000/static';

// Cleaned up featured images with consistent paths
const featuredImages = [
  { src: 'images/pets/5 Ways To Gain The Trust Of Your Cat.jpeg', alt: 'Cat tips: 5 ways to gain trust' },
  { src: 'images/pets/26 Teeny Tiny Puppies Guaranteed To Make You Say _Awww!_.jpeg', alt: 'Cute tiny puppies' },
  { src: 'images/pets/50 Times People Captured Their Cats Losing Their Single Brain Cell (Best Pics) en 2024.jpeg', alt: 'Funny cat moments' },
  { src: 'images/pets/55 Sweet Cat Names from Movies to Inspire You.jpeg', alt: 'Cats and movie names' },
  { src: 'images/pets/124a99b7-1161-4602-9cee-6c167d3ff191.jpeg', alt: 'Adorable pet image' },
  { src: 'images/pets/165cff64-6b7b-4198-a64f-df929d2b4d9a.jpeg', alt: 'Another adorable pet' },
  { src: 'images/pets/Adorable_).jpeg', alt: 'Cute pet smiling' },
  { src: 'images/pets/Blue Fronted Amazon - What You Need To Know About This Pet Bird - PetGuide.jpeg', alt: 'Blue Fronted Amazon parrot' },
];

function HomePage() {
  const { userProfile, loading: authLoading } = useAuth();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [speciesFilter, setSpeciesFilter] = useState('all');
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const fetchPets = async () => {
      setLoading(true);
      setError('');
      try {
        let filters = {};
        if (userProfile?.role === 'adopter' && userProfile?.preferences?.species && userProfile.preferences.species !== 'all') {
          filters.species = userProfile.preferences.species;
          if (speciesFilter === 'all') {
            setSpeciesFilter(userProfile.preferences.species);
          }
        } else {
          if (speciesFilter !== 'all') {
            filters.species = speciesFilter;
          }
        }
        
        const response = await getPets(filters);
        setPets(response.data);
      } catch (error) {
        console.error("Error fetching pets:", error);
        setError('Failed to load pets. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchPets();
  }, [userProfile, speciesFilter]);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const handleImageError = (e) => {
    // Instead of hiding, show a placeholder
    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjOTk5Ij5QZXQgSW1hZ2U8L3RleHQ+PC9zdmc+';
    e.target.alt = 'Pet image not available';
  };

  if (authLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-600 via-indigo-700 to-blue-800 py-24 px-4 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-500"></div>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between relative z-10">
          <div className="text-center lg:text-left mb-12 lg:mb-0 lg:w-1/2 lg:pr-12">
            <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6 animate-fadeInUp">
              🐾 Welcome to PetPals
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-6 animate-fadeInUp delay-100">
              Find Your New
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
                Best Friend
              </span>
              Today!
            </h1>
            <p className="text-xl md:text-2xl font-light mb-10 text-blue-100 animate-fadeInUp delay-200 leading-relaxed">
              Connecting loving homes with adorable pets in need. Every pet deserves a forever home filled with love.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 animate-fadeInUp delay-300">
              <Link
                to="/pets"
                className="group bg-white text-purple-700 font-bold py-4 px-8 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 ease-out text-lg relative overflow-hidden"
              >
                <span className="relative z-10">Browse Pets</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                <span className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 font-bold">
                  Browse Pets
                </span>
              </Link>
              {userProfile?.role === 'shelter' && (
                <Link
                  to="/add-pet"
                  className="group border-2 border-white/50 text-white font-bold py-4 px-8 rounded-2xl shadow-2xl hover:bg-white hover:text-purple-700 transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 ease-out text-lg backdrop-blur-sm bg-white/10"
                >
                  List a Pet
                </Link>
              )}
            </div>
          </div>

          <div className="lg:w-1/2 flex justify-center lg:justify-end animate-fadeInRight">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-400 to-blue-400 rounded-3xl blur-2xl opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <img
                src={`${STATIC_FILES_BASE_URL}/images/pets/1ec33224-0cd7-474f-927d-1249ccb8bb2b.jpeg`}
                alt="A cute pet looking for a home"
                className="relative rounded-3xl shadow-2xl max-w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 border-4 border-white/20"
                style={{ maxHeight: '500px', minHeight: '300px', width: 'auto' }}
                onError={handleImageError}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image Gallery Section */}
      <section className="py-20 px-4 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-purple-50/50"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black  bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-6">
              Meet Our Adorable Pals
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Every pet has a unique personality and story. Browse through our gallery of adorable companions waiting for their forever homes.
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto mt-8 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {featuredImages.map((image, index) => (
              <div 
                key={index} 
                className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl overflow-hidden transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 border border-gray-100"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={`${STATIC_FILES_BASE_URL}/${image.src}`}
                    alt={image.alt}
                    className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={handleImageError}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-6">
                  <p className="text-center text-gray-700 font-medium group-hover:text-purple-600 transition-colors duration-300">
                    {image.alt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pet Listing Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black  bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-6">
              Pets Available For Adoption
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-10">
              Find your perfect companion from our loving selection of pets waiting for their forever homes.
            </p>
          </div>

          <div className="flex justify-center mb-12">
            <div className="relative">
              <select
                value={speciesFilter}
                onChange={(e) => setSpeciesFilter(e.target.value)}
                className="appearance-none bg-white text-gray-800 font-semibold py-4 px-8 pr-12 rounded-2xl shadow-lg border-0 focus:ring-4 focus:ring-purple-500/50 focus:outline-none transition-all duration-300 text-lg min-w-[200px]"
              >
                <option value="all">All Species</option>
                <option value="Dog">Dogs</option>
                <option value="Cat">Cats</option>
                <option value="Other">Other</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg max-w-md mx-auto">
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </div>
          ) : pets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {pets.map((pet) => (
                <PetCard key={pet.id} pet={pet} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-8 rounded-lg max-w-md mx-auto">
                <p className="text-blue-700 text-lg font-medium">No pets found matching your criteria.</p>
                <p className="text-blue-600 mt-2">Try adjusting your filters or check back later!</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-black mb-6">What Our Adopters Say</h2>
          <p className="text-xl text-purple-200 mb-16 max-w-3xl mx-auto">
            Real stories from real families who found their perfect companions through PetPals.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                text: "Finding Luna through PetPals was the easiest and most heartwarming experience. She's brought so much joy into our home and has become the perfect companion for our family adventures!",
                author: "Sarah J.",
                rating: 5
              },
              {
                text: "The PetPals platform made it simple to connect with local shelters. We adopted Max, and he's the perfect addition to our family. The process was smooth and the support was incredible.",
                author: "David L.",
                rating: 5
              },
              {
                text: "Adopting Buddy was the best decision we ever made! He has transformed our lives with his energy and love. Thank you PetPals for making dreams come true!",
                author: "Maria R.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="group bg-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-500 hover:bg-blue/20 border border-/20">
                <div className="text-6xl text-purple-300 mb-4 opacity-50">"</div>
                <p className="italic text-lg mb-6 leading-relaxed text-gray-100">
                  {testimonial.text}
                </p>
                <p className="font-bold text-purple-200 mb-4">- {testimonial.author}</p>
                <div className="flex justify-center text-yellow-400 text-xl">
                  {'⭐'.repeat(testimonial.rating)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-purple-600 via-indigo-700 to-blue-800  relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-600/20 to-blue-600/20"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-black mb-6">
            Stay Updated on New Arrivals
          </h2>
          <p className="text-xl font-medium mb-12 text-blue-100 leading-relaxed">
            Be the first to know when new pets arrive at shelters near you. Never miss a chance to meet your new best friend.
          </p>
          
          {subscribed ? (
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-8 rounded-3xl mb-6 max-w-lg mx-auto shadow-2xl transform animate-fadeInUp">
              <div className="text-4xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold mb-2">Thank you for subscribing!</h3>
              <p className="text-green-100">You'll receive updates about new pets looking for homes.</p>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
              <div className="flex-1 relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full px-8 py-5 rounded-2xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-purple-300 shadow-2xl text-lg font-medium border-0 bg-white/95 backdrop-blur-sm"
                />
              </div>
              <button 
                type="submit"
                className="group bg-white text-purple-700 font-bold py-5 px-10 rounded-2xl shadow-2xl hover:shadow-3xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 text-lg relative overflow-hidden"
              >
                <span className="relative z-10">Subscribe Now</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                <span className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 font-bold">
                  Subscribe Now
                </span>
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

export default HomePage;