// content.js

// Function to identify and update subtitles based on language
// Function to update subtitle text based on the selected language
const axios = require('axios');

const apiKey = 'a_ShTdpSespV9HMYJK1BXT5IcghS8ZagOayBD80PTJSf3sLStZ8EV2VSe268IgPxkVlBVxZPe2JTVavPJs';
const apiUrl = 'https://lingvanex.com/api/v1/translate';

async function translateSubtitle(text, language) {
  try {
    const response = await axios.post(apiUrl, {
      text: text,
      from: 'auto', // Automatically detect source language
      to: language,
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    return response.data.result.translations[0].text;
  } catch (error) {
    console.error(`Translation error: ${error.message}`);
    return text;
  }
}


  
  // Function to update subtitles based on language
  async function updateSubtitles(language) {
    // Example: Assume subtitles are identified by the class 'subtitle'
    const subtitles = document.querySelectorAll('.subtitle');
  
    for (const subtitle of subtitles) {
      try {
        const translatedText = await translateSubtitle(subtitle.textContent, language);
        subtitle.textContent = translatedText;
      } catch (error) {
        console.error(`Error updating subtitle: ${error.message}`);
      }
    }
  
    console.log(`Subtitles updated for language: ${language}`);
  }
  
  
  
  
  
  
  // Listen for messages from the popup or other components
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'changeLanguage') {
      const selectedLanguage = request.language;
      updateSubtitles(selectedLanguage);
    } else if (request.action === 'editSubtitle') {
      // Add logic to handle subtitle editing
      const editedSubtitleText = request.data;
      console.log(`Subtitle edited: ${editedSubtitleText}`);
    }
    // Add more message handling logic as needed
  });
  
  // Example: You might also want to add logic to identify and display subtitles initially
  // You can use a MutationObserver to detect changes to the DOM and react accordingly.
  // This is just a basic example, and the actual implementation might vary based on your needs.
  
  // MutationObserver example
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      // Check if subtitles were added or modified and update them accordingly
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        updateSubtitles('en'); // Assume English initially, update as needed
      }
    });
  });
  
  // Start observing changes to the Netflix page
  observer.observe(document.body, { childList: true, subtree: true });
  