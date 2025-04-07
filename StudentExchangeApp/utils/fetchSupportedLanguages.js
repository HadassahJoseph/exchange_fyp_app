// utils/fetchSupportedLanguages.js

const supportedLanguages = {
    English: 'EN',
    German: 'DE',
    French: 'FR',
    Spanish: 'ES',
    Portuguese: 'PT',
    Italian: 'IT',
    Dutch: 'NL',
    Polish: 'PL',
    Russian: 'RU',
    Japanese: 'JA',
    Chinese: 'ZH',
    Bulgarian: 'BG',
    Czech: 'CS',
    Danish: 'DA',
    Greek: 'EL',
    Estonian: 'ET',
    Finnish: 'FI',
    Hungarian: 'HU',
    Indonesian: 'ID',
    Lithuanian: 'LT',
    Latvian: 'LV',
    Romanian: 'RO',
    Slovak: 'SK',
    Slovenian: 'SL',
    Swedish: 'SV',
    Turkish: 'TR',
    Ukrainian: 'UK'
  };
  
  // 🔁 Reverse map (for matching "en", "fr", etc.)
  const codeMap = Object.fromEntries(
    Object.entries(supportedLanguages).map(([name, code]) => [code.toLowerCase(), code])
  );
  
  export function getDeepLCodeFromName(languageInput = '') {
    const normalized = languageInput.trim().toLowerCase();
  
    // 1. Match by name (e.g. "english")
    const matchByName = Object.entries(supportedLanguages).find(
      ([name]) => name.toLowerCase() === normalized
    );
    if (matchByName) return matchByName[1];
  
    // 2. Match by code (e.g. "en", "fr")
    if (codeMap[normalized]) return codeMap[normalized];
  
    // 3. Default fallback
    return 'EN';
  }
  
  export default supportedLanguages;
  