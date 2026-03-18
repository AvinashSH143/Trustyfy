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

const ProviderDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, loading, updateProfile, refreshProfile } = useAuth();
  const [isAvailable, setIsAvailable] = useState(user?.isAvailable ?? true);
  const [bookings, setBookings] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [otpInputs, setOtpInputs] = useState({});
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [locLoading, setLocLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    serviceAreas: user?.serviceAreas?.join(', ') || ''
  });

  useEffect(() => {
    if (!loading && (!user || user.role !== 'provider')) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  const fetchBookings = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/bookings');
      setBookings(res.data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchBookings();
  }, [user]);

  if (loading || fetchLoading) return <div style={{ color: 'white', padding: '2rem' }}>Loading Dashboard...</div>;
  if (!user) return null;

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/bookings/${bookingId}/status`, {
        status: newStatus,
        eventType: newStatus
      });
      fetchBookings();
      refreshProfile(); // Refresh stats
      alert(`Booking ${newStatus.toLowerCase()}!`);
    } catch (err) {
      console.error('Error updating booking status:', err);
      alert(err.response?.data?.message || 'Failed to update status.');
    }
  };

  const handleSendOTP = async (bookingId) => {
    try {
      await axios.post(`http://localhost:5000/api/bookings/${bookingId}/send-otp`);
      alert('OTP sent to customer!');
    } catch (err) {
      console.error('Error sending OTP:', err);
      alert('Failed to send OTP.');
    }
  };

  const handleCompleteJob = async (bookingId) => {
    const otp = otpInputs[bookingId];
    if (!otp) return alert('Please enter the OTP provided by the customer.');

    try {
      await axios.put(`http://localhost:5000/api/bookings/${bookingId}/status`, {
        status: 'COMPLETED',
        eventType: 'COMPLETED',
        otp
      });
      fetchBookings();
      refreshProfile();
      alert('Job completed successfully!');
    } catch (err) {
      console.error('Error completing job:', err);
      alert(err.response?.data?.message || 'Invalid OTP or server error.');
    }
  };

  const handleOtpChange = (bookingId, value) => {
    setOtpInputs(prev => ({ ...prev, [bookingId]: value }));
  };

  const handleLogout = () => {
    logout();
    navigate('/');
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

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({
        name: profileData.name,
        serviceAreas: profileData.serviceAreas.split(',').map(s => s.trim()).filter(s => s !== '')
      });
      alert('Profile updated successfully!');
      setShowProfileModal(false);
      refreshProfile();
    } catch (err) {
      alert('Failed to update profile.');
    }
  };

  const toggleAvailability = () => {
    if (!user.location) {
      alert('Please set your location first.');
      return;
    }
    setIsAvailable(!isAvailable);
  };

  const stats = [
    { label: 'Jobs Completed', value: user.stats?.jobsCompleted || '0', icon: '✅' },
    { label: 'On-Time Arrival', value: user.stats?.jobsCompleted > 0 ? `${user.stats?.onTimeArrivals || 100}%` : '0%', icon: '⏰' },
    { label: 'Trust Score', value: user.trustScore || '0', icon: '🛡️' },
    { label: 'Reliability', value: user.reliabilityLevel || 'LOW', icon: '📈' },
  ];

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
            TRUSTIFY <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 'normal' }}>PROVIDER</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginRight: '1rem' }}>
              <span style={{ fontSize: '0.875rem', color: isAvailable ? '#22c55e' : '#ef4444' }}>
                {isAvailable ? 'Available' : 'Unavailable'}
              </span>
              <button
                onClick={toggleAvailability}
                style={{
                  width: '40px',
                  height: '20px',
                  borderRadius: '10px',
                  background: isAvailable ? '#22c55e' : '#333',
                  border: 'none',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              >
                <div style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: 'white',
                  position: 'absolute',
                  top: '2px',
                  left: isAvailable ? '22px' : '2px',
                  transition: 'all 0.3s'
                }} />
              </button>
            </div>
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
                  {(user.name || 'P')[0]}
                </div>
              )}
              <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Hey, <span style={{ color: 'white' }}>{user.name}</span></span>
            </div>
            <button onClick={handleLogout} className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Logout</button>
          </div>
        </div>
      </nav>

      {/* Hero Banner */}
      <div style={{
        backgroundImage: 'linear-gradient(to bottom, rgba(10,10,10,0.7), rgba(10,10,10,0.9)), url("https://i.pinimg.com/1200x/bc/58/01/bc58019447e704028302521e1029cffc.jpg")',
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
              border: '1px solid var(--primary)',
              background: 'rgba(255, 132, 0, 0.1)',
              padding: '1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h3 style={{ color: 'var(--primary)', marginBottom: '0.25rem' }}>Location Required</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>You must set your location to be visible to customers and accept jobs.</p>
              </div>
              <button
                onClick={handleSetLocation}
                disabled={locLoading}
                className="btn-primary"
              >
                {locLoading ? 'Setting...' : 'Set My Location'}
              </button>
            </div>
          )}

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '3rem',
            gap: '2rem'
          }}>
            <div>
              <h1 style={{ fontSize: '3.2rem', marginBottom: '0.5rem', fontWeight: '800' }}>
                Welcome Back, <span style={{ color: 'var(--primary)' }}>{(user.name || 'Pro').split(' ')[0]}</span>
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>You have {bookings.filter(b => b.status === 'PENDING').length} new booking requests waiting for you!</p>
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
                <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{stat.icon}</div>
                <div style={{ fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>{stat.value}</div>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem', fontWeight: '500' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '3rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          {/* Recent Jobs */}
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Active Booking Requests & Jobs</h2>
            <div className="glass-card" style={{ padding: '1rem', marginBottom: '2rem' }}>
              {bookings.filter(b => b.status !== 'CANCELLED').length > 0 ? bookings.filter(b => b.status !== 'CANCELLED').map((job, idx) => (
                <div key={idx} style={{
                  padding: '1.5rem',
                  borderBottom: idx === bookings.filter(b => b.status !== 'CANCELLED').length - 1 ? 'none' : '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '0.25rem' }}>
                        Customer: {job.customer?.name}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>
                        Email: {job.customer?.email} | Date: {new Date(job.serviceDate).toLocaleDateString()}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '500' }}>
                        📍 {job.location?.coordinates?.join(', ')}
                      </div>
                    </div>
                    <div style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      background: job.status === 'PENDING' ? 'rgba(251, 191, 36, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                      color: job.status === 'PENDING' ? '#fbbf24' : '#22c55e',
                      fontSize: '0.75rem',
                      fontWeight: 'bold'
                    }}>
                      {job.status}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    {job.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(job._id, 'ACCEPTED')}
                          className="btn-primary"
                          style={{ padding: '0.5rem 1.25rem' }}
                        >
                          Accept Request
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(job._id, 'CANCELLED')}
                          className="btn-secondary"
                          style={{ padding: '0.5rem 1.25rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid #ef4444' }}
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {job.status === 'ACCEPTED' && (
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', width: '100%', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px' }}>
                        <div style={{ flex: 1 }}>
                          <button
                            onClick={() => handleSendOTP(job._id)}
                            className="btn-secondary"
                            style={{ fontSize: '0.8rem', padding: '0.5rem 1rem', width: '100%', marginBottom: '0.5rem' }}
                          >
                            Resend Completion OTP
                          </button>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                              type="text"
                              placeholder="Enter Customer OTP"
                              value={otpInputs[job._id] || ''}
                              onChange={(e) => handleOtpChange(job._id, e.target.value)}
                              style={{
                                background: 'rgba(0,0,0,0.2)',
                                border: '1px solid var(--border-color)',
                                color: 'white',
                                padding: '0.5rem',
                                borderRadius: '6px',
                                flex: 1
                              }}
                            />
                            <button
                              onClick={() => handleCompleteJob(job._id)}
                              disabled={!user.location}
                              className="btn-primary"
                              style={{ background: '#22c55e', padding: '0.5rem 1.25rem', opacity: user.location ? 1 : 0.5 }}
                            >
                              Finish Job
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )) : (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dim)' }}>
                  No active booking requests or jobs.
                </div>
              )}
            </div>

            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#ef4444' }}>Rejected/Cancelled Jobs</h2>
            <div className="glass-card" style={{ padding: '1rem' }}>
              {bookings.filter(b => b.status === 'CANCELLED').length > 0 ? bookings.filter(b => b.status === 'CANCELLED').map((job, idx) => (
                <div key={idx} style={{
                  padding: '1.25rem',
                  borderBottom: idx === bookings.filter(b => b.status === 'CANCELLED').length - 1 ? 'none' : '1px solid var(--border-color)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  opacity: 0.7
                }}>
                  <div>
                    <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Customer: {job.customer?.name}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-dim)' }}>Status: <span style={{ color: '#ef4444', fontWeight: 'bold' }}>CANCELLED</span></div>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                    {new Date(job.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              )) : (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dim)' }}>
                  No cancelled jobs.
                </div>
              )}
            </div>
          </div>

          {/* Service Info / Profile Side Panel */}
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Service Profile</h2>
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px' }}>Service Type</label>
                <div style={{ fontSize: '1.1rem', fontWeight: '600', marginTop: '0.25rem' }}>{user.serviceType || 'General Pro'}</div>
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px' }}>Service Areas</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {(user.serviceAreas || ['No areas defined']).map((area, i) => (
                    <span key={i} style={{
                      padding: '0.25rem 0.75rem',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '20px',
                      fontSize: '0.8rem'
                    }}>
                      {area}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => {
                  setProfileData({
                    name: user.name,
                    serviceAreas: user.serviceAreas?.join(', ') || ''
                  });
                  setShowProfileModal(true);
                }}
                className="btn-secondary"
                style={{ width: '100%' }}
              >
                Update Profile
              </button>
            </div>
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
          <div className="glass-card" style={{ maxWidth: '450px', width: '100%', padding: '2.5rem' }}>
            <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Edit Profile</h2>
            <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Service Areas (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Downtown, North Side, West End"
                  value={profileData.serviceAreas}
                  onChange={(e) => setProfileData({ ...profileData, serviceAreas: e.target.value })}
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

export default ProviderDashboard;
