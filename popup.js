// popup.js

// Function to update the subtitle list in the popup
function updateSubtitleList(subtitles) {
  const subtitleList = document.getElementById('subtitleItems');
  subtitleList.innerHTML = ''; // Clear the existing list

  subtitles.forEach((subtitle, index) => {
    const listItem = document.createElement('li');
    listItem.classList.add('subtitleItem');
    listItem.textContent = `Subtitle ${index + 1}: ${subtitle}`;
    subtitleList.appendChild(listItem);
  });
}

// Function to handle the "Edit Subtitle" button click
document.getElementById('editSubtitleBtn').addEventListener('click', function () {
  const editedSubtitleText = document.getElementById('subtitleInput').value.trim();
  if (editedSubtitleText !== '') {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, { action: 'editSubtitle', data: editedSubtitleText });
    });
  }
});

// Function to handle the "Delete Subtitle" button click
document.getElementById('deleteSubtitleBtn').addEventListener('click', function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, { action: 'deleteSubtitle' });
  });
});

// Function to handle the "Add Subtitle" button click
document.getElementById('addSubtitleBtn').addEventListener('click', function () {
  const newSubtitleText = document.getElementById('subtitleInput').value.trim();
  if (newSubtitleText !== '') {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, { action: 'addSubtitle', data: newSubtitleText });
    });
  }
});

// Event listener for receiving subtitle list updates from content script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'updateSubtitleList') {
    const subtitles = request.data;
    updateSubtitleList(subtitles);
  } else if (request.action === 'subtitleDeleted') {
    console.log('Subtitle deleted successfully.');
  } else if (request.action === 'subtitleAdded') {
    console.log('Subtitle added successfully.');
  } else if (request.action === 'error') {
    console.error(`Error: ${request.errorMessage}`);
  }
  // Add more message handling logic as needed
});
