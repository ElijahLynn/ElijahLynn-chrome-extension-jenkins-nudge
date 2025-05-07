chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'notify') {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: chrome.runtime.getURL('icon.png'),
      title: 'Jenkins Job Status',
      message: request.message
    });

    chrome.storage.sync.get('playSound', ({ playSound }) => {
      if (playSound) {
        chrome.tabs.query({}, (tabs) => {
          for (const tab of tabs) {
            chrome.scripting.executeScript({
              target: { tabId: tab.id },
              func: () => {
                const audio = new Audio(chrome.runtime.getURL('done.mp3'));
                audio.play();
              }
            }, () => {
              if (chrome.runtime.lastError) {
                // ignore if cannot inject
              }
            });
          }
        });
        // send to popup
        chrome.runtime.sendMessage({ type: 'playSound' }, () => {
          if (chrome.runtime.lastError) {
            // ignore if no receiver
          }
        });
      }
    });
  }
});
