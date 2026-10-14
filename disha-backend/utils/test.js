const calculateRecommendation = require('./calculateRecommendation');

const fakeMarks = [
  { subject_id: 1, marks_obtained: 85, max_marks: 100 }, // Maths
  { subject_id: 2, marks_obtained: 78, max_marks: 100 }, // Science
  { subject_id: 3, marks_obtained: 60, max_marks: 100 }, // SocSci
  { subject_id: 4, marks_obtained: 70, max_marks: 100 }  // English
];

const fakeQuizVectors = [
  { science_pcm: 3, science_pcb: 1, commerce_math: 0, commerce_nomath: 0, arts: 0, diploma: 3 },
  { science_pcm: 1, science_pcb: 1, commerce_math: 0, commerce_nomath: 0, arts: 0, diploma: 3 },
  { science_pcm: 3, science_pcb: 1, commerce_math: 2, commerce_nomath: 0, arts: 0, diploma: 1 }
];

console.log(JSON.stringify(calculateRecommendation(fakeMarks, fakeQuizVectors), null, 2));