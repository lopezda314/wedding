// js/protect.js

// Check if a 'guestGroup' is stored in the session.
// sessionStorage is cleared when the browser tab is closed.
const guestGroup = sessionStorage.getItem('guestGroup');

if (!guestGroup) {
    // If no guest group is found, redirect back to the login page.
    // The path '../index.html' goes one directory up to find the login page.
    // We adjust the path depending on where this script is called from.
    // For simplicity, we assume all protected pages are in the root directory with index.html.
    window.location.href = 'index.html';
}