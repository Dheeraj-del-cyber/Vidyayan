export const supportedLanguages = [
  { value: 'auto', label: 'Auto Detect' },
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'Hindi' },
  { value: 'kn', label: 'Kannada' },
  { value: 'te', label: 'Telugu' },
  { value: 'ta', label: 'Tamil' },
  { value: 'ml', label: 'Malayalam' },
  { value: 'mr', label: 'Marathi' },
  { value: 'bn', label: 'Bengali' },
  { value: 'gu', label: 'Gujarati' },
  { value: 'pa', label: 'Punjabi' },
  { value: 'ur', label: 'Urdu' },
];

// The frontend calls this small local backend (see server/index.js), which
// in turn forwards the request to your LibreTranslate server. Point this at
// a different backend with a VITE_TRANSLATE_API_URL env var if needed.
const TRANSLATE_API_URL = (import.meta.env && import.meta.env.VITE_TRANSLATE_API_URL) || 'http://localhost:4000/api/translate';

const languageName = code => supportedLanguages.find(language => language.value === code)?.label || code;

export async function translateText({ sourceLanguage, targetLanguage, text }) {
  const cleanText = text.trim();
  if (!cleanText) throw new Error('Enter text to translate.');
  if (!targetLanguage || targetLanguage === 'auto') throw new Error('Choose a target language.');
  if (sourceLanguage === targetLanguage) throw new Error('Choose two different languages.');

  let response;
  try {
    response = await fetch(TRANSLATE_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: cleanText, source: sourceLanguage, target: targetLanguage }),
    });
  } catch {
    throw new Error('Could not reach the translation backend. Run "npm run server" (and make sure LibreTranslate is running too).');
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Could not translate ${languageName(sourceLanguage)} to ${languageName(targetLanguage)} right now.`);
  }
  if (!data.translatedText) throw new Error('The translation service returned an empty result.');

  return data.translatedText;
}
