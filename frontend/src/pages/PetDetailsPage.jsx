// frontend/src/pages/PetDetailsPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPetById } from '../api/petpalsApi';
import LoadingSpinner from '../components/Common/LoadingSpinner';

function PetDetailsPage() {
  const { id } = useParams();
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
        setError('Failed to load pet details. Pet might not exist.');
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
          <div className="text-gray-600">{error}</div>
        </div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-2xl">
          <div className="text-6xl mb-4">🔍</div>
          <div className="text-2xl font-bold text-gray-800 mb-2">Pet Not Found</div>
          <div className="text-gray-600">The pet you're looking for doesn't exist.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 py-16">
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
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-[1.01] transition-transform duration-300">
          <div className="lg:flex">
            {/* Image Section */}
            <div className="lg:w-1/2 relative group">
              <div className="aspect-square lg:h-[600px] overflow-hidden">
                <img
                  src={pet.imageUrl || 'https://via.placeholder.com/600x600?text=Pet+Image'}
                  alt={pet.name}
                  className={`w-full h-full object-cover transition-all duration-700 ${
                    imageLoaded ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
                  } group-hover:scale-105`}
                  onLoad={() => setImageLoaded(true)}
                />

                {/* Status Badge */}
                <div className="absolute top-6 right-6">
                  <div className={`px-4 py-2 rounded-full font-bold text-sm shadow-lg backdrop-blur-sm ${
                    pet.status === 'Available'
                      ? 'bg-emerald-500/90 text-white'
                      : 'bg-red-500/90 text-white'
                  }`}>
                    {pet.status === 'Available' ? '✨ Available' : '❤️ Adopted'}
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
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-2xl border border-green-200">
                  <div className="text-green-600 font-semibold text-sm mb-1">Age</div>
                  <div className="text-gray-800 font-bold">{pet.age} years</div>
                </div>
                <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-2xl border border-pink-200">
                  <div className="text-pink-600 font-semibold text-sm mb-1">Status</div>
                  <div className={`font-bold ${pet.status === 'Available' ? 'text-green-600' : 'text-red-600'}`}>
                    {pet.status}
                  </div>
                </div>
              </div>

              {/* About Section */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="mr-3">🐕</span>
                  About {pet.name}
                </h2>
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-2xl border border-gray-200">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {pet.description || 'No detailed description available.'}
                  </p>
                </div>
              </div>

              {/* Temperament Section */}
              {pet.temperament && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="mr-3">😊</span>
                    Personality
                  </h2>
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-2xl border border-yellow-200">
                    <p className="text-gray-700 leading-relaxed">{pet.temperament}</p>
                  </div>
                </div>
              )}

              {/* Medical Needs Section */}
              {pet.medicalNeeds && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="mr-3">🏥</span>
                    Medical Care
                  </h2>
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-2xl border border-red-200">
                    <p className="text-gray-700 leading-relaxed">{pet.medicalNeeds}</p>
                  </div>
                </div>
              )}

              {/* Adoption Button */}
              {pet.status === 'Available' && (
                <div className="mt-10">
                  <Link
                    to={`/pets/${pet.id}/apply`}
                    className="group relative inline-flex items-center justify-center w-full bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-bold py-6 px-8 rounded-2xl text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                  >
                    <span className="mr-3 text-2xl group-hover:animate-bounce">💝</span>
                    <span>Adopt {pet.name} Today</span>
                    <span className="ml-3 text-2xl group-hover:animate-bounce delay-100">🏠</span>

                    {/* Button glow effect */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-400 to-blue-500 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>
                  </Link>

                  <div className="text-center mt-4 text-gray-600">
                    <span className="text-sm">🌟 Give {pet.name} a loving forever home</span>
                  </div>
                </div>
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
              <div className="font-bold text-gray-800">Loving</div>
              <div className="text-sm text-gray-600 mt-2">Bonds deeply with their family</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PetDetailsPage;