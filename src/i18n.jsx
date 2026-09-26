import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export const interfaceLanguages = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'Hindi' },
  { value: 'kn', label: 'Kannada' },
  { value: 'mr', label: 'Marathi' },
  { value: 'ta', label: 'Tamil' },
  { value: 'te', label: 'Telugu' },
];

const copy = {
  en: {
    Dashboard: 'Dashboard', Children: 'Children', 'Curriculum gap': 'Curriculum gap', Learning: 'Learning', Translation: 'Translation', Progress: 'Progress', 'Migration history': 'Migration history', Settings: 'Settings', Workspace: 'Workspace', Overview: 'Overview', 'Good morning, Anita': 'Good morning, Anita', 'Add child': 'Add child', Notifications: 'Notifications', Coordinator: 'Coordinator', 'Open coordinator settings': 'Open coordinator settings',
  },
  hi: {
    Dashboard: 'डैशबोर्ड', Children: 'बच्चे', 'Curriculum gap': 'पाठ्यक्रम अंतर', Learning: 'सीखना', Translation: 'अनुवाद', Progress: 'प्रगति', 'Migration history': 'स्थानांतरण इतिहास', Settings: 'सेटिंग्स', Workspace: 'कार्यस्थल', Overview: 'अवलोकन', 'Good morning, Anita': 'सुप्रभात, अनीता', 'Add child': 'बच्चा जोड़ें', Notifications: 'सूचनाएं', Coordinator: 'समन्वयक', 'Open coordinator settings': 'समन्वयक सेटिंग्स खोलें',
  },
  kn: {
    Dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್', Children: 'ಮಕ್ಕಳು', 'Curriculum gap': 'ಪಠ್ಯಕ್ರಮ ಅಂತರ', Learning: 'ಕಲಿಕೆ', Translation: 'ಅನುವಾದ', Progress: 'ಪ್ರಗತಿ', 'Migration history': 'ವಲಸೆ ಇತಿಹಾಸ', Settings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು', Workspace: 'ಕಾರ್ಯಸ್ಥಳ', Overview: 'ಅವಲೋಕನ', 'Good morning, Anita': 'ಶುಭೋದಯ, ಅನಿತಾ', 'Add child': 'ಮಗುವನ್ನು ಸೇರಿಸಿ', Notifications: 'ಅಧಿಸೂಚನೆಗಳು', Coordinator: 'ಸಂಯೋಜಕಿ', 'Open coordinator settings': 'ಸಂಯೋಜಕರ ಸೆಟ್ಟಿಂಗ್‌ಗಳನ್ನು ತೆರೆಯಿರಿ',
  },
  mr: {
    Dashboard: 'डॅशबोर्ड', Children: 'मुले', 'Curriculum gap': 'अभ्यासक्रमातील अंतर', Learning: 'शिकणे', Translation: 'भाषांतर', Progress: 'प्रगती', 'Migration history': 'स्थलांतर इतिहास', Settings: 'सेटिंग्ज', Workspace: 'कार्यस्थळ', Overview: 'आढावा', 'Good morning, Anita': 'शुभ सकाळ, अनिता', 'Add child': 'मूल जोडा', Notifications: 'सूचना', Coordinator: 'समन्वयक', 'Open coordinator settings': 'समन्वयक सेटिंग्ज उघडा',
  },
};

const pageCopy = {
  hi: { Children: 'बच्चे', 'Add a child': 'बच्चा जोड़ें', 'Curriculum gap': 'पाठ्यक्रम अंतर', Decimals: 'दशमलव', 'Keep learning moving': 'सीखना जारी रखें', Progress: 'प्रगति', 'Migration history': 'स्थानांतरण इतिहास', Settings: 'सेटिंग्स', 'Your learning community': 'आपका सीखने वाला समुदाय', 'Build a learning record': 'सीखने का रिकॉर्ड बनाएं', 'Make the next step visible': 'अगला कदम स्पष्ट करें', 'A record that remembers': 'याद रखने वाला रिकॉर्ड', 'Nothing gets lost in the move': 'स्थानांतरण में कुछ नहीं खोता', 'Workspace preferences': 'कार्यस्थल प्राथमिकताएं' },
  kn: { Children: 'ಮಕ್ಕಳು', 'Add a child': 'ಮಗುವನ್ನು ಸೇರಿಸಿ', 'Curriculum gap': 'ಪಠ್ಯಕ್ರಮ ಅಂತರ', Decimals: 'ದಶಮಾಂಶಗಳು', 'Keep learning moving': 'ಕಲಿಕೆಯನ್ನು ಮುಂದುವರಿಸಿ', Progress: 'ಪ್ರಗತಿ', 'Migration history': 'ವಲಸೆ ಇತಿಹಾಸ', Settings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು', 'Your learning community': 'ನಿಮ್ಮ ಕಲಿಕಾ ಸಮುದಾಯ', 'Build a learning record': 'ಕಲಿಕಾ ದಾಖಲೆಯನ್ನು ರಚಿಸಿ', 'Make the next step visible': 'ಮುಂದಿನ ಹಂತವನ್ನು ಸ್ಪಷ್ಟಗೊಳಿಸಿ', 'A record that remembers': 'ನೆನಪಿನಲ್ಲಿರುವ ದಾಖಲೆ', 'Nothing gets lost in the move': 'ವಲಸೆಯಲ್ಲಿ ಏನೂ ಕಳೆದುಹೋಗುವುದಿಲ್ಲ', 'Workspace preferences': 'ಕಾರ್ಯಸ್ಥಳ ಆದ್ಯತೆಗಳು' },
  mr: { Children: 'मुले', 'Add a child': 'मूल जोडा', 'Curriculum gap': 'अभ्यासक्रमातील अंतर', Decimals: 'दशांश', 'Keep learning moving': 'शिकणे सुरू ठेवा', Progress: 'प्रगती', 'Migration history': 'स्थलांतर इतिहास', Settings: 'सेटिंग्ज', 'Your learning community': 'तुमचा शिक्षण समुदाय', 'Build a learning record': 'शिक्षण नोंद तयार करा', 'Make the next step visible': 'पुढील पाऊल स्पष्ट करा', 'A record that remembers': 'लक्षात ठेवणारी नोंद', 'Nothing gets lost in the move': 'स्थलांतरात काहीही हरवत नाही', 'Workspace preferences': 'कार्यस्थळ प्राधान्ये' },
};

const screenCopy = {
  hi: {
    'Learning continuity workspace': 'सीखने की निरंतरता का कार्यस्थल', 'Welcome back.': 'वापसी पर स्वागत है।', 'Pick up every child’s learning journey from where it belongs: with them.': 'हर बच्चे की सीखने की यात्रा वहीं से जारी रखें जहां वह होनी चाहिए: बच्चे के साथ।', 'Create your account.': 'अपना खाता बनाएं।', 'Set up a coordinator account to keep every learning journey connected.': 'हर सीखने की यात्रा को जोड़ने के लिए समन्वयक खाता बनाएं।', 'Coordinator name': 'समन्वयक का नाम', 'Enter your full name': 'अपना पूरा नाम दर्ज करें', 'Phone number': 'फ़ोन नंबर', 'Password': 'पासवर्ड', 'Enter your password': 'अपना पासवर्ड दर्ज करें', 'Sign in': 'साइन इन करें', 'Create account': 'खाता बनाएं', 'New to Vidyayan? Create an account': 'Vidyayan पर नए हैं? खाता बनाएं', 'Already have an account? Sign in': 'पहले से खाता है? साइन इन करें', 'Prototype access · no backend authentication': 'प्रोटोटाइप एक्सेस · बैकएंड प्रमाणीकरण नहीं', 'Learning language tools': 'सीखने की भाषा के उपकरण', 'Translate a lesson': 'पाठ का अनुवाद करें', 'Text translation': 'टेक्स्ट अनुवाद', 'Source language': 'स्रोत भाषा', 'Target language': 'लक्ष्य भाषा', 'Enter text to translate...': 'अनुवाद के लिए टेक्स्ट दर्ज करें...', Translate: 'अनुवाद करें', Clear: 'साफ़ करें', 'Copy translation': 'अनुवाद कॉपी करें', 'Good morning, Anita': 'सुप्रभात, अनीता', 'Total children': 'कुल बच्चे', 'Active learning': 'सक्रिय सीखना', 'Pending gap analysis': 'लंबित अंतर विश्लेषण', 'Completed bridges': 'पूर्ण किए गए ब्रिज', 'Recent children': 'हाल के बच्चे', 'Recent activity': 'हाल की गतिविधि', 'Learning progress': 'सीखने की प्रगति', 'View all': 'सभी देखें', 'Add child': 'बच्चा जोड़ें', 'Home curriculum': 'गृह पाठ्यक्रम', 'Destination curriculum': 'गंतव्य पाठ्यक्रम', 'Analyze curriculum gap': 'पाठ्यक्रम अंतर का विश्लेषण करें', 'Analysis complete': 'विश्लेषण पूरा हुआ', 'Learning profile': 'सीखने की प्रोफ़ाइल', 'Learning summary': 'सीखने का सारांश', 'Continue': 'जारी रखें', 'Back to children': 'बच्चों पर वापस जाएं', 'Back to learning': 'सीखने पर वापस जाएं', 'Understanding decimal numbers': 'दशमलव संख्याओं को समझना', 'Check answer': 'उत्तर जांचें', 'Overall learning progress': 'कुल सीखने की प्रगति', 'Export record': 'रिकॉर्ड निर्यात करें', 'Export history': 'इतिहास निर्यात करें', 'View full record': 'पूरा रिकॉर्ड देखें', 'Current location': 'वर्तमान स्थान', 'Workspace preferences': 'कार्यस्थल प्राथमिकताएं', 'Edit profile': 'प्रोफ़ाइल संपादित करें', Done: 'पूर्ण', 'Default learning language': 'डिफ़ॉल्ट सीखने की भाषा', 'View curriculum gap': 'पाठ्यक्रम अंतर देखें', 'Start bridge lesson': 'ब्रिज पाठ शुरू करें', 'PDF material': 'PDF सामग्री', Listen: 'सुनें', Read: 'पढ़ें', 'Open lesson': 'पाठ खोलें', 'Download material': 'सामग्री डाउनलोड करें', 'See learning history': 'सीखने का इतिहास देखें', 'Need a hand?': 'मदद चाहिए?', 'Open the coordinator guide': 'समन्वयक गाइड खोलें',
  },
  kn: {
    'Learning continuity workspace': 'ಕಲಿಕೆಯ ನಿರಂತರತಾ ಕಾರ್ಯಸ್ಥಳ', 'Welcome back.': 'ಮತ್ತೆ ಸ್ವಾಗತ.', 'Phone number': 'ಫೋನ್ ಸಂಖ್ಯೆ', Password: 'ಪಾಸ್‌ವರ್ಡ್', 'Sign in': 'ಸೈನ್ ಇನ್', 'Create account': 'ಖಾತೆ ರಚಿಸಿ', 'Learning language tools': 'ಕಲಿಕೆಯ ಭಾಷಾ ಸಾಧನಗಳು', 'Translate a lesson': 'ಪಾಠವನ್ನು ಅನುವಾದಿಸಿ', 'Text translation': 'ಪಠ್ಯ ಅನುವಾದ', 'Source language': 'ಮೂಲ ಭಾಷೆ', 'Target language': 'ಗುರಿ ಭಾಷೆ', Translate: 'ಅನುವಾದಿಸಿ', Clear: 'ತೆರವುಗೊಳಿಸಿ', 'Copy translation': 'ಅನುವಾದವನ್ನು ನಕಲಿಸಿ', 'Total children': 'ಒಟ್ಟು ಮಕ್ಕಳು', 'Active learning': 'ಸಕ್ರಿಯ ಕಲಿಕೆ', 'Recent children': 'ಇತ್ತೀಚಿನ ಮಕ್ಕಳು', 'Recent activity': 'ಇತ್ತೀಚಿನ ಚಟುವಟಿಕೆ', 'Add child': 'ಮಗುವನ್ನು ಸೇರಿಸಿ', 'Learning profile': 'ಕಲಿಕೆಯ ಪ್ರೊಫೈಲ್', 'Learning summary': 'ಕಲಿಕೆಯ ಸಾರಾಂಶ', Continue: 'ಮುಂದುವರಿಸಿ', 'Back to children': 'ಮಕ್ಕಳಿಗೆ ಹಿಂತಿರುಗಿ', 'Back to learning': 'ಕಲಿಕೆಗೆ ಹಿಂತಿರುಗಿ', 'Check answer': 'ಉತ್ತರ ಪರಿಶೀಲಿಸಿ', Progress: 'ಪ್ರಗತಿ', Settings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು', 'Edit profile': 'ಪ್ರೊಫೈಲ್ ಸಂಪಾದಿಸಿ', Done: 'ಮುಗಿದಿದೆ', Listen: 'ಆಲಿಸಿ', Read: 'ಓದಿ', 'PDF material': 'PDF ವಸ್ತು', 'See learning history': 'ಕಲಿಕೆಯ ಇತಿಹಾಸ ನೋಡಿ',
  },
  mr: {
    'Learning continuity workspace': 'शिक्षण सातत्य कार्यस्थळ', 'Welcome back.': 'पुन्हा स्वागत आहे.', 'Phone number': 'फोन नंबर', Password: 'पासवर्ड', 'Sign in': 'साइन इन', 'Create account': 'खाते तयार करा', 'Learning language tools': 'शिकण्याची भाषा साधने', 'Translate a lesson': 'धड्याचे भाषांतर करा', 'Text translation': 'मजकूर भाषांतर', 'Source language': 'स्रोत भाषा', 'Target language': 'लक्ष्य भाषा', Translate: 'भाषांतर करा', Clear: 'साफ करा', 'Copy translation': 'भाषांतर कॉपी करा', 'Total children': 'एकूण मुले', 'Active learning': 'सक्रिय शिक्षण', 'Recent children': 'अलीकडील मुले', 'Recent activity': 'अलीकडील क्रियाकलाप', 'Add child': 'मूल जोडा', 'Learning profile': 'शिक्षण प्रोफाइल', 'Learning summary': 'शिक्षण सारांश', Continue: 'पुढे जा', 'Back to children': 'मुलांकडे परत जा', 'Back to learning': 'शिकण्याकडे परत जा', 'Check answer': 'उत्तर तपासा', Progress: 'प्रगती', Settings: 'सेटिंग्ज', 'Edit profile': 'प्रोफाइल संपादित करा', Done: 'पूर्ण', Listen: 'ऐका', Read: 'वाचा', 'PDF material': 'PDF साहित्य', 'See learning history': 'शिक्षण इतिहास पहा',
  },
};

const sourceText = new WeakMap();
const sourceAttributes = new WeakMap();

function translateScreen(language) {
  const dictionary = screenCopy[language] || {};
  const root = document.body;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(node => {
    if (!sourceText.has(node)) sourceText.set(node, node.nodeValue);
    const original = sourceText.get(node);
    const trimmed = original.trim();
    if (!trimmed || ['SCRIPT', 'STYLE', 'OPTION'].includes(node.parentElement?.tagName)) return;
    const translated = language === 'en' ? original : original.replace(trimmed, dictionary[trimmed] || trimmed);
    if (node.nodeValue !== translated) node.nodeValue = translated;
  });
  root.querySelectorAll('input, textarea, [aria-label], [title]').forEach(element => {
    if (!sourceAttributes.has(element)) sourceAttributes.set(element, {});
    const attributes = sourceAttributes.get(element);
    ['placeholder', 'aria-label', 'title'].forEach(attribute => {
      if (!element.hasAttribute(attribute)) return;
      if (!attributes[attribute]) attributes[attribute] = element.getAttribute(attribute);
      const original = attributes[attribute];
      const nextValue = language === 'en' ? original : dictionary[original] || original;
      if (element.getAttribute(attribute) !== nextValue) element.setAttribute(attribute, nextValue);
    });
  });
}

export function useScreenTranslation(language) {
  useEffect(() => {
    document.documentElement.lang = language;
    translateScreen(language);
    const observer = new MutationObserver(() => translateScreen(language));
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [language]);
}

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => localStorage.getItem('vidyayan-language') || 'en');
  const changeLanguage = value => { setLanguage(value); localStorage.setItem('vidyayan-language', value); };
  useScreenTranslation(language);
  const value = useMemo(() => ({ language, setLanguage: changeLanguage, t: key => copy[language]?.[key] || pageCopy[language]?.[key] || copy.en[key] || key }), [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
