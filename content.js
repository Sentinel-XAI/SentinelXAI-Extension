// content.js
console.log("ChatGPT Scanner content script loaded");

// Function to scan editable elements and send data to the popup
function scanTextInputs() {
  const editableElements = document.querySelectorAll('[contenteditable="true"], textarea');
  let foundTexts = [];
  let containsNumber = false;
  let containsEmail = false;
  let containsURL = false;
  let containsPhoneNumber = false;
  let containsSSN = false;
  let containsIPAddress = false;
  let containsCreditCard = false;
  
  editableElements.forEach((el, index) => {
    const text = (el.innerText || el.value || "").trim();
    if (text) {
      foundTexts.push(text);
      
      // Check if the text contains a number
      if (/\d/.test(text)) {
        containsNumber = true;
      }
      
      // Check if the text contains an email
      if (/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text)) {
        containsEmail = true;
      }
      
      // Check if the text contains a URL
      if (/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/.test(text)) {
        containsURL = true;
      }
      
      // Check if the text contains a phone number (simplified pattern)
      if (/(\+?\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}/.test(text)) {
        containsPhoneNumber = true;
      }
      
      // Check if the text contains a Social Security Number
      if (/\b(?:\d{3}-\d{2}-\d{4}|\d{9})\b/.test(text)) {
        containsSSN = true;
      }
      
      // Check if the text contains an IP address
      if (/\b(?:\d{1,3}\.){3}\d{1,3}\b/.test(text)) {
        containsIPAddress = true;
      }
      
      // Check if the text contains a credit card number
      if (/\b(?:\d{4}[- ]?){3}\d{4}\b/.test(text)) {
        containsCreditCard = true;
      }
      
      console.log(`Editable Element ${index + 1}:`, text);
    }
  });
  
  // Send the found texts and detection status to the popup
  chrome.runtime.sendMessage({
    action: "updateText",
    texts: foundTexts,
    containsNumber: containsNumber,
    containsEmail: containsEmail,
    containsURL: containsURL,
    containsPhoneNumber: containsPhoneNumber,
    containsSSN: containsSSN,
    containsIPAddress: containsIPAddress,
    containsCreditCard: containsCreditCard
  });
}

// Run the scan function every 1000ms (1 second)
setInterval(scanTextInputs, 1000);