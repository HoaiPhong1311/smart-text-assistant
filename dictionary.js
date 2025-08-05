// ===== Dictionary Lookup and Saved Words Management =====
// Functions will be available globally via script loading order in manifest.json

// ===== Dictionary lookup handler =====
async function handleDictionaryLookup(word) {
  if (!word || word.length === 0) {
    if (typeof showErrorPopup !== 'undefined') {
      showErrorPopup("Please select a word first");
    }
    return;
  }

  // Show loading state
  const loadingDiv = document.createElement("div");
  loadingDiv.id = "sta-dictionary-loading";
  loadingDiv.innerHTML = `
    <div style="
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 2147483647;
      background: rgba(168, 85, 247, 0.9);
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      font-weight: 600;
      backdrop-filter: blur(10px);
    ">
      <div style="display: flex; align-items: center; gap: 8px;">
        <div style="
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s linear infinite;
        "></div>
        Looking up "${word}"...
      </div>
    </div>
  `;
  
  // Add spinning animation
  const spinStyle = document.createElement("style");
  spinStyle.innerHTML = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  if (!document.getElementById("sta-spin-animation")) {
    spinStyle.id = "sta-spin-animation";
    document.head.appendChild(spinStyle);
  }
  
  document.body.appendChild(loadingDiv);

  try {
    const definitions = await lookupWord(word);
    loadingDiv.remove();
    showDictionaryPopup(word, definitions);
  } catch (error) {
    loadingDiv.remove();
    if (typeof showErrorPopup !== 'undefined') {
      showErrorPopup(`Dictionary lookup failed: ${error.message}`);
    }
  }
}

// ===== Mini Dictionary =====
function showDictionaryPopup(word, definitions) {
  const existing = document.getElementById("sta-dictionary-popup");
  if (existing) existing.remove();

  // Xóa trigger icon nếu có
  const triggerIcon = document.getElementById("sta-trigger-icon");
  if (triggerIcon) triggerIcon.remove();

  const div = document.createElement("div");
  div.id = "sta-dictionary-popup";
  
  // Use centered position styling like Voice Input
  div.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2147483647;
    background: linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 100%);
    border: 2px solid #A855F7;
    border-radius: 24px;
    box-shadow: 0 20px 64px rgba(168, 85, 247, 0.15), 0 8px 32px rgba(0, 0, 0, 0.1);
    padding: 24px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #1F2937;
    width: 380px;
    max-height: min(65vh, 400px);
    overflow-y: auto;
    backdrop-filter: blur(16px);
    animation: staSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  `;
  
  // Apply lightweight protection
  protectPopupStyling(div);

  // Close button
  div.appendChild(createCloseButton("sta-dictionary-popup"));

  // Title with word
  const title = document.createElement("div");
  title.innerHTML = `
         <div style="display: flex; align-items: center; margin-bottom: 16px;">
       <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style="margin-right: 10px;">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="#A855F7" stroke-width="2"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="#A855F7" stroke-width="2" fill="#FAF5FF"/>
        <path d="M8 7h8M8 11h8M8 15h5" stroke="#A855F7" stroke-width="1.5"/>
      </svg>
      <div>
                 <span style="font-size: 18px; font-weight: 700; color: #7C3AED;">Dictionary</span>
        <div style="font-size: 14px; color: #6B7280; font-weight: 500;">"${word}"</div>
      </div>
    </div>
     `;
   div.appendChild(title);

   // Add pronunciation and usage section
   const controlsDiv = document.createElement("div");
   controlsDiv.innerHTML = `
     <div style="
       background: rgba(168, 85, 247, 0.08);
       border: 1px solid rgba(168, 85, 247, 0.2);
       border-radius: 12px;
       padding: 12px;
       margin-bottom: 16px;
       display: flex;
       align-items: center;
       justify-content: space-between;
     ">
       <div style="
         font-size: 12px;
         color: #7C3AED;
         font-weight: 500;
       ">
         💡 <strong>Tip:</strong> Click 🔊 to hear pronunciation
       </div>
       <div style="display: flex; gap: 8px;">
         <button id="dict-pronounce-btn" style="
           padding: 8px 12px;
           border: none;
           border-radius: 8px;
           background: linear-gradient(135deg, #A855F7 0%, #7C3AED 100%);
           color: white;
           cursor: pointer;
           font-size: 12px;
           font-weight: 600;
           display: flex;
           align-items: center;
           gap: 6px;
           transition: all 0.2s ease;
         ">
           🔊 Pronounce
         </button>
         
         <button id="dict-save-btn" style="
           padding: 8px 12px;
           border: none;
           border-radius: 8px;
           background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
           color: white;
           cursor: pointer;
           font-size: 12px;
           font-weight: 600;
           display: flex;
           align-items: center;
           gap: 6px;
           transition: all 0.2s ease;
         ">
           ⭐ Save
         </button>
       </div>
     </div>
   `;
   div.appendChild(controlsDiv);

   // Add click handler for pronunciation
   const pronounceBtn = controlsDiv.querySelector('#dict-pronounce-btn');
   pronounceBtn.addEventListener('click', (e) => {
     e.preventDefault();
     e.stopPropagation();
     speakDictionaryWord(word);
   });

   // Add click handler for save
   const saveBtn = controlsDiv.querySelector('#dict-save-btn');
   saveBtn.addEventListener('click', (e) => {
     e.preventDefault();
     e.stopPropagation();
     saveWordToDictionary(word, definitions, saveBtn);
   });

   // Prevent selection events on button
   pronounceBtn.addEventListener('mousedown', (e) => {
     e.preventDefault();
     e.stopPropagation();
   });

   pronounceBtn.addEventListener('mouseup', (e) => {
     e.preventDefault();
     e.stopPropagation();
   });

   // Hover effects for pronunciation button
   pronounceBtn.addEventListener('mouseenter', () => {
     pronounceBtn.style.transform = 'scale(1.05)';
     pronounceBtn.style.boxShadow = '0 4px 12px rgba(168, 85, 247, 0.3)';
   });

   pronounceBtn.addEventListener('mouseleave', () => {
     pronounceBtn.style.transform = 'scale(1)';
     pronounceBtn.style.boxShadow = 'none';
   });

   // Hover effects for save button
   saveBtn.addEventListener('mouseenter', () => {
     saveBtn.style.transform = 'scale(1.05)';
     saveBtn.style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.3)';
   });

   saveBtn.addEventListener('mouseleave', () => {
     saveBtn.style.transform = 'scale(1)';
     saveBtn.style.boxShadow = 'none';
   });

   // Prevent selection events on save button
   saveBtn.addEventListener('mousedown', (e) => {
     e.preventDefault();
     e.stopPropagation();
   });

   saveBtn.addEventListener('mouseup', (e) => {
     e.preventDefault();
     e.stopPropagation();
   });

   // Create definitions content
  if (definitions && definitions.length > 0) {
    definitions.forEach((entry, entryIndex) => {
      // Word pronunciation if available
      if (entry.phonetics && entry.phonetics.length > 0) {
        const phoneticDiv = document.createElement("div");
        const phonetic = entry.phonetics.find(p => p.text) || entry.phonetics[0];
        
        phoneticDiv.innerHTML = `
          <div style="
            margin-bottom: 16px;
            padding: 8px 12px;
            background: rgba(168, 85, 247, 0.08);
            border: 1px solid rgba(168, 85, 247, 0.2);
            border-radius: 8px;
            font-family: monospace;
            font-size: 16px;
            color: #7C3AED;
            text-align: center;
          ">
            <strong>Pronunciation:</strong> ${phonetic.text || 'N/A'}
          </div>
        `;
        div.appendChild(phoneticDiv);
      }

      // Meanings
      if (entry.meanings && entry.meanings.length > 0) {
        entry.meanings.forEach((meaning, meaningIndex) => {
          const meaningDiv = document.createElement("div");
          meaningDiv.style.cssText = `
            margin-bottom: 20px;
            padding: 16px;
            background: rgba(255, 255, 255, 0.7);
            border: 1px solid rgba(168, 85, 247, 0.15);
            border-radius: 12px;
          `;

          // Part of speech
          const partOfSpeech = document.createElement("div");
          partOfSpeech.innerHTML = `
            <div style="
              display: inline-block;
              padding: 4px 12px;
              background: linear-gradient(135deg, #A855F7 0%, #7C3AED 100%);
              color: white;
              border-radius: 20px;
              font-size: 12px;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 12px;
            ">${meaning.partOfSpeech}</div>
          `;
          meaningDiv.appendChild(partOfSpeech);

          // Definitions
          if (meaning.definitions && meaning.definitions.length > 0) {
            meaning.definitions.slice(0, 3).forEach((def, defIndex) => { // Show max 3 definitions per part of speech
              const defDiv = document.createElement("div");
              defDiv.style.cssText = `
                margin-bottom: 12px;
                padding-left: 16px;
                border-left: 3px solid #A855F7;
              `;

              defDiv.innerHTML = `
                <div style="
                  font-size: 14px;
                  color: #374151;
                  line-height: 1.6;
                  margin-bottom: 6px;
                ">
                  <strong>${defIndex + 1}.</strong> ${def.definition}
                </div>
                ${def.example ? `
                  <div style="
                    font-size: 13px;
                    color: #6B7280;
                    font-style: italic;
                    margin-left: 16px;
                  ">
                    <strong>Example:</strong> "${def.example}"
                  </div>
                ` : ''}
              `;
              
              meaningDiv.appendChild(defDiv);
            });
          }

          div.appendChild(meaningDiv);
        });
      }
    });
  } else {
    // No definitions found
    const noDefDiv = document.createElement("div");
    noDefDiv.innerHTML = `
      <div style="
        text-align: center;
        padding: 40px 20px;
        color: #6B7280;
      ">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style="margin-bottom: 16px; opacity: 0.5;">
          <circle cx="12" cy="12" r="10" stroke="#A855F7" stroke-width="2"/>
          <path d="M12 8v4M12 16h.01" stroke="#A855F7" stroke-width="2"/>
        </svg>
        <div style="font-size: 16px; font-weight: 600; margin-bottom: 8px;">
          Word not found
        </div>
        <div style="font-size: 14px;">
          No definition available for "${word}"
        </div>
      </div>
    `;
    div.appendChild(noDefDiv);
  }

  // Protect text elements from external CSS interference
  protectTextElements(div);
  
  document.body.appendChild(div);
}

// Dictionary word pronunciation
function speakDictionaryWord(word) {
  // Stop any ongoing speech
  speechSynthesis.cancel();
  
  // Create utterance for the word
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = 'en-US'; // Default to English since it's an English dictionary
  utterance.rate = 0.8; // Slightly slower for clarity
  utterance.pitch = 1.0;
  utterance.volume = 1.0;
  
  // Find appropriate English voice
  const voices = speechSynthesis.getVoices();
  const englishVoice = voices.find(v => v.lang.startsWith('en')) || voices[0];
  if (englishVoice) {
    utterance.voice = englishVoice;
  }
  
  // Update button state during pronunciation
  const pronounceBtn = document.getElementById('dict-pronounce-btn');
  if (pronounceBtn) {
    const originalContent = pronounceBtn.innerHTML;
    
    utterance.onstart = () => {
      pronounceBtn.innerHTML = '🔇 Speaking...';
      pronounceBtn.style.background = 'linear-gradient(135deg, #10B981 0%, #059669 100%)';
      pronounceBtn.disabled = true;
    };
    
    utterance.onend = () => {
      pronounceBtn.innerHTML = originalContent;
      pronounceBtn.style.background = 'linear-gradient(135deg, #A855F7 0%, #7C3AED 100%)';
      pronounceBtn.disabled = false;
    };
    
    utterance.onerror = () => {
      pronounceBtn.innerHTML = originalContent;
      pronounceBtn.style.background = 'linear-gradient(135deg, #A855F7 0%, #7C3AED 100%)';
      pronounceBtn.disabled = false;
    };
  }
  
  // Speak the word
  speechSynthesis.speak(utterance);
}

// ===== Saved Words Management =====
async function saveWordToDictionary(word, definitions, buttonElement) {
  try {
    // Check if word already saved
    const isAlreadySaved = await isWordSaved(word);
    if (isAlreadySaved) {
      // Update button to show already saved
      buttonElement.innerHTML = '✅ Saved';
      buttonElement.style.background = 'linear-gradient(135deg, #10B981 0%, #059669 100%)';
      
      setTimeout(() => {
        buttonElement.innerHTML = '⭐ Save';
        buttonElement.style.background = 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)';
      }, 2000);
      return;
    }

    // Get current saved words
    const savedWords = await getSavedWords();
    
    // Create new word entry
    const wordEntry = {
      word: word.toLowerCase().trim(),
      definitions: definitions,
      savedAt: Date.now(),
      pronunciation: extractPronunciation(definitions)
    };
    
    // Add to beginning of array (newest first)
    savedWords.unshift(wordEntry);
    
    // Save to storage (limit to 100 words)
    const limitedWords = savedWords.slice(0, 100);
    await chrome.storage.local.set({ savedWords: limitedWords });
    
    // Update button with success feedback
    buttonElement.innerHTML = '✅ Saved!';
    buttonElement.style.background = 'linear-gradient(135deg, #10B981 0%, #059669 100%)';
    buttonElement.disabled = true;
    
    // Reset button after 2 seconds
    setTimeout(() => {
      buttonElement.innerHTML = '⭐ Save';
      buttonElement.style.background = 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)';
      buttonElement.disabled = false;
    }, 2000);
    
  } catch (error) {
    console.error('Failed to save word:', error);
    
    // Show error feedback
    buttonElement.innerHTML = '❌ Error';
    buttonElement.style.background = 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)';
    
    setTimeout(() => {
      buttonElement.innerHTML = '⭐ Save';
      buttonElement.style.background = 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)';
    }, 2000);
  }
}

async function getSavedWords() {
  try {
    const result = await chrome.storage.local.get(['savedWords']);
    return result.savedWords || [];
  } catch (error) {
    console.error('Failed to get saved words:', error);
    return [];
  }
}

async function isWordSaved(word) {
  try {
    const savedWords = await getSavedWords();
    return savedWords.some(savedWord => savedWord.word === word.toLowerCase().trim());
  } catch (error) {
    console.error('Failed to check if word is saved:', error);
    return false;
  }
}

function extractPronunciation(definitions) {
  if (!definitions || !definitions.length) return null;
  
  for (const entry of definitions) {
    if (entry.phonetics && entry.phonetics.length > 0) {
      const phonetic = entry.phonetics.find(p => p.text) || entry.phonetics[0];
      if (phonetic && phonetic.text) {
        return phonetic.text;
      }
    }
  }
  return null;
}

async function removeSavedWord(word) {
  try {
    const savedWords = await getSavedWords();
    const filteredWords = savedWords.filter(savedWord => savedWord.word !== word.toLowerCase().trim());
    await chrome.storage.local.set({ savedWords: filteredWords });
    return true;
  } catch (error) {
    console.error('Failed to remove word:', error);
    return false;
  }
}

// ===== Saved Words Popup =====
async function showSavedWordsPopup() {
  const existing = document.getElementById("sta-saved-words-popup");
  if (existing) existing.remove();

  // Get saved words
  const savedWords = await getSavedWords();

  const div = document.createElement("div");
  div.id = "sta-saved-words-popup";
  
  // Use centered position styling like other popups
  div.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2147483647;
    background: linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%);
    border: 2px solid #F59E0B;
    border-radius: 24px;
    box-shadow: 0 20px 64px rgba(245, 158, 11, 0.15), 0 8px 32px rgba(0, 0, 0, 0.1);
    padding: 24px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #1F2937;
    width: 450px;
    max-height: min(70vh, 500px);
    overflow-y: auto;
    backdrop-filter: blur(16px);
    animation: staSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  `;
  
  // Apply lightweight protection
  protectPopupStyling(div);

  // Close button
  div.appendChild(createCloseButton("sta-saved-words-popup"));

  // Title with count
  const title = document.createElement("div");
  title.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
      <div style="display: flex; align-items: center;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style="margin-right: 10px;">
          <path d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z" stroke="#F59E0B" stroke-width="2" fill="#FFFBEB"/>
          <path d="M9 7H15M9 11H13" stroke="#F59E0B" stroke-width="2"/>
        </svg>
        <div>
          <span style="font-size: 18px; font-weight: 700; color: #D97706;">Saved Words</span>
          <div style="font-size: 13px; color: #6B7280; font-weight: 500;">${savedWords.length} words saved</div>
        </div>
      </div>
      ${savedWords.length > 0 ? `
        <button id="clear-all-btn" style="
          padding: 6px 12px;
          border: none;
          border-radius: 8px;
          background: rgba(239, 68, 68, 0.1);
          color: #DC2626;
          cursor: pointer;
          font-size: 12px;
          font-weight: 600;
          transition: all 0.2s ease;
        ">
          🗑️ Clear All
        </button>
      ` : ''}
    </div>
  `;
  div.appendChild(title);

  // Add clear all functionality
  if (savedWords.length > 0) {
    const clearAllBtn = title.querySelector('#clear-all-btn');
    clearAllBtn.addEventListener('click', async () => {
      if (confirm('Are you sure you want to clear all saved words?')) {
        await chrome.storage.local.set({ savedWords: [] });
        showSavedWordsPopup(); // Refresh popup
      }
    });

    clearAllBtn.addEventListener('mouseenter', () => {
      clearAllBtn.style.background = 'rgba(239, 68, 68, 0.2)';
    });

    clearAllBtn.addEventListener('mouseleave', () => {
      clearAllBtn.style.background = 'rgba(239, 68, 68, 0.1)';
    });
  }

  // Words list container
  const wordsContainer = document.createElement("div");
  
  if (savedWords.length === 0) {
    // Empty state
    wordsContainer.innerHTML = `
      <div style="
        text-align: center;
        padding: 60px 20px;
        color: #6B7280;
      ">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" style="margin-bottom: 16px; opacity: 0.3;">
          <path d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z" stroke="#F59E0B" stroke-width="2"/>
          <path d="M9 7H15M9 11H13" stroke="#F59E0B" stroke-width="2"/>
        </svg>
        <div style="font-size: 18px; font-weight: 600; margin-bottom: 8px; color: #D97706;">
          No words saved yet
        </div>
        <div style="font-size: 14px; line-height: 1.5;">
          Start building your vocabulary by saving words from the dictionary!<br>
          Select any word and look it up to save it.
        </div>
      </div>
    `;
  } else {
    // Render saved words
    savedWords.forEach((wordEntry, index) => {
      const wordCard = createSavedWordCard(wordEntry, index);
      wordsContainer.appendChild(wordCard);
    });
  }

  div.appendChild(wordsContainer);

  // Protect text elements from external CSS interference
  protectTextElements(div);
  
  document.body.appendChild(div);
}

function createSavedWordCard(wordEntry, index) {
  const card = document.createElement("div");
  card.style.cssText = `
    margin-bottom: 16px;
    padding: 16px;
    background: rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(245, 158, 11, 0.2);
    border-radius: 12px;
    transition: all 0.2s ease;
    cursor: pointer;
  `;

  // Get first definition for preview
  const firstDefinition = wordEntry.definitions?.[0]?.meanings?.[0]?.definitions?.[0]?.definition || 'No definition available';
  const partOfSpeech = wordEntry.definitions?.[0]?.meanings?.[0]?.partOfSpeech || '';

  card.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
      <div style="flex: 1;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
          <span style="font-size: 16px; font-weight: 700; color: #D97706;">${wordEntry.word}</span>
          ${wordEntry.pronunciation ? `<span style="font-size: 12px; color: #6B7280; font-family: monospace;">${wordEntry.pronunciation}</span>` : ''}
          ${partOfSpeech ? `<span style="background: #F59E0B; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 600;">${partOfSpeech}</span>` : ''}
        </div>
        <div style="font-size: 13px; color: #374151; line-height: 1.4;">
          ${firstDefinition.length > 80 ? firstDefinition.substring(0, 80) + '...' : firstDefinition}
        </div>
        <div style="font-size: 11px; color: #9CA3AF; margin-top: 4px;">
          Saved ${new Date(wordEntry.savedAt).toLocaleDateString()}
        </div>
      </div>
      <div style="display: flex; gap: 4px; margin-left: 12px;">
        <button class="word-action-btn" data-action="pronounce" data-word="${wordEntry.word}" style="
          padding: 6px 8px;
          border: none;
          border-radius: 6px;
          background: rgba(245, 158, 11, 0.1);
          color: #D97706;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.2s ease;
        ">🔊</button>
        <button class="word-action-btn" data-action="view" data-word="${wordEntry.word}" style="
          padding: 6px 8px;
          border: none;
          border-radius: 6px;
          background: rgba(59, 130, 246, 0.1);
          color: #3B82F6;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.2s ease;
        ">👁️</button>
        <button class="word-action-btn" data-action="remove" data-word="${wordEntry.word}" style="
          padding: 6px 8px;
          border: none;
          border-radius: 6px;
          background: rgba(239, 68, 68, 0.1);
          color: #EF4444;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.2s ease;
        ">🗑️</button>
      </div>
    </div>
  `;

  // Add hover effects
  card.addEventListener('mouseenter', () => {
    card.style.background = 'rgba(255, 255, 255, 0.95)';
    card.style.borderColor = 'rgba(245, 158, 11, 0.3)';
    card.style.transform = 'translateY(-1px)';
    card.style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.15)';
  });

  card.addEventListener('mouseleave', () => {
    card.style.background = 'rgba(255, 255, 255, 0.8)';
    card.style.borderColor = 'rgba(245, 158, 11, 0.2)';
    card.style.transform = 'translateY(0)';
    card.style.boxShadow = 'none';
  });

  // Add action button handlers
  const actionButtons = card.querySelectorAll('.word-action-btn');
  actionButtons.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const action = btn.dataset.action;
      const word = btn.dataset.word;

      if (action === 'pronounce') {
        speakDictionaryWord(word);
      } else if (action === 'view') {
        // Close saved words popup and show dictionary
        document.getElementById("sta-saved-words-popup")?.remove();
        const definitions = wordEntry.definitions;
        showDictionaryPopup(word, definitions);
      } else if (action === 'remove') {
        if (confirm(`Remove "${word}" from saved words?`)) {
          await removeSavedWord(word);
          showSavedWordsPopup(); // Refresh popup
        }
      }
    });

    // Hover effects for action buttons
    btn.addEventListener('mouseenter', () => {
      btn.style.transform = 'scale(1.1)';
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'scale(1)';
    });
  });

  return card;
}

// ===== Export to global scope for browser extension =====
if (typeof window !== 'undefined') {
  window.handleDictionaryLookup = handleDictionaryLookup;
  window.showSavedWordsPopup = showSavedWordsPopup;
}