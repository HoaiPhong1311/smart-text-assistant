// ===== Voice Recognition and Text-to-Speech =====
// Functions will be available globally via script loading order in manifest.json

// ===== Voice Recognition Setup =====
let recognition = null;
let isListening = false;

// ===== Text to Speech Setup =====
let speechSynthesis = window.speechSynthesis;
let currentUtterance = null;
let availableVoices = [];

// Initialize Speech Recognition
function initializeSpeechRecognition() {
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    
    return true;
  } else {
    return false;
  }
}

// Initialize Speech Synthesis
function initializeSpeechSynthesis() {
  if ('speechSynthesis' in window) {
    speechSynthesis = window.speechSynthesis;
    
    // Load voices (may need to wait for them to load)
    loadVoices();
    
    // Listen for voices changed event
    speechSynthesis.addEventListener('voiceschanged', loadVoices);
    
    return true;
  } else {
    return false;
  }
}

function loadVoices() {
  availableVoices = speechSynthesis.getVoices();
}

// Initialize on load
initializeSpeechRecognition();
initializeSpeechSynthesis();

// ===== Voice Input Popup =====
function showVoiceInputPopup() {
  const existing = document.getElementById("sta-voice-popup");
  if (existing) existing.remove();

  // Xóa trigger icon nếu có
  const triggerIcon = document.getElementById("sta-trigger-icon");
  if (triggerIcon) triggerIcon.remove();

  // Save current selection before opening popup
  const selection = window.getSelection();
  const currentSelection = selection.toString().trim();
  
  // Store both text and range for voice commands
  window.staCurrentSelection = currentSelection;
  window.staCurrentRange = null;
  
  if (selection.rangeCount > 0) {
    // Clone the range to save it
    window.staCurrentRange = selection.getRangeAt(0).cloneRange();
  }
  
  // Debug logging
  const isDebug = localStorage.getItem('sta-debug') === 'true';
  if (isDebug) {
    console.log('🎯 Voice popup opened with saved selection:', currentSelection);
    console.log('🎯 Saved range:', window.staCurrentRange);
  }

  const div = document.createElement("div");
  div.id = "sta-voice-popup";
  
  // Use original centered position styling
  div.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2147483647;
    background: linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%);
    border: 2px solid #10B981;
    border-radius: 24px;
    box-shadow: 0 20px 64px rgba(16, 185, 129, 0.15), 0 8px 32px rgba(0, 0, 0, 0.1);
    padding: 32px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #1F2937;
    width: 420px;
    max-height: min(70vh, 500px);
    overflow-y: auto;
    backdrop-filter: blur(16px);
    animation: staSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  `;
  
  // Apply lightweight protection
  protectPopupStyling(div);

  // Close button
  div.appendChild(createCloseButton("sta-voice-popup"));

  // Title với icon
  const title = document.createElement("div");
  title.innerHTML = `
    <div style="display: flex; align-items: center; margin-bottom: 20px;">
      <svg width="28" height="28" viewBox="0 0 16 16" fill="#10B981" style="margin-right: 12px;">
        <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5"/>
        <path d="M10 8a2 2 0 1 1-4 0V3a2 2 0 1 1 4 0zM8 0a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V3a3 3 0 0 0-3-3"/>
      </svg>
      <span style="font-size: 20px; font-weight: 700; color: #047857;">Voice Input</span>
    </div>
  `;
  div.appendChild(title);

  // Language selection
  const languageSection = document.createElement("div");
  languageSection.innerHTML = `
    <div style="margin-bottom: 24px;">
      <label style="font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 12px; display: block;">Select Language</label>
      <div style="display: flex; gap: 12px;">
        <button class="lang-btn" data-lang="vi-VN" style="
          flex: 1;
          padding: 12px 16px;
          border: 2px solid #D1D5DB;
          border-radius: 12px;
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        ">
          🇻🇳 Tiếng Việt
        </button>
        <button class="lang-btn" data-lang="en-US" style="
          flex: 1;
          padding: 12px 16px;
          border: 2px solid #D1D5DB;
          border-radius: 12px;
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        ">
          🇺🇸 English
        </button>
      </div>
    </div>
  `;
  div.appendChild(languageSection);

  // Voice controls
  const voiceControls = document.createElement("div");
  voiceControls.innerHTML = `
    <div style="text-align: center; margin-bottom: 24px;">
      <button id="voice-mic-btn" style="
        width: 80px;
        height: 80px;
        border: none;
        border-radius: 50%;
        background: linear-gradient(135deg, #10B981 0%, #059669 100%);
        color: white;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 16px auto;
      ">
        <svg width="32" height="32" viewBox="0 0 16 16" fill="white">
          <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5"/>
          <path d="M10 8a2 2 0 1 1-4 0V3a2 2 0 1 1 4 0zM8 0a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V3a3 3 0 0 0-3-3"/>
        </svg>
      </button>
      <div id="voice-status" style="
        font-size: 14px;
        color: #6B7280;
        font-weight: 500;
      ">Click to start recording</div>
    </div>
  `;
  div.appendChild(voiceControls);

  // Results area
  const resultsArea = document.createElement("div");
  resultsArea.innerHTML = `
    <div id="voice-results" style="
      min-height: 120px;
      background: rgba(16, 185, 129, 0.05);
      border: 2px dashed #D1D5DB;
      border-radius: 12px;
      padding: 20px;
      text-align: center;
      color: #6B7280;
      font-style: italic;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
    ">
      <div>
        <svg width="48" height="48" viewBox="0 0 16 16" fill="#6B7280" style="margin-bottom: 12px; opacity: 0.3;">
          <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5"/>
          <path d="M10 8a2 2 0 1 1-4 0V3a2 2 0 1 1 4 0zM8 0a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V3a3 3 0 0 0-3-3"/>
        </svg>
        <div>Your speech will appear here...</div>
      </div>
    </div>
  `;
  div.appendChild(resultsArea);

  // Protect text elements from external CSS interference
  protectTextElements(div);

  document.body.appendChild(div);

  // Setup voice input functionality
  setupVoiceInput(div);
}

// ===== Voice Input Setup =====
function setupVoiceInput(popupElement) {
  let selectedLanguage = 'vi-VN';
  let isRecording = false;
  
  const micBtn = popupElement.querySelector('#voice-mic-btn');
  const statusDiv = popupElement.querySelector('#voice-status');
  const resultsDiv = popupElement.querySelector('#voice-results');
  const langButtons = popupElement.querySelectorAll('.lang-btn');

  // Language selection
  langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      langButtons.forEach(b => {
        b.style.borderColor = '#D1D5DB';
        b.style.background = 'white';
      });
      
      btn.style.borderColor = '#10B981';
      btn.style.background = 'rgba(16, 185, 129, 0.1)';
      selectedLanguage = btn.dataset.lang;
    });
  });

  // Set default language (Vietnamese)
  langButtons[0].click();

  // Mic button functionality
  micBtn.addEventListener('click', () => {
    if (!recognition) {
      showVoiceError('Speech recognition not supported in this browser');
      return;
    }

    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  });

  function startRecording() {
    isRecording = true;
    recognition.lang = selectedLanguage;
    
    // Update UI
    micBtn.style.background = 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)';
    micBtn.style.boxShadow = '0 0 20px rgba(239, 68, 68, 0.5)';
    micBtn.innerHTML = `
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" class="recording-pulse">
        <rect x="6" y="6" width="12" height="12" rx="2" stroke="white" stroke-width="2" fill="white"/>
      </svg>
    `;
    
    statusDiv.textContent = selectedLanguage === 'vi-VN' ? 'Đang nghe... Nói đi!' : 'Listening... Speak now!';
    statusDiv.style.color = '#EF4444';

    // Add pulsing animation
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes pulse-recording {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
      }
      .recording-pulse { animation: pulse-recording 1s infinite; }
    `;
    document.head.appendChild(style);

    // Setup recognition events
    recognition.onstart = () => {
      // Recording started
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      handleSpeechResult(transcript, selectedLanguage);
    };

    recognition.onerror = (event) => {
      showVoiceError('Recognition error: ' + event.error);
      stopRecording();
    };

    recognition.onend = () => {
      stopRecording();
    };

    recognition.start();
  }

  function stopRecording() {
    isRecording = false;
    recognition?.stop();
    
    // Reset UI
    micBtn.style.background = 'linear-gradient(135deg, #10B981 0%, #059669 100%)';
    micBtn.style.boxShadow = '0 8px 24px rgba(16, 185, 129, 0.3)';
    micBtn.innerHTML = `
      <svg width="32" height="32" viewBox="0 0 16 16" fill="white">
        <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5"/>
        <path d="M10 8a2 2 0 1 1-4 0V3a2 2 0 1 1 4 0zM8 0a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V3a3 3 0 0 0-3-3"/>
      </svg>
    `;
    
    statusDiv.textContent = 'Click to start recording';
    statusDiv.style.color = '#6B7280';

    // Remove pulse animation
    document.querySelectorAll('.recording-pulse').forEach(el => {
      el.classList.remove('recording-pulse');
    });
  }

  function handleSpeechResult(transcript, language) {
    // Check for voice commands first
    const command = detectVoiceCommand(transcript, language);
    if (command) {
      executeVoiceCommand(command, transcript);
      return;
    }

    // Show original text
    showSpeechResult(transcript, language);

    // If Vietnamese, translate to English
    if (language === 'vi-VN') {
      translateVietnameseToEnglish(transcript);
    }
    // If English, translate to Vietnamese  
    else if (language === 'en-US') {
      translateEnglishToVietnamese(transcript);
    }
  }

  function showSpeechResult(text, language) {
    resultsDiv.innerHTML = `
      <div style="text-align: left;">
        <div style="margin-bottom: 16px;">
          <label style="font-size: 12px; font-weight: 600; color: #6B7280; text-transform: uppercase;">
            ${language === 'vi-VN' ? 'Vietnamese Input' : 'English Input'}
          </label>
          <div style="
            margin-top: 6px; 
            padding: 12px 16px; 
            background: rgba(16, 185, 129, 0.1); 
            border: 1px solid rgba(16, 185, 129, 0.2);
            border-radius: 12px; 
            color: #065F46;
            border-left: 4px solid #10B981;
          ">"${text}"</div>
        </div>
        <div style="display: flex; gap: 8px; margin-top: 16px;">
          <button class="voice-action-btn" data-action="send-original" style="
            flex: 1;
            padding: 10px 16px;
            border: 2px solid #10B981;
            border-radius: 8px;
            background: rgba(16, 185, 129, 0.1);
            color: #065F46;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
          ">📤 Send Original</button>
          ${language === 'vi-VN' ? `
          <button class="voice-action-btn" data-action="translate" style="
            flex: 1;
            padding: 10px 16px;
            border: 2px solid #3B82F6;
            border-radius: 8px;
            background: rgba(59, 130, 246, 0.1);
            color: #1E40AF;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
          ">🔄 Translate</button>
          ` : ''}
          ${language === 'en-US' ? `
          <button class="voice-action-btn" data-action="translate" style="
            flex: 1;
            padding: 10px 16px;
            border: 2px solid #3B82F6;
            border-radius: 8px;
            background: rgba(59, 130, 246, 0.1);
            color: #1E40AF;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
          ">🔄 Translate</button>
          ` : ''}
          <button class="voice-action-btn" data-action="rewrite" style="
            flex: 1;
            padding: 10px 16px;
            border: 2px solid #7C3AED;
            border-radius: 8px;
            background: rgba(124, 58, 237, 0.1);
            color: #5B21B6;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
          ">✨ Rewrite</button>
        </div>
      </div>
    `;

    // Protect dynamic content
    protectDynamicContent(resultsDiv);

    // Setup action buttons
    resultsDiv.querySelectorAll('.voice-action-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        if (action === 'send-original') {
          insertTextAtCursor(text);
          closeVoicePopup();
        } else if (action === 'translate') {
          if (language === 'vi-VN') {
            translateVietnameseToEnglish(text);
          } else if (language === 'en-US') {
            translateEnglishToVietnamese(text);
          }
        } else if (action === 'rewrite') {
          // Get saved selection before closing popup
          const savedRange = window.staCurrentRange;
          closeVoicePopup(false, false);
          
          // Restore selection if available
          if (savedRange) {
            try {
              const selection = window.getSelection();
              selection.removeAllRanges();
              selection.addRange(savedRange);
            } catch (error) {
              console.log('Failed to restore selection for rewrite:', error);
            }
          }
          
          // Clean up saved data
          if (window.staCurrentSelection) {
            delete window.staCurrentSelection;
          }
          if (window.staCurrentRange) {
            delete window.staCurrentRange;
          }
          
          // Insert the text and select it
          insertTextAtCursor(text);
          
          // Wait for text insertion, then select it and show rewrite popup
          setTimeout(() => {
            if (typeof selectLastInsertedText !== 'undefined') {
              selectLastInsertedText(text);
            }
            
            setTimeout(async () => {
              // Create a selection to get proper positioning for the popup
              const selection = window.getSelection();
              if (selection.rangeCount > 0) {
                try {
                  // Call real API to rewrite the text
                  if (typeof rewriteText !== 'undefined') {
                    const result = await rewriteText(text);
                    if (typeof showRewritePopup !== 'undefined') {
                      showRewritePopup(text, result.professional, result.casual);
                    }
                  }
                } catch (error) {
                  // If API fails, show error
                  if (typeof showErrorPopup !== 'undefined') {
                    showErrorPopup("Rewrite failed: " + error.message);
                  }
                }
              }
            }, 100);
          }, 50);
        }
      });

      btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'translateY(-1px)';
        btn.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translateY(0)';
        btn.style.boxShadow = 'none';
      });
    });
  }

  function showVoiceError(message) {
    resultsDiv.innerHTML = `
      <div style="text-align: center; color: #EF4444;">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style="margin-bottom: 12px;">
          <circle cx="12" cy="12" r="10" stroke="#EF4444" stroke-width="2"/>
          <path d="M15 9L9 15M9 9L15 15" stroke="#EF4444" stroke-width="2"/>
        </svg>
        <div>${message}</div>
      </div>
    `;
    
    // Protect dynamic content
    protectDynamicContent(resultsDiv);
  }
}

// ===== Voice Commands Detection =====
function detectVoiceCommand(transcript, language) {
  const text = transcript.toLowerCase();
  
  const commands = {
    'vi-VN': {
      'viết lại': 'rewrite',
      'sửa lỗi': 'correction', 
      'kiểm tra ngữ pháp': 'check',
      'chuyên nghiệp': 'professional',
      'thân thiện': 'casual'
    },
    'en-US': {
      'rewrite': 'rewrite',
      'rewrite this': 'rewrite',
      'fix grammar': 'correction',
      'check grammar': 'check',
      'make it professional': 'professional',
      'make it casual': 'casual'
    }
  };

  const langCommands = commands[language] || commands['en-US'];
  
  for (const [phrase, command] of Object.entries(langCommands)) {
    if (text.includes(phrase)) {
      return command;
    }
  }
  
  return null;
}

// ===== Execute Voice Commands =====
async function executeVoiceCommand(command, originalText) {
  // Functions are available globally
  
  // Get saved selection from when popup was opened
  const selectedText = window.staCurrentSelection || '';
  const savedRange = window.staCurrentRange;
  
  // Close voice popup without clearing selection
  closeVoicePopup(false, false);
  
  // Restore selection if we have a saved range
  if (savedRange) {
    try {
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(savedRange);
    } catch (error) {
      console.log('Failed to restore selection:', error);
    }
  }
  
  // Clean up saved data after restoration
  if (window.staCurrentSelection) {
    delete window.staCurrentSelection;
  }
  if (window.staCurrentRange) {
    delete window.staCurrentRange;
  }
  
  if (!selectedText) {
    showErrorPopup('Please select some text first before using voice commands');
    return;
  }

  // Set function and process
  chrome.storage.sync.set({ selectedFunction: command }, async () => {
    try {
      // Process with real API calls
      if (command === 'rewrite') {
        try {
          const result = await rewriteText(selectedText);
          showRewritePopup(selectedText, result.professional, result.casual);
        } catch (error) {
          showErrorPopup("Voice rewrite failed: " + error.message);
        }
      } else if (command === 'correction') {
        try {
          const result = await correctGrammar(selectedText);
          showCorrectionPopup(selectedText, result.corrected);
        } catch (error) {
          showErrorPopup("Voice correction failed: " + error.message);
        }
      } else if (command === 'check') {
        try {
          const result = await checkGrammar(selectedText);
          showGrammarCheckPopup(result.highlight_html, result.corrections);
        } catch (error) {
          showErrorPopup("Voice grammar check failed: " + error.message);
        }
      }
    } catch (error) {
      showErrorPopup("Voice command failed: " + error.message);
    }
  });
}

// ===== Translation functions =====
async function translateVietnameseToEnglish(text) {
  const resultsDiv = document.querySelector('#voice-results');
  
  // Show loading
  resultsDiv.innerHTML = `
    <div style="text-align: center;">
      <div style="margin-bottom: 16px;">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style="animation: spin 1s linear infinite;">
          <circle cx="12" cy="12" r="10" stroke="#10B981" stroke-width="2" stroke-dasharray="31.416" stroke-dashoffset="31.416">
            <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
            <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
          </circle>
        </svg>
      </div>
      <div style="color: #065F46; font-weight: 600;">Translating to English...</div>
    </div>
  `;
  
  protectDynamicContent(resultsDiv);

  try {
    const translatedText = await realTranslateAPI(text, 'vi', 'en');
    showTranslationResult(text, translatedText, 'vi-VN', 'en-US');
  } catch (error) {
    resultsDiv.innerHTML = `
      <div style="text-align: center; color: #EF4444;">
        <div>Translation failed. Please try again.</div>
      </div>
    `;
    protectDynamicContent(resultsDiv);
  }
}

async function translateEnglishToVietnamese(text) {
  const resultsDiv = document.querySelector('#voice-results');
  
  // Show loading
  resultsDiv.innerHTML = `
    <div style="text-align: center;">
      <div style="margin-bottom: 16px;">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style="animation: spin 1s linear infinite;">
          <circle cx="12" cy="12" r="10" stroke="#10B981" stroke-width="2" stroke-dasharray="31.416" stroke-dashoffset="31.416">
            <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
            <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
          </circle>
        </svg>
      </div>
      <div style="color: #065F46; font-weight: 600;">Translating to Vietnamese...</div>
    </div>
  `;
  
  protectDynamicContent(resultsDiv);

  try {
    const translatedText = await realTranslateAPI(text, 'en', 'vi');
    showTranslationResult(text, translatedText, 'en-US', 'vi-VN');
  } catch (error) {
    resultsDiv.innerHTML = `
      <div style="text-align: center; color: #EF4444;">
        <div>Translation failed. Please try again.</div>
      </div>
    `;
    protectDynamicContent(resultsDiv);
  }
}

function showTranslationResult(originalText, translatedText, fromLang, toLang) {
  const resultsDiv = document.querySelector('#voice-results');
  
  // Language labels
  const langLabels = {
    'vi-VN': 'Vietnamese',
    'en-US': 'English'
  };
  
  const originalLabel = langLabels[fromLang] + ' Original';
  const translatedLabel = langLabels[toLang] + ' Translation';
  
  resultsDiv.innerHTML = `
    <div style="text-align: left;">
      <div style="margin-bottom: 16px;">
        <label style="font-size: 12px; font-weight: 600; color: #6B7280; text-transform: uppercase;">${originalLabel}</label>
        <div style="
          margin-top: 6px; 
          padding: 12px 16px; 
          background: rgba(16, 185, 129, 0.1); 
          border: 1px solid rgba(16, 185, 129, 0.2);
          border-radius: 12px; 
          color: #065F46;
          border-left: 4px solid #10B981;
        ">"${originalText}"</div>
      </div>
      
      <div style="margin-bottom: 20px;">
        <label style="font-size: 12px; font-weight: 600; color: #6B7280; text-transform: uppercase;">${translatedLabel}</label>
        <div style="
          margin-top: 6px; 
          padding: 12px 16px; 
          background: rgba(59, 130, 246, 0.1); 
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 12px; 
          color: #1E40AF;
          border-left: 4px solid #3B82F6;
          font-weight: 500;
        ">"${translatedText}"</div>
      </div>
      
      <div style="display: flex; gap: 8px;">
        <button class="trans-action-btn" data-action="send-original" style="
          flex: 1;
          padding: 10px 16px;
          border: 2px solid #10B981;
          border-radius: 8px;
          background: rgba(16, 185, 129, 0.1);
          color: #065F46;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        ">📤 Send ${langLabels[fromLang]}</button>
        
        <button class="trans-action-btn" data-action="send-translation" style="
          flex: 1;
          padding: 10px 16px;
          border: 2px solid #3B82F6;
          border-radius: 8px;
          background: rgba(59, 130, 246, 0.1);
          color: #1E40AF;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        ">🌍 Send ${langLabels[toLang]}</button>
        
        <button class="trans-action-btn" data-action="rewrite-translation" style="
          flex: 1;
          padding: 10px 16px;
          border: 2px solid #7C3AED;
          border-radius: 8px;
          background: rgba(124, 58, 237, 0.1);
          color: #5B21B6;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        ">✨ Rewrite English</button>
      </div>
    </div>
  `;

  protectDynamicContent(resultsDiv);

  // Setup action buttons
  resultsDiv.querySelectorAll('.trans-action-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      if (action === 'send-original') {
        insertTextAtCursor(originalText);
        closeVoicePopup();
      } else if (action === 'send-translation') {
        insertTextAtCursor(translatedText);
        closeVoicePopup();
      } else if (action === 'rewrite-translation') {
        // Get saved selection before closing popup
        const savedRange = window.staCurrentRange;
        closeVoicePopup(false, false);
        
        // Restore selection if available
        if (savedRange) {
          try {
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(savedRange);
          } catch (error) {
            console.log('Failed to restore selection for rewrite:', error);
          }
        }
        
        // Clean up saved data
        if (window.staCurrentSelection) {
          delete window.staCurrentSelection;
        }
        if (window.staCurrentRange) {
          delete window.staCurrentRange;
        }
        
        // For English voice input, rewrite the original English text
        // For Vietnamese voice input, rewrite the translated English text
        const textToRewrite = (fromLang === 'en-US') ? originalText : translatedText;
        
        // Insert the text and select it
        insertTextAtCursor(textToRewrite);
        
        // Wait for text insertion, then select it and show rewrite popup
        setTimeout(() => {
          if (typeof selectLastInsertedText !== 'undefined') {
            selectLastInsertedText(textToRewrite);
          }
          
          setTimeout(async () => {
            // Create a selection to get proper positioning for the popup
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
              try {
                // Call real API to rewrite the text
                if (typeof rewriteText !== 'undefined') {
                  const result = await rewriteText(textToRewrite);
                  if (typeof showRewritePopup !== 'undefined') {
                    showRewritePopup(textToRewrite, result.professional, result.casual);
                  }
                }
              } catch (error) {
                // If API fails, show error
                if (typeof showErrorPopup !== 'undefined') {
                  showErrorPopup("Rewrite failed: " + error.message);
                }
              }
            }
          }, 100);
        }, 50);
      }
    });

    btn.addEventListener('mouseenter', () => {
      btn.style.transform = 'translateY(-1px)';
      btn.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translateY(0)';
      btn.style.boxShadow = 'none';
    });
  });
}



function closeVoicePopup(clearSelection = true, cleanupSavedData = true) {
  const popup = document.getElementById('sta-voice-popup');
  if (popup) {
    popup.style.animation = 'staSlideOut 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards';
    setTimeout(() => popup.remove(), 300);
  }
  
  // Clean up saved selection and range only if requested
  if (cleanupSavedData) {
    if (window.staCurrentSelection) {
      delete window.staCurrentSelection;
    }
    if (window.staCurrentRange) {
      delete window.staCurrentRange;
    }
  }
  
  // Only clear selection if explicitly requested (default behavior)
  if (clearSelection && window.getSelection) {
    window.getSelection().removeAllRanges();
  }
}

// ===== Text to Speech Popup =====
function showTextToSpeechPopup(selectedText) {
  const existing = document.getElementById("sta-tts-popup");
  if (existing) existing.remove();

  // Xóa trigger icon nếu có
  const triggerIcon = document.getElementById("sta-trigger-icon");
  if (triggerIcon) triggerIcon.remove();

  const div = document.createElement("div");
  div.id = "sta-tts-popup";
  
  // Use original centered position styling
  div.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2147483647;
    background: linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%);
    border: 2px solid #0EA5E9;
    border-radius: 24px;
    box-shadow: 0 20px 64px rgba(14, 165, 233, 0.12), 0 8px 32px rgba(0, 0, 0, 0.08);
    padding: 32px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #1F2937;
    width: 420px;
    max-height: min(70vh, 500px);
    overflow-y: auto;
    backdrop-filter: blur(16px);
    animation: staSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  `;
  
  // Apply lightweight protection
  protectPopupStyling(div);

  // Close button
  div.appendChild(createCloseButton("sta-tts-popup"));

  // Title với icon
  const title = document.createElement("div");
  title.innerHTML = `
    <div style="display: flex; align-items: center; margin-bottom: 20px;">
      <svg width="28" height="28" viewBox="0 0 16 16" fill="#0EA5E9" style="margin-right: 12px;">
        <path d="M8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7 3.582 7 8 7M8 16c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8"/>
        <path d="M6.271 5.055a.5.5 0 0 1 .52.045C7.5 5.555 8 6.258 8 7s-.5 1.445-1.209 1.9a.5.5 0 1 1-.582-.9C6.556 7.725 7 7.389 7 7s-.444-.725-.791-1a.5.5 0 0 1-.145-.945M4.271 3.055a.5.5 0 0 1 .52.045C6 4.056 7 5.353 7 7s-1 2.944-2.209 3.9a.5.5 0 1 1-.582-.9C5.444 9.394 6 8.592 6 7s-.556-2.394-1.791-3a.5.5 0 0 1-.145-.945"/>
      </svg>
      <span style="font-size: 20px; font-weight: 700; color: #0C4A6E;">Text to Speech</span>
    </div>
  `;
  div.appendChild(title);

  // Selected text preview
  const textPreview = document.createElement("div");
  textPreview.innerHTML = `
    <div style="margin-bottom: 24px;">
      <label style="font-size: 12px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.5px;">Selected Text</label>
      <div id="tts-text-display" style="
        margin-top: 6px; 
        padding: 12px 16px; 
        background: rgba(14, 165, 233, 0.08); 
        border: 1px solid rgba(14, 165, 233, 0.2);
        border-radius: 12px; 
        color: #0C4A6E;
        border-left: 4px solid #0EA5E9;
        max-height: 120px;
        overflow-y: auto;
        line-height: 1.5;
        font-size: 14px;
      ">${selectedText}</div>
    </div>
  `;
  div.appendChild(textPreview);

  // Language selection for TTS
  const languageSection = document.createElement("div");
  languageSection.innerHTML = `
    <div style="margin-bottom: 24px;">
      <label style="font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 12px; display: block;">Select Language</label>
      <div style="display: flex; gap: 12px;">
        <button class="tts-lang-btn" data-lang="en-US" style="
          flex: 1;
          padding: 12px 16px;
          border: 2px solid #D1D5DB;
          border-radius: 12px;
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        ">
          🇺🇸 English
        </button>
        <button class="tts-lang-btn" data-lang="vi-VN" style="
          flex: 1;
          padding: 12px 16px;
          border: 2px solid #D1D5DB;
          border-radius: 12px;
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        ">
          🇻🇳 Tiếng Việt
        </button>
      </div>
    </div>
  `;
  div.appendChild(languageSection);

  // Translation and Speech controls
  const speechControls = document.createElement("div");
  speechControls.innerHTML = `
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: flex; gap: 8px; justify-content: center; margin-bottom: 16px;">
        <button id="tts-translate-btn" style="
          padding: 10px 16px;
          border: none;
          border-radius: 10px;
          background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
          color: white;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 3px 8px rgba(59, 130, 246, 0.3);
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 600;
          font-size: 13px;
        ">
          🔄 Translate
        </button>
        
        <button id="tts-play-btn" style="
          padding: 10px 20px;
          border: none;
          border-radius: 10px;
          background: linear-gradient(135deg, #10B981 0%, #059669 100%);
          color: white;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 3px 8px rgba(16, 185, 129, 0.3);
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 600;
          font-size: 13px;
        ">
          ▶️ Play
        </button>
        
        <button id="tts-stop-btn" style="
          padding: 10px 16px;
          border: none;
          border-radius: 10px;
          background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
          color: white;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 3px 8px rgba(239, 68, 68, 0.3);
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 600;
          font-size: 13px;
        ">
          ⏹️ Stop
        </button>
      </div>
      
      <div id="tts-status" style="
        font-size: 14px;
        color: #6B7280;
        font-weight: 500;
        padding: 8px 16px;
        background: rgba(14, 165, 233, 0.08);
        border-radius: 8px;
        border: 1px solid rgba(14, 165, 233, 0.15);
      ">Ready to speak</div>
    </div>
  `;
  div.appendChild(speechControls);

  // Protect text elements from external CSS interference
  protectTextElements(div);

  document.body.appendChild(div);

  // Setup TTS functionality
  setupTextToSpeech(div, selectedText);
}

function setupTextToSpeech(popupElement, selectedText) {
  let selectedLanguage = 'en-US';
  let isPlaying = false;
  let currentText = selectedText;
  let currentUtterance = null;
  let wordElements = [];
  let currentWordIndex = 0;
  
  const translateBtn = popupElement.querySelector('#tts-translate-btn');
  const playBtn = popupElement.querySelector('#tts-play-btn');
  const stopBtn = popupElement.querySelector('#tts-stop-btn');
  const statusDiv = popupElement.querySelector('#tts-status');
  const langButtons = popupElement.querySelectorAll('.tts-lang-btn');
  const textDisplay = popupElement.querySelector('#tts-text-display');

  // Initialize with English selected
  langButtons[0].style.background = 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)';
  langButtons[0].style.color = 'white';
  langButtons[0].style.borderColor = '#2563EB';
  langButtons[0].style.boxShadow = '0 3px 8px rgba(59, 130, 246, 0.3)';

  // Language button handlers
  langButtons.forEach(btn => {
    // Add hover effects
    btn.addEventListener('mouseenter', () => {
      if (btn.dataset.lang !== selectedLanguage) {
        btn.style.transform = 'translateY(-1px)';
        btn.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
      }
    });
    
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translateY(0)';
      if (btn.dataset.lang !== selectedLanguage) {
        btn.style.boxShadow = 'none';
      }
    });
    
    btn.addEventListener('click', () => {
      selectedLanguage = btn.dataset.lang;
      
      // Update button styles
      langButtons.forEach(b => {
        b.style.background = 'white';
        b.style.color = '#374151';
        b.style.borderColor = '#D1D5DB';
        b.style.boxShadow = 'none';
      });
      
      btn.style.background = 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)';
      btn.style.color = 'white';
      btn.style.borderColor = '#2563EB';
      btn.style.boxShadow = '0 3px 8px rgba(59, 130, 246, 0.3)';
      
      updateStatus('Language switched to ' + (selectedLanguage === 'en-US' ? 'English' : 'Vietnamese'));
    });
  });

  // Add hover effects for control buttons
  [translateBtn, playBtn, stopBtn].forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      btn.style.transform = 'translateY(-1px)';
      btn.style.boxShadow = btn.style.boxShadow.replace('0 3px 8px', '0 6px 16px');
    });
    
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translateY(0)';
      btn.style.boxShadow = btn.style.boxShadow.replace('0 6px 16px', '0 3px 8px');
    });
  });

  // Translate button
  translateBtn.addEventListener('click', () => {
    const sourceLang = selectedLanguage === 'en-US' ? 'en' : 'vi';
    const targetLang = selectedLanguage === 'en-US' ? 'vi' : 'en';
    
    updateStatus('Translating...');
    translateText(currentText, sourceLang, targetLang)
      .then(translatedText => {
        currentText = translatedText;
        updateTextDisplay(translatedText);
        
        // Switch language selection automatically
        selectedLanguage = selectedLanguage === 'en-US' ? 'vi-VN' : 'en-US';
        langButtons.forEach(btn => {
          if (btn.dataset.lang === selectedLanguage) {
            btn.click();
          }
        });
        
        updateStatus('Translation completed');
      })
      .catch(error => {
        updateStatus('Translation failed: ' + error.message);
      });
  });

  // Play button
  playBtn.addEventListener('click', () => {
    speakText(currentText);
  });

  // Stop button
  stopBtn.addEventListener('click', () => {
    speechSynthesis.cancel();
    isPlaying = false;
    currentUtterance = null;
    updateStatus('Stopped');
    
    // Reset all highlights when stopped
    wordElements.forEach(el => {
      el.style.backgroundColor = 'transparent';
      el.style.color = '#0C4A6E';
      el.style.fontWeight = 'normal';
      el.style.transform = 'scale(1)';
      el.style.boxShadow = 'none';
    });
  });

  // Initialize text display with word wrapping
  function initializeTextDisplay(text) {
    // Split text into words while preserving spaces and punctuation
    const words = text.split(/(\s+|[.,!?;:])/);
    wordElements = [];
    textDisplay.innerHTML = '';
    
    words.forEach((word, index) => {
      if (word.trim()) {
        // Create span for actual words
        const span = document.createElement('span');
        span.textContent = word;
        span.id = `tts-word-${index}`;
        span.style.cssText = `
          transition: all 0.3s ease;
          border-radius: 3px;
          padding: 1px 2px;
          margin: 0;
        `;
        textDisplay.appendChild(span);
        wordElements.push(span);
      } else {
        // Add spaces/punctuation as text nodes
        textDisplay.appendChild(document.createTextNode(word));
      }
    });
  }

  // Highlight current word
  function highlightWord(index) {
    // Reset all highlights
    wordElements.forEach(el => {
      el.style.backgroundColor = 'transparent';
      el.style.color = '#0C4A6E';
      el.style.fontWeight = 'normal';
      el.style.transform = 'scale(1)';
      el.style.boxShadow = 'none';
    });
    
    // Highlight current word
    if (wordElements[index]) {
      wordElements[index].style.backgroundColor = '#FFD700';
      wordElements[index].style.color = '#B45309';
      wordElements[index].style.fontWeight = 'bold';
      wordElements[index].style.transform = 'scale(1.05)';
      wordElements[index].style.boxShadow = '0 2px 8px rgba(255, 215, 0, 0.3)';
      
      // Scroll into view if needed
      wordElements[index].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }

  // Initialize with current text
  initializeTextDisplay(currentText);

  function speakText(text) {
    // Stop any ongoing speech
    speechSynthesis.cancel();
    
    // Reset word highlighting
    currentWordIndex = 0;
    wordElements.forEach(el => {
      el.style.backgroundColor = 'transparent';
      el.style.color = '#0C4A6E';
      el.style.fontWeight = 'normal';
      el.style.transform = 'scale(1)';
      el.style.boxShadow = 'none';
    });
    
    // Create new utterance
    currentUtterance = new SpeechSynthesisUtterance(text);
    currentUtterance.lang = selectedLanguage;
    
    // Find appropriate voice
    const voices = speechSynthesis.getVoices();
    const langCode = selectedLanguage.split('-')[0];
    const voice = voices.find(v => v.lang.startsWith(langCode)) || voices[0];
    if (voice) {
      currentUtterance.voice = voice;
    }
    
    // Set speech parameters
    currentUtterance.rate = 1.0; // Normal speed
    currentUtterance.pitch = 1.0;
    currentUtterance.volume = 1.0;
    
    // Event listeners
    currentUtterance.onstart = () => {
      isPlaying = true;
      updateStatus('Speaking...');
      currentWordIndex = 0;
    };
    
    currentUtterance.onboundary = (event) => {
      // Highlight words based on character position
      if (event.name === 'word') {
        // Find which word corresponds to current character index
        let charCount = 0;
        let targetWordIndex = -1;
        
        for (let i = 0; i < wordElements.length; i++) {
          const wordText = wordElements[i].textContent;
          if (charCount <= event.charIndex && event.charIndex < charCount + wordText.length) {
            targetWordIndex = i;
            break;
          }
          charCount += wordText.length;
          
          // Account for spaces and punctuation between words
          let nextElement = wordElements[i].nextSibling;
          while (nextElement && nextElement.nodeType === Node.TEXT_NODE) {
            charCount += nextElement.textContent.length;
            nextElement = nextElement.nextSibling;
          }
        }
        
        if (targetWordIndex >= 0 && targetWordIndex < wordElements.length) {
          highlightWord(targetWordIndex);
          currentWordIndex = targetWordIndex;
        }
      }
    };
    
    currentUtterance.onend = () => {
      isPlaying = false;
      currentUtterance = null;
      updateStatus('Finished');
      
      // Reset all highlights after a short delay
      setTimeout(() => {
        wordElements.forEach(el => {
          el.style.backgroundColor = 'transparent';
          el.style.color = '#0C4A6E';
          el.style.fontWeight = 'normal';
          el.style.transform = 'scale(1)';
          el.style.boxShadow = 'none';
        });
      }, 1000);
    };
    
    currentUtterance.onerror = (event) => {
      updateStatus('Error: ' + event.error);
      isPlaying = false;
      // Reset highlights on error
      wordElements.forEach(el => {
        el.style.backgroundColor = 'transparent';
        el.style.color = '#0C4A6E';
        el.style.fontWeight = 'normal';
        el.style.transform = 'scale(1)';
        el.style.boxShadow = 'none';
      });
    };
    
    // Start speaking
    speechSynthesis.speak(currentUtterance);
    updateStatus('Starting...');
  }

  function updateStatus(message) {
    statusDiv.textContent = message;
  }

  function updateTextDisplay(text) {
    currentText = text;
    initializeTextDisplay(text);
  }

  // Translation function using global realTranslateAPI
  async function translateText(text, sourceLang, targetLang) {
    try {
      if (typeof realTranslateAPI !== 'undefined') {
        const translatedText = await realTranslateAPI(text, sourceLang, targetLang);
        return translatedText;
      } else {
        throw new Error('Translation API not available');
      }
    } catch (error) {
      throw error;
    }
  }
}

// ===== Export to global scope for browser extension =====
if (typeof window !== 'undefined') {
  window.showVoiceInputPopup = showVoiceInputPopup;
  window.showTextToSpeechPopup = showTextToSpeechPopup;
}