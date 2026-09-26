import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import translateRoutes from './routes/translateRoutes.js';
import syllabusRoutes from './routes/syllabusRoutes.js';
import './config/db.js'; // opens the database and makes sure tables exist

const app = express();
app.use(cors());
// Raised from the default 100kb so a profile photo (sent as a base64 data
// URL) fits in the request body.
app.use(express.json({ limit: '6mb' }));

app.use('/api/auth', authRoutes);
app.use('/api', translateRoutes);
app.use('/api', syllabusRoutes);

app.get('/api/health', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Vidyayan backend listening on http://localhost:${PORT}`);
});
