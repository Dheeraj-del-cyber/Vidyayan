export const supportedLanguages = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'Hindi' },
  { value: 'kn', label: 'Kannada' },
];

// MyMemory is a free, keyless translation API that supports Kannada (which the
// self-hosted LibreTranslate/Argos engine does not). It allows direct browser
// calls (CORS-enabled), so no local proxy server or Python install is needed.
// Free tier: 5,000 characters/day per IP, no signup. See mymemory.translated.net/doc/spec.php
const MYMEMORY_URL = 'https://api.mymemory.translated.net/get';

const languageName = code => supportedLanguages.find(language => language.value === code)?.label || code;

export async function translateText({ sourceLanguage, targetLanguage, text }) {
  const cleanText = text.trim();
  if (!cleanText) throw new Error('Enter text to translate.');
  if (!targetLanguage) throw new Error('Choose a target language.');
  if (sourceLanguage === targetLanguage) throw new Error('Choose two different languages.');

  const params = new URLSearchParams({
    q: cleanText,
    langpair: `${sourceLanguage}|${targetLanguage}`,
  });

  let response;
  try {
    response = await fetch(`${MYMEMORY_URL}?${params.toString()}`);
  } catch {
    throw new Error('Could not reach the translation service. Check your internet connection.');
  }

  const data = await response.json().catch(() => ({}));
  const status = Number(data?.responseStatus) || response.status;

  if (!response.ok || status >= 400) {
    throw new Error(data?.responseDetails || `Could not translate ${languageName(sourceLanguage)} to ${languageName(targetLanguage)} right now.`);
  }

  const translated = data?.responseData?.translatedText;
  if (!translated) throw new Error('The translation service returned an empty result.');

  return translated;
}