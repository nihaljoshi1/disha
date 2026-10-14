const { SUBJECT_WEIGHTS, STREAMS, MARKS_WEIGHT, INTEREST_WEIGHT, MARKS_FLOOR } = require('./streamWeights');

/**
 * @param {Array} marks - [{ subject_id, marks_obtained, max_marks }]
 * @param {Array} quizOptionVectors - [score_vector] — one per answered question, e.g. [{science_pcm:3,...}, {...}]
 * @returns {Object} { stream, score, breakdown, caveat }
 */
function calculateRecommendation(marks, quizOptionVectors) {
  if (!marks.length) throw new Error('No marks provided');
  if (!quizOptionVectors.length) throw new Error('No quiz responses provided');

  // Normalize each subject to 0-100
  const normalizedMarks = {};
  for (const m of marks) {
    normalizedMarks[m.subject_id] = (m.marks_obtained / m.max_marks) * 100;
  }

  // Marks score per stream
  const marksScores = {};
  for (const stream of STREAMS) {
    let score = 0;
    const weights = SUBJECT_WEIGHTS[stream];
    for (const subjectId in weights) {
      const pct = normalizedMarks[subjectId] ?? 0;
      score += pct * weights[subjectId];
    }
    marksScores[stream] = score; // already 0-100 scale since weights sum to 1
  }

  // Interest score per stream — sum raw points, then normalize against max possible
  const rawInterestScores = {};
  for (const stream of STREAMS) rawInterestScores[stream] = 0;

  for (const vector of quizOptionVectors) {
    for (const stream of STREAMS) {
      rawInterestScores[stream] += vector[stream] || 0;
    }
  }

  // Max possible per stream = num questions answered * max single-option score (assume 3, per your data)
  const MAX_POINTS_PER_QUESTION = 3;
  const maxPossible = quizOptionVectors.length * MAX_POINTS_PER_QUESTION;

  const interestScores = {};
  for (const stream of STREAMS) {
    interestScores[stream] = maxPossible > 0
      ? (rawInterestScores[stream] / maxPossible) * 100
      : 0;
  }

  // Combine
  const finalScores = {};
  for (const stream of STREAMS) {
    finalScores[stream] = (MARKS_WEIGHT * marksScores[stream]) + (INTEREST_WEIGHT * interestScores[stream]);
  }

  // Rank
  const ranked = STREAMS
    .map(stream => ({ stream, score: finalScores[stream] }))
    .sort((a, b) => b.score - a.score);

  const top = ranked[0];
  let caveat = null;

  if (marksScores[top.stream] < MARKS_FLOOR) {
    caveat = `Interest in ${top.stream} is high, but foundational marks (${marksScores[top.stream].toFixed(1)}%) are below the recommended threshold. Consider Diploma/vocational track as a safer fit, or plan for extra academic support if pursuing ${top.stream}.`;
  }

  return {
    stream: top.stream,
    score: Math.round(top.score * 100) / 100,
    breakdown: {
      marksScores,
      interestScores,
      finalScores
    },
    ranked,
    caveat
  };
}

module.exports = calculateRecommendation;