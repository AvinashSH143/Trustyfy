import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(formData.email, formData.password, 'admin');
      if (user.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        setError('Access denied. Admin role required.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Admin authentication failed.');
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
      background: 'radial-gradient(circle at top right, #1a1a1a, #0a0a0a)',
      padding: '2rem'
    }}>
      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '400px',
        padding: '3rem',
        borderRadius: '1.5rem',
        border: '1px solid rgba(255, 132, 0, 0.2)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '800',
            color: '#ff8400ff',
            letterSpacing: '-1px',
            marginBottom: '0.5rem'
          }}>
            ADMIN PORTAL
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Trustify System Management
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px' }}>Admin Email</label>
            <input
              type="email"
              placeholder="admin@trustify.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '1rem',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '0.75rem',
                color: 'white',
                outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px' }}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '1rem',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '0.75rem',
                color: 'white',
                outline: 'none'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '1rem',
              marginTop: '1rem',
              background: '#ff8400ff',
              fontWeight: '700',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <Link to="/" style={{ color: 'var(--text-dim)', fontSize: '0.875rem' }}>
            ← Back to Main Site
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
