// ===== Smart Text Assistant - Main Content Script =====

// All modules are loaded via manifest.json, functions are globally available

// ===== Initialize the extension =====
async function initializeExtension() {
  try {
    // Initialize CSS animations
    if (typeof initializeCSS !== 'undefined') {
      initializeCSS();
    }
    
    // Initialize text selection handlers  
    if (typeof initializeSelectionHandlers !== 'undefined') {
      initializeSelectionHandlers();
    }
    
    // Initialize keyboard shortcuts
    if (typeof initializeKeyboardShortcuts !== 'undefined') {
      initializeKeyboardShortcuts();
    }
    
    console.log('Smart Text Assistant initialized successfully');
  } catch (error) {
    console.error('Extension initialization failed:', error);
  }
}

// Start the extension when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeExtension);
} else {
  initializeExtension();
}

// ===== Export for debugging =====
if (typeof window !== 'undefined') {
  window.SmartTextAssistant = {
    // Export module functions for debugging/manual access
    async showVoiceInput() {
      if (typeof showVoiceInputPopup !== 'undefined') {
        showVoiceInputPopup();
      }
    },
    
    async showSavedWords() {
      if (typeof showSavedWordsPopup !== 'undefined') {
        showSavedWordsPopup();
      }
    },
    
    async lookupWord(word) {
      if (typeof handleDictionaryLookup !== 'undefined') {
        handleDictionaryLookup(word);
      }
    },
    
    async testRewrite(text) {
      try {
        if (typeof rewriteText !== 'undefined' && typeof showRewritePopup !== 'undefined') {
          const result = await rewriteText(text);
          showRewritePopup(text, result.professional, result.casual);
        }
      } catch (error) {
        console.error('Test rewrite failed:', error);
      }
    },
    
    // Enable debug mode
    enableDebug() {
      localStorage.setItem('sta-debug', 'true');
      console.log('Debug mode enabled');
    },
    
    disableDebug() {
      localStorage.removeItem('sta-debug');
      console.log('Debug mode disabled');
    }
  };
}