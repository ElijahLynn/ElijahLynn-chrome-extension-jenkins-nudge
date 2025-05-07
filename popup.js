// play sound checkbox logic
const cb = document.getElementById('soundCheckbox');
// load the value on popup open
chrome.storage.sync.get('playSound', ({ playSound }) => {
    cb.checked = !!playSound;
});
// update storage and UI on change
cb.addEventListener('change', () => {
    chrome.storage.sync.set({ playSound: cb.checked }, () => {
        chrome.storage.sync.get('playSound', ({ playSound }) => {
            cb.checked = !!playSound;
        });
    });
});
// test notification button
const testBtn = document.getElementById('testNotifyBtn');
testBtn.onclick = () => {
    chrome.runtime.sendMessage({ type: 'notify', message: 'This is a test notification from Jenkins Job Notifier.' });
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'playSound') {
        const audio = new Audio(chrome.runtime.getURL('ding.mp3'));
        audio.play();
    }
});
