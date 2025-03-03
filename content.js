// This file is needed to make the content script available for direct injection
// The main functionality is in the scanChatGPTInput function in popup.js

console.log("ChatGPT Scanner content script loaded");

// Listen for message from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "scanInput") {
    const editableElements = document.querySelectorAll('[contenteditable="true"], textarea');
    let foundText = "";
    let found = false;
    
    editableElements.forEach((el, index) => {
      const text = (el.innerText || el.value || "").trim();
      
      if (text) {
        found = true;
        foundText = text;
        console.log(`Editable Element ${index + 1}:`, text);
      }
    });
    
    sendResponse({ text: foundText, found: found });
    return true; // Keep the message channel open for the async response
  }
});