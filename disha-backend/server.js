require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const supabase = require('./config/supabaseClient');

const app = express();

// IMPORTANT: origin must match exactly where your frontend is served from.
// Check your Live Server / VS Code extension port and update this if it's not 5500.
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/test-db', async (req, res) => {
  const { data, error } = await supabase.from('subjects').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json({ data });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/marks', require('./routes/marksRoutes'));
app.use('/api/quiz', require('./routes/quizRoutes'));
app.use('/api/recommendation', require('./routes/recommendationRoutes'));
app.use('/api/attempts', require('./routes/attemptRoutes'));

// Basic error handler — catches anything that throws outside your own try/catch blocks
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong on the server' });
});

const isProd = process.env.NODE_ENV === 'production';
if (isProd) app.set('trust proxy', 1); // Render sits behind a proxy; needed for secure cookies

const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map(s => s.trim());

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true
}));