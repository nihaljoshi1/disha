import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Logo from '../components/Logo';
import ThemeToggle from '../components/ThemeToggle';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

function FieldError({ id, message }) {
  return <span className="field-error" id={id}>{message}</span>;
}

export default function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [mode, setMode] = useState(location.pathname === '/register' ? 'signup' : 'signin');

  const [signinData, setSigninData] = useState({ email: '', password: '' });
  const [signinErrors, setSigninErrors] = useState({});
  const [signinAlert, setSigninAlert] = useState(null);
  const [signinSubmitting, setSigninSubmitting] = useState(false);

  const [signupData, setSignupData] = useState({ name: '', email: '', password: '' });
  const [signupErrors, setSignupErrors] = useState({});
  const [signupAlert, setSignupAlert] = useState(null);
  const [signupSubmitting, setSignupSubmitting] = useState(false);

  const goSignup = (e) => {
    e?.preventDefault();
    setMode('signup');
    setSigninAlert(null);
    setSigninErrors({});
    navigate('/register', { replace: true });
  };
  const goSignin = () => {
    setMode('signin');
    setSignupAlert(null);
    setSignupErrors({});
    navigate('/login', { replace: true });
  };

  const validateEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const handleSigninSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!signinData.email.trim()) errors.email = 'Enter your email.';
    else if (!validateEmail(signinData.email)) errors.email = 'Enter a valid email address.';
    if (!signinData.password) errors.password = 'Enter your password.';

    setSigninErrors(errors);
    if (Object.keys(errors).length) {
      setSigninAlert({ type: 'error', text: 'Please fix the highlighted fields.' });
      return;
    }

    setSigninAlert(null);
    setSigninSubmitting(true);
    try {
      await login(signinData.email, signinData.password);
      setSigninAlert({ type: 'success', text: 'Logged in successfully. Redirecting…' });
      setTimeout(() => navigate('/dashboard'), 600);
    } catch (err) {
      setSigninAlert({ type: 'error', text: err.response?.data?.error || 'Login failed' });
    } finally {
      setSigninSubmitting(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!signupData.name.trim()) errors.name = 'Enter your name.';
    if (!signupData.email.trim()) errors.email = 'Enter your email.';
    else if (!validateEmail(signupData.email)) errors.email = 'Enter a valid email address.';
    if (!signupData.password) errors.password = 'Create a password.';
    else if (signupData.password.length < 8) errors.password = 'Must be at least 8 characters.';

    setSignupErrors(errors);
    if (Object.keys(errors).length) {
      setSignupAlert({ type: 'error', text: 'Please fix the highlighted fields.' });
      return;
    }

    setSignupAlert(null);
    setSignupSubmitting(true);
    try {
      await register(signupData.name, signupData.email, signupData.password);
      setSignupAlert({ type: 'success', text: 'Account created. You can now log in.' });
      setTimeout(() => goSignin(), 1000);
    } catch (err) {
      setSignupAlert({ type: 'error', text: err.response?.data?.error || 'Registration failed' });
    } finally {
      setSignupSubmitting(false);
    }
  };

  return (
    <div className="auth-body">
      <ThemeToggle className="auth-theme-toggle" />

      <div className="auth-wrap">
        <div className="auth-brand">
          <Link to="/" className="logo"><Logo /></Link>
        </div>

        <div className={`auth-card${mode === 'signup' ? ' mode-signup' : ''}`}>
          <div className="auth-panel auth-signin">
            <span className="auth-eyebrow">Welcome back</span>
            <h1>Log in to Disha</h1>
            <p className="sub">Pick up right where you left off.</p>
            {signinAlert && <div className={`auth-alert is-${signinAlert.type}`} role="alert">{signinAlert.text}</div>}
            <form onSubmit={handleSigninSubmit} noValidate>
              <div className={`field${signinErrors.email ? ' has-error' : ''}`}>
                <label htmlFor="loginEmail">Email ID</label>
                <input
                  type="email" id="loginEmail" placeholder="you@example.com" autoComplete="email"
                  value={signinData.email}
                  onChange={(e) => setSigninData({ ...signinData, email: e.target.value })}
                  aria-describedby="loginEmailError"
                />
                <FieldError id="loginEmailError" message={signinErrors.email} />
              </div>
              <div className={`field${signinErrors.password ? ' has-error' : ''}`}>
                <div className="field-label-row">
                  <label htmlFor="loginPassword">Password</label>
                  <a href="#" className="field-aux">Forgot password?</a>
                </div>
                <input
                  type="password" id="loginPassword" placeholder="••••••••" autoComplete="current-password"
                  value={signinData.password}
                  onChange={(e) => setSigninData({ ...signinData, password: e.target.value })}
                  aria-describedby="loginPasswordError"
                />
                <FieldError id="loginPasswordError" message={signinErrors.password} />
              </div>
              <button type="submit" className="btn btn-primary btn-block" disabled={signinSubmitting}>
                {signinSubmitting ? 'Please wait…' : 'Log In'}
              </button>
            </form>
            <div className="auth-foot">New to Disha? <a onClick={goSignup}>Create an account</a></div>
          </div>

          <div className="auth-panel auth-visual">
            <div className="auth-orbit">
              <svg viewBox="0 0 400 400" aria-hidden="true">
                <defs>
                  <linearGradient id="needleGrad2" x1="0" y1="0" x2="0" y2="1">
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
                  <path d="M200 145 L214 200 L200 255 L186 200 Z" fill="url(#needleGrad2)" opacity=".85" />
                  <path d="M155 200 L200 189 L245 200 L200 211 Z" style={{ fill: 'var(--sky)' }} opacity=".5" />
                  <circle cx="200" cy="200" r="7" style={{ fill: 'var(--paper)' }} stroke="url(#needleGrad2)" strokeWidth="2" />
                </g>
              </svg>
            </div>
          </div>

          <div className="auth-panel auth-signup">
            <h2>Create your account</h2>
            <p className="sub">Takes about a minute.</p>
            {signupAlert && <div className={`auth-alert is-${signupAlert.type}`} role="alert">{signupAlert.text}</div>}
            <form onSubmit={handleSignupSubmit} noValidate>
              <div className={`field${signupErrors.name ? ' has-error' : ''}`}>
                <label htmlFor="signupName">Full Name</label>
                <input
                  type="text" id="signupName" placeholder="Your name" autoComplete="name"
                  value={signupData.name}
                  onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                  aria-describedby="signupNameError"
                />
                <FieldError id="signupNameError" message={signupErrors.name} />
              </div>
              <div className={`field${signupErrors.email ? ' has-error' : ''}`}>
                <label htmlFor="signupEmail">Email</label>
                <input
                  type="email" id="signupEmail" placeholder="you@example.com" autoComplete="email"
                  value={signupData.email}
                  onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                  aria-describedby="signupEmailError"
                />
                <FieldError id="signupEmailError" message={signupErrors.email} />
              </div>
              <div className={`field${signupErrors.password ? ' has-error' : ''}`}>
                <label htmlFor="signupPassword">Make Password</label>
                <input
                  type="password" id="signupPassword" placeholder="Create a password" autoComplete="new-password"
                  value={signupData.password}
                  onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                  aria-describedby="signupPasswordError"
                />
                <FieldError id="signupPasswordError" message={signupErrors.password} />
              </div>
              <button type="submit" className="btn btn-primary btn-block" disabled={signupSubmitting}>
                {signupSubmitting ? 'Please wait…' : 'Submit'}
              </button>
            </form>
            <button className="auth-back" type="button" onClick={goSignin}>&larr; Back to sign in</button>
          </div>
        </div>
      </div>
    </div>
  );
}