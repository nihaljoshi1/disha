const express = require('express');
const { body, validationResult } = require('express-validator');
const supabase = require('../config/supabaseClient');
const requireAuth = require('../middleware/authMiddleware');

const router = express.Router();

// Create a new exam attempt, submit marks for all 4 subjects at once
router.post(
  '/submit',
  requireAuth,
  [
    body('marks').isArray({ min: 1 }),
    body('marks.*.subject_id').isInt(),
    body('marks.*.marks_obtained').isFloat({ min: 0 }),
    body('marks.*.max_marks').isFloat({ min: 1 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { marks } = req.body;

    for (const m of marks) {
      if (m.marks_obtained > m.max_marks) {
        return res.status(400).json({ error: `marks_obtained cannot exceed max_marks for subject_id ${m.subject_id}` });
      }
    }

    const { data: attempt, error: attemptError } = await supabase
      .from('exam_attempts')
      .insert({ user_id: req.userId })
      .select('id')
      .single();

    if (attemptError) return res.status(500).json({ error: attemptError.message });

    const rows = marks.map(m => ({
      exam_attempt_id: attempt.id,
      subject_id: m.subject_id,
      marks_obtained: m.marks_obtained,
      max_marks: m.max_marks
    }));

    const { error: marksError } = await supabase.from('marks').insert(rows);
    if (marksError) return res.status(500).json({ error: marksError.message });

    res.status(201).json({ exam_attempt_id: attempt.id });
  }
);

module.exports = router;