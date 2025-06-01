// js/rsvp.js

document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURATION ---
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyk6wZfe0KD6rkrbfOYPiofYh744Sxx1F-zUyDu35PS79NaWyS7r5fbuX1B5xgsFYUNiQ/exec'; 

    // Define which events each group is invited to
    const eventsByGroup = {
        'family': ['Rehearsal Dinner', 'Wedding Ceremony', 'Reception'],
        'friends': ['Wedding Ceremony', 'Reception']
    };
    // --- END CONFIGURATION ---

    const form = document.getElementById('guest-rsvp-form');
    const statusMsg = document.getElementById('rsvp-status');
    const attendingSelect = document.getElementById('attending-status');

    const plusOneGroup = document.getElementById('plus-one-group');
    const eventsGroup = document.getElementById('events-group');
    const dietaryGroup = document.getElementById('dietary-group');
    const messageGroup = document.getElementById('message-group');
    const eventsCheckboxes = document.getElementById('events-checkboxes');

    // Function to dynamically create event checkboxes
    function populateEvents() {
        const guestGroup = sessionStorage.getItem('guestGroup');
        const invitedEvents = eventsByGroup[guestGroup] || []; // Default to empty array if group not found

        eventsCheckboxes.innerHTML = ''; // Clear existing checkboxes

        invitedEvents.forEach(event => {
            const eventId = `event-${event.toLowerCase().replace(/ /g, '-')}`;
            const checkboxHTML = `
                <label>
                    <input type="checkbox" name="<span class="math-inline">\{eventId\}" value\="</span>{event}">
                    ${event}
                </label>
            `;
            eventsCheckboxes.insertAdjacentHTML('beforeend', checkboxHTML);
        });
    }

    // Show/hide form parts based on attendance status
    attendingSelect.addEventListener('change', () => {
        const isAttending = attendingSelect.value.startsWith('Yes');

        plusOneGroup.style.display = isAttending ? 'block' : 'none';
        eventsGroup.style.display = isAttending ? 'block' : 'none';
        dietaryGroup.style.display = isAttending ? 'block' : 'none';
        messageGroup.style.display = isAttending ? 'block' : 'none';

        if (isAttending) {
            // Assumes family gets a plus one, can be made more granular
             const guestGroup = sessionStorage.getItem('guestGroup');
             plusOneGroup.style.display = (guestGroup === 'family') ? 'block' : 'none';
        }
    });

    // Handle the form submission
    form.addEventListener('submit', e => {
        e.preventDefault();
        statusMsg.textContent = 'Sending...';

        const formData = new FormData(form);
        fetch(SCRIPT_URL, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.result === 'success') {
                statusMsg.textContent = 'Thank you! Your RSVP has been recorded.';
                form.reset();
                // Hide the extra fields again
                attendingSelect.dispatchEvent(new Event('change'));
            } else {
                throw new Error(data.message || 'An unknown error occurred.');
            }
        })
        .catch(error => {
            console.error('Error!', error);
            statusMsg.textContent = `Error: ${error.message}. Please try again.`;
        });
    });

    // Initial setup
    populateEvents();
});