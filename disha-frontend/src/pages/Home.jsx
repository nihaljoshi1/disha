import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import ThemeToggle from '../components/ThemeToggle';
import { useScrollReveal } from '../hooks/useScrollReveal';
import '../styles/home.css';

// Import your 5 team photos here after moving them to src/assets/team/
import nihalImg from '../assets/team/nihal.png';
import dhruvImg from '../assets/team/dhruv.jpg';
import naitikImg from '../assets/team/naitik.png';
import ramImg from '../assets/team/ram.png';
import darshanImg from '../assets/team/darshan.png';

const TEAM = [
  { name: 'Nihal Joshi', role: 'Project Lead & Backend', img: nihalImg },
  { name: 'Dhruv Chhatbar', role: 'Frontend Developer', img: dhruvImg },
  { name: 'Naitik Navadiya', role: 'Backend Developer', img: naitikImg },
  { name: 'Ram Bhalgamiya', role: 'Frontend Developer', img: ramImg },
  { name: 'Darshan Parmar', role: 'UI/UX', img: darshanImg },
];
export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  useScrollReveal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeNav = () => setNavOpen(false);

  return (
    <>
      <header className={`nav${scrolled ? ' scrolled' : ''}`}>
        <div className="nav-inner">
          <Link to="/" className="logo"><Logo /></Link>
          <nav className={`nav-links${navOpen ? ' open' : ''}`}>
            <a href="#streams" onClick={closeNav}>Streams</a>
            <a href="#how" onClick={closeNav}>How it works</a>
            <a href="#why" onClick={closeNav}>Why Disha</a>
            <a href="#about" onClick={closeNav}>About</a>
          </nav>
          <div className="nav-cta">
            <ThemeToggle />
            <Link to="/login" className="nav-login">Log in</Link>
            <a href="#" className="btn btn-primary">Take the Quiz</a>
            <button className="nav-toggle" aria-label="Open menu" onClick={() => setNavOpen(!navOpen)}>
              <svg viewBox="0 0 24 24" fill="none"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
            </button>
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="wrap hero-inner">
          <div>
            <span className="eyebrow">AI + voice-guided</span>
            <h1>Find the right stream for you — backed by your marks and interests, <em>not guesswork.</em></h1>
            <p className="sub">Answer a few questions, by voice or text, and get a stream recommendation you can actually explain to your parents. Takes 5 minutes. No sign-up required to start.</p>
            <div className="hero-actions">
              <a href="#" className="btn btn-primary">Start Assessment</a>
              <a href="#how" className="btn btn-ghost">See how it works</a>
            </div>
          </div>
          <div className="hero-visual">
            <svg className="hero-orbit" viewBox="0 0 400 400" aria-hidden="true">
              <defs>
                <linearGradient id="needleGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" style={{ stopColor: 'var(--coral)' }} />
                  <stop offset="100%" style={{ stopColor: 'var(--sand)' }} />
                </linearGradient>
              </defs>
              <g className="orbit-outer">
                <circle cx="200" cy="200" r="185" fill="none" style={{ stroke: 'var(--coral)' }} strokeWidth="1.4" strokeDasharray="1 11" opacity=".6" />
                <line x1="300" y1="200" x2="378" y2="200" style={{ stroke: 'var(--sky)' }} strokeWidth="1.2" opacity=".55" />
                <line x1="270.7" y1="270.7" x2="323.7" y2="323.7" style={{ stroke: 'var(--sky)' }} strokeWidth="1.2" opacity=".55" />
                <line x1="200" y1="300" x2="200" y2="378" style={{ stroke: 'var(--sky)' }} strokeWidth="1.2" opacity=".55" />
                <line x1="129.3" y1="270.7" x2="76.3" y2="323.7" style={{ stroke: 'var(--sky)' }} strokeWidth="1.2" opacity=".55" />
                <line x1="100" y1="200" x2="22" y2="200" style={{ stroke: 'var(--sky)' }} strokeWidth="1.2" opacity=".55" />
                <line x1="129.3" y1="129.3" x2="76.3" y2="76.3" style={{ stroke: 'var(--sky)' }} strokeWidth="1.2" opacity=".55" />
                <line x1="200" y1="100" x2="200" y2="22" style={{ stroke: 'var(--sky)' }} strokeWidth="1.2" opacity=".55" />
                <line x1="270.7" y1="129.3" x2="323.7" y2="76.3" style={{ stroke: 'var(--sky)' }} strokeWidth="1.2" opacity=".55" />
              </g>
              <g className="orbit-mid">
                <circle cx="200" cy="200" r="150" fill="none" style={{ stroke: 'var(--sand)' }} strokeWidth="1.1" strokeDasharray="2 9" opacity=".55" />
                <circle cx="200" cy="200" r="115" fill="none" style={{ stroke: 'var(--mint)' }} strokeWidth="1" opacity=".35" />
              </g>
              <g className="orbit-needle">
                <path d="M200 145 L214 200 L200 255 L186 200 Z" fill="url(#needleGrad)" opacity=".85" />
                <path d="M155 200 L200 189 L245 200 L200 211 Z" style={{ fill: 'var(--sky)' }} opacity=".5" />
                <circle cx="200" cy="200" r="7" style={{ fill: 'var(--paper)' }} stroke="url(#needleGrad)" strokeWidth="2" />
              </g>
            </svg>
            <div className="icon-grid">
              <div className="icon-tile">
                <svg viewBox="0 0 24 24" fill="none"><path d="M9 3v5.5L4.5 17a2 2 0 0 0 1.8 3h11.4a2 2 0 0 0 1.8-3L15 8.5V3" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><path d="M9 3h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
                <span>Science</span>
              </div>
              <div className="icon-tile">
                <svg viewBox="0 0 24 24" fill="none"><path d="M4 19V9l8-5 8 5v10" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><path d="M9 19v-6h6v6" stroke="currentColor" strokeWidth="1.6" /><path d="M4 10l8 4 8-4" stroke="currentColor" strokeWidth="1.6" /></svg>
                <span>Commerce</span>
              </div>
              <div className="icon-tile">
                <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" /><circle cx="9" cy="10" r="1.2" fill="currentColor" /><circle cx="13" cy="8.5" r="1.2" fill="currentColor" /><circle cx="15.5" cy="12.5" r="1.2" fill="currentColor" /><circle cx="10" cy="15" r="1.2" fill="currentColor" /></svg>
                <span>Arts</span>
              </div>
              <div className="icon-tile">
                <svg viewBox="0 0 24 24" fill="none"><path d="M14.7 6.3a2 2 0 0 1 2.8 0l.2.2a2 2 0 0 0 2 .5l.3-.1a2 2 0 0 1 2.4 2.4l-.1.3a2 2 0 0 0 .5 2l.2.2a2 2 0 0 1 0 2.8l-.2.2a2 2 0 0 0-.5 2l.1.3a2 2 0 0 1-2.4 2.4l-.3-.1a2 2 0 0 0-2 .5l-.2.2a2 2 0 0 1-2.8 0l-.2-.2a2 2 0 0 0-2-.5l-.3.1a2 2 0 0 1-2.4-2.4l.1-.3a2 2 0 0 0-.5-2l-.2-.2a2 2 0 0 1 0-2.8l.2-.2a2 2 0 0 0 .5-2l-.1-.3a2 2 0 0 1 2.4-2.4l.3.1a2 2 0 0 0 2-.5l.2-.2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /><circle cx="17" cy="12" r="2.4" stroke="currentColor" strokeWidth="1.4" /></svg>
                <span>Diploma</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="reveal">
        <div className="wrap">
          <div className="section-head">
            <h2>How it works</h2>
            <p>Four short steps stand between you and a recommendation you can trust.</p>
          </div>
          <div className="steps">
            {[
              ['Enter your marks', "Subject-wise scores from your last exam — that's all we need to start."],
              ['Answer the quiz', 'Speak your answers or type them. Disha listens either way.'],
              ['Get your recommendation', 'A ranked stream match built from your marks and interests together.'],
              ['See the score breakdown', 'Understand exactly which factors moved the needle, and by how much.'],
            ].map(([title, desc], i) => (
              <div className="step reveal-item" style={{ '--stagger': i }} key={title}>
                <div className="step-num">{i + 1}</div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="why" className="features reveal">
        <div className="wrap">
          <div className="section-head">
            <h2>Why Disha</h2>
            <p>Built to replace guesswork and generic advice with something you can verify.</p>
          </div>
          <div className="feature-grid">
            <div className="feature-card reveal-item" style={{ '--stagger': 0 }}>
              <div className="ic"><svg viewBox="0 0 24 24" fill="none"><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /><rect x="8" y="6" width="8" height="12" rx="4" stroke="currentColor" strokeWidth="1.6" /></svg></div>
              <h3>Voice-assisted quiz</h3>
              <p>Talk through your answers naturally — no typing required, no rigid multiple choice.</p>
            </div>
            <div className="feature-card reveal-item" style={{ '--stagger': 1 }}>
              <div className="ic"><svg viewBox="0 0 24 24" fill="none"><path d="M4 19V5a1 1 0 0 1 1-1h9l6 6v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><path d="M8 13h8M8 17h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg></div>
              <h3>Transparent scoring</h3>
              <p>Every recommendation comes with a breakdown — see exactly why, not a black box.</p>
            </div>
            <div className="feature-card reveal-item" style={{ '--stagger': 2 }}>
              <div className="ic"><svg viewBox="0 0 24 24" fill="none"><path d="M4 18V9M10 18V5M16 18v-7M20 18H4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
              <h3>"What-if" simulator</h3>
              <p>Nudge a mark or interest and watch your recommendation update in real time.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="streams" className="reveal">
        <div className="wrap">
          <div className="section-head">
            <h2>Streams, explained simply</h2>
            <p>A quick look before you dive into the full assessment.</p>
          </div>
          <div className="stream-grid">
            {[
              ['science', 'Science', 'For students drawn to how things work — strong in maths or biology, curious about engineering, medicine, or research.'],
              ['commerce', 'Commerce', 'For students interested in business, money, and numbers — a path toward finance, management, or entrepreneurship.'],
              ['arts', 'Arts', 'For students who think in words and ideas — suited to law, design, media, psychology, and the humanities.'],
              ['diploma', 'Diploma', 'For students who want hands-on, job-ready skills faster — a direct route into technical and vocational careers.'],
            ].map(([cls, title, desc], i) => (
              <div className={`stream-card ${cls} reveal-item`} style={{ '--stagger': i }} key={cls}>
                <h3>{title}</h3>
                <p>{desc}</p>
                <a href="#">Explore {title}</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-band reveal">
        <div className="wrap">
          <h2>Stop guessing. Start deciding.</h2>
          <p>Your recommendation is five minutes away.</p>
          <a href="#" className="btn btn-primary">Take the Quiz</a>
        </div>
      </section>

      <section id="about" className="reveal">
        <div className="wrap">
          <div className="section-head"><h2>About the project</h2></div>
          <p className="about-text">Disha started as a response to how stream decisions actually get made in most homes — a relative's opinion, a friend's choice, or whichever stream "sounds safest." We built a system that looks at your actual marks and interests instead, and shows its work, so the decision is yours to understand and own.</p>
          <div className="team-grid">
            {TEAM.map((member, i) => (
              <div className="team-card reveal-item" style={{ '--stagger': i }} key={member.name}>
                <img
                  className="team-avatar"
                  src={member.img /* falls back to nothing until you wire the imports above */}
                  alt={member.name}
                  style={{ background: 'linear-gradient(135deg, var(--sky), var(--mint))' }}
                />
                <h4>{member.name}</h4>
                <span>{member.role}</span>
                <div className="social-bar">
                  <a href="#" className="social-btn linkedin" aria-label={`${member.name} on LinkedIn`}><svg viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.6" /><path d="M8 10v6M8 7.5v.01M12 16v-3.5c0-1.4 1-2.2 2.2-2.2 1.2 0 1.8.9 1.8 2.2V16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg></a>
                  <a href="#" className="social-btn github" aria-label={`${member.name} on GitHub`}><svg viewBox="0 0 24 24" fill="none"><path d="M8 9l-3 3 3 3M16 9l3 3-3 3M13.5 7l-3 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></a>
                  <a href="#" className="social-btn twitter" aria-label={`${member.name} on Twitter`}><svg viewBox="0 0 24 24" fill="none"><path d="M4.5 4.5l15 15M19.5 4.5l-15 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg></a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap">
          <div className="footer-grid">
            <div>
              <div className="footer-logo-wrap"><Logo /></div>
              <p>Helping students choose a stream based on their own marks and interests — explained clearly, every step of the way.</p>
              <div className="social-row">
                <a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" /><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" /><circle cx="17.2" cy="6.8" r="1" fill="currentColor" /></svg></a>
                <a href="#" aria-label="YouTube"><svg viewBox="0 0 24 24" fill="none"><rect x="2.5" y="6" width="19" height="12" rx="4" stroke="currentColor" strokeWidth="1.6" /><path d="M10.5 9.5l4.5 2.5-4.5 2.5v-5Z" fill="currentColor" /></svg></a>
                <a href="#" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.6" /><path d="M8 10v6M8 7.5v.01M12 16v-3.5c0-1.4 1-2.2 2.2-2.2 1.2 0 1.8.9 1.8 2.2V16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg></a>
              </div>
            </div>
            <div>
              <h4>Platform</h4>
              <ul>
                <li><a href="#streams">Streams</a></li>
                <li><a href="#how">How it works</a></li>
                <li><a href="#why">Why Disha</a></li>
                <li><a href="#">Take the quiz</a></li>
              </ul>
            </div>
            <div>
              <h4>Company</h4>
              <ul>
                <li><a href="#about">About</a></li>
                <li><a href="#">Contact</a></li>
                <li><a href="#">Privacy</a></li>
                <li><a href="#">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="bottom-bar">
            <span>&copy; 2026 Disha. All rights reserved.</span>
            <div><a href="#">Privacy</a><a href="#">Terms</a></div>
          </div>
        </div>
      </footer>
    </>
  );
}