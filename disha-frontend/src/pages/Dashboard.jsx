import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import PageShell from '../components/PageShell';
import { STREAM_LABELS, apiError } from '../utils/streams';

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });

export default function Dashboard() {
  const { user } = useAuth();
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/attempts')
      .then(res => setAttempts(res.data.attempts))
      .catch(err => setError(apiError(err, 'Could not load your history.')))
      .finally(() => setLoading(false));
  }, []);

  const firstName = user.name.split(' ')[0];
  const completed = attempts.filter(a => a.completed);
  const latest = completed[0]; // backend returns newest first

  return (
    <PageShell wide title={`Hi, ${firstName}`} subtitle="Your assessments and recommendations in one place.">
      {error && <div className="flow-alert error" role="alert">{error}</div>}

      {loading ? (
        <div className="flow-loading">Loading your dashboard…</div>
      ) : (
        <>
          <div className="dash-stats">
            <div className="stat-card">
              <div className="stat-label">Assessments</div>
              <div className="stat-value">{attempts.length}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Completed</div>
              <div className="stat-value">{completed.length}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Latest best match</div>
              <div className="stat-value small">
                {latest ? STREAM_LABELS[latest.stream] || latest.stream : '—'}
              </div>
            </div>
          </div>

          {latest && (
            <div className="result-hero">
              <div className="result-eyebrow">Your latest recommendation</div>
              <div className="result-stream">{STREAM_LABELS[latest.stream] || latest.stream}</div>
              <div className="result-score">
                Match score {latest.score !== null ? latest.score.toFixed(1) : '—'} / 100 · {formatDate(latest.created_at)}
              </div>
              <div style={{ marginTop: 18 }}>
                <Link to={`/results/${latest.id}`} className="btn btn-primary">View full breakdown</Link>
              </div>
            </div>
          )}

          <div className="flow-card">
            <div className="dash-head">
              <h2>Assessment history</h2>
              <Link to="/marks" className="btn btn-primary">
                {attempts.length ? 'New assessment' : 'Take your first assessment'}
              </Link>
            </div>

            {attempts.length === 0 ? (
              <p className="empty-state">No assessments yet. Enter your marks and take the quiz to get your first recommendation.</p>
            ) : (
              attempts.map(a => (
                <div className="history-item" key={a.id}>
                  <div>
                    <div className="history-main">
                      {a.completed ? STREAM_LABELS[a.stream] || a.stream : 'Assessment in progress'}
                      <span className={`badge ${a.completed ? 'done' : 'pending'}`}>
                        {a.completed ? 'Completed' : 'In progress'}
                      </span>
                    </div>
                    <div className="history-meta">
                      {formatDate(a.created_at)}
                      {a.completed && a.score !== null && ` · Score ${a.score.toFixed(1)}`}
                    </div>
                  </div>
                  <Link to={a.completed ? `/results/${a.id}` : `/quiz/${a.id}`} className="link-btn">
                    {a.completed ? 'View result' : 'Continue'}
                  </Link>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </PageShell>
  );
}