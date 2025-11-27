import { useState, useEffect } from 'react';
import { get, post, del } from '../api';

export default function PetsPage() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    breed: '',
    birthdate: '',
    age: '',
    vaccinated: '1',
    medical_history: '',
    photo: null
  });

  useEffect(() => {
    loadPets();
  }, []);

  const loadPets = async () => {
    try {
      console.log('Loading pets from API...');
      const response = await get('api/pets');
      console.log('API Response:', response);
      if (response.success && response.pets) {
        console.log('Pets data:', response.pets);
        setPets(response.pets);
      } else {
        console.log('No pets found or invalid response structure');
      }
    } catch (error) {
      console.error('Error loading pets:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (birthdate) => {
    if (!birthdate) return '';
    
    const birth = new Date(birthdate);
    const today = new Date();
    
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();
    
    if (days < 0) {
      months--;
      days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }
    
    let ageStr = '';
    if (years > 0) {
      ageStr = years + ' year' + (years > 1 ? 's' : '');
      if (months > 0) {
        ageStr += ' ' + months + ' month' + (months > 1 ? 's' : '');
      }
    } else if (months > 0) {
      ageStr = months + ' month' + (months > 1 ? 's' : '');
    } else {
      ageStr = days + ' day' + (days > 1 ? 's' : '');
    }
    
    return ageStr;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'birthdate' ? { age: calculateAge(value) } : {})
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, photo: e.target.files[0] }));
  };

  const handleAddPet = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null) {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      await post('api/pets/add', formDataToSend);
      setShowAddModal(false);
      loadPets();
      resetForm();
    } catch (error) {
      console.error('Error adding pet:', error);
    }
  };

  const handleEditClick = (pet) => {
    setEditingPet(pet);
    setFormData({
      name: pet.name || '',
      species: pet.species || '',
      breed: pet.breed || '',
      birthdate: pet.birthdate || '',
      age: pet.age || '',
      vaccinated: pet.vaccinated ? '1' : '0',
      medical_history: pet.medical_history || '',
      photo: null
    });
    setShowEditModal(true);
  };

  const handleUpdatePet = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('id', editingPet.id);
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null) {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      await post('api/pets/update', formDataToSend);
      setShowEditModal(false);
      loadPets();
      resetForm();
    } catch (error) {
      console.error('Error updating pet:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this pet?')) return;

    try {
      await post('api/pets/delete', { id });
      loadPets();
    } catch (error) {
      console.error('Error deleting pet:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      species: '',
      breed: '',
      birthdate: '',
      age: '',
      vaccinated: '1',
      medical_history: '',
      photo: null
    });
    setEditingPet(null);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    resetForm();
  };

  return (
    <>
      <style>{`
        .card {
          background: var(--card);
          border-radius: 16px;
          padding: 35px;
          margin-bottom: 40px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }
        .card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
        }
        .card h2 {
          color: var(--primary);
          margin-bottom: 10px;
          font-size: 1.5rem;
        }
        .card p {
          color: var(--text-muted);
          margin-bottom: 15px;
        }

        .pets-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 30px;
          margin-top: 30px;
        }
        .pet-card {
          background: var(--card);
          border-radius: 14px;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05);
          padding: 25px;
          text-align: center;
          transition: 0.3s ease;
          border: 1px solid var(--border);
        }
        .pet-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(255, 145, 77, 0.2);
        }
        .pet-card img {
          width: 110px;
          height: 110px;
          border-radius: 50%;
          border: 3px solid var(--primary);
          object-fit: cover;
          margin-bottom: 15px;
        }
        .pet-card h4 {
          color: var(--primary);
          margin-bottom: 5px;
          font-size: 1.1rem;
        }
        .pet-card p {
          font-size: 0.9rem;
          color: var(--text-muted);
          margin: 3px 0;
        }

        .actions button {
          display: inline-block;
          padding: 7px 12px;
          border-radius: 6px;
          font-size: 0.85rem;
          text-decoration: none;
          font-weight: 600;
          transition: 0.3s ease;
          margin: 4px;
          border: none;
          cursor: pointer;
        }
        .actions .edit {
          background: #ffe5b4;
          color: #333;
        }
        .actions .delete {
          background: #ff6b6b;
          color: #fff;
        }
        .actions button:hover {
          opacity: 0.9;
          transform: translateY(-2px);
        }

        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(6px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 999;
        }

        .form-card {
          background: white;
          padding: 30px;
          border-radius: 14px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          width: 400px;
          animation: fadeIn 0.3s ease;
          position: relative;
        }
        .form-card h3 {
          color: var(--primary);
          text-align: center;
          margin-bottom: 20px;
        }
        form label {
          display: block;
          margin-top: 10px;
          font-weight: 600;
        }
        form input, form select, form textarea {
          width: 100%;
          padding: 10px;
          margin-top: 6px;
          border-radius: 8px;
          border: 1px solid #ddd;
          outline: none;
          transition: 0.2s;
        }
        form input:focus, form select:focus, form textarea:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 2px rgba(255,145,77,0.2);
        }
        form button {
          margin-top: 18px;
          background: var(--primary);
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 4px 10px rgba(255,145,77,0.25);
          transition: all 0.3s ease;
          width: 100%;
        }
        form button:hover {
          background: var(--light-orange);
          transform: translateY(-2px);
        }
        .close-btn {
          position: absolute;
          top: 10px;
          right: 16px;
          background: none;
          border: none;
          font-size: 1.4rem;
          color: #555;
          cursor: pointer;
        }

        .qr-container {
          margin-top: 12px;
        }
        .qr-container img {
          width: 100px;
          height: 100px;
          border: 1px solid #ccc;
          border-radius: 6px;
          margin-bottom: 5px;
        }
        .qr-container small {
          display: block;
          color: #666;
          font-size: 0.7rem;
        }
        .qr-container .download-btn {
          margin-top: 5px;
          padding: 5px 10px;
          font-size: 0.8rem;
          background: var(--primary);
          color: white;
          text-decoration: none;
          border-radius: 6px;
          display: inline-block;
        }
      `}</style>

      <div className="card">
        <h2>My Pets</h2>
        <p>Manage your pets' profiles and health history here.</p>
        <button className="btn" onClick={() => setShowAddModal(true)}>Add New Pet</button>

        {loading ? (
          <p>Loading...</p>
        ) : pets.length === 0 ? (
          <div style={{ background: '#fff8f3', padding: '15px', borderLeft: '5px solid var(--primary)', borderRadius: '8px', marginTop: '20px' }}>
            You haven't added any pets yet.
          </div>
        ) : (
          <div className="pets-grid">
            {pets.map(pet => (
              <div key={pet.id} className="pet-card">
                <img 
                  src={pet.photo ? `http://localhost/userpanel-event/userpanel-backend/${pet.photo}` : 'http://localhost/userpanel-event/userpanel-backend/assets/default-pet.png'} 
                  alt="Pet Photo" 
                />
                <h4>{pet.name}</h4>
                <p><strong>Species:</strong> {pet.species || 'N/A'}</p>
                <p><strong>Breed:</strong> {pet.breed}</p>
                <p><strong>Age:</strong> {pet.age || 'Unknown'}</p>
                <p><strong>Vaccinated:</strong> {pet.vaccinated ? 'Yes' : 'No'}</p>
                <p><strong>Medical History:</strong> {pet.medical_history || 'None'}</p>

                <div className="actions">
                  <button className="edit" onClick={() => handleEditClick(pet)}>Edit</button>
                  <button className="delete" onClick={() => handleDelete(pet.id)}>Delete</button>
                  
                  <div className="qr-container">
                    <img 
                      src={`http://localhost/userpanel-event/userpanel-backend/pets/qr/${pet.id}`} 
                      alt="QR Code"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22100%22 height=%22100%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22%3EQR Error%3C/text%3E%3C/svg%3E';
                      }}
                    />
                    <small>Pet ID: {pet.id}</small><br />
                    <a href={`http://localhost/userpanel-event/userpanel-backend/pets/download-qr/${pet.id}`} className="download-btn">Download QR</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Pet Modal */}
      {showAddModal && (
        <div className="overlay">
          <div className="form-card">
            <button className="close-btn" onClick={closeModal}>&times;</button>
            <h3>Add New Pet</h3>
            <form onSubmit={handleAddPet}>
              <label htmlFor="name">Pet Name</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required />
              
              <label htmlFor="species">Species</label>
              <input type="text" id="species" name="species" value={formData.species} onChange={handleInputChange} required />
              
              <label htmlFor="breed">Breed</label>
              <input type="text" id="breed" name="breed" value={formData.breed} onChange={handleInputChange} required />
              
              <label htmlFor="birthdate">Birthdate</label>
              <input type="date" id="birthdate" name="birthdate" value={formData.birthdate} onChange={handleInputChange} />
              
              <label htmlFor="age">Age</label>
              <input type="text" id="age" name="age" value={formData.age} readOnly />
              
              <label htmlFor="vaccinated">Vaccinated</label>
              <select id="vaccinated" name="vaccinated" value={formData.vaccinated} onChange={handleInputChange}>
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
              
              <label htmlFor="medical_history">Medical History</label>
              <textarea id="medical_history" name="medical_history" rows="3" value={formData.medical_history} onChange={handleInputChange}></textarea>
              
              <label htmlFor="photo">Photo</label>
              <input type="file" id="photo" name="photo" accept="image/*" onChange={handleFileChange} />
              
              <button type="submit">Save Pet</button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Pet Modal */}
      {showEditModal && (
        <div className="overlay">
          <div className="form-card">
            <button className="close-btn" onClick={closeModal}>&times;</button>
            <h3>Edit Pet</h3>
            <form onSubmit={handleUpdatePet}>
              <label htmlFor="edit_name">Pet Name</label>
              <input type="text" id="edit_name" name="name" value={formData.name} onChange={handleInputChange} required />
              
              <label htmlFor="edit_species">Species</label>
              <input type="text" id="edit_species" name="species" value={formData.species} onChange={handleInputChange} required />
              
              <label htmlFor="edit_breed">Breed</label>
              <input type="text" id="edit_breed" name="breed" value={formData.breed} onChange={handleInputChange} required />
              
              <label htmlFor="edit_birthdate">Birthdate</label>
              <input type="date" id="edit_birthdate" name="birthdate" value={formData.birthdate} onChange={handleInputChange} />
              
              <label htmlFor="edit_age">Age</label>
              <input type="text" id="edit_age" name="age" value={formData.age} readOnly />
              
              <label htmlFor="edit_vaccinated">Vaccinated</label>
              <select id="edit_vaccinated" name="vaccinated" value={formData.vaccinated} onChange={handleInputChange}>
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
              
              <label htmlFor="edit_medical_history">Medical History</label>
              <textarea id="edit_medical_history" name="medical_history" rows="3" value={formData.medical_history} onChange={handleInputChange}></textarea>
              
              <label htmlFor="edit_photo">Photo</label>
              <input type="file" id="edit_photo" name="photo" accept="image/*" onChange={handleFileChange} />
              
              <button type="submit">Update Pet</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
