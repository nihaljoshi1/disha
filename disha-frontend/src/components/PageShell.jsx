import { Link } from 'react-router-dom';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../context/AuthContext';
import '../styles/flow.css';

const STEPS = ['Marks', 'Quiz', 'Results'];

export default function PageShell({ step, title, subtitle, wide, children }) {
  const { user, logout } = useAuth();

  return (
    <div className="flow-page">
      <header className="flow-top">
        <Link to="/dashboard" className="logo"><Logo /></Link>
        <div className="flow-top-right">
          {user && <span>{user.name}</span>}
          <ThemeToggle />
          <button className="flow-logout" onClick={logout}>Log out</button>
        </div>
      </header>

      <main className={`flow-main${wide ? ' wide' : ''}`}>
        {step && (
          <ol className="flow-steps">
            {STEPS.map((label, i) => {
              const n = i + 1;
              const state = n < step ? 'done' : n === step ? 'active' : '';
              return (
                <li key={label} className={state}>
                  <span className="dot">{n < step ? '✓' : n}</span>
                  <span className="label">{label}</span>
                </li>
              );
            })}
          </ol>
        )}
        {title && <h1 className="flow-title">{title}</h1>}
        {subtitle && <p className="flow-sub">{subtitle}</p>}
        {children}
      </main>
    </div>
  );
}