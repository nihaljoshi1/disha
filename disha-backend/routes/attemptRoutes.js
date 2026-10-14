const express = require('express');
const supabase = require('../config/supabaseClient');
const requireAuth = require('../middleware/authMiddleware');

const router = express.Router();

// All attempts for the logged-in user, newest first, with their recommendation if one exists
router.get('/', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('exam_attempts')
    .select('id, created_at, recommendations(stream, score_breakdown)')
    .eq('user_id', req.userId)
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  const attempts = data.map(a => {
    const rec = a.recommendations?.[0];
    return {
      id: a.id,
      created_at: a.created_at,
      completed: Boolean(rec),
      stream: rec?.stream ?? null,
      score: rec?.score_breakdown?.finalScores?.[rec.stream] ?? null,
    };
  });

  res.json({ attempts });
});

module.exports = router;