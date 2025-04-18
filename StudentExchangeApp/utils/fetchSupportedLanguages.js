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
  Korean: 'KO',
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

// An alias mapping to support various inputs (both codes and common names/abbreviations)
const aliasMap = {
  // English
  en: 'EN',
  eng: 'EN',
  english: 'EN',

  // French
  fr: 'FR',
  fre: 'FR',
  french: 'FR',

  // German
  de: 'DE',
  ger: 'DE',
  german: 'DE',

  // Spanish
  es: 'ES',
  spa: 'ES',
  spanish: 'ES',

  // Portuguese
  pt: 'PT',
  por: 'PT',
  portuguese: 'PT',

  // Italian
  it: 'IT',
  ita: 'IT',
  italian: 'IT',

  // Dutch
  nl: 'NL',
  dutch: 'NL',
  nederlands: 'NL',

  // Polish
  pl: 'PL',
  polish: 'PL',

  // Russian
  ru: 'RU',
  russian: 'RU',

  // Japanese
  ja: 'JA',
  jpn: 'JA',
  japanese: 'JA',

  // Korean
  ko: 'KO',
  kor: 'KO',
  korean: 'KO',
  hangul: 'KO',

  // Chinese
  zh: 'ZH',
  zho: 'ZH',
  chinese: 'ZH',
  mandarin: 'ZH',

  // Bulgarian
  bg: 'BG',
  bulgarian: 'BG',

  // Czech
  cs: 'CS',
  czech: 'CS',

  // Danish
  da: 'DA',
  danish: 'DA',

  // Greek
  el: 'EL',
  greek: 'EL',

  // Estonian
  et: 'ET',
  estonian: 'ET',

  // Finnish
  fi: 'FI',
  finnish: 'FI',

  // Hungarian
  hu: 'HU',
  hungarian: 'HU',

  // Indonesian
  id: 'ID',
  indonesian: 'ID',

  // Lithuanian
  lt: 'LT',
  lithuanian: 'LT',

  // Latvian
  lv: 'LV',
  latvian: 'LV',

  // Romanian
  ro: 'RO',
  romanian: 'RO',

  // Slovak
  sk: 'SK',
  slovak: 'SK',

  // Slovenian
  sl: 'SL',
  slovenian: 'SL',

  // Swedish
  sv: 'SV',
  swedish: 'SV',

  // Turkish
  tr: 'TR',
  turkish: 'TR',

  // Ukrainian
  uk: 'UK',
  ukrainian: 'UK'
};

/**
 * Get the DeepL language code from a given language input.
 * Supports both full names and common aliases (case-insensitive).
 * 
 * @param {string} languageInput - The input language (e.g., "French", "fr", "FRE").
 * @returns {string} The corresponding DeepL language code (e.g., "FR"). Defaults to "EN" if no match is found.
 */
export function getDeepLCodeFromName(languageInput = '') {
  const normalized = languageInput.trim().toLowerCase();

  // Try to match using the aliasMap first.
  if (aliasMap[normalized]) {
    return aliasMap[normalized];
  }

  // Otherwise, try to match the full language name from supportedLanguages.
  const match = Object.entries(supportedLanguages).find(
    ([name]) => name.toLowerCase() === normalized
  );
  if (match) {
    return match[1];
  }

  // Default fallback
  return 'EN';
}

export default supportedLanguages;
