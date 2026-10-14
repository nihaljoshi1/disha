// subject_id mapping assumed: 1=Maths, 2=Science, 3=Social Science, 4=English
// Adjust these IDs if your actual inserted subject rows don't match this order — check your subjects table.

const SUBJECT_WEIGHTS = {
  science_pcm:      { 1: 0.45, 2: 0.35, 3: 0.05, 4: 0.15 },
  science_pcb:      { 1: 0.15, 2: 0.55, 3: 0.10, 4: 0.20 },
  commerce_math:    { 1: 0.40, 2: 0.10, 3: 0.30, 4: 0.20 },
  commerce_nomath:  { 1: 0.10, 2: 0.10, 3: 0.50, 4: 0.30 },
  arts:             { 1: 0.05, 2: 0.10, 3: 0.55, 4: 0.30 },
  diploma:          { 1: 0.30, 2: 0.30, 3: 0.20, 4: 0.20 }
};

const STREAMS = Object.keys(SUBJECT_WEIGHTS);

const MARKS_WEIGHT = 0.55;
const INTEREST_WEIGHT = 0.45;
const MARKS_FLOOR = 40; // below this, top recommendation gets a caveat instead of a clean pick

module.exports = { SUBJECT_WEIGHTS, STREAMS, MARKS_WEIGHT, INTEREST_WEIGHT, MARKS_FLOOR };