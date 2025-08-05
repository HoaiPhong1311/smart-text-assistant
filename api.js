// ===== API Helper Functions =====
// API_CONFIG and DICTIONARY_API will be available globally via config.js

async function callAPI(baseUrl, endpoint, data) {
  try {
    const fullUrl = `${baseUrl}${endpoint}`;
    console.log('🚀 API Call:', fullUrl, 'with data:', data);
    
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    });

    console.log('📡 API Response status:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error response:', errorText);
      throw new Error(`API call failed: ${response.status} - ${response.statusText}`);
    }

    const result = await response.json();
    console.log('✅ API Success:', result);
    return result;
  } catch (error) {
    console.error('🔥 API Network error:', error);
    throw new Error(`Network error: ${error.message}`);
  }
}

async function rewriteText(text) {
  return await callAPI(API_CONFIG.REWRITE_BASE_URL, API_CONFIG.ENDPOINTS.REWRITE, { text });
}

async function correctGrammar(text) {
  return await callAPI(API_CONFIG.GRAMMAR_BASE_URL, API_CONFIG.ENDPOINTS.CORRECTION, { text });
}

async function checkGrammar(text) {
  return await callAPI(API_CONFIG.GRAMMAR_BASE_URL, API_CONFIG.ENDPOINTS.CHECK, { text });
}

// ===== Dictionary API Function =====
async function lookupWord(word) {
  try {
    const cleanWord = word.toLowerCase().trim().replace(/[^\w\s-]/g, '');
    if (!cleanWord) throw new Error('Invalid word');
    
    const response = await fetch(`${DICTIONARY_API.BASE_URL}/${encodeURIComponent(cleanWord)}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Word not found in dictionary');
      }
      throw new Error('Dictionary service unavailable');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

// ===== Real Translation API =====
async function realTranslateAPI(text, fromLang, toLang) {
  try {
    // Use Google Translate API
    const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${fromLang}&tl=${toLang}&dt=t&q=${encodeURIComponent(text)}`);
    
    if (!response.ok) {
      throw new Error('Translation service unavailable');
    }
    
    const data = await response.json();
    
    // Extract translated text from Google Translate response
    let translatedText = '';
    if (data && data[0]) {
      for (const segment of data[0]) {
        if (segment[0]) {
          translatedText += segment[0];
        }
      }
    }
    
    return translatedText || text;
    
  } catch (error) {
    // Fallback to mock for development
    return mockTranslateAPI(text, fromLang, toLang);
  }
}

// ===== Fallback Mock Translation API =====
async function mockTranslateAPI(text, fromLang, toLang) {
  console.warn('🔄 Using fallback translation - Google Translate API unavailable');
  
  // Simplified fallback: just return error message instead of fake translation
  const langNames = { 'vi': 'Vietnamese', 'en': 'English' };
  const fromName = langNames[fromLang] || fromLang;
  const toName = langNames[toLang] || toLang;
  
  return `⚠️ Translation unavailable (${fromName} → ${toName}). Original text: "${text}"`;
}

// ===== Export to global scope for browser extension =====
if (typeof window !== 'undefined') {
  window.callAPI = callAPI;
  window.rewriteText = rewriteText;
  window.correctGrammar = correctGrammar;
  window.checkGrammar = checkGrammar;
  window.lookupWord = lookupWord;
  window.realTranslateAPI = realTranslateAPI;
  window.mockTranslateAPI = mockTranslateAPI;
}