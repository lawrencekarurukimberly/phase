import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { submitApplication, getPetById } from '../api/petpalsApi';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/Common/LoadingSpinner';

function ApplyPage() {
  const { id: petId } = useParams();
  const navigate = useNavigate();
  const { currentUser, userProfile } = useAuth();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: userProfile?.name || '',
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

    const applicationData = {
      petId: petId,
      contactInfo: {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
      },
      questionnaire: {
        livingSituation: formData.livingSituation,
        previousPetExperience: formData.previousPetExperience,
        whyAdopt: formData.whyAdopt,
        homeDescription: formData.homeDescription,
      },
    };

    try {
      await submitApplication(applicationData);
      alert('Application submitted successfully!');
      navigate(`/pets/${petId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  if (error && !pet) {
    return <div className="text-center text-red-500 text-2xl mt-10">{error}</div>;
  }

  if (!pet || pet.status !== 'Available') {
    return (
      <div className="text-center text-gray-600 text-2xl mt-10">
        This pet is not available for adoption.
      </div>
    );
  }

  if (!userProfile || userProfile.role !== 'adopter') {
    return (
      <div className="text-center text-red-500 text-2xl mt-10">
        You must be logged in as an adopter to apply.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8 bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl mt-10 mb-20 animate-fade-in">
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-6">
        Apply to Adopt <span className="text-blue-500">{pet.name}</span>
      </h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Your Contact Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="fullName" className="text-sm font-medium text-gray-700 mb-1 block">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div>
              <label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-1 block">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div>
              <label htmlFor="address" className="text-sm font-medium text-gray-700 mb-1 block">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Your Home & Experience
          </h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="livingSituation" className="block text-sm font-medium text-gray-700 mb-1">
                Living Situation
              </label>
              <textarea
                id="livingSituation"
                name="livingSituation"
                value={formData.livingSituation}
                onChange={handleChange}
                rows="3"
                className="input-field"
                required
              />
            </div>
            <div>
              <label htmlFor="previousPetExperience" className="block text-sm font-medium text-gray-700 mb-1">
                Previous Pet Experience
              </label>
              <textarea
                id="previousPetExperience"
                name="previousPetExperience"
                value={formData.previousPetExperience}
                onChange={handleChange}
                rows="3"
                className="input-field"
                required
              />
            </div>
            <div>
              <label htmlFor="homeDescription" className="block text-sm font-medium text-gray-700 mb-1">
                Home Description
              </label>
              <textarea
                id="homeDescription"
                name="homeDescription"
                value={formData.homeDescription}
                onChange={handleChange}
                rows="4"
                className="input-field"
                required
              />
            </div>
            <div>
              <label htmlFor="whyAdopt" className="block text-sm font-medium text-gray-700 mb-1">
                Why adopt {pet.name}?
              </label>
              <textarea
                id="whyAdopt"
                name="whyAdopt"
                value={formData.whyAdopt}
                onChange={handleChange}
                rows="3"
                className="input-field"
                required
              />
            </div>
          </div>
        </section>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : `Submit Application for ${pet.name}`}
        </button>
      </form>
    </div>
  );
}

export default ApplyPage;
