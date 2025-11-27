import { useState, useEffect } from 'react';
import { get, post } from '../api';

export default function AppointmentsPage() {
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [historyAppointments, setHistoryAppointments] = useState([]);
  const [pets, setPets] = useState([]);
  const [vets, setVets] = useState([]);
  const [services, setServices] = useState([]);
  const [filteredVets, setFilteredVets] = useState([]);
  const [formData, setFormData] = useState({
    pet_id: '',
    service: '',
    veterinarian_id: '',
    date: '',
    time: ''
  });
  const [timeSlots, setTimeSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [timeSlotInfo, setTimeSlotInfo] = useState('Select a service, veterinarian, and date to see available time slots.');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      console.log('Loading appointments data...');
      const [appointmentsRes, petsRes, vetsRes, servicesRes] = await Promise.all([
        get('api/appointments'),
        get('api/pets'),
        get('api/veterinarians'),
        get('api/services')
      ]);

      console.log('Appointments response:', appointmentsRes);
      console.log('Pets response:', petsRes);
      console.log('Vets response:', vetsRes);
      console.log('Services response:', servicesRes);

      if (appointmentsRes.success) {
        setUpcomingAppointments(appointmentsRes.upcomingAppointments || []);
        setHistoryAppointments(appointmentsRes.allAppointments || []);
      }
      if (petsRes.success) setPets(petsRes.pets || []);
      if (vetsRes.success) setVets(vetsRes.veterinarians || []);
      if (servicesRes.success) setServices(servicesRes.services || []);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load appointment data');
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour < 18; hour++) {
      slots.push(String(hour).padStart(2, '0') + ':00');
      slots.push(String(hour).padStart(2, '0') + ':30');
    }
    return slots;
  };

  const fetchBookedSlots = async (date, vetId) => {
    if (!date || !vetId) return;
    
    try {
      console.log('Fetching booked slots for date:', date, 'vet:', vetId);
      const response = await get(`api/appointments/getBookedSlots?date=${date}&vet_id=${vetId}`);
      console.log('Booked slots response:', response);
      const bookedSlotsData = response.bookedSlots || [];
      console.log('Booked slots:', bookedSlotsData);
      setBookedSlots(bookedSlotsData);
      updateAvailableSlots(bookedSlotsData, date);
    } catch (error) {
      console.error('Error fetching booked slots:', error);
      setBookedSlots([]);
    }
  };

  const updateAvailableSlots = (booked, selectedDate) => {
    const allSlots = generateTimeSlots();
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const isToday = selectedDate === todayStr;

    const available = allSlots.filter(slot => {
      // Skip past slots for today
      if (isToday) {
        const slotTime = new Date(selectedDate + 'T' + slot);
        if (slotTime < now) return false;
      }
      // Skip booked slots
      return !booked.includes(slot);
    });

    setTimeSlots(available);
    
    if (available.length === 0) {
      setTimeSlotInfo('No available slots for this date and veterinarian.');
    } else {
      setTimeSlotInfo(`${available.length} slot(s) available. Each appointment is 30 minutes.`);
    }
  };

  const handleServiceChange = (e) => {
    const serviceId = e.target.value;
    setFormData({ ...formData, service: serviceId, veterinarian_id: '', time: '' });
    setTimeSlots([]);
    setTimeSlotInfo('Select a veterinarian and date to see available time slots.');

    if (!serviceId) {
      setFilteredVets([]);
      return;
    }

    // Find selected service
    const selectedService = services.find(s => s.id === parseInt(serviceId));
    if (!selectedService) {
      setFilteredVets([]);
      return;
    }

    // Filter vets by matching specialization
    const matching = vets.filter(vet => vet.specialization === selectedService.service_name);
    setFilteredVets(matching);
  };

  const handleVetChange = (e) => {
    const vetId = e.target.value;
    setFormData({ ...formData, veterinarian_id: vetId, time: '' });
    
    if (vetId && formData.date) {
      fetchBookedSlots(formData.date, vetId);
    } else {
      setTimeSlots(generateTimeSlots());
      setTimeSlotInfo('Select a service, veterinarian, and date to see real-time availability.');
    }
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setFormData({ ...formData, date, time: '' });
    
    if (date && formData.veterinarian_id) {
      fetchBookedSlots(date, formData.veterinarian_id);
    } else {
      setTimeSlots(generateTimeSlots());
      setTimeSlotInfo('Select a service, veterinarian, and date to see real-time availability.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate time slot selected
    if (!formData.time) {
      setError('Please select a time slot.');
      return;
    }

    // Check if datetime is in past
    const now = new Date();
    const selected = new Date(formData.date + 'T' + formData.time);
    if (selected < now) {
      setError('Cannot book appointments in the past. Please select a future date and time.');
      return;
    }

    try {
      const response = await post('api/appointments/book', formData);
      if (response.success) {
        setSuccess('Appointment booked successfully!');
        setError('');
        setFormData({
          pet_id: '',
          service: '',
          veterinarian_id: '',
          date: '',
          time: ''
        });
        setFilteredVets([]);
        setTimeSlots([]);
        loadData();
      } else {
        setError(response.message || 'Failed to book appointment');
        setSuccess('');
      }
    } catch (error) {
      setError(error.message || 'Error booking appointment');
      setSuccess('');
      console.error('Booking error:', error);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;

    try {
      await post('api/appointments/cancel', { id });
      setSuccess('Appointment cancelled successfully');
      loadData();
    } catch (error) {
      setError('Error cancelling appointment');
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <>
      <style>{`
        .card {
          background: linear-gradient(to bottom right, #ffffff, #fefefe);
          border-radius: 16px;
          padding: 32px;
          margin-bottom: 30px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.08);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid #e5e7eb;
          position: relative;
          overflow: hidden;
        }
        .card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--primary), var(--light-orange));
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .card:hover::before {
          opacity: 1;
        }
        .card h3 {
          background: linear-gradient(135deg, var(--primary), var(--light-orange));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 24px;
          font-size: 1.375rem;
          font-weight: 700;
        }
        .card p {
          color: #6b7280;
          margin-bottom: 15px;
        }
        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(255, 145, 77, 0.12), 0 4px 8px rgba(0, 0, 0, 0.08);
          border-color: rgba(255, 145, 77, 0.2);
        }

        .alert {
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
          border: 1px solid;
        }
        .alert-success {
          background: #d4edda;
          color: #155724;
          border-color: #c3e6cb;
        }
        .alert-error {
          background: #f8d7da;
          color: #721c24;
          border-color: #f5c6cb;
        }

        .appointments {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .appointments th, .appointments td {
          padding: 16px 18px;
          text-align: left;
        }
        .appointments th {
          background: linear-gradient(135deg, var(--primary), var(--light-orange));
          color: #fff;
          border: none;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.8125rem;
          letter-spacing: 0.05em;
        }
        .appointments tr:nth-child(even) {
          background: #fef8f4;
        }
        .appointments tr:hover {
          background: rgba(255, 145, 77, 0.08);
          transition: all 0.2s ease;
          transform: scale(1.001);
        }
        .appointments td {
          color: #374151;
        }
        .appointments .status-cell {
          color: #ff914d;
          font-weight: 600;
        }
        .appointments .action-link {
          color: #e74c3c;
          text-decoration: none;
          font-weight: 600;
        }
        .appointments .action-link:hover {
          text-decoration: underline;
        }

        form label {
          display: block;
          margin-top: 12px;
          font-weight: 600;
          color: #374151;
          font-size: 0.9375rem;
        }
        form select, form input[type="date"] {
          width: 100%;
          padding: 12px 14px;
          margin-top: 8px;
          border-radius: 10px;
          border: 1.5px solid #e5e7eb;
          outline: none;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          font-size: 0.9375rem;
          background: white;
        }
        form select:focus, form input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(255, 145, 77, 0.1), 0 2px 8px rgba(255, 145, 77, 0.15);
          transform: translateY(-1px);
        }
        form button {
          margin-top: 20px;
          background: linear-gradient(135deg, var(--primary), var(--light-orange));
          color: white;
          padding: 12px 28px;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.9375rem;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(255,145,77,0.3), 0 2px 4px rgba(255,145,77,0.2);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        form button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.5s ease;
        }
        form button:hover::before {
          left: 100%;
        }
        form button:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 8px 20px rgba(255,145,77,0.4), 0 4px 8px rgba(255,145,77,0.25);
        }

        #timeSlotInfo {
          font-size: 0.85rem;
          color: #666;
          margin-top: 5px;
        }
        #timeSlotInfo.available {
          color: #27ae60;
        }
        #timeSlotInfo.unavailable {
          color: #e74c3c;
        }
        #timeSlotInfo.loading {
          color: #ff914d;
        }
      `}</style>

      {success && <div className="alert alert-success">✅ {success}</div>}
      {error && <div className="alert alert-error">❌ {error}</div>}

      <div className="card">
        <h3>📅 Upcoming Appointments</h3>
        <p>Your scheduled appointments that are pending or confirmed.</p>

        <table className="appointments">
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Pet</th>
              <th>Service</th>
              <th>Veterinarian</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map(a => (
                <tr key={a.id}>
                  <td>{a.appointment_date}</td>
                  <td>{a.appointment_time ? a.appointment_time.substring(0, 5) : 'N/A'}</td>
                  <td>{a.pet_name}</td>
                  <td>{a.service_name}</td>
                  <td>{a.vet_name}</td>
                  <td className="status-cell">{a.status}</td>
                  <td>
                    {['Pending', 'Confirmed'].includes(a.status) ? (
                      <a href="#" className="action-link" onClick={(e) => { e.preventDefault(); handleCancel(a.id); }}>
                        Cancel
                      </a>
                    ) : (
                      <span style={{ color: 'gray' }}>—</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="7" style={{ textAlign: 'center', color: '#999' }}>No upcoming appointments.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="card" style={{ marginTop: '30px' }}>
        <h3>📜 Appointment History</h3>
        <p>Past and cancelled appointments.</p>

        <table className="appointments">
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Pet</th>
              <th>Service</th>
              <th>Veterinarian</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {historyAppointments.length > 0 ? (
              historyAppointments.map(a => (
                <tr key={a.id} style={{ opacity: 0.7 }}>
                  <td>{a.appointment_date}</td>
                  <td>{a.appointment_time ? a.appointment_time.substring(0, 5) : 'N/A'}</td>
                  <td>{a.pet_name}</td>
                  <td>{a.service_name}</td>
                  <td>{a.vet_name}</td>
                  <td>
                    {a.status === 'Cancelled' ? (
                      <span style={{ color: '#e74c3c', fontWeight: 600 }}>❌ Cancelled</span>
                    ) : a.status === 'Completed' ? (
                      <span style={{ color: '#27ae60', fontWeight: 600 }}>✅ Completed</span>
                    ) : (
                      <span style={{ color: '#95a5a6', fontWeight: 600 }}>📅 {a.status}</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6" style={{ textAlign: 'center', color: '#999' }}>No appointment history yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3>Book a New Appointment</h3>
        <form onSubmit={handleSubmit}>
          <label htmlFor="pet_id">Select Pet:</label>
          <select 
            name="pet_id" 
            id="pet_id" 
            value={formData.pet_id} 
            onChange={(e) => setFormData({ ...formData, pet_id: e.target.value })}
            required
          >
            <option value="">-- Choose your pet --</option>
            {pets.map(pet => (
              <option key={pet.id} value={pet.id}>
                {pet.name} ({pet.species})
              </option>
            ))}
          </select>

          <label htmlFor="service">Select Service:</label>
          <select 
            name="service" 
            id="service" 
            value={formData.service}
            onChange={handleServiceChange}
            required
          >
            <option value="">-- Choose service --</option>
            {services.map(service => (
              <option key={service.id} value={service.id} data-specialization={service.service_name}>
                {service.service_name} - ₱{parseFloat(service.fee).toFixed(2)}
              </option>
            ))}
          </select>

          <label htmlFor="veterinarian_id">Select Veterinarian:</label>
          <select 
            name="veterinarian_id" 
            id="veterinarian_id" 
            value={formData.veterinarian_id}
            onChange={handleVetChange}
            required
            disabled={filteredVets.length === 0}
          >
            {filteredVets.length === 0 ? (
              <option value="">-- Select a service first --</option>
            ) : (
              <>
                <option value="">-- Choose veterinarian --</option>
                {filteredVets.map(vet => (
                  <option key={vet.id} value={vet.id}>
                    {vet.name} ({vet.specialization})
                  </option>
                ))}
              </>
            )}
          </select>

          <label htmlFor="date">Date:</label>
          <input 
            type="date" 
            name="date" 
            id="date"
            value={formData.date}
            onChange={handleDateChange}
            min={today}
            required
          />

          <label htmlFor="time">Time:</label>
          <select 
            name="time" 
            id="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            required
          >
            <option value="">-- Choose time slot --</option>
            {timeSlots.length > 0 ? (
              timeSlots.map(slot => (
                <option key={slot} value={slot}>{slot}</option>
              ))
            ) : (
              generateTimeSlots().map(slot => (
                <option key={slot} value={slot}>{slot}</option>
              ))
            )}
          </select>
          <p 
            id="timeSlotInfo" 
            className={
              timeSlotInfo.includes('available') ? 'available' : 
              timeSlotInfo.includes('No available') ? 'unavailable' : 
              timeSlotInfo.includes('Loading') ? 'loading' : ''
            }
          >
            {timeSlotInfo}
          </p>

          <button type="submit">Book Appointment</button>
        </form>
      </div>
    </>
  );
}
