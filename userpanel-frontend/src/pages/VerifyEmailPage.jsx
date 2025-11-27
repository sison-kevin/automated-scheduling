

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { post } from '../api';

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!email) {
      navigate('/auth');
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!code || code.length !== 6) {
      setError('Please enter a valid 6-digit verification code');
      return;
    }

    setLoading(true);

    try {
      const response = await post('/api/verify', {
        email,
        code
      });

      if (response.success) {
        setSuccess('Email verified successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/auth', { state: { verified: true } });
        }, 2000);
      } else {
        setError(response.message || 'Invalid verification code');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Verification error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await post('/api/register/resend', {
        email
      });

      if (response.success) {
        setSuccess('Verification code resent to your email!');
      } else {
        setError(response.message || 'Failed to resend code');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Resend error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        body, #root {
          min-height: 100vh;
          width: 100vw;
          margin: 0;
          padding: 0;
          font-family: 'Poppins', sans-serif;
        }
        .verify-bg {
          position: fixed;
          width: 100vw;
          height: 100vh;
          left: 0; top: 0;
          background: radial-gradient(circle at top left, #fff5ec, #fffaf5, #fff8f0);
          z-index: 0;
        }
        .verify-card {
          position: relative;
          background: rgba(255,255,255,0.8);
          backdrop-filter: blur(18px);
          border: 1px solid rgba(255,255,255,0.5);
          box-shadow: 0 10px 40px rgba(255,145,77,0.15);
          border-radius: 30px;
          padding: 50px 60px;
          text-align: center;
          max-width: 420px;
          width: 90%;
          z-index: 2;
          margin: 60px auto;
          animation: fadeUp 0.8s ease forwards;
          transition: all 0.3s ease;
        }
        .verify-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 50px rgba(255,145,77,0.25);
        }
        .verify-card .logo {
          width: 85px;
          margin-bottom: 20px;
          animation: floatLogo 3s ease-in-out infinite;
        }
        .verify-card h2 {
          color: #ff914d;
          font-weight: 700;
          font-size: 28px;
          margin-bottom: 10px;
        }
        .verify-card p {
          color: #555;
          font-size: 16px;
          margin-bottom: 30px;
          line-height: 1.6;
        }
        .verify-card form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .verify-card input[type="text"] {
          padding: 12px;
          border-radius: 10px;
          border: 1px solid #ddd;
          text-align: center;
          font-size: 18px;
          letter-spacing: 3px;
          font-weight: 500;
          color: #333;
          transition: all 0.3s ease;
        }
        .verify-card input[type="text"]:focus {
          border-color: #ff914d;
          box-shadow: 0 0 10px rgba(255,145,77,0.4);
          outline: none;
          transform: scale(1.03);
        }
        .verify-card button[type="submit"] {
          padding: 12px;
          background: linear-gradient(90deg, #ff914d, #ffa76c);
          border: none;
          border-radius: 12px;
          color: #fff;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 6px 20px rgba(255,145,77,0.3);
        }
        .verify-card button[type="submit"]:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(255,145,77,0.45);
          background: linear-gradient(90deg, #ffa76c, #ff914d);
        }
        .footer-note {
          margin-top: 20px;
          font-size: 14px;
          color: #777;
        }
        .footer-note a, .footer-note button {
          color: #ff914d;
          text-decoration: none;
          font-weight: 500;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
        }
        .footer-note a:hover, .footer-note button:hover {
          text-decoration: underline;
        }
        .message {
          padding: 10px 15px;
          border-radius: 8px;
          margin-bottom: 15px;
          font-size: 13px;
          font-weight: 500;
          animation: fadeUp 0.3s ease;
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
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatLogo {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @media (max-width: 480px) {
          .verify-card {
            padding: 40px 20px;
          }
          .verify-card h2 { font-size: 24px; }
          .verify-card p { font-size: 15px; }
          .verify-card input[type="text"], .verify-card button { font-size: 15px; }
        }
      `}</style>
      <div className="verify-bg"></div>
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
        <div className="verify-card">
          <div className="logo" style={{
            width: '85px',
            height: '85px',
            margin: '0 auto 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ff914d 0%, #ffa76c 100%)',
            fontSize: '48px',
            color: 'white',
            boxShadow: '0 4px 16px rgba(255,145,77,0.18)'
          }}>
            <span role="img" aria-label="envelope">✉️</span>
          </div>
          <h2>Email Verification</h2>
          <p>Please enter the 6-digit code sent to your email to verify your account and continue.<br />
            <span style={{ color: '#ff914d', fontWeight: 500 }}>{email}</span>
          </p>
          <form onSubmit={handleSubmit} autoComplete="off">
            {error && <div className="message error-message">❌ {error}</div>}
            {success && <div className="message success-message">✅ {success}</div>}
            <input
              type="text"
              value={code}
              onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Enter Code"
              maxLength="6"
              disabled={loading}
              required
              autoFocus
            />
            <button type="submit" disabled={loading || code.length !== 6}>
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
          </form>
          <div className="footer-note">
            Didn’t get the code?{' '}
            <button type="button" onClick={handleResendCode} disabled={loading} style={{ color: '#ff914d', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Resend</button>
          </div>
          <div className="footer-note">
            <button type="button" onClick={() => navigate('/auth')}>← Back to Login</button>
          </div>
        </div>
      </div>
    </>
  );
}
