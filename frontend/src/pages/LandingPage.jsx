import React, { useState, useEffect } from 'react';
import { ArrowRight, Zap, Database, FileText, Users, Globe, Clock, Shield, ChevronDown } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';

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
            <nav className="nav">
              <a href="#capabilities" className="nav-link">capabilities</a>
              <a href="#use-cases" className="nav-link">use_cases</a>
              <a href="#contact" className="nav-link">contact</a>
            </nav>
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
                <span>Request Access</span>
                <ArrowRight className="button-icon" />
              </Button>
              <button className="secondary-button" onClick={() => document.getElementById('capabilities')?.scrollIntoView({ behavior: 'smooth' })}>
                <span>Explore Capabilities</span>
                <ChevronDown className="button-icon" />
              </button>
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
      <section id="capabilities" className="capabilities">
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

      {/* Visual Break */}
      <section className="visual-break">
        <div className="visual-break-content">
          <img 
            src="https://images.unsplash.com/photo-1705107958696-a7f73c749ab3?w=1200&q=80" 
            alt="Production" 
            className="break-image"
          />
          <div className="break-overlay">
            <div className="container">
              <div className="break-text">
                <div className="section-label">[transformation]</div>
                <h2 className="break-title">48 Hours vs 5 Months<br />Single Operator vs Full Teams</h2>
                <p className="break-description">
                  880 hours of traditional development compressed into 48. Not through shortcuts - through veteran expertise amplified by precision systems. 18x faster. 55x more efficient.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="use-cases" className="use-cases">
        <div className="container">
          <div className="section-header">
            <div className="section-label">[use_cases]</div>
            <h2 className="section-title">How Producers Use This</h2>
          </div>

          <div className="use-cases-grid">
            <Card className="use-case-card">
              <div className="use-case-number">01</div>
              <h3 className="use-case-title">Portfolio Approach</h3>
              <p className="use-case-description">
                Develop 5 complete packages simultaneously. Pitch all. Greenlight the best. Zero wasted development cost on projects that don't sell.
              </p>
            </Card>

            <Card className="use-case-card">
              <div className="use-case-number">02</div>
              <h3 className="use-case-title">Rapid Response</h3>
              <p className="use-case-description">
                Breaking case hits the news. Complete development package ready in days. First to commissioners with fully developed pitch.
              </p>
            </Card>

            <Card className="use-case-card">
              <div className="use-case-number">03</div>
              <h3 className="use-case-title">International Expansion</h3>
              <p className="use-case-description">
                UK producer researching US cases. Australian stories for British broadcasters. Global research without geographic limits.
              </p>
            </Card>

            <Card className="use-case-card">
              <div className="use-case-number">04</div>
              <h3 className="use-case-title">Format Flexibility</h3>
              <p className="use-case-description">
                Same case, multiple formats. Feature for theatrical. Series for streaming. Podcast adaptation. All developed in parallel.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Specifications Section */}
      <section className="specifications">
        <div className="container">
          <div className="section-header">
            <div className="section-label">[specifications]</div>
            <h2 className="section-title">System Capabilities</h2>
          </div>

          <Accordion type="single" collapsible className="specs-accordion">
            <AccordionItem value="research">
              <AccordionTrigger className="accordion-trigger">
                <div className="trigger-content">
                  <Clock className="trigger-icon" />
                  <span>Research & Discovery</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="accordion-content">
                <p>Find viable cases globally. Deep research across court records, legal databases, news archives. Complete timeline construction. Key people profiling. Archive mapping. Blindspot analysis. Competition research. UK, US, Canada, Australia, Europe coverage.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="structure">
              <AccordionTrigger className="accordion-trigger">
                <div className="trigger-content">
                  <Zap className="trigger-icon" />
                  <span>Story Architecture</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="accordion-content">
                <p>Unique narrative positioning. Beat-by-beat structural blueprint. Emotional arc mapping. Timeline design. Tonal calibration. Act breaks and climactic moments. Visual and audio strategy. Adaptable to feature, series, or podcast formats.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="treatment">
              <AccordionTrigger className="accordion-trigger">
                <div className="trigger-content">
                  <FileText className="trigger-icon" />
                  <span>Narrative Treatment</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="accordion-content">
                <p>Complete cinematic prose treatment. Present-tense documentary screenplay. New Yorker / This American Life standard. Consistent tonal execution. Documented quotes only. Production notes integrated. Commissioners can read the complete vision.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="production">
              <AccordionTrigger className="accordion-trigger">
                <div className="trigger-content">
                  <Globe className="trigger-icon" />
                  <span>Production Planning</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="accordion-content">
                <p>Filming locations mapped with access strategies. Interview subjects prioritized. Legal risk assessment. Archive licensing roadmap. Production timeline. Crew requirements. Risk mitigation. Budget considerations. International production support.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="interviews">
              <AccordionTrigger className="accordion-trigger">
                <div className="trigger-content">
                  <Users className="trigger-icon" />
                  <span>Interview Preparation</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="accordion-content">
                <p>Comprehensive question banks for all subjects. Trauma-informed protocols. Blindspot questions. Session structure. Ethical guidelines. Vulnerability assessment. Every key person mapped and ready.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="delivery">
              <AccordionTrigger className="accordion-trigger">
                <div className="trigger-content">
                  <Shield className="trigger-icon" />
                  <span>Delivery & Export</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="accordion-content">
                <p>Development Brief. Production Roadmap. Assets Database. Interview Strategies. Pitch Materials. Professional Word document export. Multiple formats optimized for different audiences. Commissioner-ready. Funding application-ready.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
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
                DOCU-FORGE is operational and production-tested. System access requires authorization.
              </p>
            </div>
            <div className="cta-action">
              <div className="cta-box">
                <p className="cta-box-label">Contact for access:</p>
                <a href="mailto:gizmet@protonmail.com" className="cta-email">
                  gizmet@protonmail.com
                </a>
                <p className="cta-note">
                  Technical architecture, implementation details, and operational processes are proprietary.
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