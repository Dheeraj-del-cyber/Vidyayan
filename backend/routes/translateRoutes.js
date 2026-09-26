// Optional LibreTranslate proxy.
//
// The React frontend never talks to LibreTranslate directly, because
// "localhost" in a visitor's browser points at their own machine, not
// yours. This route sits in between:
//
//   React frontend  ->  this backend  ->  LibreTranslate  ->  translation
//
// It only matters if you choose to run LibreTranslate locally (see the
// project README). The app also works using the MyMemory API directly
// from the frontend, so this route is optional.

import { Router } from 'express';

const router = Router();
const LIBRETRANSLATE_URL = process.env.LIBRETRANSLATE_URL || 'http://localhost:5000';

router.post('/translate', async (req, res) => {
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
  } catch {
    res.status(502).json({
      error: `Could not reach LibreTranslate at ${LIBRETRANSLATE_URL}. Make sure it is running (see README.md).`,
    });
  }
});

export default router;
