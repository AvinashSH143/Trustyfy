import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user } = useAuth();

  const dashboardLink = user?.role === 'provider' ? '/provider-dashboard' : '/dashboard';

  return (
    <nav className="glass" style={{
      position: 'fixed',
      top: 0,
      width: '100%',
      zIndex: 1000,
      height: '70px',
      display: 'flex',
      alignItems: 'center',
      borderBottom: '1px solid var(--border-color)'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
      }}>
        <Link to="/" style={{
          fontSize: '1.5rem',
          fontWeight: '800',
          letterSpacing: '-1px',
          fontFamily: 'var(--font-display)',
          color: '#ff8400ff'
        }}>
          TRUSTIFY
        </Link>

        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <a href="#how-it-works" style={{ color: 'var(--text-muted)', fontWeight: '500' }}>How it Works</a>
          <a href="#features" style={{ color: 'var(--text-muted)', fontWeight: '500' }}>Features</a>
          <a href="#providers" style={{ color: 'var(--text-muted)', fontWeight: '500' }}>For Providers</a>

          {user ? (
            <Link to={dashboardLink}>
              <button className="btn-primary" style={{ padding: '0.5rem 1.25rem' }}>Dashboard</button>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <button className="btn-secondary" style={{ padding: '0.5rem 1rem' }}>Log In</button>
              </Link>
              <Link to="/register">
                <button className="btn-primary" style={{ padding: '0.5rem 1.25rem' }}>Get Started</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
