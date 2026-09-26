// Translation proxy for Vidyayan.
//
// The React frontend never talks to LibreTranslate directly, because
// "localhost" in a visitor's browser points at their own machine, not
// yours. This tiny server sits in between:
//
//   React frontend  ->  this proxy (Node)  ->  LibreTranslate  ->  translation
//
// Run it with:  npm run server
// It expects LibreTranslate to already be running (see README.md).

import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const LIBRETRANSLATE_URL = process.env.LIBRETRANSLATE_URL || 'http://localhost:5000';
const PORT = process.env.PORT || 4000;

app.post('/api/translate', async (req, res) => {
  const { q, source, target } = req.body || {};

  if (!q || !source || !target) {
    return res.status(400).json({ error: 'q, source and target are required.' });
  }

  try {
    const upstream = await fetch(`${LIBRETRANSLATE_URL}/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q, source, target, format: 'text' }),
    });

    if (!upstream.ok) {
      const detail = await upstream.text();
      return res.status(502).json({ error: `LibreTranslate returned an error: ${detail}` });
    }

    const data = await upstream.json();
    res.json({ translatedText: data.translatedText });
  } catch (err) {
    res.status(502).json({
      error: `Could not reach LibreTranslate at ${LIBRETRANSLATE_URL}. Make sure it is running (see README.md).`,
    });
  }
});

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Translation proxy listening on http://localhost:${PORT}`);
  console.log(`Forwarding translation requests to ${LIBRETRANSLATE_URL}`);
});
