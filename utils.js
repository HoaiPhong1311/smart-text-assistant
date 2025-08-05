// ===== Utility Functions =====

// ===== Loading state animation =====
function showLoadingState(iconElement) {
  if (typeof ICONS !== 'undefined') {
    const originalContent = iconElement.innerHTML;
    iconElement.innerHTML = ICONS.loading;
    iconElement.style.borderColor = "#94A3B8";
    iconElement.style.cursor = "wait";
  }
}

// ===== CSS Animations =====
function initializeCSS() {
  const styleElement = document.createElement("style");
  styleElement.innerHTML = `
    @keyframes staSlideIn {
      0% { 
        opacity: 0; 
        transform: translate(-50%, -60%) scale(0.9); 
      }
      100% { 
        opacity: 1; 
        transform: translate(-50%, -50%) scale(1); 
      }
    }
    
    @keyframes staSlideOut {
      0% { 
        opacity: 1; 
        transform: translate(-50%, -50%) scale(1); 
      }
      100% { 
        opacity: 0; 
        transform: translate(-50%, -40%) scale(0.9); 
      }
    }
    
    @keyframes staFadeInOut {
      0%   { opacity: 0; transform: translateY(-10px); }
      10%  { opacity: 1; transform: translateY(0); }
      90%  { opacity: 1; }
      100% { opacity: 0; transform: translateY(-10px); }
    }
  `;

  if (!document.getElementById("sta-animations")) {
    styleElement.id = "sta-animations";
    document.head.appendChild(styleElement);
  }
}

// ===== Base popup styling function =====
function getBasePopupStyle(rect, colorScheme = "blue") {
  const colors = {
    blue: {
      background: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)",
      border: "#3B82F6",
      accent: "#1D4ED8",
      arrowFill: "#EFF6FF"
    },
    green: {
      background: "linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)",
      border: "#22C55E", 
      accent: "#15803D",
      arrowFill: "#F0FDF4"
    },
    purple: {
      background: "linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 100%)",
      border: "#A855F7",
      accent: "#7C3AED",
      arrowFill: "#FAF5FF"
    }
  };
  
  const scheme = colors[colorScheme] || colors.blue;
  
  // Tính toán vị trí như Ejoy - popup ở phía trên text với arrow
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;
  
  const popupWidth = 380;
  const popupHeight = 300; // Estimated height
  const arrowSize = 12;
  const spacing = arrowSize + 8; // Khoảng cách từ text đến popup
  
  // Vị trí popup: phía trên text với arrow pointing down
  let topPosition = rect.top + window.scrollY - popupHeight - spacing;
  let leftPosition = rect.left + window.scrollX + (rect.width / 2);
  
  // Nếu popup bị cắt ở trên, đặt xuống dưới text
  let arrowDirection = "down"; // Arrow pointing down (popup above text)
  if (topPosition < window.scrollY + 20) {
    topPosition = rect.bottom + window.scrollY + spacing;
    arrowDirection = "up"; // Arrow pointing up (popup below text)
  }
  
  // Điều chỉnh left position để không bị cắt
  const minLeft = window.scrollX + 20;
  const maxLeft = window.scrollX + viewportWidth - popupWidth - 20;
  
  if (leftPosition - popupWidth/2 < minLeft) {
    leftPosition = minLeft + popupWidth/2;
  } else if (leftPosition + popupWidth/2 > maxLeft + popupWidth) {
    leftPosition = maxLeft - popupWidth/2;
  }
  
  // Tính toán vị trí arrow dựa trên center của selection
  const selectionCenter = rect.left + window.scrollX + (rect.width / 2);
  const arrowLeft = Math.max(20, Math.min(popupWidth - 20, selectionCenter - (leftPosition - popupWidth/2)));
  
  return {
    popupStyle: `
      position: fixed;
      top: ${topPosition}px;
      left: ${leftPosition}px;
      transform: translateX(-50%);
      z-index: 2147483647;
      background: ${scheme.background};
      border: 2px solid ${scheme.border};
      border-radius: 20px;
      box-shadow: 0 16px 48px rgba(0, 0, 0, 0.12), 0 8px 24px rgba(0, 0, 0, 0.08);
      padding: 24px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #1F2937;
      width: ${popupWidth}px;
      max-height: min(70vh, 400px);
      overflow-y: auto;
      backdrop-filter: blur(16px);
      animation: staSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    `,
    arrowStyle: `
      position: absolute;
      ${arrowDirection === "down" ? "bottom: -" + arrowSize + "px" : "top: -" + arrowSize + "px"};
      left: ${arrowLeft}px;
      width: 0;
      height: 0;
      border-left: ${arrowSize}px solid transparent;
      border-right: ${arrowSize}px solid transparent;
      ${arrowDirection === "down" 
        ? `border-top: ${arrowSize}px solid ${scheme.border}` 
        : `border-bottom: ${arrowSize}px solid ${scheme.border}`
      };
      z-index: 1;
    `,
    arrowInnerStyle: `
      position: absolute;
      ${arrowDirection === "down" ? "bottom: -" + (arrowSize - 2) + "px" : "top: -" + (arrowSize - 2) + "px"};
      left: ${arrowLeft}px;
      width: 0;
      height: 0;
      border-left: ${arrowSize - 2}px solid transparent;
      border-right: ${arrowSize - 2}px solid transparent;
      ${arrowDirection === "down" 
        ? `border-top: ${arrowSize - 2}px solid ${scheme.arrowFill}` 
        : `border-bottom: ${arrowSize - 2}px solid ${scheme.arrowFill}`
      };
      z-index: 2;
    `,
    scheme
  };
}

// ===== Create arrow elements =====
function createArrowPointer(arrowStyle, arrowInnerStyle) {
  const arrow = document.createElement("div");
  arrow.style.cssText = arrowStyle;
  
  const arrowInner = document.createElement("div");
  arrowInner.style.cssText = arrowInnerStyle;
  
  return { arrow, arrowInner };
}

// ===== Modern close button =====
function createCloseButton(popupId) {
  const closeBtn = document.createElement("div");
  closeBtn.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M18 6L6 18M6 6L18 18" stroke="#6B7280" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `;
  closeBtn.style.cssText = `
    position: absolute;
    top: 12px;
    right: 12px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    background: rgba(255, 255, 255, 0.5);
    border: 1px solid rgba(0, 0, 0, 0.1);
  `;
  
  closeBtn.addEventListener("mouseenter", () => {
    closeBtn.style.background = "rgba(239, 68, 68, 0.1)";
    closeBtn.style.borderColor = "#EF4444";
    closeBtn.querySelector("svg path").setAttribute("stroke", "#EF4444");
  });
  
  closeBtn.addEventListener("mouseleave", () => {
    closeBtn.style.background = "rgba(255, 255, 255, 0.5)";
    closeBtn.style.borderColor = "rgba(0, 0, 0, 0.1)";
    closeBtn.querySelector("svg path").setAttribute("stroke", "#6B7280");
  });
  
  closeBtn.addEventListener("click", () => {
    const popup = document.getElementById(popupId);
    if (popup) {
      popup.style.animation = "staSlideOut 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards";
      setTimeout(() => popup.remove(), 300);
    }
    
    // Clear selection khi đóng voice, TTS hoặc dictionary popup để tránh icon xuất hiện lại
    if (popupId === "sta-voice-popup" || popupId === "sta-tts-popup" || popupId === "sta-dictionary-popup") {
      if (window.getSelection) {
        window.getSelection().removeAllRanges();
      }
    }
  });
  
  return closeBtn;
}

// ===== Modern button styling =====
function createActionButton(text, onClick, variant = "primary") {
  const btn = document.createElement("button");
  btn.textContent = text;
  
  const variants = {
    primary: {
      bg: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
      hoverBg: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
      color: "#FFFFFF"
    },
    secondary: {
      bg: "linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)",
      hoverBg: "linear-gradient(135deg, #E5E7EB 0%, #D1D5DB 100%)",
      color: "#374151"
    },
    voice: {
      bg: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
      hoverBg: "linear-gradient(135deg, #059669 0%, #047857 100%)",
      color: "#FFFFFF"
    }
  };
  
  const style = variants[variant] || variants.primary;
  
  btn.style.cssText = `
    margin: 8px 4px 0 4px;
    padding: 12px 20px;
    border: none;
    border-radius: 12px;
    background: ${style.bg};
    color: ${style.color};
    font-family: inherit;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
  `;
  
  btn.addEventListener("mouseenter", () => {
    btn.style.background = style.hoverBg;
    btn.style.transform = "translateY(-1px)";
    btn.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
  });
  
  btn.addEventListener("mouseleave", () => {
    btn.style.background = style.bg;
    btn.style.transform = "translateY(0)";
    btn.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)";
  });
  
  btn.addEventListener("click", onClick);
  return btn;
}

// ===== Lightweight CSS Protection Function =====
function protectPopupStyling(element) {
  // Only add minimal protection without changing existing styles
  element.style.cssText = element.style.cssText + `
    ; position: fixed !important;
    z-index: 2147483647 !important;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
    box-sizing: border-box !important;
    isolation: isolate !important;
  `;
  
  return element;
}

// ===== Protect Button and Text Elements =====
function protectTextElements(popupElement) {
  // Protect buttons and their text
  const buttons = popupElement.querySelectorAll('button');
  buttons.forEach(button => {
    button.style.cssText = button.style.cssText + `
      ; color: inherit !important;
      opacity: 1 !important;
      font-weight: inherit !important;
      text-shadow: none !important;
      -webkit-text-fill-color: initial !important;
    `;
  });

  // Protect spans with specific styling
  const spans = popupElement.querySelectorAll('span');
  spans.forEach(span => {
    span.style.cssText = span.style.cssText + `
      ; color: inherit !important;
      opacity: 1 !important;
      font-weight: inherit !important;
      text-shadow: none !important;
      -webkit-text-fill-color: initial !important;
    `;
  });

  // Protect labels
  const labels = popupElement.querySelectorAll('label');
  labels.forEach(label => {
    label.style.cssText = label.style.cssText + `
      ; color: inherit !important;
      opacity: 1 !important;
      font-weight: inherit !important;
      text-shadow: none !important;
      -webkit-text-fill-color: initial !important;
    `;
  });

  // Protect divs with text
  const divs = popupElement.querySelectorAll('div');
  divs.forEach(div => {
    if (div.textContent && div.textContent.trim() && !div.querySelector('*')) {
      // Only text-only divs
      div.style.cssText = div.style.cssText + `
        ; color: inherit !important;
        opacity: 1 !important;
        font-weight: inherit !important;
        text-shadow: none !important;
        -webkit-text-fill-color: initial !important;
      `;
    }
  });

  return popupElement;
}

// ===== Protect Dynamic Content =====
function protectDynamicContent(container) {
  // Small delay to ensure DOM is updated
  setTimeout(() => {
    protectTextElements(container);
  }, 10);
}

// ===== Text Replacement =====
async function replaceSelectedText(replacementText) {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;

  const range = selection.getRangeAt(0);

  try {
    // Dành cho contenteditable: execCommand
    const success = document.execCommand("insertText", false, replacementText);
    if (!success) {
      throw new Error("execCommand failed");
    }
  } catch (e) {
    try {
      // Fallback cuối cùng: dùng Clipboard API để paste
      await navigator.clipboard.writeText(replacementText);
      document.execCommand("paste");
    } catch (clipboardErr) {
      // Nếu vẫn fail: fallback cơ bản
      range.deleteContents();
      range.insertNode(document.createTextNode(replacementText));
    }
  }

  selection.removeAllRanges();
}

// ===== Export to global scope for browser extension =====
if (typeof window !== 'undefined') {
  window.initializeCSS = initializeCSS;
  window.showLoadingState = showLoadingState;
  window.addCloseButton = addCloseButton;
  window.addActionButton = addActionButton;
  window.createPositioner = createPositioner;
  window.protectFromCSS = protectFromCSS;
  window.replaceSelectedText = replaceSelectedText;
}