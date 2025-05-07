const button = document.createElement('button');
button.textContent = 'Notify on Job Completion';
button.style.cssText = `
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  padding: 12px 20px;
  background: linear-gradient(90deg, #0b79d0 0%, #1fa2ff 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(11, 121, 208, 0.15), 0 1.5px 4px rgba(0,0,0,0.08);
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s, transform 0.1s;
  outline: none;
`;
button.onmouseover = () => {
  button.style.background = 'linear-gradient(90deg, #1fa2ff 0%, #0b79d0 100%)';
  button.style.boxShadow = '0 6px 24px rgba(31, 162, 255, 0.18), 0 2px 8px rgba(0,0,0,0.10)';
  button.style.transform = 'translateY(-2px) scale(1.03)';
};
button.onmouseout = () => {
  button.style.background = 'linear-gradient(90deg, #0b79d0 0%, #1fa2ff 100%)';
  button.style.boxShadow = '0 4px 16px rgba(11, 121, 208, 0.15), 0 1.5px 4px rgba(0,0,0,0.08)';
  button.style.transform = 'none';
};

// find the edit description button
const editDescBtn = Array.from(document.querySelectorAll('a,button')).find(
  el => el.textContent.trim().toLowerCase() === 'edit description'
);

// find the download button on the console page
const downloadBtn = Array.from(document.querySelectorAll('a,button')).find(
  el => el.textContent.trim().toLowerCase() === 'download'
);

if (downloadBtn && downloadBtn.parentElement) {
  // match style
  button.className = downloadBtn.className;
  button.style.cssText = downloadBtn.style.cssText;
  // insert to the left
  downloadBtn.parentElement.insertBefore(button, downloadBtn);
} else if (editDescBtn && editDescBtn.parentElement) {
  // match style
  button.className = editDescBtn.className;
  button.style.cssText = editDescBtn.style.cssText;
  // insert to the left
  editDescBtn.parentElement.insertBefore(button, editDescBtn);
} else {
  // fallback: append to body
  document.body.appendChild(button);
}

let observer = null;
let lastStatus = '';

function getJobStatusText() {
  // look for the first text node containing 'Success' or 'Failure'
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
  let node;
  while ((node = walker.nextNode())) {
    if (node.textContent.includes('Success') || node.textContent.includes('Failure')) {
      return node.textContent.trim();
    }
  }
  return '';
}

function getJobInfo() {
  // try to get job name and build number from breadcrumbs or heading
  let jobName = '';
  let buildNumber = '';
  // try breadcrumbs: look for a pattern like #31409
  const crumbs = Array.from(document.querySelectorAll('a,span')).map(el => el.textContent.trim());
  const buildCrumbIdx = crumbs.findIndex(t => /^#\d+$/.test(t));
  if (buildCrumbIdx !== -1) {
    buildNumber = crumbs[buildCrumbIdx].replace(/^#/, '');
    if (buildCrumbIdx > 0) jobName = crumbs[buildCrumbIdx - 1];
  }
  // fallback: try heading
  if (!jobName || !buildNumber) {
    const heading = document.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) {
      const m = heading.textContent.match(/#(\d+)/);
      if (m) buildNumber = m[1];
      jobName = heading.textContent.replace(/#\d+.*/, '').trim();
    }
  }
  return { jobName, buildNumber };
}

button.addEventListener('click', () => {
  if (observer) return;

  // show a temporary message
  const msg = document.createElement('div');
  msg.textContent = 'watching for job completion...';
  msg.style.cssText = `
    position: fixed;
    top: 60px;
    right: 20px;
    background: #fff;
    color: #0b79d0;
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(11,121,208,0.10);
    padding: 8px 16px;
    font-size: 0.95rem;
    font-weight: 500;
    z-index: 1001;
    border: 1px solid #e0eaf6;
    pointer-events: none;
    opacity: 0.98;
  `;
  document.body.appendChild(msg);
  setTimeout(() => msg.remove(), 2200);

  // check status immediately
  const status = getJobStatusText();
  const { jobName, buildNumber } = getJobInfo();
  if (status.includes('Success') || status.includes('Failure')) {
    chrome.runtime.sendMessage({
      type: 'notify',
      message: `Job: ${jobName || 'Unknown'} #${buildNumber || '?'}\nStatus: ${status}`
    });
    return;
  }

  observer = new MutationObserver(() => {
    const status = getJobStatusText();
    if ((status.includes('Success') || status.includes('Failure')) && status !== lastStatus) {
      lastStatus = status;
      const { jobName, buildNumber } = getJobInfo();
      chrome.runtime.sendMessage({
        type: 'notify',
        message: `Job: ${jobName || 'Unknown'} #${buildNumber || '?'}\nStatus: ${status}`
      });
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
});

// sticky/floating logic
let isFloating = false;
let origRect = null;
let origParent = null;
let origNext = null;

function floatButton() {
  if (isFloating) return;
  isFloating = true;
  origRect = button.getBoundingClientRect();
  origParent = button.parentElement;
  origNext = button.nextSibling;
  button.style.position = 'fixed';
  button.style.top = '20px';
  button.style.right = '20px';
  button.style.left = '';
  button.style.zIndex = 1000;
  button.style.margin = '0';
  document.body.appendChild(button);
}

function unfloatButton() {
  if (!isFloating) return;
  isFloating = false;
  button.style.position = '';
  button.style.top = '';
  button.style.right = '';
  button.style.left = '';
  button.style.zIndex = '';
  button.style.margin = '';
  if (origParent) {
    origParent.insertBefore(button, origNext);
  }
}

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (y > 60) {
    floatButton();
  } else {
    unfloatButton();
  }
});

// play sound when requested by background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'playSound') {
    const audio = new Audio(chrome.runtime.getURL('ding.mp3'));
    audio.play();
  }
});
