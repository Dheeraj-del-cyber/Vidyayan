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

const phraseTranslations = {
  'en->kn': { 'good morning, how are you?': 'ಶುಭೋದಯ, ನೀವು ಹೇಗಿದ್ದೀರಿ?', 'good morning': 'ಶುಭೋದಯ' },
  'en->hi': { 'good morning, how are you?': 'सुप्रभात, आप कैसे हैं?', 'good morning': 'सुप्रभात' },
  'en->mr': { 'good morning, how are you?': 'शुभ प्रभात, तुम्ही कसे आहात?', 'good morning': 'शुभ प्रभात' },
  'en->ta': { 'good morning, how are you?': 'காலை வணக்கம், நீங்கள் எப்படி இருக்கிறீர்கள்?', 'good morning': 'காலை வணக்கம்' },
  'en->te': { 'good morning, how are you?': 'శుభోదయం, మీరు ఎలా ఉన్నారు?', 'good morning': 'శుభోదయం' },
  'en->ml': { 'good morning, how are you?': 'സുപ്രഭാതം, നിങ്ങൾക്ക് എങ്ങനെയുണ്ട്?', 'good morning': 'സുപ്രഭാതം' },
  'en->bn': { 'good morning, how are you?': 'সুপ্রভাত, আপনি কেমন আছেন?', 'good morning': 'সুপ্রভাত' },
  'en->gu': { 'good morning, how are you?': 'સુપ્રભાત, તમે કેમ છો?', 'good morning': 'સુપ્રભાત' },
  'en->pa': { 'good morning, how are you?': 'ਸ਼ੁਭ ਸਵੇਰ, ਤੁਸੀਂ ਕਿਵੇਂ ਹੋ?', 'good morning': 'ਸ਼ੁਭ ਸਵੇਰ' },
  'en->ur': { 'good morning, how are you?': 'صبح بخیر، آپ کیسے ہیں؟', 'good morning': 'صبح بخیر' },
};

const languageName = code => supportedLanguages.find(language => language.value === code)?.label || code;

export function translateText({ sourceLanguage, targetLanguage, text }) {
  const cleanText = text.trim();
  if (!cleanText) throw new Error('Enter text to translate.');
  if (!targetLanguage || targetLanguage === 'auto') throw new Error('Choose a target language.');
  if (sourceLanguage === targetLanguage) throw new Error('Choose two different languages.');

  const detectedSource = sourceLanguage === 'auto' ? 'en' : sourceLanguage;
  const key = `${detectedSource}->${targetLanguage}`;
  const translated = phraseTranslations[key]?.[cleanText.toLowerCase()];
  if (!translated) {
    throw new Error(`This demo has no saved translation for ${languageName(detectedSource)} to ${languageName(targetLanguage)} yet.`);
  }
  return translated;
}
