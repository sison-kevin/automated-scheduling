import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { get } from '../api';

export default function VeterinariansPage() {
  const [veterinarians, setVeterinarians] = useState([]);

  useEffect(() => {
    loadVeterinarians();
  }, []);

  const loadVeterinarians = async () => {
    try {
      const response = await get('api/veterinarians');
      if (response.success) {
        setVeterinarians(response.veterinarians || []);
      }
    } catch (error) {
      console.error('Error loading veterinarians:', error);
    }
  };

  return (
    <>
      <style>{`
        .card {
          background: var(--card);
          border-radius: 14px;
          padding: 40px 35px;
          margin-bottom: 30px;
          box-shadow: 0 6px 24px rgba(0,0,0,0.06);
          transition: 0.3s;
        }
        .card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.08);
        }
        .card h3 {
          color: var(--primary);
          margin-bottom: 18px;
          font-size: 1.35rem;
          font-weight: 700;
        }
        .card p {
          color: #555;
          font-size: 0.96rem;
        }

        .back-link {
          display: inline-block;
          margin-bottom: 25px;
          color: var(--primary);
          font-weight: 500;
          text-decoration: none;
          transition: 0.2s;
        }
        .back-link:hover {
          text-decoration: underline;
        }

        .vet-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 25px;
          animation: fadeUp 0.6s ease;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .vet-table th, .vet-table td {
          padding: 14px 16px;
          text-align: left;
        }
        .vet-table th {
          background: var(--primary);
          color: #fff;
          border: none;
          font-weight: 600;
        }
        .vet-table td {
          color: #333;
        }
        .vet-table tr:nth-child(even) {
          background: #fdf7f2;
        }
        .vet-table tr:hover {
          background: #fff0e4;
          transition: 0.2s;
        }

        .status-badge {
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 700;
          display: inline-block;
        }
        .status-active {
          background: #d1f4e0;
          color: #0f5132;
        }
        .status-inactive {
          background: #f8d7da;
          color: #721c24;
        }

        .no-data {
          background: #fff5ef;
          padding: 15px;
          border-radius: 8px;
          border-left: 5px solid var(--primary);
          margin-top: 25px;
        }
      `}</style>

      <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>

      <div className="card">
        <h3>Available Veterinarians</h3>
        <p>Explore our list of qualified veterinarians, their specializations, and contact information below.</p>

        {veterinarians.length > 0 ? (
          <table className="vet-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Specialization</th>
                <th>Contact</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {veterinarians.map(vet => {
                const isActive = vet.is_active === 1 || vet.is_active === '1' || vet.is_active === true;
                return (
                  <tr key={vet.id}>
                    <td>{vet.id}</td>
                    <td>{vet.name}</td>
                    <td>{vet.specialization}</td>
                    <td>{vet.contact}</td>
                    <td>
                      {isActive ? (
                        <span className="status-badge status-active">● ACTIVE</span>
                      ) : (
                        <span className="status-badge status-inactive">● INACTIVE</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p className="no-data">
            No veterinarians found in the system.
          </p>
        )}
      </div>
    </>
  );
}
