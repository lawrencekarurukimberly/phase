// frontend/src/pages/ApplyPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { submitApplication, getPetById } from '../api/petpalsApi';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { Link } from 'react-router-dom';

function ApplyPage() {
  const { id: petId } = useParams();
  const navigate = useNavigate();
  const { currentUser, userProfile } = useAuth();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: userProfile?.display_name || '',
    email: currentUser?.email || '',
    phone: '',
    address: '',
    livingSituation: '',
    previousPetExperience: '',
    whyAdopt: '',
    homeDescription: '',
  });

  useEffect(() => {
    const fetchPet = async () => {
      setLoading(true);
      try {
        const response = await getPetById(petId);
        setPet(response.data);
      } catch (err) {
        setError('Failed to load pet details for application.');
      } finally {
        setLoading(false);
      }
    };
    fetchPet();
  }, [petId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (!currentUser || !userProfile) {
      setError('You must be logged in to submit an application.');
      setIsSubmitting(false);
      return;
    }

    try {
      const applicationData = {
        pet_id: petId,
        user_id: currentUser.uid,
        shelter_id: pet.shelter_id,
        contact_info: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
        },
        home_info: {
          livingSituation: formData.livingSituation,
          homeDescription: formData.homeDescription,
        },
        experience: formData.previousPetExperience,
        whyAdopt: formData.whyAdopt,
      };
      
      const response = await submitApplication(applicationData);
      console.log('Application submitted:', response.data);
      alert('Application submitted successfully!');
      navigate('/home');
    } catch (err) {
      console.error('Error submitting application:', err.response?.data?.detail || err.message);
      setError(err.response?.data?.detail || 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error && !pet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-pink-50 flex items-center justify-center p-4">
        <div className="text-center p-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-red-200/50 max-w-md mx-auto">
          <div className="text-6xl mb-6 animate-bounce">😿</div>
          <div className="text-3xl font-bold text-red-600 mb-4">Oops!</div>
          <div className="text-red-500 text-lg font-medium mb-6">{error}</div>
          <Link to="/home" className="inline-flex items-center bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
            <span className="mr-2">🏠</span>
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!pet || pet.status !== 'available') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="text-center p-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 max-w-md mx-auto">
          <div className="text-6xl mb-6 animate-pulse">🚫</div>
          <div className="text-3xl font-bold text-gray-800 mb-4">Not Available</div>
          <div className="text-gray-600 text-lg mb-6">This pet is currently not available for adoption.</div>
          <Link to="/home" className="inline-flex items-center bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
            <span className="mr-2">🔍</span>
            Browse Other Pets
          </Link>
        </div>
      </div>
    );
  }

  if (!userProfile || userProfile.role !== 'adopter') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-pink-50 flex items-center justify-center p-4">
        <div className="text-center p-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-red-200/50 max-w-md mx-auto">
          <div className="text-6xl mb-6 animate-bounce">🔒</div>
          <div className="text-3xl font-bold text-red-600 mb-4">Access Denied</div>
          <div className="text-red-500 text-lg font-medium mb-6">You must be logged in as an adopter to apply.</div>
          <Link to="/login" className="inline-flex items-center bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
            <span className="mr-2">🔑</span>
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full mb-6 shadow-lg">
            <span className="text-3xl animate-bounce">💝</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Apply to Adopt
          </h1>
          <p className="text-2xl font-semibold text-gray-700">
            Give <span className="text-transparent bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text">{pet.name}</span> a loving home! 🏡
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/50">
          {error && (
            <div className="mb-6 p-4 bg-red-100/80 backdrop-blur-sm border border-red-300/50 text-red-700 rounded-xl flex items-center">
              <span className="text-red-500 mr-3 text-xl">⚠️</span>
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Contact Information Section */}
            <section className="space-y-6">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white text-lg">📞</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-800">Contact Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { id: 'fullName', label: 'Full Name', type: 'text', icon: '👤' },
                  { id: 'email', label: 'Email', type: 'email', icon: '📧' },
                  { id: 'phone', label: 'Phone Number', type: 'tel', icon: '📱', placeholder: 'e.g., +1234567890' },
                  { id: 'address', label: 'Address', type: 'text', icon: '🏠', placeholder: 'Street, City, State, Zip' }
                ].map((field) => (
                  <div key={field.id} className="space-y-2">
                    <label htmlFor={field.id} className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                      <span className="mr-2">{field.icon}</span>
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      id={field.id}
                      name={field.id}
                      value={formData[field.id]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-300/50 rounded-xl shadow-sm focus:ring-2 focus:ring-purple-400/50 focus:border-transparent transition-all duration-300 hover:bg-white/90"
                      required
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Home & Experience Section */}
            <section className="space-y-6">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white text-lg">🏡</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-800">Home & Experience</h2>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="livingSituation" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <span className="mr-2">🏘️</span>
                    Living Situation
                  </label>
                  <select
                    id="livingSituation"
                    name="livingSituation"
                    value={formData.livingSituation}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-300/50 rounded-xl shadow-sm focus:ring-2 focus:ring-purple-400/50 focus:border-transparent transition-all duration-300 hover:bg-white/90"
                    required
                  >
                    <option value="">Select your living situation...</option>
                    <option value="house-own">🏠 Own House</option>
                    <option value="house-rent">🏠 Rent House</option>
                    <option value="apartment-own">🏢 Own Apartment</option>
                    <option value="apartment-rent">🏢 Rent Apartment</option>
                    <option value="condo-own">🏨 Own Condo</option>
                    <option value="condo-rent">🏨 Rent Condo</option>
                  </select>
                </div>

                {[
                  { id: 'previousPetExperience', label: 'Previous Pet Experience', icon: '🐾', rows: 4 },
                  { id: 'homeDescription', label: 'Describe Your Home Environment', icon: '🏡', rows: 4 },
                  { id: 'whyAdopt', label: `Why do you want to adopt ${pet.name}?`, icon: '💝', rows: 4 }
                ].map((field) => (
                  <div key={field.id} className="space-y-2">
                    <label htmlFor={field.id} className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                      <span className="mr-2">{field.icon}</span>
                      {field.label}
                    </label>
                    <textarea
                      id={field.id}
                      name={field.id}
                      value={formData[field.id]}
                      onChange={handleChange}
                      rows={field.rows}
                      className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-300/50 rounded-xl shadow-sm focus:ring-2 focus:ring-purple-400/50 focus:border-transparent transition-all duration-300 hover:bg-white/90 resize-none"
                      placeholder={`Tell us about ${field.label.toLowerCase()}...`}
                      required
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 hover:from-pink-600 hover:via-rose-600 hover:to-orange-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group text-lg"
                disabled={isSubmitting}
              >
                {/* Button shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                <span className="relative z-10 flex items-center justify-center">
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mr-3"></div>
                      <span>Submitting Application...</span>
                    </>
                  ) : (
                    <>
                      <span className="mr-3 text-xl">💝</span>
                      <span>Submit Application for {pet.name}</span>
                      <span className="ml-3 text-xl">🚀</span>
                    </>
                  )}
                </span>
              </button>
            </div>
          </form>
        </div>

        {/* Decorative footer */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-4 text-gray-500">
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-gray-300"></div>
            <span className="text-2xl">🐾</span>
            <div className="w-16 h-0.5 bg-gradient-to-r from-gray-300 to-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplyPage;