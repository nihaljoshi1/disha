const express = require('express');
const { param, validationResult } = require('express-validator');
const supabase = require('../config/supabaseClient');
const requireAuth = require('../middleware/authMiddleware');
const calculateRecommendation = require('../utils/calculateRecommendation');

const router = express.Router();

router.get(
  '/:examAttemptId',
  requireAuth,
  [param('examAttemptId').isUUID()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { examAttemptId } = req.params;

    // Confirm ownership
    const { data: attempt, error: attemptError } = await supabase
      .from('exam_attempts')
      .select('id, user_id')
      .eq('id', examAttemptId)
      .single();

    if (attemptError || !attempt) return res.status(404).json({ error: 'Exam attempt not found' });
    if (attempt.user_id !== req.userId) return res.status(403).json({ error: 'Not your exam attempt' });

    // Fetch marks
    const { data: marks, error: marksError } = await supabase
      .from('marks')
      .select('subject_id, marks_obtained, max_marks')
      .eq('exam_attempt_id', examAttemptId);

    if (marksError) return res.status(500).json({ error: marksError.message });
    if (!marks.length) return res.status(400).json({ error: 'No marks submitted for this attempt' });

    // Fetch quiz responses joined with option score_vectors
    const { data: responses, error: responsesError } = await supabase
      .from('quiz_responses')
      .select('option_id, quiz_options(score_vector)')
      .eq('exam_attempt_id', examAttemptId);

    if (responsesError) return res.status(500).json({ error: responsesError.message });
    if (!responses.length) return res.status(400).json({ error: 'No quiz responses submitted for this attempt' });

    const quizOptionVectors = responses.map(r => r.quiz_options.score_vector);

    let result;
    try {
      result = calculateRecommendation(marks, quizOptionVectors);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }

    // Save the recommendation
    const { data: saved, error: saveError } = await supabase
      .from('recommendations')
      .insert({
        exam_attempt_id: examAttemptId,
        stream: result.stream,
        score_breakdown: result.breakdown
      })
      .select('id, created_at')
      .single();

    if (saveError) return res.status(500).json({ error: saveError.message });

    res.json({
      recommendation_id: saved.id,
      exam_attempt_id: examAttemptId,
      ...result
    });
  }
);

module.exports = router;