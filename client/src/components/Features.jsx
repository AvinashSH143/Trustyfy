import React from 'react';

const Features = () => {
  const features = [
    {
      title: 'Real-Time Tracking',
      description: 'Live provider location, en-route notifications, and instant job status updates powered by WebSockets.',
      
      Image: 'https://i.pinimg.com/736x/52/e2/87/52e287b2d08a7f26e40d9ac0cd5fb427.jpg'
    },
    {
      title: 'Risk-Based Ranking',
      description: 'Find providers based on reliable data points: punctuality, completion rates, and historical reliability.',
      Image: 'https://i.pinimg.com/1200x/12/ec/a5/12eca522709a2979072ab094f9919345.jpg'
    },
    {
      title: 'Fraud Detection',
      description: 'Our system automatically flags suspicious patterns like location spoofing or excessive cancellations.',
      Image: 'https://i.pinimg.com/1200x/0d/0e/43/0d0e438563ef02fd9c9a30766d4a15aa.jpg'
    },
    {
      title: 'Geo-Intelligent Matching',
      description: 'Advanced geospatial queries find the most reliable providers within your service radius instantly.',
      Image: 'https://i.pinimg.com/736x/56/7f/a7/567fa76dad8ed135d93cd4135327d40b.jpg'
    },
    {
      title: 'Trust Recovery',
      description: 'Providers can improve their standing through consistent performance during probation periods.',
      Image: 'https://i.pinimg.com/736x/aa/60/7b/aa607b54600593f01d509ce35b55ab2b.jpg'
    },
    {
      title: 'Dynamic Visibility',
      description: 'Top-tier behavior leads to better search ranking and early access to high-value bookings.',
      Image: 'https://i.pinimg.com/736x/2e/96/7f/2e967f7fc6c61e399811d5e24ecf5055.jpg'
    }
  ];

  return (
    <section id="features" className="section-padding">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Engineered for Accountability</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto' }}>
            Built with modern tech to solve the ancient problem of service reliability.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          {features.map((feature, idx) => (
            <div key={idx} className="glass-card">
              <div style={{
                fontSize: '2rem',
                marginBottom: '1.5rem',
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255,255,255,0.02)',
                borderRadius: '1rem',
                border: '1px solid var(--border-color)',
                overflow: 'hidden'
              }}>
                {feature.Image ? (
                  <img
                    src={feature.Image}
                    alt={feature.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  feature.icon
                )}
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{feature.title}</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
