import { useState } from 'react';
import { ArrowLeftRight, Check, Clipboard, Languages, LoaderCircle, Sparkles, Trash2 } from 'lucide-react';
import { supportedLanguages, translateText } from './translationService';

const languageLabel = code => supportedLanguages.find(language => language.value === code)?.label || code;

function LanguageSelect({ label, value, onChange, includeAuto = false }) {
  const options = includeAuto ? supportedLanguages : supportedLanguages.filter(language => language.value !== 'auto');
  return <label className="translation-field-label"><span>{label}</span><div className="translation-select"><Languages size={16} /><select value={value} onChange={event => onChange(event.target.value)}>{options.map(language => <option value={language.value} key={language.value}>{language.label}</option>)}</select></div></label>;
}

export default function Translation() {
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [targetLanguage, setTargetLanguage] = useState('kn');
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleTranslate = async () => {
    setError('');
    setCopied(false);
    setLoading(true);
    try {
      const result = await translateText({ sourceLanguage, targetLanguage, text: inputText });
      setTranslatedText(result);
    } catch (translationError) {
      setTranslatedText('');
      setError(translationError.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = () => {
    if (sourceLanguage === 'auto') return setError('Choose a source language before swapping.');
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    setInputText(translatedText);
    setTranslatedText(inputText);
    setError('');
    setCopied(false);
  };

  const handleClear = () => {
    setInputText('');
    setTranslatedText('');
    setError('');
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!translatedText) return setError('Translate something before copying.');
    try {
      await navigator.clipboard.writeText(translatedText);
      setCopied(true);
      setError('');
    } catch {
      setError('Copy is unavailable in this browser. Select the translation manually.');
    }
  };

  return <div className="translation-page">
    <div className="translation-intro"><div><div className="eyebrow">Learning language tools</div><h1>Translate a lesson</h1><p>Prepare simple learning content in a language a child can use immediately.</p></div><div className="translation-note"><Sparkles size={16} /><span>Connected to a local LibreTranslate server</span></div></div>
    <section className="translation-card" aria-label="Text translation">
      <div className="translation-card-head"><div><span className="section-kicker">Text translation</span><h2>Make the next explanation feel familiar.</h2></div><span className="translation-status"><span /> Ready to translate</span></div>
      <div className="translation-workspace">
        <div className="translation-pane"><LanguageSelect label="Source language" value={sourceLanguage} onChange={setSourceLanguage} includeAuto /><textarea value={inputText} onChange={event => { setInputText(event.target.value); setError(''); }} maxLength={2000} placeholder="Enter text to translate..." aria-label="Text to translate" /><div className="translation-pane-footer"><span>{inputText.length} / 2,000 characters</span><button className="quiet-button" onClick={handleClear}><Trash2 size={15} /> Clear</button></div></div>
        <button className="swap-button" onClick={handleSwap} aria-label="Swap source and target languages" title="Swap languages"><ArrowLeftRight size={18} /></button>
        <div className="translation-pane output-pane"><LanguageSelect label="Target language" value={targetLanguage} onChange={value => { setTargetLanguage(value); setError(''); }} /><div className={`translation-output ${translatedText ? 'has-output' : ''}`} aria-live="polite">{loading ? <div className="translation-loading"><LoaderCircle size={20} /><span>Preparing translation...</span></div> : translatedText || <span>Translated text will appear here...</span>}</div><div className="translation-pane-footer"><span>{translatedText.length} characters</span><button className="quiet-button" onClick={handleCopy} disabled={!translatedText}><Clipboard size={15} /> {copied ? 'Copied' : 'Copy translation'}</button></div></div>
      </div>
      {error && <div className="translation-error" role="alert"><span>!</span>{error}</div>}
      <div className="translation-actions"><button className="primary-button" onClick={handleTranslate} disabled={loading}>{loading ? <><LoaderCircle size={17} className="spin" /> Translating...</> : <><Languages size={17} /> Translate</>}</button><span>Works with any sentence, not just saved phrases</span></div>
    </section>
    <div className="translation-help"><div className="translation-help-icon"><Check size={18} /></div><div><strong>Runs fully on your machine</strong><p>Text is sent to a small local backend, which forwards it to your own LibreTranslate server — nothing leaves your computer.</p></div></div>
  </div>;
}

export { languageLabel };