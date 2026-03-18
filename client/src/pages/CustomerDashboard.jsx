import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const AVATARS = [
  'http://localhost:5000/avatars/avatar1.jpg',
  'http://localhost:5000/avatars/avatar2.jpg',
  'http://localhost:5000/avatars/avatar3.jpg',
  'http://localhost:5000/avatars/avatar4.jpg',
  'http://localhost:5000/avatars/avatar5.jpg',
  'http://localhost:5000/avatars/avatar6.jpg',
];

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();
  const [nearbyProviders, setNearbyProviders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAllBookings, setShowAllBookings] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const { updateProfile, refreshProfile } = useAuth();
  const [locLoading, setLocLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || ''
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (user && user.location) {
        try {
          const [providersRes, bookingsRes] = await Promise.all([
            axios.get(`http://localhost:5000/api/bookings/nearby?lat=${user.location.coordinates[1]}&lng=${user.location.coordinates[0]}&radius=10000`),
            axios.get('http://localhost:5000/api/bookings')
          ]);
          setNearbyProviders(providersRes.data);
          setBookings(bookingsRes.data);
        } catch (err) {
          console.error('Error fetching dashboard data:', err);
        } finally {
          setFetchLoading(false);
        }
      }
    };

    if (user) fetchData();
  }, [user]);

  if (loading || fetchLoading) return <div style={{ color: 'white', padding: '2rem' }}>Loading Dashboard...</div>;
  if (!user) return null;

  const handleBook = async (providerId) => {
    if (!user?.location) {
      alert('Please set your location first.');
      return;
    }
    try {
      const res = await axios.post('http://localhost:5000/api/bookings', {
        providerId,
        serviceDate: new Date(Date.now() + 86400000), // Tomorrow
        coordinates: user.location.coordinates
      });
      alert('Booking requested successfully!');
      // Refresh bookings
      const bookingsRes = await axios.get('http://localhost:5000/api/bookings');
      setBookings(bookingsRes.data);
    } catch (err) {
      console.error('Error creating booking:', err);
      alert('Failed to create booking.');
    }
  };

  const handleSetLocation = () => {
    setLocLoading(true);
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      setLocLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          await updateProfile({
            location: {
              type: 'Point',
              coordinates: [longitude, latitude]
            }
          });
          alert('Location set successfully!');
          refreshProfile();
        } catch (err) {
          alert('Failed to update location on server.');
        } finally {
          setLocLoading(false);
        }
      },
      (error) => {
        alert('Please enable location access in your browser.');
        setLocLoading(false);
      }
    );
  };

  const stats = [
    { label: 'Total Bookings', value: bookings.length || '0' },
    { label: 'Active Requests', value: bookings.filter(b => b.status === 'PENDING' || b.status === 'ACCEPTED').length || '0' },
    { label: 'Trustify Points', value: user.trustScore || '0', icon: '⭐' },
    { label: 'Saved Pros', value: '0', icon: '👤' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({ name: profileData.name });
      alert('Profile updated successfully!');
      setShowProfileModal(false);
      refreshProfile();
    } catch (err) {
      alert('Failed to update profile.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-dark)', color: 'var(--text-main)' }}>
      {/* Dashboard Nav */}
      <nav style={{
        height: '70px',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 2rem',
        background: 'rgba(10,10,10,0.8)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <Link to="/" style={{
            fontSize: '1.25rem',
            fontWeight: '800',
            color: '#ffffffff',
            fontFamily: 'var(--font-display)'
          }}>
            TRUSTIFY <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 'normal' }}>DASHBOARD</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div
              onClick={() => setShowAvatarModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                cursor: 'pointer',
                padding: '0.25rem 0.5rem',
                borderRadius: '0.5rem',
                transition: 'background 0.2s'
              }}
              className="hover-bg"
            >
              {user.avatar ? (
                <img src={user.avatar} alt="Avatar" style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--border-color)', objectFit: 'cover', objectPosition: 'center 10%', transform: 'scale(1.4)' }} />
              ) : (
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>
                  {user.name[0]}
                </div>
              )}
              <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Hey, <span style={{ color: 'white' }}>{user.name || 'User'}</span></span>
            </div>
            <button onClick={handleLogout} className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Logout</button>
          </div>
        </div>
      </nav>

      {/* Hero Banner with Background */}
      <div style={{
        backgroundImage: 'linear-gradient(to bottom, rgba(10,10,10,0.7), rgba(10,10,10,0.9)), url("https://i.pinimg.com/1200x/8a/ce/bf/8acebff41f694e24255126ffe25bb9e0.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '4rem 0 3rem 0',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div className="container">
          {/* Location Warning */}
          {!user.location && (
            <div className="glass-card" style={{
              marginBottom: '2rem',
              border: '1px solid #ff8400ff',
              background: 'rgba(255, 132, 0, 0.1)',
              padding: '1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h3 style={{ color: '#ff8400ff', marginBottom: '0.25rem' }}>Location Required</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>You must set your location to discover and book nearby providers.</p>
              </div>
              <button
                onClick={handleSetLocation}
                disabled={locLoading}
                className="btn-primary"
                style={{ background: '#ff8400ff' }}
              >
                {locLoading ? 'Setting...' : 'Set My Location'}
              </button>
            </div>
          )}

          {/* Welcome Header and Avatar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '3rem',
            gap: '2rem'
          }}>
            <div>
              <h1 style={{ fontSize: '3.2rem', marginBottom: '0.5rem', fontWeight: '800' }}>
                Welcome Home, <span style={{ color: '#1a803a' }}>{(user.name || 'User').split(' ')[0]}</span>
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '1.5rem' }}>Everything looks solid. You have {bookings.filter(b => b.status === 'PENDING').length} new requests pending.</p>
              <button
                onClick={() => {
                  setProfileData({ name: user.name });
                  setShowProfileModal(true);
                }}
                className="btn-secondary"
                style={{ fontSize: '0.875rem', padding: '0.5rem 1.25rem' }}
              >
                Edit Profile
              </button>
            </div>
            {user.avatar && (
              <div style={{
                width: '180px',
                height: '180px',
                borderRadius: '24px',
                overflow: 'hidden',
                border: '4px solid rgba(255,255,255,0.1)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(10px)',
                flexShrink: 0
              }}>
                <img src={user.avatar} alt="Profile Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 10%', transform: 'scale(1.4)' }} />
              </div>
            )}
          </div>

          {/* Stats Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem'
          }}>
            {stats.map((stat, idx) => (
              <div key={idx} className="glass-card" style={{
                padding: '1.5rem',
                background: 'rgba(20, 20, 20, 0.4)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{stat.icon || '📊'}</div>
                <div style={{ fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>{stat.value}</div>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem', fontWeight: '500' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '3rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          {/* Recent Activity */}
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Active & Completed Bookings</h2>
            <div className="glass-card" style={{ padding: '1rem', marginBottom: '2rem' }}>
              {bookings.filter(b => b.status !== 'CANCELLED').length > 0 ? (
                <>
                  {bookings.filter(b => b.status !== 'CANCELLED').slice(0, 5).map((booking, idx) => (
                    <div key={idx} style={{
                      padding: '1.25rem',
                      borderBottom: '1px solid var(--border-color)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{booking.provider?.serviceType || 'Service'} with {booking.provider?.name}</div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-dim)' }}>Scheduled: {new Date(booking.serviceDate).toLocaleDateString()}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.75rem', color: booking.status === 'PENDING' ? '#fbbf24' : '#22c55e', fontWeight: 'bold' }}>{booking.status}</div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dim)' }}>
                  No active bookings.
                </div>
              )}
            </div>

            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#ef4444' }}>Rejected/Cancelled Services</h2>
            <div className="glass-card" style={{ padding: '1rem' }}>
              {bookings.filter(b => b.status === 'CANCELLED').length > 0 ? (
                bookings.filter(b => b.status === 'CANCELLED').map((booking, idx) => (
                  <div key={idx} style={{
                    padding: '1.25rem',
                    borderBottom: idx === bookings.filter(b => b.status === 'CANCELLED').length - 1 ? 'none' : '1px solid var(--border-color)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    opacity: 0.7
                  }}>
                    <div>
                      <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{booking.provider?.serviceType || 'Service'} with {booking.provider?.name}</div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-dim)' }}>Cancelled on: {new Date(booking.updatedAt).toLocaleDateString()}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 'bold' }}>{booking.status}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dim)' }}>
                  No rejected services.
                </div>
              )}
            </div>
          </div>

          {/* Top Providers in Area */}
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Providers Near You</h2>
            <div style={{ marginBottom: '1.5rem' }}>
              <input
                type="text"
                placeholder="Search by name or service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.75rem',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-color)',
                  color: 'white',
                  outline: 'none',
                  fontSize: '0.9rem'
                }}
              />
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              maxHeight: '450px',
              overflowY: 'auto',
              paddingRight: '0.5rem'
            }} className="custom-scrollbar">
              {nearbyProviders.filter(provider =>
                provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                provider.serviceType.toLowerCase().includes(searchTerm.toLowerCase())
              ).length > 0 ? nearbyProviders
                .filter(provider =>
                  provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  provider.serviceType.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((provider, idx) => (
                  <div key={idx} className="glass-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                      {provider.name[0]}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{provider.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{provider.serviceType}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 'bold' }}>★ {provider.trustScore} Trust Score</div>
                    </div>
                    <button
                      onClick={() => handleBook(provider._id)}
                      disabled={!user.location}
                      className="btn-primary"
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', opacity: user.location ? 1 : 0.5 }}
                    >
                      Book
                    </button>
                  </div>
                )) : (
                <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-dim)', border: '1px dashed var(--border-color)', borderRadius: '1rem' }}>
                  No providers found matching "{searchTerm}".
                </div>
              )}
            </div>
            <button className="btn-secondary" style={{ width: '100%', marginTop: '1.5rem' }}>Explore All Services</button>
          </div>
        </div>
      </div>

      {/* Profile Update Modal */}
      {showProfileModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '1rem'
        }}>
          <div className="glass-card" style={{ maxWidth: '400px', width: '100%', padding: '2.5rem' }}>
            <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Edit Profile</h2>
            <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Full Name</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'rgba(0,0,0,0.2)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '0.5rem',
                    color: 'white'
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowProfileModal(false)} className="btn-secondary" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Avatar Selection Modal */}
      {showAvatarModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '1rem'
        }}>
          <div className="glass-card" style={{ maxWidth: '400px', width: '100%', padding: '2rem', textAlign: 'center' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Update Your Avatar</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              {AVATARS.map((url, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    updateProfile({ avatar: url });
                    setShowAvatarModal(false);
                  }}
                  style={{
                    aspectRatio: '1/1',
                    borderRadius: '50%',
                    padding: '2px',
                    border: user.avatar === url ? '3px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: 'rgba(255,255,255,0.05)',
                    overflow: 'hidden'
                  }}
                >
                  <img src={url} alt={`Avatar ${idx + 1}`} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', objectPosition: 'center 10%', transform: 'scale(1.4)' }} />
                </div>
              ))}
            </div>
            <button onClick={() => setShowAvatarModal(false)} className="btn-secondary" style={{ width: '100%' }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;

