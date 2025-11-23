import React, { useState } from 'react';
import GeometricOwl from '../components/GeometricOwl';
import ParallaxTitle from '../components/ParallaxTitle';
import ContactModal from '../components/ContactModal';

const LandingPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="landing-page">
      {/* Film texture overlay */}
      <div
        className="film-texture"
        style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/film-texture.jpg)` }}
      ></div>

      {/* Film grain overlay */}
      <div
        className="film-grain"
        style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/film-grain.jpg)` }}
      ></div>

      {/* Full-screen Hero */}
      <section className="hero">
        {/* Content Layer */}
        <div className="hero-content">
          <ParallaxTitle>
            <span className="accent">Development</span><br />
            Intelligence
          </ParallaxTitle>

          {/* Owl - Mobile only (above tagline) */}
          <div className="owl-container owl-mobile">
            <GeometricOwl />
          </div>

          <p className="hero-tagline">
            Where consulting meets computational intelligence
          </p>

          <div className="hero-description">
            <p>
              Investigative-grade research methodology assisted by engineered intelligence. Documentary research or format development - we deliver talent evaluation, source verification and narrative architecture at scale.
            </p>
            <p className="hero-patent">Patent-pending</p>
            <p className="hero-stat">
              Traditional teams: 8-12 weeks, 3-5 researchers<br />
              <strong>Gizmet systems: 48-72 hours</strong>
            </p>
          </div>

          <button className="cta-button" onClick={() => setIsModalOpen(true)}>
            Talk to the Lab
          </button>
        </div>

        {/* Owl - Desktop only (side column) */}
        <div className="owl-container owl-desktop">
          <GeometricOwl />
        </div>

        {/* Footer */}
        <footer className="hero-footer">
          <div className="footer-brand">GIZMET DEV LTD</div>
          <div className="footer-tagline">Development Intelligence Consultancy</div>
        </footer>
      </section>

      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default LandingPage;
