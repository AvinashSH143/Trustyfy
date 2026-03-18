import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AVATARS = [
  'http://localhost:5000/avatars/avatar1.jpg',
  'http://localhost:5000/avatars/avatar2.jpg',
  'http://localhost:5000/avatars/avatar3.jpg',
  'http://localhost:5000/avatars/avatar4.jpg',
  'http://localhost:5000/avatars/avatar5.jpg',
  'http://localhost:5000/avatars/avatar6.jpg',
];

const SERVICE_CATEGORIES = [
  'Electrician',
  'Mechanic',
  'Plumber',
  'Carpenter',
  'Painter',
  'Cleaner',
];

const Auth = ({ mode = 'login' }) => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(mode === 'login');
  const [role, setRole] = useState('customer'); // 'customer' or 'provider'
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    serviceType: SERVICE_CATEGORIES[0],
  });

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  const handleToggleRole = (newRole) => {
    setRole(newRole);
    setError('');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const loggedInUser = await login(formData.email, formData.password, role);
        if (loggedInUser.role === 'customer') {
          navigate('/dashboard');
        } else {
          navigate('/provider-dashboard');
        }
      } else {
        const payload = {
          email: formData.email,
          password: formData.password,
          name: formData.name,
          role: role,
          avatar: selectedAvatar,
          serviceType: role === 'provider' ? formData.serviceType : undefined,
        };
        const newUser = await register(payload);
        if (newUser.role === 'customer') {
          navigate('/dashboard');
        } else {
          navigate('/provider-dashboard');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-dark)',
      padding: '2rem'
    }}>
      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '450px',
        padding: '3rem',
        borderRadius: '1.5rem',
        position: 'relative'
      }}>
        {/* Back Button */}
        <Link to="/" style={{
          position: 'absolute',
          top: '1.5rem',
          left: '1.5rem',
          color: 'var(--text-dim)',
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          ← Back to Home
        </Link>

        <div style={{ textAlign: 'center', marginBottom: '2.5rem', marginTop: '1rem' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: '#ffffffff' }}>
            TRUSTIFY
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            {isLogin ? 'Welcome back! Please login.' : 'Create an account to get started.'}
          </p>
        </div>

        {error && (
          <div style={{
            padding: '0.75rem',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid #ef4444',
            color: '#ef4444',
            borderRadius: '0.5rem',
            marginBottom: '1.5rem',
            fontSize: '0.875rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {/* Role Selector */}
        <div style={{
          display: 'flex',
          background: 'rgba(255,255,255,0.05)',
          padding: '0.25rem',
          borderRadius: '0.75rem',
          marginBottom: '2rem'
        }}>
          <button
            onClick={() => handleToggleRole('customer')}
            style={{
              flex: 1,
              padding: '0.75rem',
              borderRadius: '0.6rem',
              background: role === 'customer' ? 'var(--primary)' : 'transparent',
              color: role === 'customer' ? 'white' : 'var(--text-dim)',
              fontWeight: '600'
            }}
          >
            Customer
          </button>
          <button
            onClick={() => handleToggleRole('provider')}
            style={{
              flex: 1,
              padding: '0.75rem',
              borderRadius: '0.6rem',
              background: role === 'provider' ? 'var(--primary)' : 'transparent',
              color: role === 'provider' ? 'white' : 'var(--text-dim)',
              fontWeight: '600'
            }}
          >
            Provider
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {!isLogin && (
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '0.75rem',
                  color: 'white'
                }}
              />
            </div>
          )}

          {role === 'provider' && !isLogin && (
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Service Category</label>
              <select
                name="serviceType"
                value={formData.serviceType}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '0.75rem',
                  color: 'white',
                  appearance: 'none',
                  cursor: 'pointer'
                }}
              >
                {SERVICE_CATEGORIES.map((category) => (
                  <option key={category} value={category} style={{ background: 'var(--bg-dark)' }}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@company.com"
              required
              style={{
                width: '100%',
                padding: '1rem',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border-color)',
                borderRadius: '0.75rem',
                color: 'white'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              style={{
                width: '100%',
                padding: '1rem',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border-color)',
                borderRadius: '0.75rem',
                color: 'white'
              }}
            />
          </div>

          {!isLogin && (
            <div>
              <label style={{ display: 'block', marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Choose Your Avatar</label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.75rem',
                padding: '0.5rem'
              }}>
                {AVATARS.map((url, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedAvatar(url)}
                    style={{
                      aspectRatio: '1/1',
                      borderRadius: '50%',
                      padding: '2px',
                      border: selectedAvatar === url ? '3px solid var(--primary)' : '1px solid var(--border-color)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      transform: selectedAvatar === url ? 'scale(1.1)' : 'scale(1)',
                      background: 'rgba(255,255,255,0.05)',
                      overflow: 'hidden'
                    }}
                  >
                    <img src={url} alt={`Avatar ${idx + 1}`} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', objectPosition: 'center 15%', transform: 'scale(1.5)' }} />
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{
              width: '100%',
              justifyContent: 'center',
              padding: '1rem',
              marginTop: '1rem',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={handleToggleMode}
            style={{
              background: 'none',
              color: 'var(--primary)',
              fontWeight: 'bold',
              padding: 0,
              fontSize: 'inherit'
            }}
          >
            {isLogin ? 'Register' : 'Login'}
          </button>
        </div>
        <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
          <Link to="/admin-login" style={{ color: 'var(--text-dim)', fontSize: '0.75rem', textDecoration: 'none' }}>
            System Administrator? <span style={{ color: 'var(--primary)' }}>Login here</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Auth;
