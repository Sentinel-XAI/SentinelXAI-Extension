// popup.js
document.getElementById('scanButton').addEventListener('click', async () => {
    try {
      // Get the current active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab) {
        console.error("No active tab found.");
        return;
      }
      // Execute the content script function to scan the text
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: scanChatGPTInput
      }, (results) => {
        const resultDiv = document.getElementById('result');
        const numberDetectionDiv = document.getElementById('numberDetection');
        const emailDetectionDiv = document.getElementById('emailDetection');
        const urlDetectionDiv = document.getElementById('urlDetection');
        const phoneDetectionDiv = document.getElementById('phoneDetection');
        const ssnDetectionDiv = document.getElementById('ssnDetection');
        const ipDetectionDiv = document.getElementById('ipDetection');
        const ccDetectionDiv = document.getElementById('ccDetection');
        
        if (chrome.runtime.lastError) {
          console.error("Script execution error:", chrome.runtime.lastError.message);
          resultDiv.textContent = 'Error scanning input field.';
          resultDiv.style.display = 'block';
          return;
        }
        
        if (results && results[0] && results[0].result) {
          const { 
            text, 
            found, 
            containsNumber, 
            containsEmail,
            containsURL,
            containsPhoneNumber,
            containsSSN,
            containsIPAddress,
            containsCreditCard 
          } = results[0].result;
          
          if (found) {
            resultDiv.textContent = `${text}`;
            resultDiv.style.display = 'block';
            
            // Update detection messages
            numberDetectionDiv.textContent = containsNumber ? "Number detected" : "";
            numberDetectionDiv.style.display = containsNumber ? 'block' : 'none';
            
            emailDetectionDiv.textContent = containsEmail ? "Email detected" : "";
            emailDetectionDiv.style.display = containsEmail ? 'block' : 'none';
            
            urlDetectionDiv.textContent = containsURL ? "URL detected" : "";
            urlDetectionDiv.style.display = containsURL ? 'block' : 'none';
            
            phoneDetectionDiv.textContent = containsPhoneNumber ? "Phone number detected" : "";
            phoneDetectionDiv.style.display = containsPhoneNumber ? 'block' : 'none';
            
            ssnDetectionDiv.textContent = containsSSN ? "SSN detected" : "";
            ssnDetectionDiv.style.display = containsSSN ? 'block' : 'none';
            
            ipDetectionDiv.textContent = containsIPAddress ? "IP address detected" : "";
            ipDetectionDiv.style.display = containsIPAddress ? 'block' : 'none';
            
            ccDetectionDiv.textContent = containsCreditCard ? "Credit card detected" : "";
            ccDetectionDiv.style.display = containsCreditCard ? 'block' : 'none';
          } else {
            resultDiv.textContent = 'No text found in input field.';
            resultDiv.style.display = 'block';
            numberDetectionDiv.style.display = 'none';
            emailDetectionDiv.style.display = 'none';
            urlDetectionDiv.style.display = 'none';
            phoneDetectionDiv.style.display = 'none';
            ssnDetectionDiv.style.display = 'none';
            ipDetectionDiv.style.display = 'none';
            ccDetectionDiv.style.display = 'none';
          }
        } else {
          resultDiv.textContent = 'Error scanning input field.';
          resultDiv.style.display = 'block';
          numberDetectionDiv.style.display = 'none';
          emailDetectionDiv.style.display = 'none';
          urlDetectionDiv.style.display = 'none';
          phoneDetectionDiv.style.display = 'none';
          ssnDetectionDiv.style.display = 'none';
          ipDetectionDiv.style.display = 'none';
          ccDetectionDiv.style.display = 'none';
        }
      });
    } catch (error) {
      console.error("Error in scanButton click event:", error);
    }
  });
  
  // Function that will be injected into the page
  function scanChatGPTInput() {
    const editableElements = document.querySelectorAll('[contenteditable="true"], textarea');
    let foundText = "";
    let found = false;
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
        found = true;
        foundText = text;
        
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
    
    return { 
      text: foundText, 
      found: found, 
      containsNumber: containsNumber,
      containsEmail: containsEmail,
      containsURL: containsURL,
      containsPhoneNumber: containsPhoneNumber,
      containsSSN: containsSSN,
      containsIPAddress: containsIPAddress,
      containsCreditCard: containsCreditCard
    };
  }