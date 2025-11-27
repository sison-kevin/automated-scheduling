import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function AuthPage() {
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPasswordLogin, setShowPasswordLogin] = useState(false);
  const [showPasswordRegister, setShowPasswordRegister] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();

  // Show success message if coming from verification
  useEffect(() => {
    if (location.state?.verified) {
      setSuccess('Email verified successfully! You can now login.');
      setShowLogin(true);
      // Clear the state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Scroll effects
  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector('header');
      header?.classList.toggle('scrolled', window.scrollY > 80);
      
      // Active nav link
      const navLinks = document.querySelectorAll('nav a');
      let fromTop = window.scrollY + 150;
      navLinks.forEach(link => {
        const section = document.querySelector(link.getAttribute('href'));
        if (section) {
          if (section.offsetTop <= fromTop && section.offsetTop + section.offsetHeight > fromTop) {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top button
  useEffect(() => {
    const scrollBtn = document.getElementById("scrollTopBtn");
    const handleScroll = () => {
      if (scrollBtn) {
        scrollBtn.style.display = window.scrollY > 400 ? "block" : "none";
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Close forms when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest('.form-container') && !e.target.closest('.toggle-btn')) {
        setShowRegister(false);
        setShowLogin(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      await register(formData.name, formData.username, formData.email, formData.password);
      setSuccess('Registration successful! Check your email for the verification code.');
      const userEmail = formData.email;
      setFormData({ name: '', username: '', email: '', password: '', confirmPassword: '' });
      setShowRegister(false);
      setTimeout(() => {
        navigate('/verify', { state: { email: userEmail } });
      }, 2000);
    } catch (err) {
      setError(err.message || 'An error occurred');
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await login(formData.email, formData.password);
      navigate('/landing');
    } catch (err) {
      setError(err.message || 'An error occurred');
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
          font-family: 'Poppins', sans-serif;
          color: #1a1a1a;
          background: linear-gradient(135deg, #fffaf5, #fff5eb);
          overflow-x: hidden;
          scroll-behavior: smooth;
        }

        header {
          position: fixed;
          top: 0;
          width: 100%;
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 60px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
          z-index: 999;
          transition: all 0.4s ease;
        }
        header.scrolled { background: rgba(255,255,255,0.95); box-shadow: 0 5px 25px rgba(0,0,0,0.1); }
        header h2 { color: #ff914d; font-weight: 700; font-size: 1.8rem; }
        nav { display: flex; gap: 30px; }
        nav a {
          color: #333;
          text-decoration: none;
          font-weight: 500;
          transition: 0.3s;
          position: relative;
        }
        nav a::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #ff914d, #ffb47b);
          transition: width 0.3s ease;
        }
        nav a:hover::after, nav a.active::after { width: 100%; }
        nav a.active { color: #ff914d; }
        
        .header-buttons { display: flex; gap: 12px; }
        .toggle-btn {
          background: linear-gradient(135deg, #ff914d, #ffb47b);
          color: white;
          border: none;
          padding: 10px 24px;
          border-radius: 25px;
          cursor: pointer;
          font-weight: 600;
          box-shadow: 0 4px 12px rgba(255,145,77,0.3);
          transition: all 0.3s ease;
        }
        .toggle-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(255,145,77,0.4); }

        section {
          padding: 100px 80px;
          animation: fadeIn 1s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        #home {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 140px;
          gap: 50px;
          background: linear-gradient(135deg, #fffaf5, #fff5eb);
        }
        .hero-content { flex: 1; animation: float 4s ease-in-out infinite; }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .hero-content h1 {
          font-size: 3.2rem;
          background: linear-gradient(90deg, #ff914d, #ffb47b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 20px;
          font-weight: 700;
        }
        .hero-content p { font-size: 1.2rem; color: #555; margin-bottom: 30px; line-height: 1.7; }
        .cta-btn {
          display: inline-block;
          padding: 14px 36px;
          background: linear-gradient(135deg, #ff914d, #ffb47b);
          color: white;
          text-decoration: none;
          border-radius: 30px;
          font-weight: 600;
          box-shadow: 0 8px 20px rgba(255,145,77,0.4);
          transition: all 0.3s ease;
          animation: fadeInUp 1.5s ease;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .cta-btn:hover { transform: translateY(-3px); box-shadow: 0 10px 25px rgba(255,145,77,0.5); }
        .hero-img { flex: 1; text-align: center; }
        .hero-img img { width: 100%; max-width: 500px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }

        .section-title {
          text-align: center;
          font-size: 2.5rem;
          color: #ff914d;
          margin-bottom: 50px;
          font-weight: 700;
        }

        .reasons {
          display: flex;
          justify-content: center;
          gap: 40px;
          flex-wrap: wrap;
        }
        .reason {
          background: white;
          padding: 25px;
          border-radius: 15px;
          width: 280px;
          text-align: center;
          box-shadow: 0 8px 20px rgba(0,0,0,0.05);
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .reason::before {
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
        .reason:hover::before { transform: scaleX(1); }
        .reason:hover { transform: translateY(-8px); box-shadow: 0 10px 25px rgba(255,145,77,0.2); }
        .reason img {
          width: 160px;
          height: 160px;
          object-fit: cover;
          border-radius: 10px;
          margin-bottom: 15px;
        }
        .reason h3 { color: #ff914d; margin-bottom: 10px; }

        .services-grid {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 30px;
        }
        .service-card {
          background: white;
          width: 280px;
          padding: 25px;
          border-radius: 15px;
          text-align: center;
          box-shadow: 0 5px 20px rgba(0,0,0,0.05);
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          border: 1px solid #f0f0f0;
        }
        .service-card::before {
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
        .service-card:hover::before { transform: scaleX(1); }
        .service-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 10px 25px rgba(255,145,77,0.2);
          border-color: rgba(255,145,77,0.3);
        }
        .service-card .icon {
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
        .service-card:hover .icon {
          transform: scale(1.1) rotate(5deg);
          box-shadow: 0 12px 30px rgba(255,145,77,0.4);
        }
        .service-card h3 {
          color: #ff914d;
          margin-bottom: 12px;
          font-size: 1.25rem;
          font-weight: 600;
        }
        .service-card p {
          color: #666;
          font-size: 0.9375rem;
          line-height: 1.6;
        }

        #contact .contact-info {
          text-align: center;
          font-size: 18px;
          color: #555;
          line-height: 1.7;
          margin-bottom: 50px;
        }

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
        .gallery {
          display: flex;
          gap: 20px;
          animation: scroll-carousel 20s linear infinite;
          width: max-content;
          padding-left: 0;
        }
        .gallery:hover { animation-play-state: paused; }
        @keyframes scroll-carousel {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
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

        .parallax-divider {
          position: relative;
          height: 400px;
          background-image: url('http://localhost/userpanel-event/userpanel-backend/cat peeking.jfif');
          background-attachment: fixed;
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
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

        #about { padding-top: 80px; }
        footer {
          background: linear-gradient(120deg, #ff914d, #ffb47b);
          color: white;
          text-align: center;
          padding: 30px 0;
          margin-top: 50px;
        }
        footer p { margin: 5px 0; }

        #scrollTopBtn {
          position: fixed;
          bottom: 30px;
          right: 30px;
          background: #ff914d;
          color: white;
          border: none;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          font-size: 20px;
          cursor: pointer;
          box-shadow: 0 5px 15px rgba(255,145,77,0.4);
          display: none;
          transition: all 0.3s ease;
          z-index: 999;
        }
        #scrollTopBtn:hover {
          background: #ffb47b;
          transform: translateY(-4px);
        }

        .about-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 60px;
          flex-wrap: wrap;
          max-width: 1100px;
          margin: 0 auto;
          animation: fadeInUp 1s ease;
        }
        .about-image img {
          width: 420px;
          border-radius: 20px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          transition: transform 0.4s ease;
        }
        .about-image img:hover { transform: scale(1.03); }
        .about-text { max-width: 550px; }
        .about-text p { font-size: 18px; color: #555; line-height: 1.8; margin-bottom: 25px; }

        .form-container {
          display: none;
          position: fixed;
          top: 110px;
          right: 50px;
          background: transparent;
          padding: 0;
          border-radius: 10px;
          width: 380px;
          z-index: 999;
        }
        .form-container.active { display: block; }
        .form-card {
          background: white;
          padding: 22px 22px 18px 22px;
          border-radius: 12px;
          box-shadow: 0 18px 50px rgba(15,15,15,0.12);
          border: 1px solid rgba(0,0,0,0.03);
        }
        .form-card h2 { margin-bottom: 6px; font-size: 20px; color: #1a1a1a; }
        .form-card p.sub { margin: 0 0 12px 0; color: #666; font-size: 13px; }
        .input-group { position: relative; display: flex; align-items: center; gap: 8px; margin: 10px 0; }
        .input-group input {
          width: 100%;
          padding: 12px 42px 12px 14px;
          border: 1px solid #eee;
          border-radius: 8px;
          font-size: 14px;
          outline: none;
          transition: box-shadow 0.15s ease, border-color 0.15s ease;
        }
        .input-group input:focus { box-shadow: 0 6px 18px rgba(255,145,77,0.08); border-color: rgba(255,145,77,0.2); }
        .input-icon { position: absolute; right: 10px; font-size: 16px; color: #888; background: transparent; border: none; cursor: pointer; }
        .form-card .submit-btn {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #ff914d, #ffb47b);
          color: white;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 700;
          margin-top: 12px;
        }
        .small-note { font-size: 12px; color: #777; margin-top: 8px; }

        .message {
          padding: 10px 15px;
          border-radius: 8px;
          margin-bottom: 15px;
          font-size: 13px;
          font-weight: 500;
          animation: slideIn 0.3s ease;
        }
        .error-message {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }
        .success-message {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        #location {
          background: #fffaf5;
          padding: 100px 80px;
        }
        .location-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 60px;
          flex-wrap: wrap;
          max-width: 1100px;
          margin: 0 auto;
          animation: fadeInUp 1s ease;
        }
        .location-text {
          flex: 1;
          font-size: 18px;
          color: #555;
          line-height: 1.8;
        }
        .location-text p { margin-bottom: 15px; }
        .map-container {
          flex: 1;
          min-width: 400px;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
        }
      `}</style>

      <header>
        <h2>PetCare</h2>
        <nav>
          <a href="#home" className="active">Home</a>
          <a href="#about">About Us</a>
          <a href="#why">Why Choose Us</a>
          <a href="#services">Services</a>
          <a href="#contact">Contact</a>
          <a href="#location">Location</a>
        </nav>
        <div className="header-buttons">
          <button className="toggle-btn" onClick={(e) => { e.stopPropagation(); setShowLogin(false); setShowRegister(true); }}>Register</button>
          <button className="toggle-btn" onClick={(e) => { e.stopPropagation(); setShowRegister(false); setShowLogin(true); }}>Login</button>
        </div>
      </header>

      <section id="home">
        <div className="hero-content">
          <h1>Your Trusted Veterinary Companion</h1>
          <p>Expert care, compassionate treatment, and modern facilities to keep your pets healthy and happy.</p>
          <a href="#services" className="cta-btn">Explore Services</a>
        </div>
        <div className="hero-img">
          <img src="http://localhost/userpanel-event/userpanel-backend/vet%20dog.jfif" alt="Veterinary Dog" />
        </div>
      </section>

      <div className="carousel-section">
        <div className="carousel-container">
          <div className="gallery">
            {[...Array(2)].map((_, setIndex) => (
              <div key={setIndex} style={{ display: 'flex', gap: '20px' }}>
                {Array.from({ length: 10 }, (_, i) => (
                  <div key={i} className="pet-card">
                    <img src={`http://localhost/userpanel-event/userpanel-backend/pet${i + 1}.jfif`} alt={`Pet ${i + 1}`} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <section id="about">
        <h2 className="section-title">About Us</h2>
        <div className="about-container">
          <div className="about-image">
            <img src="http://localhost/userpanel-event/userpanel-backend/vet%20with%20pet.jfif" alt="Vet with pet" />
          </div>
          <div className="about-text">
            <p>At <strong>PetCare</strong>, we're passionate about keeping your furry companions happy and healthy. 
            Our team of experienced veterinarians and caring staff provide expert medical care in a warm, stress-free environment. 
            From preventive checkups to emergency treatment, we ensure your pets receive the best care possible — because they're family.</p>
            <a href="#services" className="cta-btn">Learn More</a>
          </div>
        </div>
      </section>

      <section id="why">
        <h2 className="section-title">Why Choose Us?</h2>
        <div className="reasons">
          <div className="reason">
            <img src="http://localhost/userpanel-event/userpanel-backend/expert%20vet.jfif" alt="Expert Vet" />
            <h3>Expert Veterinarians</h3>
            <p>Certified professionals passionate about animal wellness.</p>
          </div>
          <div className="reason">
            <img src="http://localhost/userpanel-event/userpanel-backend/emergency.jfif" alt="Emergency" />
            <h3>24/7 Emergency</h3>
            <p>Round-the-clock emergency service for your peace of mind.</p>
          </div>
          <div className="reason">
            <img src="http://localhost/userpanel-event/userpanel-backend/modern%20facility.jfif" alt="Facility" />
            <h3>Modern Facilities</h3>
            <p>Advanced equipment for accurate diagnosis and care.</p>
          </div>
        </div>
      </section>

      <section id="services">
        <h2 className="section-title">Our Services</h2>
        <div className="services-grid">
          <div className="service-card">
            <div className="icon">🏥</div>
            <h3>Routine Checkups</h3>
            <p>Comprehensive exams to keep your pets in great shape.</p>
          </div>
          <div className="service-card">
            <div className="icon">💉</div>
            <h3>Vaccinations</h3>
            <p>Preventative care to protect your furry friends.</p>
          </div>
          <div className="service-card">
            <div className="icon">✂️</div>
            <h3>Grooming</h3>
            <p>Pamper your pet with our expert grooming services.</p>
          </div>
          <div className="service-card">
            <div className="icon">🔬</div>
            <h3>Surgery</h3>
            <p>Safe, advanced surgical care from trusted veterinarians.</p>
          </div>
        </div>
      </section>

      <section id="contact">
        <h2 className="section-title">Contact Us</h2>
        <div className="contact-info">
          <p>Email: cityvet@gmail.com.com | Phone: +63 912-3456-789</p>
          <p>Visit us at 123 Paw Avenue, Calapan City, Oriental Mindoro</p>
        </div>
      </section>

      <div className="parallax-divider">
        <div className="parallax-content">
          <h3>We Care For Your Pets</h3>
          <p>Like Family, Because They Are</p>
        </div>
      </div>

      <section id="location">
        <h2 className="section-title">Find Us</h2>
        <div className="location-container">
          <div className="location-text">
            <p>We're conveniently located in the heart of <strong>Calapan City, Oriental Mindoro</strong>.</p>
            <p>Drop by for a visit — we're always happy to welcome you and your furry friends!</p>
            <p><strong>Address:</strong> 123 Paw Avenue, Calapan City, Oriental Mindoro</p>
            <p><strong>Operating Hours:</strong> Open 24 Hours, 7 Days a Week</p>
          </div>
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps?q=13.4138889,121.18&z=16&output=embed"
              width="100%"
              height="350"
              style={{ border: 0, borderRadius: '15px', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade">
            </iframe>
          </div>
        </div>
      </section>

      {/* Register Form */}
      <div className={`form-container ${showRegister ? 'active' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="form-card">
          <h2>Create account</h2>
          <p className="sub">Join PetCare — manage your pets, appointments, and records.</p>
          {error && showRegister && <div className="message error-message">❌ {error}</div>}
          {success && showRegister && <div className="message success-message">✅ {success}</div>}
          <form onSubmit={handleRegisterSubmit}>
            <div className="input-group">
              <input type="text" name="name" placeholder="Full name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <input type={showPasswordRegister ? 'text' : 'password'} name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
              <button type="button" className="input-icon" onClick={() => setShowPasswordRegister(s => !s)} aria-label="Toggle password visibility">{showPasswordRegister ? '🙈' : '👁️'}</button>
            </div>
            <div className="input-group">
              <input type={showPasswordRegister ? 'text' : 'password'} name="confirmPassword" placeholder="Confirm password" value={formData.confirmPassword} onChange={handleChange} required />
              <button type="button" className="input-icon" onClick={() => setShowPasswordRegister(s => !s)} aria-label="Toggle password visibility">{showPasswordRegister ? '🙈' : '👁️'}</button>
            </div>
            <div className="small-note">By creating an account you agree to our terms and privacy.</div>
            <button type="submit" className="submit-btn">Create account</button>
          </form>
        </div>
      </div>

      {/* Login Form */}
      <div className={`form-container ${showLogin ? 'active' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="form-card">
          <h2>Welcome back</h2>
          <p className="sub">Sign in to manage your appointments and pets.</p>
          {error && showLogin && <div className="message error-message">❌ {error}</div>}
          <form onSubmit={handleLoginSubmit}>
            <div className="input-group">
              <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <input type={showPasswordLogin ? 'text' : 'password'} name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
              <button type="button" className="input-icon" onClick={() => setShowPasswordLogin(s => !s)} aria-label="Toggle password visibility">{showPasswordLogin ? '🙈' : '👁️'}</button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="small-note">Forgot password? <button type="button" style={{ background: 'transparent', border: 'none', color: '#ff914d', cursor: 'pointer' }} onClick={() => navigate('/verify')}>Reset</button></div>
            </div>
            <button type="submit" className="submit-btn">Sign in</button>
          </form>
        </div>
      </div>

      <footer>
        <p>© 2025 PetCare Veterinary Portal</p>
      </footer>

      <button id="scrollTopBtn" onClick={scrollToTop}>&#8679;</button>
    </>
  );
}

export default AuthPage;
