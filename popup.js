document.getElementById('scanButton').addEventListener('click', async () => {
    // Get the current active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // Execute the content script function to scan the text
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: scanChatGPTInput
    }, (results) => {
      const resultDiv = document.getElementById('result');
      
      if (results && results[0] && results[0].result) {
        const { text, found } = results[0].result;
        
        if (found) {
          resultDiv.textContent = `Text found: ${text}`;
          resultDiv.style.display = 'block';
        } else {
          resultDiv.textContent = 'No text found in input field.';
          resultDiv.style.display = 'block';
        }
      } else {
        resultDiv.textContent = 'Error scanning input field.';
        resultDiv.style.display = 'block';
      }
    });
  });
  
  // Function that will be injected into the page
  function scanChatGPTInput() {
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
    
    return { text: foundText, found: found };
  }