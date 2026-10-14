const express = require('express');
const { body, validationResult } = require('express-validator');
const supabase = require('../config/supabaseClient');
const requireAuth = require('../middleware/authMiddleware');

const router = express.Router();

// Return questions + options WITHOUT score_vector — never leak scoring weights to frontend
router.get('/questions', async (req, res) => {
  const { data: questions, error } = await supabase
    .from('quiz_questions')
    .select('id, question_text, quiz_options(id, option_text)');

  if (error) return res.status(500).json({ error: error.message });
  res.json({ questions });
});

// Submit responses for an existing exam_attempt_id
router.post(
  '/submit',
  requireAuth,
  [
    body('exam_attempt_id').isUUID(),
    body('responses').isArray({ min: 1 }),
    body('responses.*.question_id').isInt(),
    body('responses.*.option_id').isInt()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { exam_attempt_id, responses } = req.body;

    // Confirm this attempt actually belongs to the logged-in user
    const { data: attempt, error: attemptError } = await supabase
      .from('exam_attempts')
      .select('id, user_id')
      .eq('id', exam_attempt_id)
      .single();

    if (attemptError || !attempt) return res.status(404).json({ error: 'Exam attempt not found' });
    if (attempt.user_id !== req.userId) return res.status(403).json({ error: 'Not your exam attempt' });

    const rows = responses.map(r => ({
      exam_attempt_id,
      question_id: r.question_id,
      option_id: r.option_id
    }));

    const { error: insertError } = await supabase.from('quiz_responses').insert(rows);
    if (insertError) return res.status(500).json({ error: insertError.message });

    res.status(201).json({ message: 'Quiz responses saved' });
  }
);

module.exports = router;