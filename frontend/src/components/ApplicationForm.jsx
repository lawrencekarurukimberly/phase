import React, { useState } from 'react';
import { submitApplication } from '../api/petpalsApi'; // Ensure this path is correct

function ApplicationForm({ petId, currentUser, userProfile }) {
  const [formData, setFormData] = useState({
    fullName: userProfile?.name || '', // Use userProfile.name if available
    email: currentUser?.email || '',
    phone: '',
    address: '',
    livingSituation: '',
    previousPetExperience: '',
    whyAdopt: '',
    homeDescription: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');

    if (!currentUser || !userProfile) {
      setError('You must be logged in to submit an application.');
      setIsSubmitting(false);
      return;
    }

    try {
      // NOTE: `pet.shelter_id` is not available directly in this component's props.
      // You would need to fetch the pet details (including shelter_id) based on `petId`
      // or pass `shelter_id` as a prop from the parent component (e.g., PetDetailsPage).
      // For now, I'm using a placeholder and flagging this for your attention.
      const applicationData = {
        pet_id: petId,
        user_id: currentUser.uid, // Firebase UID
        shelter_id: "PLACEHOLDER_SHELTER_ID", // <<< IMPORTANT: Replace with actual shelter ID
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
      setSuccessMessage('Application submitted successfully!');
      // Optionally clear form data here:
      // setFormData({ /* initial empty state */ });
    } catch (err) {
      console.error('Error submitting application:', err.response?.data?.detail || err.message);
      setError(err.response?.data?.detail || 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mb-8"> {/* Added container styling */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Pet Adoption Application</h2>
      <form onSubmit={handleSubmit} className="space-y-4"> {/* Added spacing between form elements */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="John Doe"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john.doe@example.com"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1234567890"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">Full Address</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="123 Main St, Anytown, USA"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="livingSituation" className="block text-sm font-medium text-gray-700">Describe your living situation</label>
          <textarea
            id="livingSituation"
            name="livingSituation"
            value={formData.livingSituation}
            onChange={handleChange}
            placeholder="E.g., apartment with a small yard, house with a large fenced yard, etc."
            rows="3"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="previousPetExperience" className="block text-sm font-medium text-gray-700">Tell us about your previous pet experience</label>
          <textarea
            id="previousPetExperience"
            name="previousPetExperience"
            value={formData.previousPetExperience}
            onChange={handleChange}
            placeholder="E.g., owned dogs/cats before, volunteered at shelters, etc."
            rows="4"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="whyAdopt" className="block text-sm font-medium text-gray-700">Why do you want to adopt this pet?</label>
          <textarea
            id="whyAdopt"
            name="whyAdopt"
            value={formData.whyAdopt}
            onChange={handleChange}
            placeholder="Share your motivations for adopting this specific pet."
            rows="4"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="homeDescription" className="block text-sm font-medium text-gray-700">Describe your home environment</label>
          <textarea
            id="homeDescription"
            name="homeDescription"
            value={formData.homeDescription}
            onChange={handleChange}
            placeholder="E.g., quiet home, active family, other pets, children, etc."
            rows="4"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        {successMessage && <p className="text-green-600 text-sm mt-2">{successMessage}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </div>
  );
}

export default ApplicationForm;