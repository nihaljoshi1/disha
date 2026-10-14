import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api';
import PageShell from '../components/PageShell';
import { STREAM_LABELS, apiError } from '../utils/streams';

export default function Results() {
  const { attemptId } = useParams();
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const didFetch = useRef(false); // StrictMode runs effects twice in dev

  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;
    api.get(`/recommendation/${attemptId}`)
      .then(res => setResult(res.data))
      .catch(err => setError(apiError(err, 'Could not load your recommendation.')))
      .finally(() => setLoading(false));
  }, [attemptId]);

  if (loading) return <PageShell step={3}><div className="flow-loading">Calculating your match…</div></PageShell>;
  if (error) {
    return (
      <PageShell step={3}>
        <div className="flow-alert error">{error}</div>
        <Link to="/marks" className="btn btn-primary">Start over</Link>
      </PageShell>
    );
  }

  const { stream, score, ranked, breakdown, caveat } = result;

  return (
    <PageShell step={3} wide title="Your recommendation" subtitle="Ranked by how well your marks and interests match each stream.">
      <div className="result-hero">
        <div className="result-eyebrow">Best match</div>
        <div className="result-stream">{STREAM_LABELS[stream] || stream}</div>
        <div className="result-score">Match score {score.toFixed(1)} / 100</div>
      </div>

      {caveat && <div className="flow-alert warn" role="note">{caveat}</div>}

      <div className="flow-card">
        {ranked.map((r, i) => (
          <div className={`rank-row${i === 0 ? ' top' : ''}`} key={r.stream}>
            <div className="rank-head">
              <span>{i + 1}. {STREAM_LABELS[r.stream] || r.stream}</span>
              <span>{r.score.toFixed(1)}</span>
            </div>
            <div className="rank-bar"><div className="rank-fill" style={{ width: `${Math.max(0, Math.min(100, r.score))}%` }} /></div>
            <div className="rank-meta">
              Marks fit {breakdown.marksScores[r.stream].toFixed(1)} · Interest fit {breakdown.interestScores[r.stream].toFixed(1)}
            </div>
          </div>
        ))}

        <div className="flow-actions">
          <Link to="/dashboard" className="btn btn-ghost">Dashboard</Link>
          <Link to="/marks" className="btn btn-primary">Retake assessment</Link>
        </div>
      </div>
    </PageShell>
  );
}