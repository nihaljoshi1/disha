export const STREAM_LABELS = {
  science_pcm: 'Science (PCM)',
  science_pcb: 'Science (PCB)',
  commerce_math: 'Commerce (with Maths)',
  commerce_nomath: 'Commerce (without Maths)',
  arts: 'Arts',
  diploma: 'Diploma',
};

export function apiError(err, fallback) {
  return err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || fallback;
}