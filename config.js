// ===== API Configuration =====
const API_CONFIG = {
  // Hugging Face Spaces URLs
  REWRITE_BASE_URL: 'https://PhongLee0938-rewrite-2style-space.hf.space',
  GRAMMAR_BASE_URL: 'https://PhongLee0938-grammar-correction-space.hf.space',
  ENDPOINTS: {
    REWRITE: '/api/rewrite',
    CORRECTION: '/api/grammar',
    CHECK: '/api/grammar_check'
  }
};

// Free Dictionary API
const DICTIONARY_API = {
  BASE_URL: 'https://api.dictionaryapi.dev/api/v2/entries/en'
};

// ===== SVG Icons cho từng function =====
const ICONS = {
  default: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="#4A90E2" stroke-width="2" fill="#fff"/>
    <path d="M14 2V8H20" stroke="#4A90E2" stroke-width="2" fill="none"/>
    <path d="M16 13H8M16 17H8M10 9H8" stroke="#4A90E2" stroke-width="2"/>
  </svg>`,
  
  rewrite: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H11" stroke="#4A90E2" stroke-width="2" fill="none"/>
    <path d="M18.5 2.5C19.6 1.4 21.4 1.4 22.5 2.5C23.6 3.6 23.6 5.4 22.5 6.5L12 17H7V12L18.5 2.5Z" stroke="#4A90E2" stroke-width="2" fill="#fff"/>
  </svg>`,
  
  correction: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="#4A90E2" stroke-width="2" fill="#fff"/>
    <path d="M9 12L11 14L15 10" stroke="#4A90E2" stroke-width="2" fill="none"/>
  </svg>`,
  
  check: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="11" cy="11" r="8" stroke="#4A90E2" stroke-width="2" fill="#fff"/>
    <path d="M21 21L16.65 16.65" stroke="#4A90E2" stroke-width="2"/>
    <path d="M11 8V13M11 16H11.01" stroke="#4A90E2" stroke-width="2"/>
  </svg>`,
  
  loading: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="#E5E7EB" stroke-width="2"/>
    <path d="M4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4" stroke="#4A90E2" stroke-width="2" stroke-linecap="round">
      <animateTransform attributeName="transform" attributeType="XML" type="rotate" dur="1s" from="0 12 12" to="360 12 12" repeatCount="indefinite"/>
    </path>
  </svg>`,
  
  voice: `<svg width="20" height="20" viewBox="0 0 16 16" fill="#4A90E2" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5"/>
    <path d="M10 8a2 2 0 1 1-4 0V3a2 2 0 1 1 4 0zM8 0a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V3a3 3 0 0 0-3-3"/>
  </svg>`,
  
  tts: `<svg width="20" height="20" viewBox="0 0 16 16" fill="#0EA5E9" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7 3.582 7 8 7M8 16c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8"/>
    <path d="M6.271 5.055a.5.5 0 0 1 .52.045C7.5 5.555 8 6.258 8 7s-.5 1.445-1.209 1.9a.5.5 0 1 1-.582-.9C6.556 7.725 7 7.389 7 7s-.444-.725-.791-1a.5.5 0 0 1-.145-.945M4.271 3.055a.5.5 0 0 1 .52.045C6 4.056 7 5.353 7 7s-1 2.944-2.209 3.9a.5.5 0 1 1-.582-.9C5.444 9.394 6 8.592 6 7s-.556-2.394-1.791-3a.5.5 0 0 1-.145-.945"/>
  </svg>`
};

// ===== Lấy icon theo function =====
function getIconForFunction(functionType) {
  return ICONS[functionType] || ICONS.default;
}

// ===== Export to global scope for browser extension =====
if (typeof window !== 'undefined') {
  window.API_CONFIG = API_CONFIG;
  window.DICTIONARY_API = DICTIONARY_API;
  window.ICONS = ICONS;
  window.getIconForFunction = getIconForFunction;
}