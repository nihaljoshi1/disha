import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import PageShell from '../components/PageShell';
import { apiError } from '../utils/streams';

export default function Quiz() {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [questionId]: optionId }
  const [alert, setAlert] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get('/quiz/questions')
      .then(res => {
        const sorted = [...res.data.questions]
          .sort((a, b) => a.id - b.id)
          .map(q => ({ ...q, quiz_options: [...q.quiz_options].sort((a, b) => a.id - b.id) }));
        setQuestions(sorted);
      })
      .catch(err => setLoadError(apiError(err, 'Could not load the quiz.')))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageShell step={2}><div className="flow-loading">Loading quiz…</div></PageShell>;
  if (loadError) return <PageShell step={2}><div className="flow-alert error">{loadError}</div></PageShell>;
  if (!questions.length) return <PageShell step={2}><div className="flow-alert error">No quiz questions found. Seed the quiz_questions table first.</div></PageShell>;

  const q = questions[index];
  const isLast = index === questions.length - 1;
  const answered = answers[q.id] !== undefined;
  const progress = ((index + (answered ? 1 : 0)) / questions.length) * 100;

  const handleSubmit = async () => {
    setAlert('');
    setSubmitting(true);
    try {
      await api.post('/quiz/submit', {
        exam_attempt_id: attemptId,
        responses: questions.map(item => ({ question_id: item.id, option_id: answers[item.id] })),
      });
      navigate(`/results/${attemptId}`);
    } catch (err) {
      setAlert(apiError(err, 'Could not submit your answers. Try again.'));
      setSubmitting(false);
    }
  };

  return (
    <PageShell step={2} title="What suits you?" subtitle="Pick the option that feels most like you. There are no right answers.">
      <div className="flow-card">
        <div className="progress"><span style={{ width: `${progress}%` }} /></div>
        <p className="progress-label">Question {index + 1} of {questions.length}</p>

        {alert && <div className="flow-alert error" role="alert">{alert}</div>}

        <h2 className="quiz-question">{q.question_text}</h2>
        {q.quiz_options.map(opt => (
          <button
            type="button" key={opt.id}
            className={`option${answers[q.id] === opt.id ? ' selected' : ''}`}
            aria-pressed={answers[q.id] === opt.id}
            onClick={() => setAnswers(a => ({ ...a, [q.id]: opt.id }))}
          >
            {opt.option_text}
          </button>
        ))}

        <div className="flow-actions">
          <button type="button" className="btn btn-ghost" disabled={index === 0 || submitting} onClick={() => setIndex(i => i - 1)}>
            Back
          </button>
          {isLast ? (
            <button type="button" className="btn btn-primary" disabled={!answered || submitting} onClick={handleSubmit}>
              {submitting ? 'Calculating…' : 'See my result'}
            </button>
          ) : (
            <button type="button" className="btn btn-primary" disabled={!answered} onClick={() => setIndex(i => i + 1)}>
              Next
            </button>
          )}
        </div>
      </div>
    </PageShell>
  );
}