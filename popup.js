(() => {
  const oldPopup = document.getElementById("sta-function-chooser");
  if (oldPopup) oldPopup.remove();

  const div = document.createElement("div");
  div.id = "sta-function-chooser";

  div.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2147483647;
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
    border: 2px solid #e2e8f0;
    border-radius: 20px;
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12), 0 6px 20px rgba(0, 0, 0, 0.08);
    padding: 24px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    text-align: center;
    backdrop-filter: blur(16px);
    animation: staFunctionChooserIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    max-width: min(360px, calc(100vw - 40px));
    width: 340px;
  `;

  // Title section
  const titleSection = document.createElement("div");
  titleSection.innerHTML = `
    <div style="margin-bottom: 20px;">
      <div style="
        width: 48px;
        height: 48px;
        margin: 0 auto 12px auto;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 6px 16px rgba(102, 126, 234, 0.25);
      ">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 6.5C13.4 6.5 14.5 7.6 14.5 9C14.5 10.4 13.4 11.5 12 11.5C10.6 11.5 9.5 10.4 9.5 9C9.5 7.6 10.6 6.5 12 6.5Z" fill="white"/>
          <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z" fill="white" opacity="0.7"/>
          <path d="M12 18C13.1 18 14 18.9 14 20C14 21.1 13.1 22 12 22C10.9 22 10 21.1 10 20C10 18.9 10.9 18 12 18Z" fill="white" opacity="0.7"/>
          <path d="M6 10C7.1 10 8 10.9 8 12C8 13.1 7.1 14 6 14C4.9 14 4 13.1 4 12C4 10.9 4.9 10 6 10Z" fill="white" opacity="0.7"/>
          <path d="M18 10C19.1 10 20 10.9 20 12C20 13.1 19.1 14 18 14C16.9 14 16 13.1 16 12C16 10.9 16.9 10 18 10Z" fill="white" opacity="0.7"/>
        </svg>
      </div>
      <h2 style="
        margin: 0;
        font-size: 20px;
        font-weight: 700;
        color: #1e293b;
        line-height: 1.2;
      ">Smart Text Assistant</h2>
      <p style="
        margin: 6px 0 0 0;
        font-size: 14px;
        color: #64748b;
        font-weight: 500;
      ">Choose your preferred function</p>
    </div>
  `;
  div.appendChild(titleSection);

  // Functions container
  const functionsContainer = document.createElement("div");
  functionsContainer.style.cssText = `
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 20px;
  `;

  const functions = [
    { 
      label: "Rewrite Text", 
      value: "rewrite",
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M11 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H11" stroke="currentColor" stroke-width="2"/>
        <path d="M18.5 2.5C19.6 1.4 21.4 1.4 22.5 2.5C23.6 3.6 23.6 5.4 22.5 6.5L12 17H7V12L18.5 2.5Z" stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity="0.1"/>
      </svg>`,
      color: "#3b82f6",
      description: "Rewrite text in different styles"
    },
    { 
      label: "Grammar Correction", 
      value: "correction",
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity="0.1"/>
        <path d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="2"/>
      </svg>`,
      color: "#22c55e",
      description: "Fix grammar and spelling errors"
    },
    { 
      label: "Grammar Check", 
      value: "check",
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity="0.1"/>
        <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2"/>
        <path d="M11 8V13M11 16H11.01" stroke="currentColor" stroke-width="2"/>
      </svg>`,
      color: "#a855f7",
      description: "Analyze text for grammar issues"
    },
    { 
      label: "Voice Input", 
      value: "voice",
      icon: `<svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor">
        <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5"/>
        <path d="M10 8a2 2 0 1 1-4 0V3a2 2 0 1 1 4 0zM8 0a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V3a3 3 0 0 0-3-3"/>
      </svg>`,
      color: "#10b981",
      description: "Vietnamese → English translation & voice commands"
    },
    { 
      label: "Text to Speech", 
      value: "tts",
      icon: `<svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7 3.582 7 8 7M8 16c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8"/>
        <path d="M6.271 5.055a.5.5 0 0 1 .52.045C7.5 5.555 8 6.258 8 7s-.5 1.445-1.209 1.9a.5.5 0 1 1-.582-.9C6.556 7.725 7 7.389 7 7s-.444-.725-.791-1a.5.5 0 0 1-.145-.945M4.271 3.055a.5.5 0 0 1 .52.045C6 4.056 7 5.353 7 7s-1 2.944-2.209 3.9a.5.5 0 1 1-.582-.9C5.444 9.394 6 8.592 6 7s-.556-2.394-1.791-3a.5.5 0 0 1-.145-.945"/>
      </svg>`,
      color: "#0ea5e9",
      description: "Read selected text aloud in English or Vietnamese"
    },
    { 
      label: "Saved Words", 
      value: "savedwords",
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z" stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity="0.1"/>
        <path d="M9 7H15M9 11H13" stroke="currentColor" stroke-width="2"/>
      </svg>`,
      color: "#f59e0b",
      description: "View and manage your saved vocabulary words"
    }
  ];

  functions.forEach(({ label, value, icon, color, description }) => {
    const btn = document.createElement("button");
    btn.innerHTML = `
      <div style="display: flex; align-items: center; text-align: left;">
        <div style="
          width: 40px;
          height: 40px;
          margin-right: 12px;
          background: linear-gradient(135deg, ${color}15, ${color}25);
          border: 2px solid ${color}30;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${color};
          transition: all 0.3s ease;
          flex-shrink: 0;
        " class="sta-function-icon">
          <div style="transform: scale(0.85);">${icon}</div>
        </div>
        <div style="flex: 1;">
          <div style="
            font-size: 15px;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 3px;
            line-height: 1.2;
          ">${label}</div>
          <div style="
            font-size: 12px;
            color: #64748b;
            line-height: 1.3;
          ">${description}</div>
        </div>
      </div>
    `;
    
    btn.style.cssText = `
      width: 100%;
      padding: 16px;
      border: 2px solid #e2e8f0;
      border-radius: 14px;
      background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      font-family: inherit;
      outline: none;
    `;
    
    btn.addEventListener("mouseenter", () => {
      btn.style.background = `linear-gradient(135deg, ${color}08, ${color}15)`;
      btn.style.borderColor = color;
      btn.style.transform = "translateY(-2px)";
      btn.style.boxShadow = `0 8px 24px ${color}25, 0 4px 12px rgba(0, 0, 0, 0.1)`;
      const iconDiv = btn.querySelector('.sta-function-icon');
      iconDiv.style.background = color;
      iconDiv.style.color = "white";
      iconDiv.style.transform = "scale(1.1)";
    });
    
    btn.addEventListener("mouseleave", () => {
      btn.style.background = "linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)";
      btn.style.borderColor = "#e2e8f0";
      btn.style.transform = "translateY(0)";
      btn.style.boxShadow = "none";
      const iconDiv = btn.querySelector('.sta-function-icon');
      iconDiv.style.background = `linear-gradient(135deg, ${color}15, ${color}25)`;
      iconDiv.style.color = color;
      iconDiv.style.transform = "scale(1)";
    });
    
    btn.addEventListener("click", () => {
      // Success animation
      btn.style.background = `linear-gradient(135deg, ${color}20, ${color}30)`;
      btn.style.borderColor = color;
      btn.style.transform = "scale(0.98)";
      
      // Special handling for Saved Words
      if (value === "savedwords") {
        // Animate out first
        div.style.animation = "staFunctionChooserOut 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards";
        setTimeout(() => {
          div.remove();
          // Open Saved Words popup directly
          showSavedWordsPopup();
        }, 300);
        return;
      }
      
      // Regular function selection
      chrome.storage.sync.set({ selectedFunction: value }, () => {
        // Animate out
        div.style.animation = "staFunctionChooserOut 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards";
        setTimeout(() => div.remove(), 300);
      });
    });
    
    functionsContainer.appendChild(btn);
  });

  div.appendChild(functionsContainer);

  // Footer
  const footer = document.createElement("div");
  footer.innerHTML = `
    <div style="
      padding-top: 16px;
      border-top: 1px solid #e2e8f0;
      text-align: center;
    ">
      <p style="
        margin: 0;
        font-size: 11px;
        color: #94a3b8;
        font-weight: 500;
      ">Right-click on any webpage and select text to use</p>
    </div>
  `;
  div.appendChild(footer);

  // Add animations CSS
  const animationStyle = document.createElement("style");
  animationStyle.innerHTML = `
    @keyframes staFunctionChooserIn {
      0% { 
        opacity: 0; 
        transform: translate(-50%, -50%) scale(0.9) translateY(20px); 
      }
      100% { 
        opacity: 1; 
        transform: translate(-50%, -50%) scale(1) translateY(0); 
      }
    }
    
    @keyframes staFunctionChooserOut {
      0% { 
        opacity: 1; 
        transform: translate(-50%, -50%) scale(1) translateY(0); 
      }
      100% { 
        opacity: 0; 
        transform: translate(-50%, -50%) scale(0.95) translateY(-10px); 
      }
    }
  `;
  
  if (!document.getElementById("sta-function-animations")) {
    animationStyle.id = "sta-function-animations";
    document.head.appendChild(animationStyle);
  }

  document.body.appendChild(div);
})();
  