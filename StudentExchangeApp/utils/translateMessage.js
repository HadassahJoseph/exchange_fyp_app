import axios from 'axios';

const translateMessage = async (message, targetLang = 'EN') => {
  const API_KEY = '100c1113-6df2-4e01-a607-36cd9cc0900e:fx';  // Keep API key secure
  const apiUrl = 'https://api-free.deepl.com/v2/translate';

  try {
    const response = await axios.post(apiUrl, null, {
      params: {
        auth_key: API_KEY,
        text: message,
        target_lang: targetLang.toUpperCase(),  // Ensure the language is in uppercase
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    });

    console.log("✅ Translation successful:", response.data);
    const translatedText = response.data.translations[0].text;
    const detectedLanguage = response.data.translations[0].detected_source_language;

    return { translatedText, detectedLanguage };
  } catch (error) {
    console.error('❌ Translation error:', error.response?.data || error.message);
    return { translatedText: "Translation failed", detectedLanguage: null };
  }
};

export default translateMessage;
