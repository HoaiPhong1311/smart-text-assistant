// ===== Popup UI Components =====
// Functions will be available globally via script loading order in manifest.json

// ===== Error and Reminder Popups =====
function showReminderPopup() {
  const existing = document.getElementById("sta-reminder-popup");
  if (existing) existing.remove();

  const div = document.createElement("div");
  div.id = "sta-reminder-popup";
  div.innerHTML = `
    <div style="display: flex; align-items: center; margin-bottom: 8px;">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style="margin-right: 8px;">
        <circle cx="12" cy="12" r="10" stroke="#F59E0B" stroke-width="2" fill="#FEF3C7"/>
        <path d="M12 8V12M12 16H12.01" stroke="#F59E0B" stroke-width="2"/>
      </svg>
      <span style="font-weight: 600; color: #92400E;">Action Required</span>
    </div>
    <p style="margin: 0; color: #451A03;">Please choose a function from the context menu first.</p>
  `;
  
  div.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2147483647;
    background: linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%);
    border: 2px solid #F59E0B;
    border-radius: 16px;
    box-shadow: 0 16px 40px rgba(245, 158, 11, 0.15), 0 8px 16px rgba(0, 0, 0, 0.1);
    padding: 20px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    text-align: left;
    max-width: 320px;
    animation: staSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    backdrop-filter: blur(10px);
  `;

  document.body.appendChild(div);

  // Auto hide với smooth animation
  setTimeout(() => {
    div.style.animation = "staSlideOut 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards";
    setTimeout(() => div.remove(), 300);
  }, 2700);
}

function showErrorPopup(message) {
  const existing = document.getElementById("sta-error-popup");
  if (existing) existing.remove();

  const div = document.createElement("div");
  div.id = "sta-error-popup";
  div.innerHTML = `
    <div style="display: flex; align-items: center; margin-bottom: 8px;">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style="margin-right: 8px;">
        <circle cx="12" cy="12" r="10" stroke="#EF4444" stroke-width="2" fill="#FEE2E2"/>
        <path d="M15 9L9 15M9 9L15 15" stroke="#EF4444" stroke-width="2"/>
      </svg>
      <span style="font-weight: 600; color: #DC2626;">Error</span>
    </div>
    <p style="margin: 0; color: #7F1D1D;">${message}</p>
  `;
  
  div.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2147483647;
    background: linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%);
    border: 2px solid #EF4444;
    border-radius: 16px;
    box-shadow: 0 16px 40px rgba(239, 68, 68, 0.15), 0 8px 16px rgba(0, 0, 0, 0.1);
    padding: 20px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    text-align: left;
    max-width: 320px;
    animation: staSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    backdrop-filter: blur(10px);
  `;

  document.body.appendChild(div);

  // Auto hide với smooth animation
  setTimeout(() => {
    div.style.animation = "staSlideOut 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards";
    setTimeout(() => div.remove(), 300);
  }, 3000);
}

// ===== Rewrite Popup =====
function showRewritePopup(originalText, proText, casualText) {
  const existing = document.getElementById("sta-rewrite-popup");
  if (existing) existing.remove();

  const selection = window.getSelection();
  let rect;
  
  // Check if we have a valid selection with text
  if (selection.rangeCount > 0 && selection.toString().trim()) {
    const range = selection.getRangeAt(0);
    rect = range.getBoundingClientRect();
    
    // Validate rect has proper dimensions
    if (rect.width > 0 && rect.height > 0) {
      // Use normal positioning
      const styleConfig = getBasePopupStyle(rect, "blue");
      createRewritePopupWithStyle(originalText, proText, casualText, styleConfig);
      return;
    }
  }
  
  // Fallback: use center position
  createRewritePopupCentered(originalText, proText, casualText);
}

function createRewritePopupWithStyle(originalText, proText, casualText, styleConfig) {
  const div = document.createElement("div");
  div.id = "sta-rewrite-popup";
  div.style.cssText = styleConfig.popupStyle;

  // Close button
  div.appendChild(createCloseButton("sta-rewrite-popup"));

  // Title với icon
  const title = document.createElement("div");
  title.innerHTML = `
    <div style="display: flex; align-items: center; margin-bottom: 16px;">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style="margin-right: 10px;">
        <path d="M11 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H11" stroke="#3B82F6" stroke-width="2"/>
        <path d="M18.5 2.5C19.6 1.4 21.4 1.4 22.5 2.5C23.6 3.6 23.6 5.4 22.5 6.5L12 17H7V12L18.5 2.5Z" stroke="#3B82F6" stroke-width="2" fill="#EFF6FF"/>
      </svg>
      <span style="font-size: 18px; font-weight: 700; color: #1E40AF;">Rewrite Options</span>
    </div>
  `;
  div.appendChild(title);

  // Original text preview
  const originalPreview = document.createElement("div");
  originalPreview.innerHTML = `
    <div style="margin-bottom: 20px;">
      <label style="font-size: 12px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.5px;">Original Text</label>
      <div style="
        margin-top: 6px; 
        padding: 12px 16px; 
        background: rgba(59, 130, 246, 0.05); 
        border: 1px solid rgba(59, 130, 246, 0.1);
        border-radius: 12px; 
        font-style: italic; 
        color: #374151;
        border-left: 4px solid #3B82F6;
      ">"${originalText}"</div>
    </div>
  `;
  div.appendChild(originalPreview);

  // Function để tạo option block
  const createOptionBlock = (label, text, variant, icon) => {
    const wrapper = document.createElement("div");
    wrapper.style.cssText = `
      margin-bottom: 20px; 
      padding: 20px; 
      background: rgba(255, 255, 255, 0.7); 
      border: 1px solid rgba(59, 130, 246, 0.1);
      border-radius: 16px;
      transition: all 0.2s ease;
    `;

    wrapper.addEventListener("mouseenter", () => {
      wrapper.style.background = "rgba(255, 255, 255, 0.9)";
      wrapper.style.borderColor = "rgba(59, 130, 246, 0.3)";
      wrapper.style.transform = "translateY(-2px)";
      wrapper.style.boxShadow = "0 8px 24px rgba(59, 130, 246, 0.1)";
    });

    wrapper.addEventListener("mouseleave", () => {
      wrapper.style.background = "rgba(255, 255, 255, 0.7)";
      wrapper.style.borderColor = "rgba(59, 130, 246, 0.1)";
      wrapper.style.transform = "translateY(0)";
      wrapper.style.boxShadow = "none";
    });

    const labelDiv = document.createElement("div");
    labelDiv.innerHTML = `
      <div style="display: flex; align-items: center; margin-bottom: 12px;">
        ${icon}
        <span style="font-weight: 700; font-size: 16px; color: #1E40AF; margin-left: 8px;">${label}</span>
      </div>
    `;

    const textDiv = document.createElement("div");
    textDiv.textContent = text;
    textDiv.style.cssText = `
      color: #374151;
      font-size: 14px;
      line-height: 1.6;
      margin-bottom: 16px;
      white-space: pre-wrap;
    `;

    const btn = createActionButton(`Choose ${label}`, () => {
      replaceSelectedText(text);
      window.getSelection().removeAllRanges();
      
      const popup = document.getElementById("sta-rewrite-popup");
      if (popup) {
        popup.style.animation = "staSlideOut 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards";
        setTimeout(() => popup.remove(), 300);
      }
    }, variant);

    wrapper.appendChild(labelDiv);
    wrapper.appendChild(textDiv);
    wrapper.appendChild(btn);
    return wrapper;
  };

  // Professional option
  const professionalIcon = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M20 6L9 17L4 12" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;
  div.appendChild(createOptionBlock("Professional", proText, "primary", professionalIcon));

  // Casual option  
  const casualIcon = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="#F59E0B" stroke-width="2"/>
      <path d="M8 14S9.5 16 12 16S16 14 16 14M9 9H9.01M15 9H15.01" stroke="#F59E0B" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `;
  div.appendChild(createOptionBlock("Casual", casualText, "primary", casualIcon));

  document.body.appendChild(div);
}

function createRewritePopupCentered(originalText, proText, casualText) {
  const div = document.createElement("div");
  div.id = "sta-rewrite-popup";
  
  // Use center positioning like voice popup
  div.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2147483647;
    background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%);
    border: 2px solid #3B82F6;
    border-radius: 20px;
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.12), 0 8px 24px rgba(0, 0, 0, 0.08);
    padding: 24px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #1F2937;
    width: 380px;
    max-height: min(70vh, 400px);
    overflow-y: auto;
    backdrop-filter: blur(16px);
    animation: staSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  `;

  // Close button
  div.appendChild(createCloseButton("sta-rewrite-popup"));

  // Title với icon
  const title = document.createElement("div");
  title.innerHTML = `
    <div style="display: flex; align-items: center; margin-bottom: 16px;">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style="margin-right: 10px;">
        <path d="M11 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H11" stroke="#3B82F6" stroke-width="2"/>
        <path d="M18.5 2.5C19.6 1.4 21.4 1.4 22.5 2.5C23.6 3.6 23.6 5.4 22.5 6.5L12 17H7V12L18.5 2.5Z" stroke="#3B82F6" stroke-width="2" fill="#EFF6FF"/>
      </svg>
      <span style="font-size: 18px; font-weight: 700; color: #1E40AF;">Rewrite Options</span>
    </div>
  `;
  div.appendChild(title);

  // Original text preview
  const originalPreview = document.createElement("div");
  originalPreview.innerHTML = `
    <div style="margin-bottom: 20px;">
      <label style="font-size: 12px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.5px;">Original Text</label>
      <div style="
        margin-top: 6px; 
        padding: 12px 16px; 
        background: rgba(59, 130, 246, 0.05); 
        border: 1px solid rgba(59, 130, 246, 0.1);
        border-radius: 12px; 
        font-style: italic; 
        color: #374151;
        border-left: 4px solid #3B82F6;
      ">"${originalText}"</div>
    </div>
  `;
  div.appendChild(originalPreview);

  // Function để tạo option block
  const createOptionBlock = (label, text, variant, icon) => {
    const wrapper = document.createElement("div");
    wrapper.style.cssText = `
      margin-bottom: 20px; 
      padding: 20px; 
      background: rgba(255, 255, 255, 0.7); 
      border: 1px solid rgba(59, 130, 246, 0.1);
      border-radius: 16px;
      transition: all 0.2s ease;
    `;

    wrapper.addEventListener("mouseenter", () => {
      wrapper.style.background = "rgba(255, 255, 255, 0.9)";
      wrapper.style.borderColor = "rgba(59, 130, 246, 0.3)";
      wrapper.style.transform = "translateY(-2px)";
      wrapper.style.boxShadow = "0 8px 24px rgba(59, 130, 246, 0.1)";
    });

    wrapper.addEventListener("mouseleave", () => {
      wrapper.style.background = "rgba(255, 255, 255, 0.7)";
      wrapper.style.borderColor = "rgba(59, 130, 246, 0.1)";
      wrapper.style.transform = "translateY(0)";
      wrapper.style.boxShadow = "none";
    });

    const labelDiv = document.createElement("div");
    labelDiv.innerHTML = `
      <div style="display: flex; align-items: center; margin-bottom: 12px;">
        ${icon}
        <span style="font-weight: 700; font-size: 16px; color: #1E40AF; margin-left: 8px;">${label}</span>
      </div>
    `;

    const textDiv = document.createElement("div");
    textDiv.textContent = text;
    textDiv.style.cssText = `
      color: #374151;
      font-size: 14px;
      line-height: 1.6;
      margin-bottom: 16px;
      white-space: pre-wrap;
    `;

    const btn = createActionButton(`Choose ${label}`, () => {
      replaceSelectedText(text);
      window.getSelection().removeAllRanges();
      
      const popup = document.getElementById("sta-rewrite-popup");
      if (popup) {
        popup.style.animation = "staSlideOut 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards";
        setTimeout(() => popup.remove(), 300);
      }
    }, variant);

    wrapper.appendChild(labelDiv);
    wrapper.appendChild(textDiv);
    wrapper.appendChild(btn);
    return wrapper;
  };

  // Professional option
  const professionalIcon = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M20 6L9 17L4 12" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;
  div.appendChild(createOptionBlock("Professional", proText, "primary", professionalIcon));

  // Casual option  
  const casualIcon = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="#F59E0B" stroke-width="2"/>
      <path d="M8 14S9.5 16 12 16S16 14 16 14M9 9H9.01M15 9H15.01" stroke="#F59E0B" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `;
  div.appendChild(createOptionBlock("Casual", casualText, "primary", casualIcon));

  document.body.appendChild(div);
}

// ===== Grammar Correction Popup =====
function showCorrectionPopup(originalText, correctedText) {
  const existing = document.getElementById("sta-correction-popup");
  if (existing) existing.remove();

  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();

  const styleConfig = getBasePopupStyle(rect, "green");
  
  const div = document.createElement("div");
  div.id = "sta-correction-popup";
  div.style.cssText = styleConfig.popupStyle;

  // Close button
  div.appendChild(createCloseButton("sta-correction-popup"));

  // Check if there are no errors (corrected text is same as original)
  const hasErrors = correctedText.trim() !== originalText.trim();

  // Title với icon
  const title = document.createElement("div");
  title.innerHTML = `
    <div style="display: flex; align-items: center; margin-bottom: 16px;">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style="margin-right: 10px;">
        <circle cx="12" cy="12" r="10" stroke="#22C55E" stroke-width="2" fill="#F0FDF4"/>
        <path d="M9 12L11 14L15 10" stroke="#22C55E" stroke-width="2" fill="none"/>
      </svg>
      <span style="font-size: 18px; font-weight: 700; color: #15803D;">Grammar Correction</span>
    </div>
  `;
  div.appendChild(title);

  if (!hasErrors) {
    // No errors found - show success message
    const noErrorsDiv = document.createElement("div");
    noErrorsDiv.innerHTML = `
      <div style="text-align: center; margin-bottom: 20px;">
        <div style="
          padding: 24px; 
          background: rgba(34, 197, 94, 0.1); 
          border: 2px solid rgba(34, 197, 94, 0.3);
          border-radius: 16px; 
          margin-bottom: 16px;
        ">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style="margin: 0 auto 16px auto; display: block;">
            <circle cx="12" cy="12" r="10" stroke="#22C55E" stroke-width="2" fill="#F0FDF4"/>
            <path d="M9 12L11 14L15 10" stroke="#22C55E" stroke-width="2" fill="none"/>
          </svg>
          <h3 style="margin: 0 0 8px 0; color: #15803D; font-size: 18px; font-weight: 700;">Perfect Grammar! ✨</h3>
          <p style="margin: 0; color: #166534; font-size: 14px; line-height: 1.5;">
            No grammar errors were found in your text. Your writing looks great!
          </p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <label style="font-size: 12px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.5px;">Your Text</label>
          <div style="
            margin-top: 6px; 
            padding: 12px 16px; 
            background: rgba(34, 197, 94, 0.08); 
            border: 1px solid rgba(34, 197, 94, 0.2);
            border-radius: 12px; 
            color: #14532D;
            border-left: 4px solid #22C55E;
            font-weight: 500;
          ">"${originalText}"</div>
        </div>
      </div>
    `;
    div.appendChild(noErrorsDiv);

    // OK button for no errors
    const btn = createActionButton("✓ Got it", () => {
      window.getSelection().removeAllRanges();
      
      const popup = document.getElementById("sta-correction-popup");
      if (popup) {
        popup.style.animation = "staSlideOut 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards";
        setTimeout(() => popup.remove(), 300);
      }
    }, "primary");

    div.appendChild(btn);
  } else {
    // Errors found - show original correction UI
    // Original text
    const originalDiv = document.createElement("div");
    originalDiv.innerHTML = `
      <div style="margin-bottom: 16px;">
        <label style="font-size: 12px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.5px;">Original</label>
        <div style="
          margin-top: 6px; 
          padding: 12px 16px; 
          background: rgba(248, 113, 113, 0.1); 
          border: 1px solid rgba(248, 113, 113, 0.2);
          border-radius: 12px; 
          color: #7F1D1D;
          border-left: 4px solid #EF4444;
        ">"${originalText}"</div>
      </div>
    `;
    div.appendChild(originalDiv);

    // Corrected text
    const correctedDiv = document.createElement("div");
    correctedDiv.innerHTML = `
      <div style="margin-bottom: 20px;">
        <label style="font-size: 12px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.5px;">Suggested Correction</label>
        <div style="
          margin-top: 6px; 
          padding: 12px 16px; 
          background: rgba(34, 197, 94, 0.1); 
          border: 1px solid rgba(34, 197, 94, 0.2);
          border-radius: 12px; 
          color: #14532D;
          border-left: 4px solid #22C55E;
          font-weight: 500;
        ">${correctedText}</div>
      </div>
    `;
    div.appendChild(correctedDiv);

    // Action button
    const btn = createActionButton("✔ Apply Correction", () => {
      replaceSelectedText(correctedText);
      window.getSelection().removeAllRanges();
      
      const popup = document.getElementById("sta-correction-popup");
      if (popup) {
        popup.style.animation = "staSlideOut 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards";
        setTimeout(() => popup.remove(), 300);
      }
    }, "primary");

    div.appendChild(btn);
  }

  document.body.appendChild(div);
}

// ===== Grammar Check Popup =====
function showGrammarCheckPopup(highlightHTML, replacementsArray) {
  const existing = document.getElementById("sta-grammar-popup");
  if (existing) existing.remove();

  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();

  const styleConfig = getBasePopupStyle(rect, "purple");
  
  const div = document.createElement("div");
  div.id = "sta-grammar-popup";
  div.style.cssText = styleConfig.popupStyle;

  // Close button
  div.appendChild(createCloseButton("sta-grammar-popup"));

  // Check if there are no grammar issues
  const hasIssues = replacementsArray && replacementsArray.length > 0;

  // Title với icon
  const title = document.createElement("div");
  title.innerHTML = `
    <div style="display: flex; align-items: center; margin-bottom: 16px;">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style="margin-right: 10px;">
        <circle cx="11" cy="11" r="8" stroke="#A855F7" stroke-width="2" fill="#FAF5FF"/>
        <path d="M21 21L16.65 16.65" stroke="#A855F7" stroke-width="2"/>
        <path d="M11 8V13M11 16H11.01" stroke="#A855F7" stroke-width="2"/>
      </svg>
      <span style="font-size: 18px; font-weight: 700; color: #7C3AED;">Grammar Analysis</span>
    </div>
  `;
  div.appendChild(title);

  if (!hasIssues) {
    // No grammar issues found - show success message
    const noIssuesDiv = document.createElement("div");
    noIssuesDiv.innerHTML = `
      <div style="text-align: center; margin-bottom: 20px;">
        <div style="
          padding: 24px; 
          background: rgba(168, 85, 247, 0.08); 
          border: 2px solid rgba(168, 85, 247, 0.2);
          border-radius: 16px; 
          margin-bottom: 16px;
        ">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style="margin: 0 auto 16px auto; display: block;">
            <circle cx="12" cy="12" r="10" stroke="#A855F7" stroke-width="2" fill="#FAF5FF"/>
            <path d="M9 12L11 14L15 10" stroke="#A855F7" stroke-width="2" fill="none"/>
          </svg>
          <h3 style="margin: 0 0 8px 0; color: #7C3AED; font-size: 18px; font-weight: 700;">Excellent Grammar! 🎯</h3>
          <p style="margin: 0; color: #6B46C1; font-size: 14px; line-height: 1.5;">
            Your text has been analyzed and no grammar issues were detected. Well done!
          </p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <label style="font-size: 12px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.5px;">Analysis Result</label>
          <div style="
            margin-top: 6px; 
            padding: 16px; 
            background: rgba(168, 85, 247, 0.05); 
            border: 1px solid rgba(168, 85, 247, 0.15);
            border-radius: 12px; 
            color: #581C87;
            border-left: 4px solid #A855F7;
            line-height: 1.6;
          ">${highlightHTML || 'Grammar analysis completed successfully.'}</div>
        </div>
      </div>
    `;
    div.appendChild(noIssuesDiv);
  } else {
    // Grammar issues found - show original analysis UI
    // Analysis result
    const analysisDiv = document.createElement("div");
    analysisDiv.innerHTML = `
      <div style="margin-bottom: 20px;">
        <label style="font-size: 12px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.5px;">Analysis Result</label>
        <div style="
          margin-top: 6px; 
          padding: 16px; 
          background: rgba(168, 85, 247, 0.05); 
          border: 1px solid rgba(168, 85, 247, 0.1);
          border-radius: 12px; 
          color: #581C87;
          border-left: 4px solid #A855F7;
          line-height: 1.6;
        ">${highlightHTML}</div>
      </div>
    `;
    div.appendChild(analysisDiv);

    // Corrections section
    const correctionsDiv = document.createElement("div");
    correctionsDiv.innerHTML = `
      <div style="margin-bottom: 16px;">
        <label style="font-size: 12px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.5px;">Suggestions</label>
      </div>
    `;

    const suggestionsList = document.createElement("div");
    replacementsArray.forEach((item, index) => {
      const suggestionItem = document.createElement("div");
      suggestionItem.innerHTML = `
        <div style="
          margin-bottom: 12px;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.7);
          border: 1px solid rgba(168, 85, 247, 0.1);
          border-radius: 12px;
          display: flex;
          align-items: flex-start;
        ">
          <div style="
            width: 24px;
            height: 24px;
            background: linear-gradient(135deg, #A855F7, #7C3AED);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 12px;
            flex-shrink: 0;
            color: white;
            font-size: 12px;
            font-weight: 600;
          ">${index + 1}</div>
          <div style="color: #374151; font-size: 14px; line-height: 1.5;">${item}</div>
        </div>
      `;
      suggestionsList.appendChild(suggestionItem);
    });

    correctionsDiv.appendChild(suggestionsList);
    div.appendChild(correctionsDiv);
  }

  // Action button
  const btn = createActionButton("✓ Got it", () => {
    window.getSelection().removeAllRanges();
    const popup = document.getElementById("sta-grammar-popup");
    if (popup) {
      popup.style.animation = "staSlideOut 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards";
      setTimeout(() => popup.remove(), 300);
    }
  }, "primary");

  div.appendChild(btn);
  document.body.appendChild(div);
}

// ===== Export to global scope for browser extension =====
if (typeof window !== 'undefined') {
  window.showReminderPopup = showReminderPopup;
  window.showErrorPopup = showErrorPopup;
  window.showRewritePopup = showRewritePopup;
  window.showCorrectionPopup = showCorrectionPopup;
  window.showGrammarCheckPopup = showGrammarCheckPopup;
}