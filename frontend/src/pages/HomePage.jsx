import React, { useState, useEffect } from 'react';

const HomePage = () => {
  const [pets, setPets] = useState([]);
  const [speciesFilter, setSpeciesFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // Sample pet data - replace this with your actual data source
  const samplePets = [
    {
      id: 1,
      name: "Buddy",
      species: "dog",
      breed: "Golden Retriever",
      age: "3 years",
      image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400",
      description: "Friendly and energetic dog looking for an active family."
    },
    {
      id: 2,
      name: "Whiskers",
      species: "cat",
      breed: "Persian",
      age: "2 years",
      image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400",
      description: "Calm and affectionate cat who loves to cuddle."
    },
    {
      id: 3,
      name: "Max",
      species: "dog",
      breed: "German Shepherd",
      age: "4 years",
      image: "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=400",
      description: "Loyal and intelligent dog, great with children."
    },
    {
      id: 4,
      name: "Luna",
      species: "cat",
      breed: "Siamese",
      age: "1 year",
      image: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400",
      description: "Playful kitten with beautiful blue eyes."
    },
    {
      id: 5,
      name: "Charlie",
      species: "dog",
      breed: "Labrador",
      age: "5 years",
      image: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400",
      description: "Gentle giant who loves swimming and fetching."
    },
    {
      id: 6,
      name: "Mittens",
      species: "cat",
      breed: "Maine Coon",
      age: "3 years",
      image: "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=400",
      description: "Large, fluffy cat with a sweet personality."
    }
  ];

  useEffect(() => {
    // Simulate loading pets from an API
    setTimeout(() => {
      setPets(samplePets);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredPets = pets.filter(pet => {
    if (speciesFilter === 'all') return true;
    return pet.species === speciesFilter;
  });

  const clearFilter = () => {
    setSpeciesFilter('all');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-xl text-gray-600">Loading adorable pets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Hero Section */}
      <div className="text-center py-20 px-4">
        <div className="text-8xl mb-6">🐾</div>
        <h1 className="text-6xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Find Your Perfect Companion
        </h1>
        <p className="text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
          Give a loving home to pets in need. Browse our adorable friends waiting for their forever families.
        </p>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button
            onClick={clearFilter}
            className={`py-3 px-6 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
              speciesFilter === 'all'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-white text-purple-600 hover:bg-purple-50'
            }`}
          >
            🏠 All Pets
          </button>
          <button
            onClick={() => setSpeciesFilter('dog')}
            className={`py-3 px-6 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
              speciesFilter === 'dog'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-white text-purple-600 hover:bg-purple-50'
            }`}
          >
            🐕 Dogs
          </button>
          <button
            onClick={() => setSpeciesFilter('cat')}
            className={`py-3 px-6 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
              speciesFilter === 'cat'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-white text-purple-600 hover:bg-purple-50'
            }`}
          >
            🐱 Cats
          </button>
        </div>
      </div>

      {/* Pets Grid */}
      <div className="container mx-auto px-4 pb-20">
        {filteredPets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPets.map((pet) => (
              <div
                key={pet.id}
                className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <div className="relative">
                  <img
                    src={pet.image}
                    alt={pet.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg">
                    <span className="text-2xl">
                      {pet.species === 'dog' ? '🐕' : '🐱'}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{pet.name}</h3>
                  <p className="text-gray-600 mb-2">
                    <span className="font-semibold">Breed:</span> {pet.breed}
                  </p>
                  <p className="text-gray-600 mb-4">
                    <span className="font-semibold">Age:</span> {pet.age}
                  </p>
                  <p className="text-gray-700 mb-6">{pet.description}</p>
                  <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-6 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                    💕 Adopt {pet.name}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-6">😢</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">No pets found</h2>
            <p className="text-xl text-gray-600 mb-8">
              Try adjusting your filter to see more adorable companions!
            </p>
            <button
              onClick={clearFilter}
              className="bg-purple-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-purple-700 transition-all duration-300"
            >
              Show All Pets
            </button>
          </div>
        )}
      </div>

      {/* Call to Action Section */}
      {pets.length > 0 && (
        <div className="mt-20 text-center px-4 pb-20">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 shadow-2xl max-w-4xl mx-auto">
            <div className="text-6xl mb-6">❤️</div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Each pet deserves a loving home. Your perfect companion is waiting for you!
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button
                onClick={() => setSpeciesFilter('dog')}
                className="bg-white text-purple-600 font-bold py-4 px-8 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                🐕 Adopt a Dog
              </button>
              <button
                onClick={() => setSpeciesFilter('cat')}
                className="bg-white text-purple-600 font-bold py-4 px-8 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                🐱 Adopt a Cat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;