// frontend/src/pages/PetDetailsPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPetById } from '../api/petpalsApi';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

function PetDetailsPage() {
  const { id } = useParams();
  const { userProfile, currentUser } = useAuth(); // Get user profile and currentUser to determine if adopter and logged in
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const fetchPet = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await getPetById(id);
        setPet(response.data);
      } catch (err) {
        console.error("Error fetching pet details:", err);
        setError('Failed to load pet details. Pet might not exist or network issue.');
      } finally {
        setLoading(false);
      }
    };
    fetchPet();
  }, [id]);

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-2xl">
          <div className="text-6xl mb-4">😿</div>
          <div className="text-2xl font-bold text-red-600 mb-2">Oops!</div>
          <div className="text-red-500 text-xl font-semibold">{error}</div>
          <Link to="/" className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-300">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Pet not found.</p>
      </div>
    );
  }

  const isAdopter = userProfile?.role === 'adopter';
  const isAvailable = pet.status === 'available';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-700 py-16">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative container mx-auto px-6 text-center">
          <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-4">
            <span className="text-white font-semibold">🐾 Meet Your New Best Friend</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
            {pet.name}
          </h1>
          <div className="text-xl text-white/90 font-medium">
            {pet.species} • {pet.breed} • {pet.age} years old
          </div>
        </div>

        {/* Animated background elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full animate-bounce delay-500"></div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-101 transition-transform duration-300">
          <div className="lg:flex">
            {/* Image Section */}
            <div className="lg:w-1/2 relative group">
              <div className="aspect-square lg:h-[600px] overflow-hidden">
                <img
                  src={pet.imageUrl || 'https://placehold.co/600x600?text=Pet+Image'}
                  alt={pet.name}
                  className={`w-full h-full object-cover transition-all duration-700 ${
                    imageLoaded ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
                  } group-hover:scale-105`}
                  onLoad={() => setImageLoaded(true)}
                  onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/600x600/EF4444/FFFFFF?text=Image+Error`; setImageLoaded(true); }}
                />

                {/* Status Badge */}
                <div className="absolute top-6 right-6">
                  <div className={`px-4 py-2 rounded-full font-bold text-sm shadow-lg backdrop-blur-sm ${
                    pet.status === 'available'
                      ? 'bg-emerald-500/90 text-white'
                      : 'bg-red-500/90 text-white'
                  }`}>
                    {pet.status === 'available' ? '✨ Available' : '❤️ Adopted'}
                  </div>
                </div>

                {/* Floating hearts animation */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-1/4 left-1/4 text-2xl animate-bounce delay-0">💖</div>
                  <div className="absolute top-3/4 right-1/4 text-xl animate-bounce delay-1000">🐾</div>
                  <div className="absolute bottom-1/4 left-1/3 text-lg animate-bounce delay-500">✨</div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="lg:w-1/2 p-8 lg:p-12">
              {/* Pet Stats Cards */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-2xl border border-blue-200">
                  <div className="text-blue-600 font-semibold text-sm mb-1">Species</div>
                  <div className="text-gray-800 font-bold capitalize">{pet.species}</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-2xl border border-purple-200">
                  <div className="text-purple-600 font-semibold text-sm mb-1">Breed</div>
                  <div className="text-gray-800 font-bold">{pet.breed}</div>
                </div>
                <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-2xl border border-pink-200">
                  <div className="text-pink-600 font-semibold text-sm mb-1">Age</div>
                  <div className="text-gray-800 font-bold">{pet.age} years</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-2xl border border-green-200">
                  <div className="text-green-600 font-semibold text-sm mb-1">Gender</div>
                  <div className="text-gray-800 font-bold capitalize">{pet.gender}</div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">About {pet.name}</h2>
                <p className="text-gray-700 leading-relaxed">{pet.description}</p>
              </div>

              {/* Temperament */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Temperament</h3>
                <p className="text-gray-700 leading-relaxed">{pet.temperament}</p>
              </div>

              {/* Medical Needs */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Medical Needs</h3>
                <p className="text-gray-700 leading-relaxed">
                  {pet.medicalNeeds || 'None specified.'}
                </p>
              </div>

              {/* Adoption Call to Action */}
              {isAdopter && isAvailable && (
                <div className="mt-8 text-center">
                  <Link
                    to={`/pets/${pet.id}/apply`}
                    className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-10 rounded-xl shadow-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 text-lg"
                  >
                    Apply to Adopt {pet.name}
                  </Link>
                </div>
              )}

              {isAdopter && !isAvailable && (
                <p className="text-center text-red-500 font-semibold text-lg mt-4">
                  This pet is currently not available for adoption.
                </p>
              )}

              {!currentUser && (
                <p className="text-center text-blue-500 font-semibold text-lg mt-4">
                  <Link to="/login" className="underline hover:text-blue-700">Login</Link> or{' '}
                  <Link to="/register" className="underline hover:text-blue-700">Create an Account</Link> to apply for adoption.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Fun Facts Section */}
        <div className="mt-12 bg-white rounded-3xl shadow-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
            <span className="mr-3">🎉</span>
            Fun Facts About {pet.name}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl">
              <div className="text-4xl mb-4">🎾</div>
              <div className="font-bold text-gray-800">Playful</div>
              <div className="text-sm text-gray-600 mt-2">Loves interactive games and toys</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl">
              <div className="text-4xl mb-4">👨‍👩‍👧‍👦</div>
              <div className="font-bold text-gray-800">Family Friendly</div>
              <div className="text-sm text-gray-600 mt-2">Great with kids and other pets</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-pink-50 to-red-50 rounded-2xl">
              <div className="text-4xl mb-4">❤️</div>
              <div className="font-bold text-gray-800">Affectionate</div>
              <div className="text-sm text-gray-600 mt-2">Enjoys cuddles and companionship</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PetDetailsPage;