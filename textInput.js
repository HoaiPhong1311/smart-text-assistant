// ===== Enhanced Text Input Functions =====

// ===== Enhanced Helper Functions =====
function insertTextAtCursor(text) {
  const isDebug = localStorage.getItem('sta-debug') === 'true';
  
  if (isDebug) {
    console.log('🎯 insertTextAtCursor called with:', text);
    debugCurrentPageElements();
  }
  
  // Method 1: Try active element with event triggering
  if (tryInsertToActiveElement(text)) {
    if (isDebug) console.log('✅ Success via active element');
    return;
  }
  
  // Method 2: Try focused element with comprehensive search
  if (tryInsertToFocusedElement(text)) {
    if (isDebug) console.log('✅ Success via focused element');
    return;
  }
  
  // Method 3: Try Facebook-specific methods
  if (tryInsertToFacebookElement(text)) {
    if (isDebug) console.log('✅ Success via Facebook method');
    return;
  }
  
  // Method 4: Try contenteditable with execCommand
  if (tryInsertViaExecCommand(text)) {
    if (isDebug) console.log('✅ Success via execCommand');
    return;
  }
  
  // Method 5: Try clipboard method
  if (tryInsertViaClipboard(text)) {
    if (isDebug) console.log('✅ Success via clipboard');
    return;
  }
  
  // Method 6: Last resort - find any editable element
  tryInsertToAnyEditableElement(text);
  if (isDebug) console.log('⚠️ Used fallback method');
}

// Enable debug mode by running: localStorage.setItem('sta-debug', 'true') in console

function debugCurrentPageElements() {
  console.log('🔍 DEBUG: Current page elements');
  console.log('- URL:', window.location.href);
  console.log('- Active element:', document.activeElement);
  
  // Check for Facebook-specific elements
  const fbElements = {
    'status input': document.querySelectorAll('[data-testid="status-attachment-mentions-input"]'),
    'textbox role': document.querySelectorAll('[role="textbox"]'),
    'draft editor': document.querySelectorAll('.DraftEditor-editorContainer'),
    'data-text': document.querySelectorAll('[data-text="true"]'),
    'notranslate': document.querySelectorAll('.notranslate'),
    'contenteditable': document.querySelectorAll('[contenteditable="true"]'),
    'focused inputs': document.querySelectorAll('input:focus, textarea:focus')
  };
  
  Object.entries(fbElements).forEach(([name, elements]) => {
    if (elements.length > 0) {
      console.log(`- Found ${name}:`, elements.length, elements);
    }
  });
}

function tryInsertToActiveElement(text) {
  const activeElement = document.activeElement;
  const isDebug = localStorage.getItem('sta-debug') === 'true';
  
  if (isDebug) {
    console.log('🔍 Active element:', activeElement?.tagName, activeElement?.type);
  }
  
  if (!activeElement) return false;
  
  // Handle input/textarea
  if (activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'INPUT') {
    return insertToInputElement(activeElement, text);
  }
  
  // Handle contenteditable
  if (activeElement.contentEditable === 'true') {
    return insertToContentEditable(activeElement, text);
  }
  
  return false;
}

function tryInsertToFocusedElement(text) {
  // Find focused elements with more comprehensive search
  const selectors = [
    'input:focus',
    'textarea:focus', 
    '[contenteditable="true"]:focus',
    '[contenteditable=""]:focus',
    '[role="textbox"]:focus',
    '.DraftEditor-editorContainer',
    '[data-text="true"]',
    '.notranslate',
    '[aria-label*="post" i]',
    '[aria-label*="comment" i]',
    '[aria-label*="write" i]',
    '[aria-label*="type" i]'
  ];
  
  for (const selector of selectors) {
    const elements = document.querySelectorAll(selector);
    for (const element of elements) {
      const isDebug = localStorage.getItem('sta-debug') === 'true';
      if (isDebug) {
        console.log('🔍 Trying selector:', selector, element);
      }
      
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        if (insertToInputElement(element, text)) {
          return true;
        }
      } else if (element.contentEditable === 'true' || element.getAttribute('contenteditable') !== null) {
        if (insertToContentEditable(element, text)) {
          return true;
        }
      }
    }
  }
  
  return false;
}

function tryInsertToFacebookElement(text) {
  // Facebook-specific selectors in order of preference
  const fbSelectors = [
    '[data-testid="status-attachment-mentions-input"]',
    '[role="textbox"][contenteditable="true"]',
    '[role="textbox"]',
    '.DraftEditor-editorContainer [contenteditable="true"]',
    '.DraftEditor-editorContainer',
    '[data-text="true"]',
    '.notranslate[contenteditable="true"]',
    '.notranslate',
    '[aria-expanded="true"][role="textbox"]'
  ];
  
  for (const selector of fbSelectors) {
    const elements = document.querySelectorAll(selector);
    for (const element of elements) {
      console.log('🔍 Trying Facebook selector:', selector, element);
      
      // Check if element is visible and interactable
      if (!isElementVisible(element)) {
        console.log('❌ Element not visible, skipping');
        continue;
      }
      
      // Try to focus and activate the element first
      if (prepareElementForInput(element)) {
        // Try immediate insertion
        if (insertToFacebookRichEditor(element, text)) {
          return true;
        }
        
        if (element.contentEditable === 'true') {
          if (insertToContentEditable(element, text)) {
            return true;
          }
        }
        
        // If immediate insertion fails, try delayed insertion for React components
        setTimeout(() => {
          insertToFacebookRichEditor(element, text) || insertToContentEditable(element, text);
        }, 100);
        
        return true; // Consider it successful even if delayed
      }
    }
  }
  
  return false;
}

function isElementVisible(element) {
  const rect = element.getBoundingClientRect();
  const style = getComputedStyle(element);
  
  return rect.width > 0 && 
         rect.height > 0 && 
         style.display !== 'none' && 
         style.visibility !== 'hidden' &&
         style.opacity !== '0';
}

function prepareElementForInput(element) {
  try {
    // Scroll element into view
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Click the element to activate it
    element.click();
    
    // Focus the element
    element.focus();
    
    // Trigger mouse events
    ['mousedown', 'mouseup', 'click'].forEach(eventType => {
      const event = new MouseEvent(eventType, {
        bubbles: true,
        cancelable: true,
        view: window
      });
      element.dispatchEvent(event);
    });
    
    // Trigger focus events
    ['focus', 'focusin'].forEach(eventType => {
      const event = new FocusEvent(eventType, {
        bubbles: true,
        cancelable: true
      });
      element.dispatchEvent(event);
    });
    
    console.log('✅ Element prepared for input');
    return true;
  } catch (error) {
    console.log('❌ Failed to prepare element:', error);
    return false;
  }
}

function tryInsertViaExecCommand(text) {
  try {
    document.execCommand('insertText', false, text);
    return true;
  } catch (error) {
    console.log('❌ execCommand failed:', error);
    return false;
  }
}

function tryInsertViaClipboard(text) {
  try {
    navigator.clipboard.writeText(text).then(() => {
      document.execCommand('paste');
    });
    return true;
  } catch (error) {
    console.log('❌ Clipboard method failed:', error);
    return false;
  }
}

function tryInsertToAnyEditableElement(text) {
  // Last resort: find any potentially editable element
  const allEditableSelectors = [
    'input[type="text"]',
    'input[type="search"]', 
    'input:not([type])',
    'textarea',
    '[contenteditable="true"]',
    '[contenteditable=""]',
    '[role="textbox"]'
  ];
  
  for (const selector of allEditableSelectors) {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 0) {
      const element = elements[0]; // Use first found
      console.log('🔍 Last resort element:', selector, element);
      
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        element.focus();
        return insertToInputElement(element, text);
      } else {
        element.focus();
        return insertToContentEditable(element, text);
      }
    }
  }
}

function insertToInputElement(element, text) {
  try {
    element.focus();
    
    const start = element.selectionStart || 0;
    const end = element.selectionEnd || 0;
    const value = element.value || '';
    
    // Update value
    const newValue = value.substring(0, start) + text + value.substring(end);
    element.value = newValue;
    
    // Set cursor position
    const newPosition = start + text.length;
    element.setSelectionRange(newPosition, newPosition);
    
    // Trigger events for React and other frameworks
    triggerInputEvents(element);
    
    return true;
  } catch (error) {
    console.log('❌ insertToInputElement failed:', error);
    return false;
  }
}

function insertToContentEditable(element, text) {
  try {
    element.focus();
    
    const selection = window.getSelection();
    
    // Try with execCommand first
    if (document.execCommand('insertText', false, text)) {
      triggerInputEvents(element);
      return true;
    }
    
    // Fallback: manual insertion
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      
      const textNode = document.createTextNode(text);
      range.insertNode(textNode);
      
      // Set cursor after inserted text
      range.setStartAfter(textNode);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
      
      triggerInputEvents(element);
      return true;
    } else {
      // No selection, append to end
      element.textContent += text;
      triggerInputEvents(element);
      return true;
    }
  } catch (error) {
    console.log('❌ insertToContentEditable failed:', error);
    return false;
  }
}

function insertToFacebookRichEditor(element, text) {
  try {
    element.focus();
    
    // Method 1: Try with execCommand first (works best with Facebook)
    if (document.execCommand('insertText', false, text)) {
      console.log('✅ Facebook insertion via execCommand');
      triggerInputEvents(element);
      triggerReactEvents(element);
      return true;
    }
    
    // Method 2: Try with selection and range
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(text));
      
      // Move cursor to end
      range.setStartAfter(range.endContainer);
      range.collapse(true);
      
      triggerInputEvents(element);
      triggerReactEvents(element);
      console.log('✅ Facebook insertion via range');
      return true;
    }
    
    // Method 3: Direct text manipulation (fallback)
    const currentText = element.textContent || element.innerText || '';
    element.textContent = currentText + text;
    
    // Trigger comprehensive events
    triggerInputEvents(element);
    triggerReactEvents(element);
    
    console.log('✅ Facebook insertion via textContent');
    return true;
  } catch (error) {
    console.log('❌ insertToFacebookRichEditor failed:', error);
    return false;
  }
}

function triggerInputEvents(element) {
  const events = [
    'input',
    'change', 
    'keydown',
    'keyup',
    'beforeinput',
    'textinput'
  ];
  
  events.forEach(eventType => {
    try {
      const event = new Event(eventType, { 
        bubbles: true, 
        cancelable: true 
      });
      element.dispatchEvent(event);
    } catch (error) {
      // Ignore event errors
    }
  });
}

function triggerReactEvents(element) {
  // Special events for React and Facebook
  try {
    // Facebook/React specific events
    const syntheticEvents = [
      new Event('input', { bubbles: true, cancelable: true }),
      new Event('change', { bubbles: true, cancelable: true }),
      new InputEvent('beforeinput', { 
        bubbles: true, 
        cancelable: true,
        inputType: 'insertText',
        data: null
      }),
      new CompositionEvent('compositionupdate', { bubbles: true }),
      new CompositionEvent('compositionend', { bubbles: true })
    ];
    
    syntheticEvents.forEach(event => {
      element.dispatchEvent(event);
    });
    
    // Try to access React fiber and trigger updates
    const reactFiber = element._reactInternalFiber || 
                      element._reactInternalInstance ||
                      element.__reactInternalInstance ||
                      Object.keys(element).find(key => key.startsWith('__reactInternalInstance'));
    
    if (reactFiber) {
      console.log('🔍 Found React fiber, triggering updates');
      
      // Try to trigger React's state update
      if (element.onInput || element.onChange) {
        const syntheticEvent = {
          target: element,
          currentTarget: element,
          type: 'input',
          bubbles: true,
          cancelable: true,
          nativeEvent: new InputEvent('input')
        };
        
        if (element.onInput) element.onInput(syntheticEvent);
        if (element.onChange) element.onChange(syntheticEvent);
      }
    }
    
    // Trigger mutation observer events
    const observer = new MutationObserver(() => {});
    observer.observe(element, { childList: true, characterData: true, subtree: true });
    observer.disconnect();
    
  } catch (error) {
    console.log('❌ triggerReactEvents failed:', error);
  }
}

function selectLastInsertedText(text) {
  const activeElement = document.activeElement;
  
  if (activeElement && (activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'INPUT')) {
    // For input/textarea elements
    const currentPos = activeElement.selectionStart;
    const startPos = Math.max(0, currentPos - text.length);
    activeElement.setSelectionRange(startPos, currentPos);
    activeElement.focus();
  } else {
    // For contenteditable elements or general document
    const selection = window.getSelection();
    
    // Try multiple approaches to select the text
    let textSelected = false;
    
    // Approach 1: Use current range if available
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const container = range.startContainer;
      
      if (container.nodeType === Node.TEXT_NODE) {
        const textContent = container.textContent;
        const textIndex = textContent.lastIndexOf(text);
        
        if (textIndex !== -1) {
          const newRange = document.createRange();
          newRange.setStart(container, textIndex);
          newRange.setEnd(container, textIndex + text.length);
          
          selection.removeAllRanges();
          selection.addRange(newRange);
          textSelected = true;
        }
      }
    }
    
    // Approach 2: Search in the document if range approach failed
    if (!textSelected) {
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null,
        false
      );
      
      let node;
      while (node = walker.nextNode()) {
        const nodeText = node.textContent;
        const textIndex = nodeText.lastIndexOf(text);
        
        if (textIndex !== -1) {
          const range = document.createRange();
          range.setStart(node, textIndex);
          range.setEnd(node, textIndex + text.length);
          
          selection.removeAllRanges();
          selection.addRange(range);
          textSelected = true;
          break;
        }
      }
    }
    
    if (!textSelected) {
      // Could not select text
    }
  }
}

// ===== Export to global scope for browser extension =====
if (typeof window !== 'undefined') {
  window.insertTextAtCursor = insertTextAtCursor;
  window.selectLastInsertedText = selectLastInsertedText;
}