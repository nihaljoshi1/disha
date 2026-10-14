import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import PageShell from '../components/PageShell';
import { apiError } from '../utils/streams';

// IDs must match the rows in your Supabase `subjects` table (inserted in this order).
const SUBJECTS = [
  { id: 1, name: 'Maths' },
  { id: 2, name: 'Science' },
  { id: 3, name: 'Social Science' },
  { id: 4, name: 'English' },
];

export default function Marks() {
  const navigate = useNavigate();
  const [values, setValues] = useState(
    Object.fromEntries(SUBJECTS.map(s => [s.id, { obtained: '', max: '100' }]))
  );
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const update = (id, field, val) =>
    setValues(v => ({ ...v, [id]: { ...v[id], [field]: val } }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    const payload = [];

    for (const s of SUBJECTS) {
      const obtained = parseFloat(values[s.id].obtained);
      const max = parseFloat(values[s.id].max);
      if (Number.isNaN(max) || max <= 0) errs[s.id] = 'Enter a valid maximum.';
      else if (Number.isNaN(obtained)) errs[s.id] = 'Enter your marks.';
      else if (obtained < 0 || obtained > max) errs[s.id] = `Must be between 0 and ${max}.`;
      else payload.push({ subject_id: s.id, marks_obtained: obtained, max_marks: max });
    }

    setErrors(errs);
    if (Object.keys(errs).length) {
      setAlert('Please fix the highlighted fields.');
      return;
    }

    setAlert('');
    setSubmitting(true);
    try {
      const res = await api.post('/marks/submit', { marks: payload });
      navigate(`/quiz/${res.data.exam_attempt_id}`);
    } catch (err) {
      setAlert(apiError(err, 'Could not save your marks. Try again.'));
      setSubmitting(false);
    }
  };

  return (
    <PageShell step={1} title="Enter your marks" subtitle="Use the scores from your most recent exam. Change the maximum if a subject wasn't out of 100.">
      <form className="flow-card" onSubmit={handleSubmit} noValidate>
        {alert && <div className="flow-alert error" role="alert">{alert}</div>}

        {SUBJECTS.map(s => (
          <div key={s.id}>
            <div className="marks-row">
              <label htmlFor={`m-${s.id}`}>{s.name}</label>
              <input
                id={`m-${s.id}`} type="number" step="any" min="0" placeholder="Marks"
                className={`flow-input${errors[s.id] ? ' invalid' : ''}`}
                value={values[s.id].obtained}
                onChange={e => update(s.id, 'obtained', e.target.value)}
              />
              <span className="of">out of</span>
              <input
                type="number" step="any" min="1" aria-label={`${s.name} maximum marks`}
                className="flow-input"
                value={values[s.id].max}
                onChange={e => update(s.id, 'max', e.target.value)}
              />
            </div>
            <p className="marks-error">{errors[s.id]}</p>
          </div>
        ))}

        <div className="flow-actions">
          <span />
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Saving…' : 'Continue to quiz'}
          </button>
        </div>
      </form>
    </PageShell>
  );
}