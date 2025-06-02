import React from 'react';
import { Link } from 'react-router-dom';

function PetCard({ pet }) {
  const imageUrl = pet.imageUrl || 'https://via.placeholder.com/400x300?text=Pet+Image+Not+Available'; // Larger placeholder image

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden transform hover:scale-102 transition-transform duration-300 ease-in-out border border-gray-200"> {/* Stronger shadow, subtle border, slight scale on hover */}
      <img src={imageUrl} alt={pet.name} className="w-full h-56 object-cover object-center" /> {/* Taller image, better centering */}
      <div className="p-5"> {/* Increased padding */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{pet.name}</h2> {/* Larger, bolder name */}
        <p className="text-gray-600 text-base mb-2"> {/* Larger text */}
          <span className="font-medium">{pet.species}</span> &bull; {pet.age} &bull; {pet.breed}
        </p>
        <p className="text-gray-700 text-sm mt-3 line-clamp-4"> {/* More lines for description */}
          {pet.description || 'No detailed description provided for this pet.'}
        </p>
        <p className="text-gray-600 text-sm mt-3">
          <span className="font-semibold">Temperament:</span> {pet.temperament || 'Not specified'}
        </p>
        <p className="text-gray-600 text-sm">
          <span className="font-semibold">Medical Needs:</span> {pet.medicalNeeds || 'None reported'}
        </p>
        <p className={`text-md font-extrabold mt-3 ${pet.status === 'available' ? 'text-green-600' : 'text-red-600'}`}> {/* Bolder status */}
          Status: {pet.status.charAt(0).toUpperCase() + pet.status.slice(1)} {/* Capitalize status */}
        </p>
        <div className="mt-5"> {/* More margin */}
          <Link
            to={`/pets/${pet.id}`}
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-lg transition duration-300 ease-in-out transform hover:translate-y-0.5" // Nicer button styling
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PetCard;