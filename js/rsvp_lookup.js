// js/rsvp_lookup.js
document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURATION ---
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby1DO_pT8FpgPvZMv3oUCcN19MZNUql1y0d7zro_r5mVpBIvnwEhsB3uBhYEyjK1jVMQA/exec';
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

        let rsvpHTML;
        if (guestData.HasResponded) {
            rsvpHTML = `
            <p style="text-align:center;">Thank you, ${guestData.GuestName}. We have already received your RSVP!</p>
            <p style="text-align:center;">Would you like to make changes?</p>
            <select id="modify-status" name="Modify" required>
            <option value="" disabled selected>Please choose an option</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
            </select>
            `;
            rsvpSection.innerHTML = rsvpHTML;
            const modifySelect = document.getElementById('modify-status');
            modifySelect.addEventListener('change', () => {
                if (modifySelect.value === 'Yes') {
                    guestData.HasResponded = false; // Reset the response
                    displayRsvpForm(guestData); // Redisplay the form
                    return;
                } else {
                    return;
                }
            });

            return;
        }

        const invitedEvents = JSON.parse(guestData.Group) || [];
        const plusOneAllowed = guestData.PlusOneAllowed === true;

        const formHTML = `
    <p style="text-align:center;">Welcome, ${guestData.GuestName}!</p>
    <form id="guest-rsvp-form">
        <input type="hidden" name="GuestName" value="${guestData.GuestName}">
        <div class="form-group">
            <label>Will you be celebrating with us?</label>
            <select id="attending-status" name="Attending" required>
                <option value="" disabled selected>Please choose an option</option>
                <option value="Yes, with pleasure!">Yes, with pleasure!</option>
                <option value="No, with regrets.">No, with regrets.</option>
            </select>
        </div>
        <div id="dynamic-fields" style="display:none;">
            ${plusOneAllowed ? `
            <div class="form-group">
                <label for="plus-one-name">Name of your Guest</label>
                <input type="text" id="plus-one-name" name="PlusOneName">
            </div>` : ''}

            <div class="form-group">
                <label>Please select the events you will be attending:</label>
                <div class="event-selector">
                    ${invitedEvents.map(day => `
                        <h3 class="event-day">${day.day}</h3>
                        <div class="event-day-buttons">
                            ${day.events.map(event => `
                                <label class="event-button">
                                    <input type="checkbox" name="event-${event.toLowerCase().replace(/ /g, '-')}" value="${event}" class="sr-only">
                                    <span>${event}</span>
                                </label>
                            `).join('')}
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="form-group">
                <label for="dietary-restrictions">Any dietary restrictions or allergies?</label>
                <input type="text" id="dietary-restrictions" name="DietaryRestrictions" placeholder="e.g., Vegetarian, Gluten-Free">
            </div>
            <div class="form-group">
                <label for="message">Leave us a message? (optional)</label>
                <textarea id="message" name="Message" rows="4"></textarea>
            </div>
        </div>
        <button type="submit" class="button">Submit RSVP</button>
        <p id="rsvp-status" class="status-message"></p>
    </form>
`;
        rsvpSection.innerHTML = formHTML;

        // Add event listeners to the newly created form
        const attendingSelect = document.getElementById('attending-status');
        const dynamicFields = document.getElementById('dynamic-fields');
        const skipRSVPCheck = guestData.GuestName === 'ff' || guestData.GuestName === 'Dlo';
        if (skipRSVPCheck) {
            dynamicFields.style.display = 'block';
        }
        attendingSelect.addEventListener('change', () => {
            dynamicFields.style.display = attendingSelect.value.startsWith('Yes') ? 'block' : 'none';
        });

        const rsvpForm = document.getElementById('guest-rsvp-form');
        rsvpForm.addEventListener('submit', handleRsvpSubmission);
    }

    function handleRsvpSubmission(e) {
        e.preventDefault();
        const rsvpStatus = document.getElementById('rsvp-status');
        rsvpStatus.textContent = 'Sending...';

        const form = e.target;
        const formData = new FormData(form);

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