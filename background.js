chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "sampleContextMenu",
    title: "ChatGPT Selected Text",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "sampleContextMenu") {
    const selectedText = info.selectionText;
    // Now you can pass this `selectedText` to other parts of your extension or use it as needed
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (selectedText) => {
        // Function to handle the selected text
        function sendTextToChatGPT(text) {
          console.log('Sending text to ChatGPT');
          const apiKey = 'YOUR_API_KEY'; // You should securely retrieve this, not hardcode it
          const data = {
            "model": "gpt-4-1106-preview",
            "messages": [
              {
                "role": "user",
                "content": "Can you explain: "+ text,
              }
            ],
            "temperature": 1,
            "max_tokens": 256,
            "top_p": 1,
            "frequency_penalty": 0,
            "presence_penalty": 0
          };
        
          fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          })
            .then(response => response.json())
            .then(data => {
              console.log('Success:', data.choices[0].message.content);
              // Handle the response data
            })
            .catch((error) => {
              console.error('Error:', error);
            });
        }
        sendTextToChatGPT(selectedText);
        // You can invoke more complex logic or UI here
      },
      args: [selectedText]
    });
  }
});


