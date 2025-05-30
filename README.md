<div align="center">
  <img src="icon.png" alt="jenkins-nudge icon" width="256" height="256">
</div>

# jenkins-nudge

> ⚡️ this entire extension was vibe coded. there are probably inaccuracies, but it works.

---


## Overview
jenkins-nudge is a chrome extension that lets you receive instant desktop notifications when your Jenkins jobs finish, right from the Jenkins web UI. it adds a 'notify on job completion' button next to the 'edit description' button on job and console pages, so you never miss a build result.

## example screenshots

### System notification example:
<img src="images/screenshot-example-system-notification.png" alt="jenkins-nudge system notification example" width="400">

### Settings popup example:
<img src="images/screenshot-settings-popup.png" alt="jenkins-nudge settings popup example" width="200">

### Status view example:
<img src="images/screenshot-example-status-view.png" alt="jenkins-nudge status view example" width="600">

### Console view example:
<img src="images/screenshot-example-console-output-view.png" alt="jenkins-nudge console view example" width="600">

## features
- one-click notifications for any jenkins job
- works on both job summary and console output pages
- notification includes job name, build number, and status
- optional sound alert for notifications
- lightweight and easy to use

## installation
1. clone or download this repository.
2. go to `chrome://extensions` in your browser.
3. enable 'developer mode' (top right).
4. click 'load unpacked' and select this project folder.

## usage
- visit any jenkins job page (e.g. `/job/your-job/123/`).
- click the 'notify on job completion' button (to the left of 'edit description').
- you'll get a desktop notification when the job finishes (success or failure).
- enable or disable sound in the extension popup.

## permissions
- notifications: to show desktop alerts
- storage: to save your sound preference
- activeTab, scripting: to inject the button into jenkins pages

## why jenkins-nudge?
there are many jenkins notifiers, but this one is:
- always visible where you need it (right in the ui)
- simple, no server setup or api tokens
- open source and privacy-friendly

## roadmap
- [ ] fix: make it reliably notify on job completion, sometimes it doesn't trigger if away from tab for too long, only when you come back to the tab does it notify
- [ ] feature: add some test to ensure I don't break features on future updates
- [ ] docs: add version of Jenkins tested to README
- [ ] submit to chrome web store
- [ ] fix: remove from main job page, OR make it work and fix the placement so it looks good
- [ ] fix: button hover effect only works after first hover
- [ ] feature: pulse the icon when their are jobs in the notification queue (or show a number)
- [ ] feature: show a list of active notifications in the queue when clicking the icon in the toolbar
- [ ] feature: add an "x" on each notification in the queue view in the popup to remove the notification from the queue
- [ ] feature: add a "clear all" button in the popup to remove all notifications from the queue


---

made with ❤️ for devs who want to stay in the loop, not in the dark.
