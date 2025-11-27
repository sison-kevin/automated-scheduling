import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { get } from '../api';

export default function DashboardHome() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const response = await get('api/dashboard');
      if (response.success) {
        setAppointments(response.appointments || []);
      }
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .card {
          background: var(--card);
          border-radius: 14px;
          padding: 30px;
          margin-bottom: 30px;
          box-shadow: 0 6px 20px rgba(0,0,0,0.05);
          transition: 0.3s;
        }
        .card h3 {
          color: var(--primary);
          margin-bottom: 20px;
          font-size: 1.3rem;
        }
        .card:hover {
          transform: translateY(-2px);
        }

        .search-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .appointments {
          width: 100%;
          border-collapse: collapse;
        }
        .appointments th, .appointments td {
          padding: 14px 16px;
          text-align: left;
        }
        .appointments th {
          background: var(--primary);
          color: #fff;
          border: none;
        }
        .appointments tr:nth-child(even) {
          background: #fdf7f2;
        }
        .appointments tr:hover {
          background: #fff0e4;
          transition: 0.2s;
        }
      `}</style>

      <div className="card">
        <h3>Welcome Back, {user?.name || 'User'}!</h3>
        <p>Manage appointments, track your pets' medical records, and connect with veterinarians — all in one clean, modern dashboard.</p>
      </div>

      <div className="card">
        <div className="search-bar">
          <h3>Upcoming Appointments</h3>
        </div>

        {loading ? (
          <p>Loading appointments...</p>
        ) : (
          <table className="appointments">
            <thead>
              <tr>
                <th>Date</th>
                <th>Pet Name</th>
                <th>Service</th>
                <th>Veterinarian</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length > 0 ? (
                appointments.map((appt, index) => (
                  <tr key={index}>
                    <td>{appt.appointment_date || 'N/A'}</td>
                    <td>{appt.pet_name || 'N/A'}</td>
                    <td>{appt.service_name || appt.service || 'N/A'}</td>
                    <td>{appt.vet_name || appt.veterinarian || 'N/A'}</td>
                    <td>{appt.status || 'N/A'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>No upcoming appointments.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
