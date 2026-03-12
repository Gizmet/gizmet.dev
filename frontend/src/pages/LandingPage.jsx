import React, { useEffect, useRef, useState, useCallback } from 'react';
import HeroGlobe from '../components/HeroGlobe';

const owlSrc = `${process.env.PUBLIC_URL}/owl-logo.png`;

const LandingPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const loaderRef = useRef(null);
  const progressRef = useRef(null);
  const heroGridRef = useRef(null);
  const navRef = useRef(null);
  const lastScrollRef = useRef(0);

  // Loader dismiss — wait for minimum animation time AND globe readiness
  useEffect(() => {
    let minTimePassed = false;
    let globeReady = false;
    const dismiss = () => {
      if (minTimePassed && globeReady && loaderRef.current) {
        loaderRef.current.classList.add('done');
      }
    };
    const timer = setTimeout(() => { minTimePassed = true; dismiss(); }, 1400);
    const onReady = () => { globeReady = true; dismiss(); };
    window.addEventListener('globe-ready', onReady);
    // Fallback: dismiss after 3s no matter what
    const fallback = setTimeout(() => {
      if (loaderRef.current) loaderRef.current.classList.add('done');
    }, 3000);
    return () => {
      clearTimeout(timer);
      clearTimeout(fallback);
      window.removeEventListener('globe-ready', onReady);
    };
  }, []);

  // Scroll: progress bar, hero parallax, nav hide/show
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      if (progressRef.current) progressRef.current.style.width = progress + '%';

      if (!ticking) {
        requestAnimationFrame(() => {
          if (scrollTop < window.innerHeight && heroGridRef.current) {
            heroGridRef.current.style.transform = 'translateY(' + (scrollTop * 0.25) + 'px)';
          }
          ticking = false;
        });
        ticking = true;
      }

      if (navRef.current) {
        if (scrollTop > lastScrollRef.current && scrollTop > 200) {
          navRef.current.style.transform = 'translateY(-100%)';
        } else {
          navRef.current.style.transform = 'translateY(0)';
        }
        navRef.current.style.transition = 'transform 0.35s ease';
      }
      lastScrollRef.current = scrollTop;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for scroll reveal
  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const toggleMenu = useCallback(() => setMenuOpen(prev => !prev), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const scrollTo = useCallback((e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    closeMenu();
  }, [closeMenu]);

  return (
    <>
      {/* LOADER */}
      <div className="loader" ref={loaderRef}>
        <img src={owlSrc} alt="Gizmet" />
        <div className="loader-bar"></div>
      </div>

      <div className="scroll-progress" ref={progressRef}></div>

      {/* NAV */}
      <nav ref={navRef}>
        <a href="#top" className="nav-logo" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
          <img className="owl" src={owlSrc} alt="Gizmet" />
          <span className="nav-wordmark">Gizmet Dev</span>
        </a>
        <div className="nav-right">
          <ul className="nav-links">
            <li><a href="#systems" onClick={(e) => scrollTo(e, 'systems')}>Systems</a></li>
            <li><a href="#method" onClick={(e) => scrollTo(e, 'method')}>Method</a></li>
            <li><a href="#about" onClick={(e) => scrollTo(e, 'about')}>About</a></li>
            <li><a href="https://gizint.ghost.io" target="_blank" rel="noopener noreferrer">GIZINT ↗</a></li>
          </ul>
          <a href="mailto:hello@gizmet.dev" className="nav-contact">Enquire</a>
          <button className={`hamburger${menuOpen ? ' active' : ''}`} onClick={toggleMenu} aria-label="Menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        <a href="#systems" onClick={(e) => scrollTo(e, 'systems')}>Systems</a>
        <a href="#method" onClick={(e) => scrollTo(e, 'method')}>Method</a>
        <a href="#about" onClick={(e) => scrollTo(e, 'about')}>About</a>
        <a href="https://gizint.ghost.io" target="_blank" rel="noopener noreferrer">GIZINT ↗</a>
        <a href="mailto:hello@gizmet.dev" style={{ color: 'var(--amber)' }}>Enquire</a>
      </div>

      {/* HERO */}
      <section className="hero">
        <HeroGlobe />
        <div className="hero-bg-grid" ref={heroGridRef}></div>
        <div className="hero-glow"></div>
        <div className="hero-content">
          <h1 className="hero-h1">Research at machine<br /><em>speed.</em></h1>
          <p className="hero-kicker">Gizmet Dev Ltd &nbsp;&middot;&nbsp; United Kingdom</p>
        </div>
        <div className="hero-bottom">
          <p className="hero-sub">Proprietary analytical systems for media development and geopolitical research. Built by practitioners. Operated to the same standard as the work it supports.</p>
          <div className="hero-actions">
            <a href="#systems" className="btn-a" onClick={(e) => scrollTo(e, 'systems')}>Our Systems</a>
            <a href="mailto:hello@gizmet.dev" className="btn-b">Get in Touch</a>
          </div>
        </div>
        <div className="scroll-hint">
          <span>Scroll</span>
          <div className="scroll-line"></div>
        </div>
      </section>

      {/* RULE BAR */}
      <div className="rule-bar">
        <div className="rule-item">
          <div className="rule-dot"></div>
          <span className="rule-text">Media Development</span>
        </div>
        <div className="rule-item">
          <div className="rule-dot"></div>
          <span className="rule-text">Geopolitical Analysis</span>
        </div>
        <div className="rule-item">
          <div className="rule-dot"></div>
          <span className="rule-text">Analytical Systems</span>
        </div>
      </div>

      {/* SYSTEMS */}
      <section className="section systems" id="systems">
        <div className="s-label reveal">01 — Systems</div>
        <div className="systems-intro">
          <h2 className="reveal">Three systems.<br />Operational now.</h2>
          <p className="reveal reveal-stagger" style={{ '--delay': '100ms' }}>Each system was built to solve a specific problem that existing tools could not. They run continuously, they are used on live client work, and they are not available off the shelf. Enquiries about access are handled directly by the director.</p>
        </div>
        <div className="systems-grid">
          <div className="sys-card reveal reveal-stagger" style={{ '--delay': '0ms' }}>
            <div className="sys-status">
              <span className="sys-status-dot"></span>
              Active · Production
            </div>
            <div className="sys-codename">BLACKTHORN</div>
            <div className="sys-function">Media Development</div>
            <p className="sys-desc">Development research at a pace and depth that traditional teams cannot reach. Currently deployed on behalf of production organisations holding the industry's highest broadcast awards.</p>
            <div className="sys-footer">Patent pending &nbsp;&middot;&nbsp; UK registered</div>
          </div>
          <div className="sys-card reveal reveal-stagger" style={{ '--delay': '120ms' }}>
            <div className="sys-status">
              <span className="sys-status-dot"></span>
              Active · Continuous
            </div>
            <div className="sys-codename">LONGBOW</div>
            <div className="sys-function">Story Discovery</div>
            <p className="sys-desc">Finds what researcher-led discovery misses. Runs continuously, surfaces candidates at volume, and operates across investigative tiers that manual processes cannot cover.</p>
            <div className="sys-footer">Proprietary architecture &nbsp;&middot;&nbsp; 24/7 operation</div>
          </div>
          <div className="sys-card reveal reveal-stagger" style={{ '--delay': '240ms' }}>
            <div className="sys-status">
              <span className="sys-status-dot"></span>
              Active · Daily
            </div>
            <div className="sys-codename">NIGHTJAR</div>
            <div className="sys-function">Geopolitical Analysis</div>
            <p className="sys-desc">The engine behind GIZINT. Delivers assessed intelligence daily to subscribers who operate under uncertainty and need the full picture before they act. Human-directed at every stage.</p>
            <div className="sys-footer">Powers GIZINT &nbsp;&middot;&nbsp; gizint.ghost.io</div>
          </div>
        </div>
      </section>

      {/* METHOD */}
      <section className="section method" id="method">
        <div className="s-label reveal">02 — Method</div>
        <div className="method-grid">
          <div className="method-card reveal reveal-stagger" style={{ '--delay': '0ms' }}>
            <div className="method-num">01</div>
            <h3 className="method-title">No editorial line</h3>
            <p className="method-body">We do not advocate for outcomes. We assess conditions. Every output is structured to present the picture as it is — not as any party would prefer it to be. Clients form their own judgments.</p>
          </div>
          <div className="method-card reveal reveal-stagger" style={{ '--delay': '100ms' }}>
            <div className="method-num">02</div>
            <h3 className="method-title">Sourced or not stated</h3>
            <p className="method-body">Every claim carries a citation. Analytical judgments are graded by confidence level and clearly separated from reported fact. Precision in language is structural, not stylistic.</p>
          </div>
          <div className="method-card reveal reveal-stagger" style={{ '--delay': '200ms' }}>
            <div className="method-num">03</div>
            <h3 className="method-title">Human-directed throughout</h3>
            <p className="method-body">Collection and synthesis is system-assisted. All analytical judgments are human-directed. The distinction is maintained without exception — in every output, for every client.</p>
          </div>
          <div className="method-card reveal reveal-stagger" style={{ '--delay': '300ms' }}>
            <div className="method-num">04</div>
            <h3 className="method-title">Errors corrected publicly</h3>
            <p className="method-body">When assessments are wrong — and they sometimes are — corrections appear in the next output under the author's name, with the reasoning explained. The correction record is permanent.</p>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="section about" id="about">
        <div className="s-label reveal">03 — About</div>
        <div className="about-layout">
          <div className="about-left">
            <h2 className="reveal">Built by a practitioner.<br />Not a theorist.</h2>
            <p className="reveal" style={{ '--delay': '80ms' }}>Gizmet Dev Ltd is a UK-registered analytical systems company. The director holds fifteen years of field production experience — progressing from acquisition through direction to the systems architecture that underpins every Gizmet product.</p>
            <p className="reveal" style={{ '--delay': '160ms' }}>He has published peer-reviewed research on AI methodology, holds registered intellectual property in the United Kingdom, and maintains active contracts with production organisations holding the industry's highest broadcast awards.</p>
            <p className="reveal" style={{ '--delay': '240ms' }}>The analytical instinct behind this work is not academic. It was trained under deadline, in contested environments, where the cost of a wrong read is visible immediately.</p>
          </div>
          <div className="about-right reveal" style={{ '--delay': '120ms' }}>
            <div className="fact-row">
              <span className="fact-key">Incorporated</span>
              <span className="fact-val">United Kingdom</span>
            </div>
            <div className="fact-row">
              <span className="fact-key">Director</span>
              <span className="fact-val">Systems architect &amp;<br />published researcher</span>
            </div>
            <div className="fact-row">
              <span className="fact-key">Field experience</span>
              <span className="fact-val">15 years</span>
            </div>
            <div className="fact-row">
              <span className="fact-key">Active clients</span>
              <span className="fact-val">BAFTA / Emmy /<br />Grierson-awarded orgs</span>
            </div>
            <div className="fact-row">
              <span className="fact-key">IP status</span>
              <span className="fact-val">Registered &amp;<br />patent-pending</span>
            </div>
            <div className="fact-row">
              <span className="fact-key">Published research</span>
              <span className="fact-val">AI training methodology<br />&amp; network science</span>
            </div>
          </div>
        </div>
      </section>

      {/* GIZINT */}
      <section className="gizint-strip" id="gizint">
        <div className="s-label reveal">04 — Live Product</div>
        <div className="gizint-inner">
          <div className="gizint-copy">
            <h2 className="reveal">The brief<br />is <em>live.</em></h2>
            <p className="reveal" style={{ '--delay': '80ms' }}>GIZINT publishes daily. Geopolitics, defence, markets, security — assessed to a consistent standard, delivered before the day opens. No editorial line. No advocacy.</p>
            <p className="reveal" style={{ '--delay': '160ms' }}>Written for people who operate under uncertainty. Not for a general audience.</p>
            <div className="reveal" style={{ '--delay': '240ms' }}>
              <a href="https://gizint.ghost.io" target="_blank" rel="noopener noreferrer" className="btn-a">Read GIZINT →</a>
            </div>
          </div>
          <div className="brief-mock reveal" style={{ '--delay': '200ms' }}>
            <div className="brief-top">
              <span className="brief-title-tag">
                <span className="brief-live-dot"></span>
                GIZINT — Daily Brief
              </span>
              <span className="brief-date">12 Mar 2026</span>
            </div>
            <div className="brief-entries">
              <div className="brief-entry">
                <div className="brief-entry-region">■ Iran · US</div>
                <div className="brief-entry-head">US assessment contradicts administration posture on regime stability</div>
                <div className="brief-entry-body"><em>We assess</em> — four incompatible endgame timelines now active simultaneously across principal decision-makers.</div>
              </div>
              <div className="brief-entry">
                <div className="brief-entry-region">■ Naval · MCM</div>
                <div className="brief-entry-head">Sole RN mine-hunter offline for maintenance</div>
                <div className="brief-entry-body"><em>Reporting indicates</em> — coalition mine countermeasures capability below yesterday's assessment. Gap is structural, not temporary.</div>
              </div>
              <div className="brief-entry">
                <div className="brief-entry-region">■ Diplomatic</div>
                <div className="brief-entry-head">Gulf–Pakistan backchannel confirmed at principal level</div>
                <div className="brief-entry-body"><em>Available reporting suggests</em> — most concrete off-ramp signal to date. Riyadh track now active.</div>
              </div>
            </div>
            <div className="brief-footer">
              <span>No editorial line</span>
              <span>Assessment only</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <p className="cta-eyebrow reveal">Enquiries welcome</p>
        <h2 className="reveal" style={{ '--delay': '80ms' }}>Let's talk<br />about the <em>work.</em></h2>
        <p className="reveal" style={{ '--delay': '160ms' }}>Media development, enterprise research arrangements, or GIZINT subscriptions. All enquiries handled directly.</p>
        <div className="reveal" style={{ '--delay': '240ms' }}>
          <a href="mailto:hello@gizmet.dev" className="cta-email">hello@gizmet.dev</a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="footer-id">
          <span className="footer-name">Gizmet Dev Ltd</span>
          <span className="footer-sub">Registered in England and Wales &nbsp;&middot;&nbsp; gizmet.dev</span>
        </div>
        <div className="footer-links">
          <a href="mailto:hello@gizmet.dev">Contact</a>
          <a href="https://gizint.ghost.io" target="_blank" rel="noopener noreferrer">GIZINT</a>
          <a href="mailto:subscriptions@gizmet.dev">Subscriptions</a>
        </div>
        <span className="footer-mark">No editorial line. No advocacy.</span>
      </footer>
    </>
  );
};

export default LandingPage;
