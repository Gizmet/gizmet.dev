import React, { useState, useEffect } from 'react';
import { ArrowRight, Zap, Database, FileText, Users, Globe, Shield } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

const LandingPage = () => {
  const [terminalText, setTerminalText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  const fullText = '> initialising DOCU-FORGE...';

  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < fullText.length) {
        setTerminalText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, 80);

    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);

    return () => {
      clearInterval(typingInterval);
      clearInterval(cursorInterval);
    };
  }, []);

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <span className="logo-bracket">[</span>
              DOCU-FORGE
              <span className="logo-bracket">]</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-grid-bg"></div>
        <div className="container">
          <div className="hero-content">
            <div className="terminal-line">
              {terminalText}
              {showCursor && <span className="cursor">_</span>}
            </div>
            <h1 className="hero-title">
              Documentary Development<br />
              <span className="gradient-text">At Machine Speed</span>
            </h1>
            <div className="patent-badge">
              <span className="patent-icon">◆</span>
              <span className="patent-text">PATENT PENDING</span>
            </div>
            <p className="hero-subtitle">
              What takes traditional teams 4-7 months, delivered in 48 hours.
              Research → Structure → Treatment → Production → Pitch.
              <span className="highlight-text"> Single operator. Full package.</span>
            </p>
            <div className="hero-stats">
              <div className="stat">
                <div className="stat-number">18x</div>
                <div className="stat-label">faster development</div>
              </div>
              <div className="stat">
                <div className="stat-number">55x</div>
                <div className="stat-label">person-hour efficiency</div>
              </div>
              <div className="stat">
                <div className="stat-number">48hrs</div>
                <div className="stat-label">complete package</div>
              </div>
            </div>
            <div className="hero-cta">
              <Button onClick={scrollToContact} className="cta-button">
                <span>Schedule Consultation</span>
                <ArrowRight className="button-icon" />
              </Button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="visual-container">
              <img 
                src="https://images.unsplash.com/photo-1572018098513-8c5fa9a254cc?w=800&q=80" 
                alt="Studio" 
                className="hero-image"
              />
              <div className="image-overlay"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="problem-solution">
        <div className="container">
          <div className="split-content">
            <div className="problem-side">
              <div className="section-label">[problem]</div>
              <h2 className="section-title">Traditional Development<br />Is Broken</h2>
              <ul className="problem-list">
                <li className="problem-item">
                  <span className="problem-icon">×</span>
                  <span>4-7 months per project (880+ hours)</span>
                </li>
                <li className="problem-item">
                  <span className="problem-icon">×</span>
                  <span>Multi-person teams, high burn rate</span>
                </li>
                <li className="problem-item">
                  <span className="problem-icon">×</span>
                  <span>Limited parallel development capacity</span>
                </li>
                <li className="problem-item">
                  <span className="problem-icon">×</span>
                  <span>Incomplete packages, uncertain outcomes</span>
                </li>
              </ul>
            </div>
            <div className="solution-side">
              <div className="section-label">[solution]</div>
              <h2 className="section-title">DOCU-FORGE<br />Changes Everything</h2>
              <ul className="solution-list">
                <li className="solution-item">
                  <span className="solution-icon">✓</span>
                  <span>48 hours per project (18x faster)</span>
                </li>
                <li className="solution-item">
                  <span className="solution-icon">✓</span>
                  <span>Single operator (55x person-hour efficiency)</span>
                </li>
                <li className="solution-item">
                  <span className="solution-icon">✓</span>
                  <span>Develop 5+ projects simultaneously</span>
                </li>
                <li className="solution-item">
                  <span className="solution-icon">✓</span>
                  <span>Complete packages, zero uncertainty</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="capabilities">
        <div className="container">
          <div className="section-header">
            <div className="section-label">[capabilities]</div>
            <h2 className="section-title">What The System Delivers</h2>
            <p className="section-description">
              Input: Case name. Output: Complete production-ready documentary package.
            </p>
          </div>

          <div className="capabilities-grid">
            <Card className="capability-card">
              <div className="card-icon">
                <Database />
              </div>
              <h3 className="card-title">Deep Research Engine</h3>
              <p className="card-description">
                Global court records, legal databases, news archives. Complete timeline, key people profiles, blindspot analysis. UK, US, Canada, Australia coverage.
              </p>
            </Card>

            <Card className="capability-card">
              <div className="card-icon">
                <FileText />
              </div>
              <h3 className="card-title">Story Architecture</h3>
              <p className="card-description">
                Beat-by-beat structural blueprint. Feature or series format. Emotional arc mapping. Tension design. Tonal calibration. Production notes integrated.
              </p>
            </Card>

            <Card className="capability-card">
              <div className="card-icon">
                <Zap />
              </div>
              <h3 className="card-title">Full Narrative Treatment</h3>
              <p className="card-description">
                Complete cinematic prose. New Yorker standard writing. Present-tense documentary screenplay. Commissioners can read exactly what they're greenlighting.
              </p>
            </Card>

            <Card className="capability-card">
              <div className="card-icon">
                <Users />
              </div>
              <h3 className="card-title">Interview Strategies</h3>
              <p className="card-description">
                Extensive question banks. Trauma-informed protocols. Blindspot questions. Session structure. Every interview subject mapped and prepped.
              </p>
            </Card>

            <Card className="capability-card">
              <div className="card-icon">
                <Globe />
              </div>
              <h3 className="card-title">Production Planning</h3>
              <p className="card-description">
                Locations mapped. Access strategies. Legal clearances. Archive licensing. Crew requirements. Risk assessment. Timeline from greenlight to delivery.
              </p>
            </Card>

            <Card className="capability-card">
              <div className="card-icon">
                <Shield />
              </div>
              <h3 className="card-title">Broadcast-Ready Package</h3>
              <p className="card-description">
                Development brief. Production roadmap. Assets database. Pitch materials. Professional Word exports. Commissioner-ready from day one.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="social-proof">
        <div className="container">
          <div className="social-proof-content">
            <p className="social-proof-text">Developed in partnership with UK broadcast veterans</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="cta-section">
        <div className="container">
          <div className="cta-content">
            <div className="cta-text">
              <div className="section-label">[access]</div>
              <h2 className="cta-title">Ready To Transform<br />Your Development Process?</h2>
              <p className="cta-description">
                DOCU-FORGE is operational and production-tested. System access requires authorization. All work is confidential and NDA-protected.
              </p>
            </div>
            <div className="cta-action">
              <div className="cta-box">
                <p className="cta-box-label">Contact for access:</p>
                <a href="mailto:gizmet@protonmail.com" className="cta-email">
                  gizmet@protonmail.com
                </a>
                <p className="cta-note">
                  Technical architecture, implementation details, and operational processes are proprietary. Patent Pending (UK Patent Application GB2518692.5).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-left">
              <div className="footer-logo">
                <span className="logo-bracket">[</span>
                DOCU-FORGE
                <span className="logo-bracket">]</span>
              </div>
              <p className="footer-tagline">by GIZMET.DEV [creative systems lab]</p>
              <p className="footer-copyright">© 2025 Gizmet.dev / Michael Needs</p>
              <p className="footer-patent">Patent Pending (UK Patent Application GB2518692.5)</p>
              <p className="footer-product">DOCU-FORGE is a Gizmet.dev Ltd product</p>
            </div>
            <div className="footer-right">
              <p className="footer-text">Integrated infrastructure for high-trust creative work.</p>
              <p className="footer-text">Secure, efficient - fewer steps from idea to execution.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;