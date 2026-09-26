import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { translateText } from './translationService';

// Language names are shown in their own script, not translated, since a
// selector that only reads correctly once you're already in that language
// (e.g. showing "Hindi" instead of "हिन्दी" while the UI is in Hindi) isn't
// usable to switch away from it in the first place.
export const interfaceLanguages = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'हिन्दी' },
  { value: 'kn', label: 'ಕನ್ನಡ' },
];

// Persisted so a phrase is only ever sent to LibreTranslate once, even across reloads.
const CACHE_KEY = 'vidyayan-translation-cache';

function loadCache() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveCache(cache) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // Storage full or unavailable - translations still work, just won't persist.
  }
}

const cache = loadCache();
const cacheKey = (language, text) => `${language}::${text}`;

// Unicode ranges for each target language's own script, used to sanity-check
// what comes back from MyMemory (see the validation in translateBatch below).
const SCRIPT_RANGES = {
  hi: /[\u0900-\u097F]/, // Devanagari
  kn: /[\u0C80-\u0CFF]/, // Kannada
};

function looksLikeTargetScript(language, text) {
  const range = SCRIPT_RANGES[language];
  if (!range) return true; // no script check defined for this language
  return range.test(text);
}

// The greeting on the student dashboard ("Good morning"/"Good afternoon"/
// "Good evening"/"Good night") kept showing up untranslated. MyMemory (the
// free translation API in translationService.js) occasionally has no real
// match for a short, ambiguous fragment like this and echoes the English
// text back with a 200 response instead of an error, so the old code cached
// that untranslated result forever - once poisoned, the cache never let the
// phrase be retried. These four are common and safety-critical enough to
// just ship known-good translations instead of depending on the API for
// them; see the poisoned-result guard in translateBatch below for the
// general fix (which also cleans out any bad cache entries left over).
const PHRASE_OVERRIDES = {
  hi: {
    'Good morning': 'सुप्रभात',
    'Good afternoon': 'शुभ दोपहर',
    'Good evening': 'शुभ संध्या',
    'Good night': 'शुभ रात्रि',
    'Welcome back.': 'वापस आपका स्वागत है।',
  },
  kn: {
    'Good morning': 'ಶುಭೋದಯ',
    'Good afternoon': 'ಶುಭ ಮಧ್ಯಾಹ್ನ',
    'Good evening': 'ಶುಭ ಸಂಜೆ',
    'Good night': 'ಶುಭ ರಾತ್ರಿ',
    'Welcome back.': 'ಮತ್ತೆ ಸುಸ್ವಾಗತ.',
  },
};

// Original (English) text is stashed here the first time a node/attribute is seen,
// so switching back to English - or re-translating after a re-render - always starts
// from the true source text rather than a previously translated one.
const sourceText = new WeakMap();
const sourceAttributes = new WeakMap();
const IGNORE_TAGS = ['SCRIPT', 'STYLE', 'OPTION', 'NOSCRIPT'];
const TRANSLATED_ATTRS = ['placeholder', 'aria-label', 'title'];

function shouldSkip(element) {
  return element?.closest?.('[data-no-translate]');
}

// Walk the live DOM and collect every distinct piece of English text on screen right now.
function collectStrings(root) {
  const strings = new Set();
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    if (IGNORE_TAGS.includes(node.parentElement?.tagName) || shouldSkip(node.parentElement)) continue;
    const original = sourceText.get(node) ?? node.nodeValue;
    const trimmed = original.trim();
    if (trimmed) strings.add(trimmed);
  }
  root.querySelectorAll('input, textarea, [aria-label], [title], [placeholder]').forEach(element => {
    if (shouldSkip(element)) return;
    const stored = sourceAttributes.get(element) || {};
    TRANSLATED_ATTRS.forEach(attribute => {
      if (!element.hasAttribute(attribute)) return;
      const original = stored[attribute] ?? element.getAttribute(attribute);
      const trimmed = original.trim();
      if (trimmed) strings.add(trimmed);
    });
  });
  return [...strings];
}

// Runs a handful of translate calls at a time instead of firing dozens at once,
// which keeps a local LibreTranslate instance responsive.
async function translateBatch(language, texts, concurrency = 2) {
  const overrides = PHRASE_OVERRIDES[language];
  const pending = [...new Set(texts)].filter(text => !(cacheKey(language, text) in cache));
  if (pending.length === 0) return;
  let index = 0;
  async function worker() {
    while (index < pending.length) {
      const text = pending[index++];
      if (overrides?.[text]) {
        cache[cacheKey(language, text)] = overrides[text];
        continue;
      }
      try {
        const translated = await translateText({ sourceLanguage: 'en', targetLanguage: language, text });
        // MyMemory sometimes returns the English text unchanged (no real match,
        // but still a 200 response) instead of failing outright. Treat that as
        // a failed translation rather than caching it - caching it would show
        // English forever, since a cache hit is never retried.
        if (translated.trim().toLowerCase() === text.trim().toLowerCase() && /[a-z]/i.test(text)) {
          console.warn(`Translation for "${text}" (${language}) came back unchanged; not caching.`);
          continue;
        }
        // MyMemory can also return a confident-looking but completely
        // unrelated match for a short, ambiguous phrase - e.g. "Welcome
        // back." coming back as a romanised sentence about a quiz question,
        // written in Latin letters instead of Devanagari/Kannada. If the
        // result doesn't contain any of the target script's own characters,
        // it's not a real translation into that language, so don't cache it.
        if (!looksLikeTargetScript(language, translated)) {
          console.warn(`Translation for "${text}" (${language}) didn't come back in the expected script; not caching.`, translated);
          continue;
        }
        cache[cacheKey(language, text)] = translated;
      } catch (err) {
        // Deliberately NOT cached: a failed phrase stays uncached so it's retried
        // next time translateScreen runs, instead of being stuck in English forever.
        console.warn(`Translation failed for "${text}" (${language}):`, err.message);
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, pending.length) }, worker));
  saveCache(cache);
}

// One-off cleanup: earlier versions could have already cached a bad result -
// either the English text unchanged, or a mismatched phrase in the wrong
// script (romanised Latin letters instead of Devanagari/Kannada) - which
// would otherwise sit there forever since a cache hit is never retried.
// Drop any such entries once so they get a fresh, correct translation next
// time they're needed.
Object.keys(cache).forEach(key => {
  const separatorIndex = key.indexOf('::');
  if (separatorIndex === -1) return;
  const language = key.slice(0, separatorIndex);
  const text = key.slice(separatorIndex + 2);
  if (language === 'en') return;
  if (PHRASE_OVERRIDES[language]?.[text] && cache[key] !== PHRASE_OVERRIDES[language][text]) {
    cache[key] = PHRASE_OVERRIDES[language][text];
  } else if (cache[key]?.trim().toLowerCase() === text.trim().toLowerCase() && /[a-z]/i.test(text)) {
    delete cache[key];
  } else if (typeof cache[key] === 'string' && !looksLikeTargetScript(language, cache[key])) {
    delete cache[key];
  }
});
saveCache(cache);

// Applies whatever is already in the cache to the DOM. Safe to call before every
// phrase has arrived - anything not cached yet is simply left in English for now.
function applyTranslations(root, language) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  let node;
  while ((node = walker.nextNode())) nodes.push(node);

  nodes.forEach(textNode => {
    if (IGNORE_TAGS.includes(textNode.parentElement?.tagName) || shouldSkip(textNode.parentElement)) return;
    if (!sourceText.has(textNode)) sourceText.set(textNode, textNode.nodeValue);
    const original = sourceText.get(textNode);
    const trimmed = original.trim();
    if (!trimmed) return;
    const translated = language === 'en' ? trimmed : cache[cacheKey(language, trimmed)] || trimmed;
    const nextValue = original.replace(trimmed, translated);
    if (textNode.nodeValue !== nextValue) textNode.nodeValue = nextValue;
  });

  root.querySelectorAll('input, textarea, [aria-label], [title], [placeholder]').forEach(element => {
    if (shouldSkip(element)) return;
    if (!sourceAttributes.has(element)) sourceAttributes.set(element, {});
    const stored = sourceAttributes.get(element);
    TRANSLATED_ATTRS.forEach(attribute => {
      if (!element.hasAttribute(attribute)) return;
      if (!stored[attribute]) stored[attribute] = element.getAttribute(attribute);
      const original = stored[attribute];
      const trimmed = original.trim();
      const translated = language === 'en' || !trimmed ? original : cache[cacheKey(language, trimmed)] || original;
      if (element.getAttribute(attribute) !== translated) element.setAttribute(attribute, translated);
    });
  });
}

async function translateScreen(language) {
  document.documentElement.lang = language;
  const root = document.body;
  if (language === 'en') {
    applyTranslations(root, language);
    return;
  }
  const strings = collectStrings(root);
  document.documentElement.dataset.translating = 'true';
  await translateBatch(language, strings);
  applyTranslations(root, language);
  delete document.documentElement.dataset.translating;
}

export function useScreenTranslation(language) {
  useEffect(() => {
    translateScreen(language);
    // React re-renders add/replace DOM nodes constantly (navigation, new data, etc.);
    // re-run on every change so newly rendered text gets translated too.
    const observer = new MutationObserver(() => translateScreen(language));
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [language]);
}

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => localStorage.getItem('vidyayan-language') || 'en');
  const changeLanguage = value => {
    setLanguage(value);
    localStorage.setItem('vidyayan-language', value);
  };
  useScreenTranslation(language);
  // t() is kept only so existing components don't need to change - it just returns the
  // key as-is. The DOM walk above is what actually translates it, along with everything else.
  const value = useMemo(() => ({ language, setLanguage: changeLanguage, t: key => key }), [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}