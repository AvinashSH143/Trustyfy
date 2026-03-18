import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();
  const [providers, setProviders] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);

  const fetchUnapproved = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/unapproved');
      setProviders(res.data);
    } catch (err) {
      console.error('Error fetching unapproved providers:', err);
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      navigate('/admin-login');
    }
    if (user?.role === 'admin') {
      fetchUnapproved();
    }
  }, [user, loading, navigate]);

  const handleApprove = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/admin/${id}/approve`);
      alert('Provider approved!');
      fetchUnapproved();
    } catch (err) {
      alert('Failed to approve provider.');
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Are you sure you want to reject this provider? This will remove them from the system.')) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/${id}/reject`);
      alert('Provider rejected.');
      fetchUnapproved();
    } catch (err) {
      alert('Failed to reject provider.');
    }
  };

  if (loading || fetchLoading) return <div style={{ color: 'white', padding: '2rem' }}>Loading Admin Console...</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: 'white', fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <nav style={{
        height: '80px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 3rem',
        background: 'rgba(10,10,10,0.8)',
        backdropFilter: 'blur(20px)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: '900', color: '#ff8400ff' }}>TRUSTIFY</span>
            <span style={{ marginLeft: '0.75rem', fontSize: '0.75rem', color: 'var(--text-dim)', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>ADMIN CONTROL</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>Logged in as: <span style={{ color: 'white' }}>{user.email}</span></span>
            <button onClick={() => { logout(); navigate('/'); }} className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>Sign Out</button>
          </div>
        </div>
      </nav>

      <main style={{ padding: '4rem 3rem' }}>
        <div style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>Provider Approvals</h1>
          <p style={{ color: 'var(--text-dim)' }}>Review and verify new service providers before they go live on the platform.</p>
        </div>

        <div className="glass-card" style={{ padding: '0', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
          {providers.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <th style={{ padding: '1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-dim)' }}>Provider Info</th>
                  <th style={{ padding: '1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-dim)' }}>Service Type</th>
                  <th style={{ padding: '1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-dim)' }}>Location</th>
                  <th style={{ padding: '1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-dim)' }}>Registered At</th>
                  <th style={{ padding: '1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-dim)', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {providers.map((p) => (
                  <tr key={p._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s' }} className="hover-bg">
                    <td style={{ padding: '1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {p.avatar ? (
                          <img src={p.avatar} alt={p.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{p.name[0]}</div>
                        )}
                        <div>
                          <div style={{ fontWeight: '600' }}>{p.name}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{p.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1.5rem' }}>
                      <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(255, 132, 0, 0.1)', color: '#ff8400ff', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: '600' }}>
                        {p.serviceType}
                      </span>
                    </td>
                    <td style={{ padding: '1.5rem', fontSize: '0.9rem', color: 'var(--text-dim)' }}>
                      {p.location?.coordinates?.join(', ') || 'N/A'}
                    </td>
                    <td style={{ padding: '1.5rem', fontSize: '0.9rem', color: 'var(--text-dim)' }}>
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1.5rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => handleApprove(p._id)}
                          style={{
                            padding: '0.5rem 1rem',
                            background: '#22c55e',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.5rem',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(p._id)}
                          style={{
                            padding: '0.5rem 1rem',
                            background: 'transparent',
                            color: '#ef4444',
                            border: '1px solid #ef4444',
                            borderRadius: '0.5rem',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ padding: '5rem', textAlign: 'center', color: 'var(--text-dim)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛡️</div>
              <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>All Clear</h3>
              <p>No pending provider registrations to review at this time.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
