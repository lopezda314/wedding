// js/rsvp_lookup.js
document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURATION ---
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby_sKg5I3A02iXzjfIm68rnUfHNk5AqQW7bbtFAcCQct9dGjI6xkWSaNP1SQt6d3o6xPQ/exec';
    // --- END CONFIGURATION ---

    const lookupForm = document.getElementById('lookup-form');
    const lookupStatus = document.getElementById('lookup-status');
    const rsvpSection = document.getElementById('rsvp-section');
    const lookupSection = document.getElementById('lookup-section');

    lookupForm.addEventListener('submit', e => {
        e.preventDefault();
        const nameInput = document.getElementById('lookup-name');
        const guestName = nameInput.value.trim();
        if (!guestName) return;

        lookupStatus.textContent = 'Searching...';
        lookupStatus.style.color = '#333';

        fetch(`${SCRIPT_URL}?name\=${guestName}`)
            .then(response => response.json())
            .then(data => {
                if (data.result === 'success') {
                    lookupStatus.textContent = '';
                    displayRsvpForm(data.guestData);
                } else {
                    lookupStatus.textContent = "We couldn't find that name. Please ensure it matches your invitation exactly.";
                    lookupStatus.style.color = '#a94442';
                }
            })
            .catch(error => {
                console.error('Lookup Error!', error);
                lookupStatus.textContent = 'An error occurred. Please try again.';
                lookupStatus.style.color = '#a94442';
            });
    });

    function displayRsvpForm(guestData) {
        lookupSection.style.display = 'none';
        rsvpSection.style.display = 'block';

        if (guestData.HasResponded) {
            const rsvpHTML = `
                <p style="text-align:center;">Thank you, ${guestData.GuestName}. We have already received your RSVP!</p>
                <p style="text-align:center;">Would you like to make changes?</p>
                <button id="modify-status" class="button">Modify RSVP</button>
            `;
            rsvpSection.innerHTML = rsvpHTML;
            document.getElementById('modify-status').addEventListener('click', () => {
                guestData.HasResponded = false;
                displayRsvpForm(guestData);
            });
            return;
        }

        const invitedEvents = JSON.parse(guestData.Group) || [];
        const attendees = [guestData.GuestName, ...(guestData.PlusOneGuests ? guestData.PlusOneGuests.split(',').map(name => name.trim()).filter(name => name) : [])];

        const formHTML = `
            <p style="text-align:center;">Welcome, ${guestData.GuestName}!</p>
            <form id="guest-rsvp-form">
                <input type="hidden" name="GuestName" value="${guestData.GuestName}">
                <div class="form-group">
                    <label>Who will be celebrating with us?</label>
                    <div id="attendee-list">
                        ${attendees.map(name => `
                            <label class="attendee-checkbox">
                                <input type="checkbox" name="attending_guests" value="${name}">
                                <span>${name}</span>
                            </label>
                        `).join('')}
                    </div>
                </div>
                <div id="dynamic-fields" style="display:none;">
                    <div class="form-group">
                        <label>Please select the events you will be attending:</label>
                        <div class="event-selector">
                            ${invitedEvents.map(day => `
                                <h3 class="event-day">${day.day}</h3>
                                <div class="event-day-buttons">
                                    ${day.events.map(event => `
                                        <label class="event-button">
                                            <input type="checkbox" name="event-${event.toLowerCase().replace(/ /g, '-')}" value="${event}" class="sr-only" ${guestData.Events.split(", ").includes(event) ? 'checked' : ''}>
                                            <span>${event}</span>
                                        </label>
                                    `).join('')}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="dietary-restrictions">Any dietary restrictions or allergies?</label>
                        <input type="text" id="dietary-restrictions" name="DietaryRestrictions" placeholder="e.g., Vegetarian, Gluten-Free" value="${guestData.DietaryRestrictions || ''}">
                    </div>
                    <div class="form-group">
                        <label for="message">Leave us a message? (optional)</label>
                        <textarea id="message" name="Message" rows="4">${guestData.Message || ''}</textarea>
                    </div>
                </div>
                <button type="submit" class="button">Submit RSVP</button>
                <p id="rsvp-status" class="status-message"></p>
            </form>
        `;
        rsvpSection.innerHTML = formHTML;

        const dynamicFields = document.getElementById('dynamic-fields');
        const attendeeCheckboxes = document.querySelectorAll('input[name="attending_guests"]');

        function updateDynamicFields() {
            const anyAttending = Array.from(attendeeCheckboxes).some(checkbox => checkbox.checked);
            dynamicFields.style.display = anyAttending ? 'block' : 'none';
        }

        attendeeCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', updateDynamicFields);
        });

        // Initial check in case of pre-filled form
        updateDynamicFields();

        document.getElementById('guest-rsvp-form').addEventListener('submit', handleRsvpSubmission);
    }

    function handleRsvpSubmission(e) {
        e.preventDefault();
        const rsvpStatus = document.getElementById('rsvp-status');
        rsvpStatus.textContent = 'Sending...';

        const form = e.target;
        const formData = new FormData(form);
        const confirmedGuests = Array.from(form.querySelectorAll('input[name="attending_guests"]:checked')).map(cb => cb.value);

        if (confirmedGuests.length === 0) {
            formData.append('Attending', 'No, with regrets.');
        } else {
            formData.append('Attending', 'Yes, with pleasure!');
            formData.append('ConfirmedGuests', confirmedGuests.join(', '));
        }

        fetch(SCRIPT_URL, { method: 'POST', body: formData })
            .then(response => response.json())
            .then(data => {
                if (data.result === 'success') {
                    rsvpSection.innerHTML = `<p style="text-align:center;">Thank you! Your RSVP has been recorded.</p>`;
                } else { throw new Error(data.message); }
            })
            .catch(error => {
                console.error('Submit Error!', error);
                rsvpStatus.textContent = 'An error occurred. Please try again.';
            });
    }
});