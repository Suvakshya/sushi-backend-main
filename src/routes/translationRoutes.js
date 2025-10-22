import express from 'express';
import axios from 'axios';

const router = express.Router();

// Translation cache to avoid repeated API calls
const translationCache = new Map();

// Google Translate API function
const translateText = async (text, targetLang) => {
  try {
    // Check cache first
    const cacheKey = `${text}-${targetLang}`;
    if (translationCache.has(cacheKey)) {
      return translationCache.get(cacheKey);
    }

    // Using LibreTranslate (free) - you can replace with Google Cloud Translate if you have API key
    const response = await axios.post('https://libretranslate.de/translate', {
      q: text,
      source: 'en',
      target: targetLang,
      format: 'text'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.data && response.data.translatedText) {
      const translated = response.data.translatedText;
      
      // Cache the translation
      translationCache.set(cacheKey, translated);
      
      return translated;
    }
    
    return text; // Fallback to original text
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Fallback to original text
  }
};

// Batch translate endpoint
router.post('/translate', async (req, res) => {
  try {
    const { texts, targetLang } = req.body;

    if (!texts || !targetLang) {
      return res.status(400).json({
        success: false,
        message: 'Texts and targetLang are required'
      });
    }

    // Translate all texts
    const translationPromises = texts.map(text => translateText(text, targetLang));
    const translatedTexts = await Promise.all(translationPromises);

    // Create a mapping of original to translated text
    const translations = {};
    texts.forEach((text, index) => {
      translations[text] = translatedTexts[index];
    });

    res.json({
      success: true,
      data: translations
    });

  } catch (error) {
    console.error('Translation API error:', error);
    res.status(500).json({
      success: false,
      message: 'Translation service unavailable'
    });
  }
});

// Single text translation endpoint
router.post('/translate-single', async (req, res) => {
  try {
    const { text, targetLang } = req.body;

    if (!text || !targetLang) {
      return res.status(400).json({
        success: false,
        message: 'Text and targetLang are required'
      });
    }

    const translated = await translateText(text, targetLang);

    res.json({
      success: true,
      data: {
        original: text,
        translated: translated
      }
    });

  } catch (error) {
    console.error('Single translation error:', error);
    res.status(500).json({
      success: false,
      message: 'Translation service unavailable'
    });
  }
});

export default router;