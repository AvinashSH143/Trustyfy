import React from 'react';

const TrustScoreEngine = () => {
  const events = [
    { label: 'Job Completed', impact: '+5', color: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)' },
    { label: 'On-time Arrival', impact: '+3', color: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)' },
    { label: 'Late Arrival', impact: '-4', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
    { label: 'Cancellation', impact: '-6', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
    { label: 'Repeat Customer', impact: '+8', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
    { label: 'Dispute Raised', impact: '-8', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
  ];

  return (
    <section id="how-it-works" className="section-padding" style={{ position: 'relative' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>The Trust Score Engine</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto' }}>
            Our core innovation: A real-time algorithm that converts trackable behavior into a transparent reliability score.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div className="glass-card" style={{ padding: '2.5rem' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ color: 'var(--primary)' }}>⚡</span> Behavior Matrix
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {events.map((event, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem',
                  borderRadius: '0.75rem',
                  background: '#151515',
                  border: '1px solid var(--border-color)'
                }}>
                  <span style={{ fontWeight: '500' }}>{event.label}</span>
                  <span style={{
                    color: event.color,
                    background: event.bg,
                    padding: '0.25rem 0.75rem',
                    borderRadius: '0.5rem',
                    fontWeight: 'bold',
                    fontSize: '0.875rem'
                  }}>
                    {event.impact}
                  </span>
                </div>
              ))}
            </div>
            <p style={{ marginTop: '2rem', fontSize: '0.875rem', color: 'var(--text-dim)', textAlign: 'center' }}>
              *Scores are dynamic and decay over time to prioritize recent performance.
            </p>
          </div>

          <div>
            <div style={{ marginBottom: '3rem' }}>
              <h4 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>01. Real-time Calculation</h4>
              <p style={{ color: 'var(--text-muted)' }}>
                Every action (or inaction) triggers an instant update. No more waiting weeks for a review to appear.
              </p>
            </div>
            <div style={{ marginBottom: '3rem' }}>
              <h4 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--secondary)' }}>02. Fraud Proof</h4>
              <p style={{ color: 'var(--text-muted)' }}>
                Unlike text reviews, behavior events are verified by system logs, geolocation, and job status transitions.
              </p>
            </div>
            <div>
              <h4 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#22c55e' }}>03. Trust Recovery</h4>
              <p style={{ color: 'var(--text-muted)' }}>
                Had a bad day? Regain your standing through consistent high-performance in a probation period.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section >
  );
};

// Variable fix for the inline template string
const var_primary = '#7c3aed';

export default TrustScoreEngine;
