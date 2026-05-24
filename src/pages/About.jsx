import './About.css';

function About() {
  return (
    <div className="about">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-container">
          <h1 className="about-heading">The Problem I Solve</h1>
          <p className="about-subtitle">
            A lot of brands look good, but they don't communicate the right things. And when your brand isn't clear, people don't trust it.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="about-content">
        {/* Story Section */}
        <section className="about-section">
          <h2 className="about-section-title">Why I Do This</h2>
          <p className="about-text">
            I didn't get into design just to "make things look nice."
          </p>
          <p className="about-text">
            I got into it because I saw too many brands with potential… but poor visual communication holding them back.
          </p>
          <p className="about-text">
            The truth is, when your brand isn't clear, people scroll past it. They ignore it. They don't trust it.
          </p>
          <p className="about-text">
            That's the problem I solve. I design visuals that don't just look beautiful — they position your brand properly, communicate your value, and make people pay attention.
          </p>
        </section>

        {/* What I Help Brands Do */}
        <section className="about-section">
          <h2 className="about-section-title">How I Help Brands</h2>
          <div className="about-grid">
            <div className="about-card">
              <h3 className="about-card-title">Look More Premium</h3>
              <p className="about-card-text">
                Elevate your visual presence with designs that command attention and communicate quality at first glance.
              </p>
            </div>
            <div className="about-card">
              <h3 className="about-card-title">Feel More Intentional</h3>
              <p className="about-card-text">
                Every design decision has a reason. No random choices — just strategic, purposeful visuals that work.
              </p>
            </div>
            <div className="about-card">
              <h3 className="about-card-title">Communicate More Clearly</h3>
              <p className="about-card-text">
                Cut through the noise with visual storytelling that makes your message impossible to miss or misunderstand.
              </p>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="about-section">
          <h2 className="about-section-title">What I Do</h2>
          <div className="services-grid">
            <div className="service-item">Brand Identity Design</div>
            <div className="service-item">Brand Design Audits</div>
            <div className="service-item">Visual Storytelling</div>
            <div className="service-item">Strategic Design Systems</div>
            <div className="service-item">Logo Design</div>
            <div className="service-item">Brand Positioning</div>
            <div className="service-item">Visual Communication</div>
            <div className="service-item">Design Strategy</div>
          </div>
        </section>

        {/* Results Section */}
        <section className="about-section">
          <h2 className="about-section-title">Results I Focus On</h2>
          <div className="about-grid">
            <div className="about-card">
              <h3 className="about-card-title">Stronger Brand Perception</h3>
              <p className="about-card-text">
                People see your brand differently — more professional, more trustworthy, more premium.
              </p>
            </div>
            <div className="about-card">
              <h3 className="about-card-title">Clearer Communication</h3>
              <p className="about-card-text">
                Your audience instantly understands what you do and why it matters to them.
              </p>
            </div>
            <div className="about-card">
              <h3 className="about-card-title">Business Growth</h3>
              <p className="about-card-text">
                Designs that don't just look good — they actually support your business goals and drive results.
              </p>
            </div>
          </div>
        </section>

        {/* Working With Me */}
        <section className="about-section">
          <h2 className="about-section-title">Working With Me Means</h2>
          <div className="about-stats">
            <div className="stat-item">
              <div className="stat-label">No Random Design</div>
              <p style={{marginTop: '1rem', color: '#666', fontSize: '0.95rem'}}>Everything has a reason</p>
            </div>
            <div className="stat-item">
              <div className="stat-label">Strategy Before Aesthetics</div>
              <p style={{marginTop: '1rem', color: '#666', fontSize: '0.95rem'}}>Function drives form</p>
            </div>
            <div className="stat-item">
              <div className="stat-label">Clean & Intentional</div>
              <p style={{marginTop: '1rem', color: '#666', fontSize: '0.95rem'}}>Effective visuals</p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="about-section" style={{textAlign: 'center', paddingTop: '3rem'}}>
          <h2 className="about-section-title" style={{textAlign: 'center'}}>
            If your brand feels inconsistent, unclear, or underwhelming...
          </h2>
          <p className="about-text" style={{maxWidth: '600px', margin: '0 auto 2rem', fontSize: '1.2rem'}}>
            I can help you fix that.
          </p>
          <a href="/contact" style={{
            display: 'inline-block',
            background: '#1a1a1a',
            color: '#ffffff',
            padding: '16px 48px',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: '600',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            fontSize: '0.9rem',
            transition: 'all 0.3s ease'
          }}>
            Let's Connect
          </a>
        </section>
      </div>
    </div>
  );
}

export default About;
