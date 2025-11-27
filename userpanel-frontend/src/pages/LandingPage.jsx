import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { get } from '../api';

function LandingPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [stats, setStats] = useState({
    upcoming: 0,
    pets: 0,
    completed: 0
  });
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    // Show welcome toast
    const toast = document.getElementById('toast');
    setTimeout(() => toast?.classList.add('show'), 500);
    setTimeout(() => toast?.classList.remove('show'), 4000);

    // Load data from API
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Fetch dashboard data from API
      const [dashboardRes, petsRes] = await Promise.all([
        get('api/dashboard'),
        get('api/pets')
      ]);

      console.log('Dashboard response:', dashboardRes);
      console.log('Pets response:', petsRes);

      if (dashboardRes.success) {
        const upcomingCount = dashboardRes.appointments?.length || 0;
        const petsCount = petsRes.success ? (petsRes.pets?.length || 0) : 0;
        
        // Count completed appointments (you can add this to backend)
        const completedCount = 0; // This would come from backend

        setStats({
          upcoming: upcomingCount,
          pets: petsCount,
          completed: completedCount
        });

        // Format appointments for display
        const formattedAppointments = (dashboardRes.appointments || []).slice(0, 3).map(apt => ({
          pet_name: apt.pet_name,
          service: apt.service,
          date: apt.appointment_date,
          vet_name: apt.veterinarian
        }));

        setAppointments(formattedAppointments);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      // Set default empty data on error
      setStats({
        upcoming: 0,
        pets: 0,
        completed: 0
      });
      setAppointments([]);
    }
  };

  useEffect(() => {
    // Progress bar
    const handleProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progressBar = document.getElementById('progress-bar');
      if (progressBar) {
        progressBar.style.width = `${(scrollTop / docHeight) * 100}%`;
      }
    };

    // Section fade-in
    const handleScroll = () => {
      const trigger = window.innerHeight * 0.85;
      document.querySelectorAll('section').forEach(sec => {
        const top = sec.getBoundingClientRect().top;
        if (top < trigger) sec.classList.add('show');
      });

      // Active nav link
      const navLinks = document.querySelectorAll('nav a');
      let fromTop = window.scrollY + 150;
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          const section = document.querySelector(href);
          if (section && section.offsetTop <= fromTop && section.offsetTop + section.offsetHeight > fromTop) {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
          }
        }
      });
    };

    window.addEventListener('scroll', handleProgress);
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleProgress);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

        * {
          margin: 0; padding: 0; box-sizing: border-box;
          scroll-behavior: smooth;
        }

        body {
          font-family: 'Poppins', sans-serif;
          background: #fffaf5;
          color: #333;
          overflow-x: hidden;
          transition: background 0.4s, color 0.4s;
        }

        h1, h2, h3 { color: #1a1a1a; }
        a { text-decoration: none; }

        /* HEADER */
        header {
          position: fixed;
          top: 0; width: 100%;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 2px 15px rgba(0,0,0,0.05);
          display: flex; justify-content: space-between; align-items: center;
          padding: 15px 50px;
          z-index: 1000;
          transition: all 0.3s ease;
        }
        header h2 {
          font-weight: 700;
          background: linear-gradient(135deg, #ff914d, #ffb47b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-size: 26px;
          letter-spacing: 0.5px;
          transition: 0.3s;
        }
        header:hover h2 { filter: brightness(1.1); }

        nav {
          display: flex;
          gap: 25px;
          align-items: center;
        }

        nav a {
          color: #333;
          font-weight: 500;
          position: relative;
          padding: 6px 0;
          transition: color 0.3s, transform 0.3s;
        }

        nav a::after {
          content: "";
          position: absolute;
          bottom: -5px; left: 0;
          width: 0%;
          height: 2px;
          background: linear-gradient(90deg, #ff914d, #ffb47b);
          transition: width 0.3s;
          border-radius: 2px;
        }
        nav a:hover::after, nav a.active::after { width: 100%; }
        nav a:hover, nav a.active { color: #ff914d; transform: translateY(-2px); }

        .btn-dashboard {
          background: linear-gradient(45deg, #ff914d, #ffb47b);
          color: white !important;
          padding: 8px 18px;
          border-radius: 25px;
          font-weight: 600;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 3px 10px rgba(255,145,77,0.3);
        }
        .btn-dashboard::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.5s ease;
        }
        .btn-dashboard:hover::before {
          left: 100%;
        }
        .btn-dashboard:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(255,145,77,0.4);
        }

        .logout-btn {
          background: linear-gradient(45deg, #ff914d, #ffb47b);
          color: white;
          border: none;
          border-radius: 25px;
          padding: 8px 20px;
          cursor: pointer;
          font-weight: 600;
          transition: 0.3s;
          box-shadow: 0 3px 10px rgba(255,145,77,0.3);
        }
        .logout-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255,145,77,0.4);
        }

        /* PROGRESS BAR */
        #progress-bar {
          position: fixed;
          top: 0;
          left: 0;
          height: 4px;
          background: linear-gradient(90deg, #ff914d, #ffb47b);
          width: 0%;
          z-index: 1500;
          transition: width 0.25s ease-out;
        }

        /* TOAST */
        .toast {
          position: fixed;
          top: 80px;
          right: 30px;
          background: #ff914d;
          color: white;
          padding: 15px 25px;
          border-radius: 10px;
          box-shadow: 0 6px 20px rgba(255,145,77,0.4);
          opacity: 0;
          transform: translateY(-20px);
          transition: all 0.6s ease;
          z-index: 2000;
        }
        .toast.show {
          opacity: 1;
          transform: translateY(0);
        }

        /* HERO */
        section#home {
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 100vh;
          padding: 120px 80px;
          background: linear-gradient(120deg, #fff7ef 40%, #fff 60%);
          animation: fadeInUp 1s ease;
        }
        .hero-content {
          flex: 1;
          padding-left: 60px;
          animation: fadeInUp 1s ease-in-out;
        }
        .hero-content h1 {
          font-size: 50px;
          margin-bottom: 20px;
          background: linear-gradient(45deg, #ff914d, #ffb47b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-content p {
          color: #555;
          font-size: 18px;
          max-width: 460px;
          margin-bottom: 30px;
        }
        .cta-btn {
          background: linear-gradient(135deg, #ff914d, #ffb47b);
          color: white;
          padding: 12px 35px;
          border-radius: 30px;
          font-weight: 600;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(255,145,77,0.4);
          transition: 0.3s;
          display: inline-block;
          border: none;
          cursor: pointer;
        }
        .cta-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.5s ease;
        }
        .cta-btn:hover::before {
          left: 100%;
        }
        .cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255,145,77,0.5);
        }
        .hero-img {
          flex: 1;
          text-align: center;
        }
        .hero-img img {
          width: 450px;
          border-radius: 50%;
          animation: float 3s ease-in-out infinite;
        }

        /* CAROUSEL */
        .carousel-section {
          position: relative;
          margin-top: -80px;
          padding: 0 0 60px 0;
          background: transparent;
          overflow: visible;
          z-index: 10;
        }
        .carousel-container {
          position: relative;
          width: 100vw;
          margin-left: calc(-50vw + 50%);
          margin-right: calc(-50vw + 50%);
          overflow: hidden;
          padding: 20px 0;
        }
        .carousel-gallery {
          display: flex;
          gap: 20px;
          animation: scroll-carousel 20s linear infinite;
          width: max-content;
          padding-left: 0;
        }
        .carousel-gallery:hover {
          animation-play-state: paused;
        }
        @keyframes scroll-carousel {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .pet-card {
          flex-shrink: 0;
          width: 300px;
          background: #fafaf8;
          border-radius: 12px;
          padding: 15px 15px 60px 15px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid #e8e8e6;
          transform-style: preserve-3d;
        }
        .pet-card:hover {
          transform: translateY(-10px) rotate(-2deg);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
          border-color: #d4d4d2;
        }
        .pet-card img {
          width: 100%;
          height: 280px;
          object-fit: cover;
          border-radius: 12px;
          transition: all 0.4s ease;
          filter: brightness(1);
        }
        .pet-card:hover img {
          filter: brightness(1.05);
          transform: scale(1.02);
        }

        /* PARALLAX DIVIDER */
        .parallax-divider {
          position: relative;
          height: 400px;
          background-image: url('http://localhost/userpanel-event/userpanel-backend/dog peeking.jfif');
          background-attachment: fixed;
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          margin: 50px 0;
        }
        .parallax-divider::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1;
        }
        .parallax-content {
          position: relative;
          z-index: 2;
          text-align: center;
          color: white;
          padding: 20px;
        }
        .parallax-content h3 {
          font-size: 42px;
          font-weight: 700;
          margin-bottom: 15px;
          color: white;
          text-shadow: 2px 2px 8px rgba(0,0,0,0.3);
        }
        .parallax-content p {
          font-size: 20px;
          font-weight: 300;
          color: #f0f0f0;
          text-shadow: 1px 1px 4px rgba(0,0,0,0.3);
        }

        /* SECTIONS */
        section#stats {
          padding-top: 80px;
        }
        section {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        section.show {
          opacity: 1;
          transform: translateY(0);
        }

        /* STATS SECTION */
        #stats {
          text-align: center;
          padding: 100px 60px;
          background: #fffaf5;
        }
        .section-title {
          font-size: 2rem;
          margin-bottom: 40px;
          background: linear-gradient(135deg, #ff914d, #ffb47b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 700;
        }
        .stats-container {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 25px;
        }
        .stat-card {
          background: white;
          border-radius: 15px;
          box-shadow: 0 8px 25px rgba(255,145,77,0.15);
          padding: 25px 40px;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          width: 260px;
        }
        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: linear-gradient(90deg, #ff914d, #ffb47b);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }
        .stat-card:hover::before {
          transform: scaleX(1);
        }
        .stat-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 30px rgba(255,145,77,0.25);
        }
        .stat-card h3 {
          color: #333;
          font-size: 18px;
          margin-bottom: 10px;
        }
        .stat-card p {
          font-size: 24px;
          font-weight: 700;
          color: #ff914d;
        }

        /* APPOINTMENTS */
        #appointments {
          padding: 100px 60px;
          text-align: center;
          background: #fff;
        }
        .appointment-grid {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 25px;
        }
        .appointment-card {
          background: #fffaf5;
          border-left: 5px solid #ff914d;
          border-radius: 15px;
          box-shadow: 0 8px 20px rgba(255,145,77,0.1);
          padding: 20px 30px;
          transition: 0.3s;
          width: 300px;
          text-align: left;
        }
        .appointment-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 25px rgba(255,145,77,0.25);
        }
        .appointment-card h3 {
          color: #ff914d;
          font-size: 18px;
          margin-bottom: 10px;
        }

        /* PET TIPS */
        #tips {
          padding: 100px 60px;
          text-align: center;
          background: #fffaf5;
        }
        .tips-container {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 25px;
        }
        .tip {
          background: white;
          border-radius: 15px;
          padding: 25px;
          box-shadow: 0 8px 25px rgba(255,145,77,0.15);
          width: 280px;
          transition: 0.3s;
        }
        .tip:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 30px rgba(255,145,77,0.25);
        }
        .tip-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 20px;
          background: linear-gradient(135deg, #ff914d, #ffb47b);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
          box-shadow: 0 8px 20px rgba(255,145,77,0.3);
          transition: all 0.3s ease;
        }
        .tip:hover .tip-icon {
          transform: scale(1.1) rotate(5deg);
          box-shadow: 0 12px 30px rgba(255,145,77,0.4);
        }
        .tip h3 {
          color: #ff914d;
          font-size: 18px;
          margin-bottom: 8px;
        }
        .tip p {
          color: #555;
          font-size: 15px;
        }

        /* FOOTER */
        footer {
          background: linear-gradient(120deg, #ff914d, #ffb47b);
          color: white;
          text-align: center;
          padding: 30px 0;
          margin-top: 50px;
        }

        /* ANIMATIONS */
        @keyframes fadeInUp {
          from {opacity: 0; transform: translateY(30px);}
          to {opacity: 1; transform: translateY(0);}
        }
        @keyframes float {
          0%,100% {transform: translateY(0);}
          50% {transform: translateY(-10px);}
        }
      `}</style>

      <div id="progress-bar"></div>

      <header>
        <h2>PetCare Portal</h2>
        <nav>
          <a href="#home" className="active">Home</a>
          <a href="#stats">Overview</a>
          <a href="#appointments">Appointments</a>
          <a href="#tips">Pet Tips</a>
          <Link to="/dashboard" className="btn-dashboard">Go to Dashboard</Link>
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <div className="toast" id="toast">Welcome back, {user?.name || 'User'}!</div>

      {/* HERO */}
      <section id="home">
        <div className="hero-content">
          <h1>Welcome, {user?.name || 'User'}!</h1>
          <p>Your pet's wellbeing is our top priority. Manage appointments, track health, and discover expert pet tips — all in one place.</p>
          <a href="#appointments" className="cta-btn">View Appointments</a>
        </div>
        <div className="hero-img">
          <img src="http://localhost/userpanel-event/userpanel-backend/vet cat.jfif.jfif" alt="Vet Illustration" />
        </div>
      </section>

      {/* CAROUSEL */}
      <div className="carousel-section">
        <div className="carousel-container">
          <div className="carousel-gallery">
            {/* First set */}
            {Array.from({ length: 10 }, (_, i) => (
              <div key={i} className="pet-card">
                <img src={`http://localhost/userpanel-event/userpanel-backend/pet${i + 1}.jfif`} alt={`Pet ${i + 1}`} />
              </div>
            ))}
            {/* Duplicate set for seamless loop */}
            {Array.from({ length: 10 }, (_, i) => (
              <div key={`dup-${i}`} className="pet-card">
                <img src={`http://localhost/userpanel-event/userpanel-backend/pet${i + 1}.jfif`} alt={`Pet ${i + 1}`} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <section id="stats">
        <h2 className="section-title">Your Dashboard Overview</h2>
        <div className="stats-container">
          <div className="stat-card">
            <h3>Upcoming Appointments</h3>
            <p>{stats.upcoming}</p>
          </div>
          <div className="stat-card">
            <h3>Registered Pets</h3>
            <p>{stats.pets}</p>
          </div>
          <div className="stat-card">
            <h3>Completed Visits</h3>
            <p>{stats.completed}</p>
          </div>
        </div>
      </section>

      <section id="appointments">
        <h2 className="section-title">Upcoming Appointments</h2>
        <div className="appointment-grid">
          {appointments.length > 0 ? (
            appointments.map((apt, index) => (
              <div key={index} className="appointment-card">
                <h3>{apt.pet_name} - {apt.service}</h3>
                <p>Date: {apt.date}</p>
                <p>Vet: {apt.vet_name}</p>
              </div>
            ))
          ) : (
            <div className="appointment-card">
              <h3>No Upcoming Appointments</h3>
              <p>You don't have any scheduled appointments yet.</p>
              <p><Link to="/dashboard/appointments" style={{ color: '#ff914d' }}>Book an appointment now!</Link></p>
            </div>
          )}
        </div>
      </section>

      {/* PARALLAX DIVIDER */}
      <div className="parallax-divider">
        <div className="parallax-content">
          <h3>We Care For Your Pets</h3>
          <p>Like Family, Because They Are</p>
        </div>
      </div>

      <section id="tips">
        <h2 className="section-title">Pet Wellness Tips</h2>
        <div className="tips-container">
          <div className="tip">
            <div className="tip-icon">💧</div>
            <h3>Stay Hydrated</h3>
            <p>Keep fresh water available at all times.</p>
          </div>
          <div className="tip">
            <div className="tip-icon">✂️</div>
            <h3>Regular Grooming</h3>
            <p>Brushing helps prevent matting and promotes healthy skin.</p>
          </div>
          <div className="tip">
            <div className="tip-icon">🏥</div>
            <h3>Annual Checkups</h3>
            <p>Routine vet visits ensure long-term health.</p>
          </div>
        </div>
      </section>

      <footer>
        <p>© 2025 PetCare Portal | All rights reserved.</p>
      </footer>
    </>
  );
}

export default LandingPage;
