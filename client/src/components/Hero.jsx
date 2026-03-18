import React from 'react';

const Hero = () => {
  return (
    <section className="section-padding" style={{ paddingTop: '160px', position: 'relative', overflow: 'hidden' }}>

      <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '4rem', alignItems: 'center' }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '0.5rem 1rem',
            borderRadius: '2rem',
            background: '#1a803a',
            border: '1px solid rgba(124, 58, 237, 0.3)',
            color: 'var(--primary)',
            fontSize: '0.875rem',
            fontWeight: '600',
            marginBottom: '1.5rem',
            color: '#fff'
          }}>
            <span style={{ marginRight: '0.5rem' }}></span> The Future of Service Reliability
          </div>

          <h1 style={{ fontSize: '4.5rem', lineHeight: '1.1', marginBottom: '1.5rem' }}>
            Trust is earned by <span className="text-primary-gradient">actions</span>, not ratings.
          </h1>

          <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '2.5rem', maxWidth: '600px' }}>
            Stop guessing with fake reviews. Trustify uses real behavior—punctuality, completion, and reliability—to match you with the best local pros.
          </p>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn-primary" style={{ fontSize: '1.125rem', padding: '1rem 2rem' }}>
              Find Reliable Services
            </button>
            <button className="btn-secondary" style={{ fontSize: '1.125rem', padding: '1rem 2rem' }}>
              How it works
            </button>
          </div>

          <div style={{ marginTop: '3rem', display: 'flex', gap: '3rem' }}>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>50+</div>
              <div style={{ color: 'var(--text-dim)', fontSize: '0.875rem' }}>Service Types</div>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>2.5k</div>
              <div style={{ color: 'var(--text-dim)', fontSize: '0.875rem' }}>Verified Pro's</div>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>12k+</div>
              <div style={{ color: 'var(--text-dim)', fontSize: '0.875rem' }}>Jobs Completed</div>
            </div>
          </div>
        </div>

        <div style={{ position: 'relative' }}>
          {/* Mock Trust Card */}
          <div className="glass-card" style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#333' }}></div>
              <div style={{
                background: 'rgba(34, 197, 94, 0.1)',
                color: '#22c55e',
                padding: '0.25rem 0.75rem',
                borderRadius: '1rem',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                height: 'fit-content'
              }}>
                🟢 RELIABLE
              </div>
            </div>

            <h3 style={{ marginBottom: '0.25rem' }}>Alex Rivara</h3>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Professional Electrician</p>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                <span>Trust Score</span>
                <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>94/100</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '94%', height: '100%', background: 'var(--primary)' }}></div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>On-time rate</div>
                <div style={{ fontWeight: '600' }}>98.2%</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Completion</div>
                <div style={{ fontWeight: '600' }}>142 Jobs</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
