import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { translateText } from './translationService';

// Only languages LibreTranslate actually has loaded (see README: --load-only en,hi,kn).
export const interfaceLanguages = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'Hindi' },
  { value: 'kn', label: 'Kannada' },
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
  const pending = [...new Set(texts)].filter(text => !(cacheKey(language, text) in cache));
  if (pending.length === 0) return;
  let index = 0;
  async function worker() {
    while (index < pending.length) {
      const text = pending[index++];
      try {
        cache[cacheKey(language, text)] = await translateText({ sourceLanguage: 'en', targetLanguage: language, text });
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