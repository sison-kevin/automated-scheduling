import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (path) => {
    if (path === '/dashboard' && location.pathname === '/dashboard') return true;
    if (path !== '/dashboard' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        :root {
          --primary: #ff914d;
          --light-orange: #ffb47b;
          --bg: #f7f9fb;
          --text: #222;
          --card: #fff;
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', sans-serif;
          background: var(--bg);
          color: var(--text);
        }

        /* ===== HEADER ===== */
        header {
          position: sticky;
          top: 0;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(12px);
          box-shadow: 0 2px 12px rgba(0,0,0,0.05);
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 18px 50px;
          z-index: 100;
        }
        header h1 {
          color: var(--primary);
          font-size: 1.4rem;
          font-weight: 700;
          letter-spacing: 0.3px;
        }
        .user-info {
          color: #555;
          font-size: 0.9rem;
        }
        .btn {
          background: var(--primary);
          color: #fff;
          padding: 9px 20px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          box-shadow: 0 4px 10px rgba(255,145,77,0.25);
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
        }
        .btn:hover {
          background: var(--light-orange);
          transform: translateY(-2px);
        }

        /* ===== LAYOUT ===== */
        .dashboard {
          display: grid;
          grid-template-columns: 240px 1fr;
          min-height: 100vh;
        }

        /* ===== SIDEBAR ===== */
        .sidebar {
          background: var(--card);
          box-shadow: 3px 0 12px rgba(0,0,0,0.05);
          padding: 40px 20px;
          display: flex;
          flex-direction: column;
          border-right: 1px solid #eee;
        }
        .sidebar h3 {
          text-align: center;
          color: var(--primary);
          margin-bottom: 30px;
          font-weight: 700;
        }
        .sidebar a {
          display: block;
          padding: 12px 16px;
          border-radius: 10px;
          color: #444;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.3s ease;
          margin-bottom: 8px;
        }
        .sidebar a:hover,
        .sidebar a.active {
          background: linear-gradient(45deg, var(--primary), var(--light-orange));
          color: white;
          box-shadow: 0 3px 12px rgba(255,145,77,0.25);
          transform: translateX(5px);
        }

        /* ===== MAIN ===== */
        .main-content {
          padding: 40px 60px;
          animation: fadeIn 0.4s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* FOOTER */
        footer {
          text-align: center;
          padding: 20px;
          color: #666;
          font-size: 0.9rem;
          border-top: 1px solid #eee;
          background: #fff;
        }

        /* RESPONSIVE */
        @media (max-width: 900px) {
          .dashboard {
            grid-template-columns: 1fr;
          }
          .sidebar {
            flex-direction: row;
            justify-content: center;
            border-right: none;
            border-bottom: 1px solid #eee;
          }
          .main-content {
            padding: 30px 20px;
          }
        }
      `}</style>

      <header>
        <div>
          <h1>Veterinary Services Dashboard</h1>
          <div className="user-info">
            {user?.name || 'User'} | {user?.email || ''}
          </div>
        </div>
        <button onClick={handleLogout} className="btn">Logout</button>
      </header>

      <div className="dashboard">
        {/* Sidebar */}
        <aside className="sidebar">
          <h3>Navigation</h3>
          <Link to="/landing">Landing Page</Link>
          <Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>Dashboard</Link>
          <Link to="/dashboard/appointments" className={isActive('/dashboard/appointments') ? 'active' : ''}>Appointments</Link>
          <Link to="/dashboard/pets" className={isActive('/dashboard/pets') ? 'active' : ''}>Pets</Link>
          <Link to="/dashboard/veterinarians" className={isActive('/dashboard/veterinarians') ? 'active' : ''}>Veterinarians</Link>
          <Link to="/dashboard/settings" className={isActive('/dashboard/settings') ? 'active' : ''}>Settings</Link>
        </aside>

        {/* Main Content */}
        <section className="main-content">
          <Outlet />
        </section>
      </div>

      <footer>
        &copy; {new Date().getFullYear()} Automated Scheduling and Tracking System for Veterinary Services – Calapan City, Oriental Mindoro
      </footer>
    </>
  );
}
