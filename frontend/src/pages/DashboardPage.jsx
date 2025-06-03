// frontend/src/pages/DashboardPage.jsx
import React, { useEffect, useState } from 'react';
import { getShelterApplications, updateApplicationStatus, addPet, getPets, updatePet, deletePet } from '../api/petpalsApi';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { Link } from 'react-router-dom'; // Import Link for the "Go Home" button

function DashboardPage() {
  const { userProfile, loading: authLoading } = useAuth(); // Get authLoading state
  const [applications, setApplications] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('applications');
  const [newPetForm, setNewPetForm] = useState({
    name: '', age: '', species: '', breed: '', description: '', temperament: '', medicalNeeds: '', status: 'available', gender: ''
  });
  const [newPetImage, setNewPetImage] = useState(null);
  const [isAddingPet, setIsAddingPet] = useState(false);
  const [editingPetId, setEditingPetId] = useState(null);
  const [editPetForm, setEditPetForm] = useState(null);
  const [editPetImage, setEditPetImage] = useState(null);
  const [isUpdatingPet, setIsUpdatingPet] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState('');

  // Custom Alert/Confirm Modal replacement
  const showCustomConfirm = (message, action) => {
    setConfirmMessage(message);
    setConfirmAction(() => action); // Store the action function
    setShowConfirmModal(true);
  };

  const handleConfirm = () => {
    if (confirmAction) {
      confirmAction();
    }
    setShowConfirmModal(false);
    setConfirmAction(null);
  };

  const handleCancelConfirm = () => {
    setShowConfirmModal(false);
    setConfirmAction(null);
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError('');
      try {
        // Fetch applications for the shelter's pets
        const apps = await getShelterApplications(userProfile?.shelter_id); // Pass shelter_id to backend
        setApplications(apps.data);

        // Fetch pets owned by this shelter
        const petsData = await getPets({ shelterId: userProfile?.shelter_id }); // Pass shelter_id to backend
        setPets(petsData.data); // Backend should filter by shelterId already
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError('Failed to load dashboard data. Please ensure your backend is running and accessible.');
      } finally {
        setLoading(false);
      }
    };

    // Only fetch data if userProfile is loaded and role is shelter
    if (!authLoading && userProfile?.role === 'shelter') {
      if (userProfile?.shelter_id) {
        fetchDashboardData();
      } else {
        setError('Shelter profile incomplete. Please ensure your shelter ID is set in the backend.');
        setLoading(false);
      }
    } else if (!authLoading && userProfile?.role !== 'shelter') {
      setError('Access Denied. This page is for shelters only.');
      setLoading(false);
    }
  }, [userProfile, authLoading]); // Added authLoading to dependencies

  const handleStatusChange = (id, status) => {
    showCustomConfirm(`Are you sure you want to change this application status to ${status}?`, async () => {
      try {
        await updateApplicationStatus(id, status);
        alert('Application status updated successfully!'); // Use alert for now
        window.location.reload(); // Reload to fetch updated data
      } catch (err) {
        console.error("Error updating application status:", err);
        alert('Error updating application status.'); // Use alert for now
      }
    });
  };

  const handleNewPetChange = e => setNewPetForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleNewPetImageChange = e => setNewPetImage(e.target.files[0]);

  const handleAddPet = async (e) => {
    e.preventDefault();
    setIsAddingPet(true);
    try {
      // Add shelterId to the new pet form from userProfile
      const petDataWithShelterId = { ...newPetForm, shelter_id: userProfile.shelter_id }; // Flask backend uses shelter_id
      await addPet(petDataWithShelterId, newPetImage);
      alert('Pet added successfully!'); // Use alert for now
      window.location.reload(); // Reload to fetch updated data
    } catch (err) {
      console.error("Error adding pet:", err.response?.data?.message || err.message);
      alert(`Error adding pet: ${err.response?.data?.message || 'Please check all fields.'}`); // Use alert for now
    } finally {
      setIsAddingPet(false);
    }
  };

  const startEditPet = pet => {
    setEditingPetId(pet.id);
    // Ensure age is a string for input type="number" if it comes as a number
    // Map backend keys to frontend state keys if necessary (e.g., shelter_id to shelterId)
    setEditPetForm({
      ...pet,
      age: String(pet.age || ''),
      shelter_id: pet.shelter_id, // Ensure shelter_id is preserved for update
      medicalNeeds: pet.medical_info, // Map medical_info to medicalNeeds
      temperament: pet.behavior_info // Map behavior_info to temperament
    });
    setEditPetImage(null); // Clear image for edit, user can select new one
  };
  const handleEditPetChange = e => setEditPetForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleEditPetImageChange = e => setEditPetImage(e.target.files[0]);

  const handleUpdatePet = async (e) => {
    e.preventDefault();
    setIsUpdatingPet(true);
    try {
      if (!editingPetId) throw new Error("No pet selected for editing.");
      // Map frontend state keys back to backend keys if necessary
      const updateData = {
        ...editPetForm,
        medical_info: editPetForm.medicalNeeds, // Map medicalNeeds back to medical_info
        behavior_info: editPetForm.temperament // Map temperament back to behavior_info
      };
      await updatePet(editingPetId, updateData, editPetImage);
      alert('Pet updated successfully!'); // Use alert for now
      window.location.reload(); // Reload to fetch updated data
    } catch (err) {
      console.error("Error updating pet:", err.response?.data?.message || err.message);
      alert(`Error updating pet: ${err.response?.data?.message || 'Please check all fields.'}`); // Use alert for now
    } finally {
      setIsUpdatingPet(false);
      setEditingPetId(null); // Exit edit mode
      setEditPetForm(null);
    }
  };

  const handleDeletePet = (id) => {
    showCustomConfirm('Are you sure you want to delete this pet? This action cannot be undone.', async () => {
      try {
        await deletePet(id);
        alert('Pet deleted successfully!'); // Use alert for now
        window.location.reload(); // Reload to fetch updated data
      } catch (err) {
        console.error("Error deleting pet:", err);
        alert('Error deleting pet.'); // Use alert for now
      }
    });
  };

  if (loading) return <LoadingSpinner fullScreen />;
  if (error) return <div className="text-center text-red-500 text-2xl mt-10 p-4">{error}</div>;
  if (userProfile?.role !== 'shelter') return <div className="text-center text-red-500 text-2xl mt-10 p-4">Shelter access only.</div>;
  // If shelter but no shelter_id, prompt them to create one or contact admin
  if (userProfile?.role === 'shelter' && !userProfile.shelter_id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="text-center bg-white p-8 rounded-xl shadow-xl max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Shelter Profile Incomplete</h2>
          <p className="text-gray-600 mb-6">
            Your user account is marked as a 'shelter', but it's not linked to a specific shelter profile in our system.
            Please contact an administrator to set up your shelter profile, or ensure your `user_id` is linked to a shelter in the backend.
          </p>
          <Link to="/" className="bg-blue-600 hover-bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg">Go Home</Link>
        </div>
      </div>
    );
  }


  return (
    <div className="container mx-auto p-6 bg-white rounded-xl shadow-xl my-10 max-w-7xl">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">Shelter Dashboard</h1>
      <div className="flex justify-center space-x-6 border-b pb-4 mb-8">
        {['applications', 'pets'].map(tab => (
          <button
            key={tab}
            className={`text-xl font-semibold transition-colors ${activeTab === tab ? 'text-blue-600 border-b-4 border-blue-600 pb-2' : 'text-gray-500 hover-text-blue-500'}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'applications' ? `Applications (${applications.length})` : `My Pets (${pets.length})`}
          </button>
        ))}
      </div>

      {activeTab === 'applications' && (
        <section className="space-y-6">
          {applications.length === 0 ? (
            <p className="text-gray-600 text-center">No applications yet.</p>
          ) : applications.map(app => (
            <div key={app.id} className="bg-gray-50 p-6 rounded-lg shadow hover-shadow-lg transition-shadow">
              <h3 className="text-lg font-bold">Application for: {app.petDetails?.name || 'N/A'}</h3>
              <p className="text-sm text-gray-600">By {app.applicantDetails?.name || 'N/A'} ({app.applicantDetails?.email || 'N/A'})</p>
              <p>Status: <span className={`font-semibold ${app.status === 'approved' ? 'text-green-600' : app.status === 'rejected' ? 'text-red-600' : 'text-yellow-500'}`}>{app.status.toUpperCase()}</span></p>
              <p className="text-xs text-gray-500">Submitted: {app.created_at?._seconds ? new Date(app.created_at._seconds * 1000).toLocaleString() : 'N/A'}</p> {/* Use created_at from Flask */}
              <div className="mt-3 text-sm">
                <p><strong>Phone:</strong> {app.contact_info?.phone || 'N/A'}</p> {/* Use contact_info from Flask */}
                <p><strong>Address:</strong> {app.contact_info?.address || 'N/A'}</p>
                <p><strong>Living Situation:</strong> {app.home_info?.livingSituation || 'N/A'}</p> {/* Use home_info from Flask */}
                <p><strong>Experience:</strong> {app.experience || 'N/A'}</p>
                <p><strong>Why Adopt:</strong> {app.whyAdopt || 'N/A'}</p>
                <p><strong>Home Description:</strong> {app.home_info?.homeDescription || 'N/A'}</p>
              </div>
              {app.status === 'submitted' && ( // Ensure status matches backend's 'submitted'
                <div className="mt-4 space-x-3">
                  <button onClick={() => handleStatusChange(app.id, 'approved')} className="bg-green-500 hover-bg-green-600 px-4 py-1 rounded shadow">Approve</button>
                  <button onClick={() => handleStatusChange(app.id, 'rejected')} className="bg-red-500 hover-bg-red-600 px-4 py-1 rounded shadow">Reject</button>
                  <button onClick={() => handleStatusChange(app.id, 'under_review')} className="bg-yellow-500 hover-bg-yellow-600 px-4 py-1 rounded shadow">Under Review</button>
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {activeTab === 'pets' && (
        <section className="space-y-6">
          <div className="bg-blue-50 p-6 rounded-lg shadow">
            <h3 className="text-2xl font-bold mb-4">
              {editingPetId ? 'Edit Pet' : 'Add New Pet'}
            </h3>
            <form onSubmit={editingPetId ? handleUpdatePet : handleAddPet} className="grid grid-cols-1 md-grid-cols-2 gap-4">
              <input name="name" value={editingPetId ? editPetForm.name : newPetForm.name} onChange={editingPetId ? handleEditPetChange : handleNewPetChange} placeholder="Name" className="input-field" required />
              <input name="age" type="number" value={editingPetId ? editPetForm.age : newPetForm.age} onChange={editingPetId ? handleEditPetChange : handleNewPetChange} placeholder="Age (years)" className="input-field" required />
              <select name="species" value={editingPetId ? editPetForm.species : newPetForm.species} onChange={editingPetId ? handleEditPetChange : handleNewPetChange} className="input-field" required>
                <option value="">Select Species</option>
                <option value="dog">Dog</option>
                <option value="cat">Cat</option>
                <option value="bird">Bird</option>
                <option value="other">Other</option>
              </select>
              <input name="breed" value={editingPetId ? editPetForm.breed : newPetForm.breed} onChange={editingPetId ? handleEditPetChange : handleNewPetChange} placeholder="Breed" className="input-field" required />
              <select name="gender" value={editingPetId ? editPetForm.gender : newPetForm.gender} onChange={editingPetId ? handleEditPetChange : handleNewPetChange} className="input-field" required>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              <select name="status" value={editingPetId ? editPetForm.status : newPetForm.status} onChange={editingPetId ? handleEditPetChange : handleNewPetChange} className="input-field" required>
                <option value="available">Available</option>
                <option value="pending">Pending</option>
                <option value="adopted">Adopted</option>
              </select>
              <textarea name="description" value={editingPetId ? editPetForm.description : newPetForm.description} onChange={editingPetId ? handleEditPetChange : handleNewPetChange} placeholder="Description" rows="2" className="input-field col-span-full" required></textarea>
              <input name="temperament" value={editingPetId ? editPetForm.temperament : newPetForm.temperament} onChange={editingPetId ? handleEditPetChange : handleNewPetChange} placeholder="Temperament (optional)" className="input-field" />
              <input name="medicalNeeds" value={editingPetId ? editPetForm.medicalNeeds : newPetForm.medicalNeeds} onChange={editingPetId ? handleEditPetChange : handleNewPetChange} placeholder="Medical Needs (optional)" className="input-field" />
              <input type="file" onChange={editingPetId ? handleEditPetImageChange : handleNewPetImageChange} accept="image/*" className="input-field col-span-full" />
              
              <div className="col-span-full flex justify-end space-x-4 mt-4">
                {editingPetId && (
                  <button type="button" onClick={() => setEditingPetId(null)} className="bg-gray-400 hover-bg-gray-500 text-white font-semibold py-2 px-4 rounded shadow">
                    Cancel Edit
                  </button>
                )}
                <button type="submit" disabled={isAddingPet || isUpdatingPet} className="bg-blue-600 hover-bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow">
                  {isAddingPet || isUpdatingPet ? 'Saving...' : editingPetId ? 'Update Pet' : 'Add Pet'}
                </button>
              </div>
            </form>
          </div>

          <h3 className="text-2xl font-bold text-center mt-10 mb-6">My Listed Pets</h3>
          <div className="grid grid-cols-1 md-grid-cols-2 gap-6">
            {pets.length === 0 ? (
              <p className="text-gray-600 text-center col-span-full">No pets listed yet.</p>
            ) : pets.map(pet => (
              <div key={pet.id} className="bg-gray-50 p-4 rounded-lg shadow hover-shadow-lg flex flex-col md-flex-row items-center">
                <img src={pet.imageUrl || 'https://placehold.co/150x150/A78BFA/FFFFFF?text=Pet'} alt={pet.name} className="w-24 h-24 rounded-md object-cover mr-4 mb-4 md-mb-0" onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/150x150/EF4444/FFFFFF?text=Error`; }} />
                <div className="flex-grow">
                  <h4 className="text-xl font-bold">{pet.name}</h4>
                  <p className="text-sm text-gray-600 capitalize">{pet.species} &bull; {pet.age} &bull; {pet.breed}</p>
                  <p className="text-gray-700 mt-2 line-clamp-2">{pet.description}</p>
                  <p className="mt-1 text-sm">Status: <span className={`font-bold ${pet.status === 'available' ? 'text-green-600' : 'text-red-600'}`}>{pet.status.toUpperCase()}</span></p>
                  <div className="mt-3 space-x-2">
                    <button onClick={() => startEditPet(pet)} className="bg-yellow-400 hover-bg-yellow-500 text-white px-3 py-1 rounded text-sm shadow">Edit</button>
                    <button onClick={() => handleDeletePet(pet.id)} className="bg-red-500 hover-bg-red-600 text-white px-3 py-1 rounded text-sm shadow">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Custom Confirm Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-gray-600/75 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full text-center">
            <p className="text-lg font-semibold mb-6">{confirmMessage}</p>
            <div className="flex justify-center space-x-4">
              <button onClick={handleConfirm} className="bg-blue-600 hover-bg-blue-700 text-white px-5 py-2 rounded-md shadow">
                Yes
              </button>
              <button onClick={handleCancelConfirm} className="bg-gray-300 hover-bg-gray-400 text-gray-800 px-5 py-2 rounded-md shadow">
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
