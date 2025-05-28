// frontend/src/components/PetCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function PetCard({ pet }) {
  const imageUrl = pet.imageUrl || 'https://via.placeholder.com/300x200?text=Pet+Image'; // Placeholder image

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300">
      <img src={imageUrl} alt={pet.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-1">{pet.name}</h2>
        <p className="text-gray-600 text-sm">
          {pet.species} &bull; {pet.age} &bull; {pet.breed}
        </p>
        <p className="text-gray-700 mt-2 line-clamp-3">
          {pet.description || 'No description provided.'}
        </p>
        <div className="mt-4">
          <Link
            to={`/pets/${pet.id}`}
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PetCard;