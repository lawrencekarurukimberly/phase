import React, { useEffect, useState } from 'react';
import { getShelterApplications, updateApplicationStatus, addPet, getPets, updatePet, deletePet } from '../api/petpalsApi';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/Common/LoadingSpinner';

function DashboardPage() {
  const { userProfile } = useAuth();
  const [applications, setApplications] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('applications');
  const [newPetForm, setNewPetForm] = useState({
    name: '', age: '', species: '', breed: '', description: '', temperament: '', medicalNeeds: ''
  });
  const [newPetImage, setNewPetImage] = useState(null);
  const [isAddingPet, setIsAddingPet] = useState(false);
  const [editingPetId, setEditingPetId] = useState(null);
  const [editPetForm, setEditPetForm] = useState(null);
  const [editPetImage, setEditPetImage] = useState(null);
  const [isUpdatingPet, setIsUpdatingPet] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError('');
      try {
        const apps = await getShelterApplications();
        const petsData = await getPets({ shelterId: userProfile?.uid });
        setApplications(apps.data);
        setPets(petsData.data.filter(p => p.shelterId === userProfile?.uid));
      } catch (err) {
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    if (userProfile?.role === 'shelter') fetchDashboardData();
  }, [userProfile]);

  const handleStatusChange = async (id, status) => {
    if (!window.confirm(`Change status to ${status}?`)) return;
    try {
      await updateApplicationStatus(id, status);
      alert('Updated!');
      window.location.reload();
    } catch (err) {
      alert('Error updating status.');
    }
  };

  const handleNewPetChange = e => setNewPetForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleNewPetImageChange = e => setNewPetImage(e.target.files[0]);

  const handleAddPet = async (e) => {
    e.preventDefault();
    setIsAddingPet(true);
    try {
      await addPet(newPetForm, newPetImage);
      alert('Pet added.');
      window.location.reload();
    } catch (err) {
      alert('Error adding pet.');
    } finally {
      setIsAddingPet(false);
    }
  };

  const startEditPet = pet => {
    setEditingPetId(pet.id);
    setEditPetForm({ ...pet, age: String(pet.age) });
  };
  const handleEditPetChange = e => setEditPetForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleEditPetImageChange = e => setEditPetImage(e.target.files[0]);

  const handleUpdatePet = async (e) => {
    e.preventDefault();
    setIsUpdatingPet(true);
    try {
      await updatePet(editingPetId, editPetForm, editPetImage);
      alert('Pet updated.');
      window.location.reload();
    } catch (err) {
      alert('Error updating pet.');
    } finally {
      setIsUpdatingPet(false);
    }
  };

  const handleDeletePet = async (id) => {
    if (!window.confirm('Delete this pet?')) return;
    try {
      await deletePet(id);
      alert('Pet deleted.');
      window.location.reload();
    } catch (err) {
      alert('Error deleting pet.');
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;
  if (error) return <div className="text-center text-red-500 text-2xl mt-10">{error}</div>;
  if (userProfile?.role !== 'shelter') return <div className="text-center text-red-500 text-2xl mt-10">Shelter access only.</div>;

  return (
    <div className="container mx-auto p-6 bg-white rounded-xl shadow-xl my-10 max-w-7xl">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">Shelter Dashboard</h1>
      <div className="flex justify-center space-x-6 border-b pb-4 mb-8">
        {['applications', 'pets'].map(tab => (
          <button
            key={tab}
            className={`text-xl font-semibold transition-colors ${activeTab === tab ? 'text-blue-600 border-b-4 border-blue-600 pb-2' : 'text-gray-500 hover:text-blue-500'}`}
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
            <div key={app.id} className="bg-gray-50 p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-bold">Application for: {app.petDetails?.name}</h3>
              <p className="text-sm text-gray-600">By {app.applicantDetails?.name} ({app.applicantDetails?.email})</p>
              <p>Status: <span className={`font-semibold ${app.status === 'Approved' ? 'text-green-600' : app.status === 'Rejected' ? 'text-red-600' : 'text-yellow-500'}`}>{app.status}</span></p>
              <p className="text-xs text-gray-500">Submitted: {new Date(app.submittedAt?._seconds * 1000).toLocaleString()}</p>
              <div className="mt-3 text-sm">
                <p><strong>Phone:</strong> {app.contactInfo.phone}</p>
                <p><strong>Address:</strong> {app.contactInfo.address}</p>
                <p><strong>Living Situation:</strong> {app.questionnaire.livingSituation}</p>
                <p><strong>Experience:</strong> {app.questionnaire.previousPetExperience}</p>
                <p><strong>Why Adopt:</strong> {app.questionnaire.whyAdopt}</p>
                <p><strong>Home Description:</strong> {app.questionnaire.homeDescription}</p>
              </div>
              {app.status === 'Submitted' && (
                <div className="mt-4 space-x-3">
                  <button onClick={() => handleStatusChange(app.id, 'Approved')} className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded shadow">Approve</button>
                  <button onClick={() => handleStatusChange(app.id, 'Rejected')} className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded shadow">Reject</button>
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {activeTab === 'pets' && (
        <section className="space-y-6">
          <div className="bg-blue-50 p-6 rounded-lg shadow">
            <h3 className="text-2xl font-bold mb-4">Add New Pet</h3>
            <form onSubmit={handleAddPet} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="name" value={newPetForm.name} onChange={handleNewPetChange} placeholder="Name" className="input-field" required />
              <input name="age" type="number" value={newPetForm.age} onChange={handleNewPetChange} placeholder="Age" className="input-field" required />
              <select name="species" value={newPetForm.species} onChange={handleNewPetChange} className="input-field" required>
                <option value="">Species</option>
                <option value="dog">Dog</option>
                <option value="cat">Cat</option>
                <option value="bird">Bird</option>
                <option value="other">Other</option>
              </select>
              <input name="breed" value={newPetForm.breed} onChange={handleNewPetChange} placeholder="Breed" className="input-field" required />
              <textarea name="description" value={newPetForm.description} onChange={handleNewPetChange} placeholder="Description" rows="2" className="input-field col-span-full" required></textarea>
              <input name="temperament" value={newPetForm.temperament} onChange={handleNewPetChange} placeholder="Temperament (optional)" className="input-field" />
              <input name="medicalNeeds" value={newPetForm.medicalNeeds} onChange={handleNewPetChange} placeholder="Medical Needs (optional)" className="input-field" />
              <input type="file" onChange={handleNewPetImageChange} accept="image/*" className="input-field col-span-full" />
              <button type="submit" disabled={isAddingPet} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded col-span-full">
                {isAddingPet ? 'Adding...' : 'Add Pet'}
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pets.map(pet => (
              <div key={pet.id} className="bg-gray-50 p-4 rounded-lg shadow hover:shadow-lg flex flex-col md:flex-row items-center">
                <img src={pet.imageUrl || 'https://via.placeholder.com/150'} alt={pet.name} className="w-24 h-24 rounded-md object-cover mr-4 mb-4 md:mb-0" />
                <div className="flex-grow">
                  <h4 className="text-xl font-bold">{pet.name}</h4>
                  <p className="text-sm text-gray-600">{pet.species} &bull; {pet.age} &bull; {pet.breed}</p>
                  <p className="text-gray-700 mt-2 line-clamp-2">{pet.description}</p>
                  <p className="mt-1 text-sm">Status: <span className={`font-bold ${pet.status === 'Available' ? 'text-green-600' : 'text-red-600'}`}>{pet.status}</span></p>
                  <div className="mt-3 space-x-2">
                    <button onClick={() => startEditPet(pet)} className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded text-sm">Edit</button>
                    <button onClick={() => handleDeletePet(pet.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default DashboardPage;