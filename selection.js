// ===== Text Selection and Icon Handling =====
// Functions will be available globally via script loading order in manifest.json

// Global variables for selection handling
let isMouseDown = false;

// ===== Event listeners để phát hiện khi bôi đen text =====
function initializeSelectionHandlers() {
  // Event khi bấm chuột xuống
  document.addEventListener("mousedown", () => {
    isMouseDown = true;
    
    // Xóa icon ngay khi bắt đầu bôi đen
    const oldIcon = document.getElementById("sta-trigger-icon");
    if (oldIcon) {
      oldIcon.remove();
    }
  });

  // Event khi thả chuột - chỉ event này mới hiện icon
  document.addEventListener("mouseup", (e) => {
    isMouseDown = false;
    
    // Delay nhỏ để đảm bảo selection đã ổn định
    setTimeout(() => {
      handleSelection(e);
    }, 100);
  });

  // Event khi dùng bàn phím để selection (Shift + Arrow keys)
  document.addEventListener("keyup", (e) => {
    // Chỉ xử lý khi là các phím selection
    if (e.shiftKey || e.key === "Shift" || (e.key.includes("Arrow") && e.shiftKey)) {
      setTimeout(() => {
        handleSelection();
      }, 100);
    }
  });

  // Event khi click để xóa icon nếu click ra ngoài
  document.addEventListener("click", (e) => {
    const icon = document.getElementById("sta-trigger-icon");
    
    // Kiểm tra xem có click vào popup không
    const clickedOnPopup = document.getElementById("sta-rewrite-popup")?.contains(e.target)
      || document.getElementById("sta-correction-popup")?.contains(e.target)
      || document.getElementById("sta-grammar-popup")?.contains(e.target)
      || document.getElementById("sta-reminder-popup")?.contains(e.target)
      || document.getElementById("sta-voice-popup")?.contains(e.target)
      || document.getElementById("sta-tts-popup")?.contains(e.target)
      || document.getElementById("sta-dictionary-popup")?.contains(e.target)
      || document.getElementById("sta-saved-words-popup")?.contains(e.target);
    
    // Nếu click vào icon thì bỏ qua
    if (icon && icon.contains(e.target)) {
      return;
    }
    
    // Nếu click vào popup thì bỏ qua
    if (clickedOnPopup) {
      return;
    }
    
    // Nếu click ra ngoài và có icon thì xóa icon
    if (icon && !icon.contains(e.target)) {
      const selectedText = window.getSelection().toString().trim();
      if (!selectedText) {
        icon.remove();
      }
    }
    
    // Nếu click ra ngoài và không có popup, kiểm tra có thể hiện icon không
    const anyPopup = document.getElementById("sta-rewrite-popup")
      || document.getElementById("sta-correction-popup")
      || document.getElementById("sta-grammar-popup")
      || document.getElementById("sta-reminder-popup")
      || document.getElementById("sta-voice-popup")
      || document.getElementById("sta-tts-popup")
      || document.getElementById("sta-dictionary-popup")
      || document.getElementById("sta-saved-words-popup");
      
    if (!anyPopup && !icon) {
      // Delay nhỏ để đảm bảo popup đã được xóa hoàn toàn
      setTimeout(() => {
        const selectedText = window.getSelection().toString().trim();
        if (selectedText && !document.getElementById("sta-trigger-icon")) {
          showTriggerIcon(selectedText);
        }
      }, 50);
    }
  });
}

function handleSelection(e) {
  // Kiểm tra xem có click vào popup hay icon không
  if (e && e.target) {
    const popupElement = document.getElementById("sta-rewrite-popup")
      || document.getElementById("sta-correction-popup")
      || document.getElementById("sta-grammar-popup")
      || document.getElementById("sta-voice-popup")
      || document.getElementById("sta-tts-popup")
      || document.getElementById("sta-dictionary-popup")
      || document.getElementById("sta-trigger-icon");

    if (popupElement && popupElement.contains(e.target)) {
      return;
    }
  }

  const selectedText = window.getSelection().toString().trim();
  
  if (!selectedText) {
    // Xóa icon cũ nếu không có text được chọn
    const oldIcon = document.getElementById("sta-trigger-icon");
    if (oldIcon) {
      oldIcon.remove();
    }
    return;
  }

  // Kiểm tra xem có popup nào đang hiển thị không
  const existingPopup = document.getElementById("sta-rewrite-popup")
    || document.getElementById("sta-correction-popup")
    || document.getElementById("sta-grammar-popup")
    || document.getElementById("sta-reminder-popup")
    || document.getElementById("sta-voice-popup")
    || document.getElementById("sta-tts-popup")
    || document.getElementById("sta-dictionary-popup")
    || document.getElementById("sta-saved-words-popup");

  if (existingPopup) {
    return;
  }

  // Chỉ hiện icon nếu không đang trong quá trình kéo chuột
  if (!isMouseDown) {
    showTriggerIcon(selectedText);
  }
}

// ===== Dictionary Icon for Single Word =====
function showDictionaryIcon(word, rect) {
  const icon = document.createElement("div");
  icon.id = "sta-trigger-icon";
  icon.title = "📖 Dictionary Lookup - Click to see definition";
  
  // Dictionary icon (purple theme)
  icon.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="#A855F7" stroke-width="2"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="#A855F7" stroke-width="2" fill="#FAF5FF"/>
      <path d="M8 7h8M8 11h8M8 15h5" stroke="#A855F7" stroke-width="1.5"/>
    </svg>
  `;
  
  // Position calculation
  const scrollX = window.scrollX || document.documentElement.scrollLeft;
  const scrollY = window.scrollY || document.documentElement.scrollTop;
  
  const iconTop = rect.bottom + scrollY + 8;
  const iconLeft = Math.max(8, rect.left + scrollX);

  icon.style.cssText = `
    position: absolute;
    top: ${iconTop}px;
    left: ${iconLeft}px;
    background: linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 100%);
    border: 2px solid #A855F7;
    border-radius: 16px;
    padding: 10px;
    cursor: pointer;
    z-index: 2147483647;
    box-shadow: 0 8px 24px rgba(168, 85, 247, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    user-select: none;
    pointer-events: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 44px;
    min-height: 44px;
    backdrop-filter: blur(10px);
  `;

  // Hover effects
  icon.addEventListener("mouseenter", (e) => {
    icon.style.transform = "scale(1.1) translateY(-2px)";
    icon.style.boxShadow = "0 12px 32px rgba(168, 85, 247, 0.25), 0 8px 16px rgba(0, 0, 0, 0.15)";
    icon.style.borderColor = "#7C3AED";
  });

  icon.addEventListener("mouseleave", (e) => {
    icon.style.transform = "scale(1) translateY(0)";
    icon.style.boxShadow = "0 8px 24px rgba(168, 85, 247, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1)";
    icon.style.borderColor = "#A855F7";
  });

  icon.addEventListener("mousedown", (e) => {
    e.preventDefault();
    e.stopPropagation();
    icon.style.transform = "scale(0.95) translateY(1px)";
  });

  // Click handler for dictionary lookup
  icon.addEventListener("click", async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Immediately remove icon with fade out effect
    icon.style.animation = "staSlideOut 0.2s ease-out forwards";
    setTimeout(() => {
      if (icon.parentNode) icon.remove();
    }, 200);
    
    // Call dictionary function
    if (typeof handleDictionaryLookup !== 'undefined') {
      handleDictionaryLookup(word);
    }
  });

  // Touch support
  icon.addEventListener("touchstart", (e) => {
    e.preventDefault();
    e.stopPropagation();
    icon.click();
  });

  document.body.appendChild(icon);
}

// ===== Hiện icon kế bên đoạn bôi đen =====
function showTriggerIcon(selectionText) {
  // Kiểm tra xem có popup nào đang mở không - không hiện icon nếu có popup
  const anyPopup = document.getElementById("sta-rewrite-popup")
    || document.getElementById("sta-correction-popup")
    || document.getElementById("sta-grammar-popup")
    || document.getElementById("sta-reminder-popup")
    || document.getElementById("sta-voice-popup")
    || document.getElementById("sta-tts-popup")
    || document.getElementById("sta-dictionary-popup")
    || document.getElementById("sta-saved-words-popup");
    
  if (anyPopup) {
    return;
  }

  // Xoá icon cũ nếu có
  const old = document.getElementById("sta-trigger-icon");
  if (old) {
    old.remove();
  }

  const selection = window.getSelection();
  if (!selection.rangeCount) {
    return;
  }
  
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();

  // Kiểm tra xem rect có hợp lệ không
  if (rect.width === 0 && rect.height === 0) {
    return;
  }

  // Check if selection is a single word
  const words = selectionText.split(/\s+/).filter(word => word.trim());
  const isSingleWord = words.length === 1 && selectionText.length > 0;

  if (isSingleWord) {
    // Show dictionary icon for single word
    showDictionaryIcon(selectionText, rect);
    return;
  }

  // Continue with normal Smart Text Assistant icon for multiple words

  const icon = document.createElement("div");
  icon.id = "sta-trigger-icon";
  icon.title = "Smart Text Assistant ✨ Click to process text";
  
  // Lấy function đã chọn để hiển thị icon phù hợp
  chrome.storage.sync.get("selectedFunction", ({ selectedFunction }) => {
    icon.innerHTML = getIconForFunction(selectedFunction);
    
    // Tính toán vị trí tốt hơn
    const scrollX = window.scrollX || document.documentElement.scrollLeft;
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    
    const iconTop = rect.bottom + scrollY + 8;
    const iconLeft = Math.max(8, rect.left + scrollX);

    icon.style.cssText = `
      position: absolute;
      top: ${iconTop}px;
      left: ${iconLeft}px;
      background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
      border: 2px solid #4A90E2;
      border-radius: 16px;
      padding: 10px;
      cursor: pointer;
      z-index: 2147483647;
      box-shadow: 0 8px 24px rgba(74, 144, 226, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      user-select: none;
      pointer-events: auto;
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 44px;
      min-height: 44px;
      backdrop-filter: blur(10px);
    `;

    // Event listeners với improved styling
    icon.addEventListener("mouseenter", (e) => {
      icon.style.transform = "scale(1.1) translateY(-2px)";
      icon.style.boxShadow = "0 12px 32px rgba(74, 144, 226, 0.25), 0 8px 16px rgba(0, 0, 0, 0.15)";
      icon.style.borderColor = "#357ABD";
    });

    icon.addEventListener("mouseleave", (e) => {
      icon.style.transform = "scale(1) translateY(0)";
      icon.style.boxShadow = "0 8px 24px rgba(74, 144, 226, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1)";
      icon.style.borderColor = "#4A90E2";
    });

    icon.addEventListener("mousedown", (e) => {
      e.preventDefault();
      e.stopPropagation();
      icon.style.transform = "scale(0.95) translateY(1px)";
    });

    icon.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Hiển thị loading animation
      showLoadingState(icon);
      
      // Lấy chức năng đã chọn
      chrome.storage.sync.get("selectedFunction", async ({ selectedFunction }) => {
        try {
          if (!selectedFunction) {
            if (typeof showReminderPopup !== 'undefined') {
        showReminderPopup();
      }
            icon.remove();
            return;
          }

          // Xoá icon ngay khi click để popup có thể hiển thị
          icon.remove();

          // ==== Check for voice input function ====
          if (selectedFunction === "voice") {
            // Đảm bảo icon được remove trước khi hiển thị popup
            const iconToRemove = document.getElementById("sta-trigger-icon");
            if (iconToRemove) iconToRemove.remove();
            if (typeof showVoiceInputPopup !== 'undefined') {
              showVoiceInputPopup();
            }
            return;
          }

          // ==== Check for text to speech function ====
          if (selectedFunction === "tts") {
            // Đảm bảo icon được remove trước khi hiển thị popup
            const iconToRemove = document.getElementById("sta-trigger-icon");
            if (iconToRemove) iconToRemove.remove();
            if (typeof showTextToSpeechPopup !== 'undefined') {
              showTextToSpeechPopup(selectionText);
            }
            return;
          }

          // ==== Process with real API calls ====
          // Functions are available globally
          
          if (selectedFunction === "rewrite") {
            try {
              const result = await rewriteText(selectionText);
              showRewritePopup(selectionText, result.professional, result.casual);
            } catch (error) {
              showErrorPopup("Rewrite failed: " + error.message);
            }
          }

          if (selectedFunction === "correction") {
            try {
              const result = await correctGrammar(selectionText);
              showCorrectionPopup(selectionText, result.corrected);
            } catch (error) {
              showErrorPopup("Grammar correction failed: " + error.message);
            }
          }

          if (selectedFunction === "check") {
            try {
              const result = await checkGrammar(selectionText);
              showGrammarCheckPopup(result.highlight_html, result.corrections);
            } catch (error) {
              showErrorPopup("Grammar check failed: " + error.message);
            }
          }
        } catch (error) {
          icon.remove();
          if (typeof showErrorPopup !== 'undefined') {
            showErrorPopup("An error occurred: " + error.message);
          }
        }
      });
    });

    // Touch support
    icon.addEventListener("touchstart", (e) => {
      e.preventDefault();
      e.stopPropagation();
      icon.click();
    });

    document.body.appendChild(icon);
    
    // Entrance animation
    icon.style.opacity = "0";
    icon.style.transform = "scale(0.6) translateY(-10px)";
    
    setTimeout(() => {
      icon.style.opacity = "1";
      icon.style.transform = "scale(1) translateY(0)";
    }, 10);
  });
}

// ===== Keyboard Shortcuts =====
function initializeKeyboardShortcuts() {
  document.addEventListener('keydown', async (event) => {
    // Ctrl+Shift+V: Open Voice Input
    if (event.ctrlKey && event.shiftKey && event.key === 'V') {
      event.preventDefault();
      // Xóa icon nếu có
      const existingIcon = document.getElementById("sta-trigger-icon");
      if (existingIcon) existingIcon.remove();
      if (typeof showVoiceInputPopup !== 'undefined') {
        showVoiceInputPopup();
      }
    }
    
    // Ctrl+Shift+T: Open Function Chooser
    if (event.ctrlKey && event.shiftKey && event.key === 'T') {
      event.preventDefault();
      // Execute popup.js script
      const script = document.createElement('script');
      script.src = chrome.runtime.getURL('popup.js');
      document.head.appendChild(script);
      script.onload = () => script.remove();
    }
  });
}

// ===== Export to global scope for browser extension =====
if (typeof window !== 'undefined') {
  window.initializeSelectionHandlers = initializeSelectionHandlers;
  window.initializeKeyboardShortcuts = initializeKeyboardShortcuts;
}