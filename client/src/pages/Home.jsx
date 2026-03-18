import React from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import TrustScoreEngine from '../components/TrustScoreEngine';
import Features from '../components/Features';
import '../index.css';

const Home = () => {
  return (
    <div className="home-page">
      <Navbar />
      <main>
        <Hero />
        <TrustScoreEngine />
        <Features />
      </main>
      <footer className="section-padding" style={{ borderTop: '1px solid var(--border-color)', marginTop: '4rem' }}>
        <div className="container" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          <div style={{ marginBottom: '1.5rem', color: 'var(--text-main)', fontSize: '1.5rem', fontWeight: 'bold' }}>
            TRUSTIFY
          </div>
          <p>© {new Date().getFullYear()} Trustify – Behavior-Based Local Services Platform</p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>"Trust is earned by actions, not ratings."</p>
          <div style={{ marginTop: '2rem' }}>
            <Link to="/admin-login" style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.1)', textDecoration: 'none' }}>Admin Portal</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
