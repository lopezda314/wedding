// js/rsvp_lookup.js
document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURATION ---
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwnWXjFefXsSW45bEYuC32qut0yj3H_7P63VIlh8GfQjWflRY_zUXxT_cc-rBGGu8_MEw/exec';
    const EVENT_TO_COLUMN_MAP = {
        'welcome-cocktail-and-paella-celebration': 'WelcomeCocktail',
        'padel': 'Padel',
        'wedding-ceremony-and-reception': 'Ceremony',
        'farewell-brunch': 'Brunch',
    }
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
                    // Store the guest's name in local storage for game high scores
                    localStorage.setItem('guestName', guestName);
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
                <div class="rsvp-page">
                <p style="text-align:center;">Thank you, ${guestData.GuestName}. We have already received your RSVP!</p>
                <p style="text-align:center;">Would you like to make changes?</p>
                <button id="modify-status" class="button">Modify RSVP</button>
                </div>
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
            <div class="rsvp-page">
            <p style="text-align:center; font-size:24px">Welcome, ${guestData.GuestName}!</p>
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
                <div class="form-group">
                    <label class="attendee-checkbox">
                        <input type="checkbox" id="bringing-kids-checkbox">
                        <span>Are you bringing any children (under 18)?</span>
                    </label>
                    <a href="/faq.html#kids" target="_blank" class="faq-link">See our FAQ about kids</a>
                </div>
                <div id="dynamic-fields" style="display:none;">
                    <div class="form-group">
                        <label>Please select the events you will be attending:</label>
                        <div class="event-selector">
                            ${invitedEvents.map(day => `
                                <h3 class="event-day">${day.day}</h3>
                                <div class="event-day-buttons">
                                    ${day.events.map(event => {
                                        const eventId = event.toLowerCase().replace(/ /g, '-');
                                        const isWeddingEvent = eventId === 'wedding-ceremony-and-reception';
                                        return `
                                        <div class="event-container">
                                            <label class="event-button">
                                                <input type="checkbox" name="event-${eventId}" value="${event}" class="sr-only event-checkbox" ${guestData.Events.split(", ").includes(event) ? 'checked' : ''}>
                                                <span class="event-button-content">${event}</span>
                                            </label>
                                            <div class="event-attendance-details" style="display: none;">
                                                <div class="form-group adults-input">
                                                    <label for="adults-${eventId}">Attendees</label>
                                                    <input type="number" id="adults-${eventId}" name="adults-${eventId}" min="0" max="${attendees.length}" value="${guestData[`${EVENT_TO_COLUMN_MAP[eventId]}Adults`] || 0}">
                                                </div>
                                                <div class="kids-input-container" style="display: none;">
                                                    ${!isWeddingEvent ? `
                                                    <div class="form-group">
                                                        <label for="kids-${eventId}">Kids (under 18)</label>
                                                        <input type="number" id="kids-${eventId}" name="kids-${eventId}" min="0" max="5" value="${guestData[`${EVENT_TO_COLUMN_MAP[eventId]}Kids`] || 0}">
                                                    </div>
                                                    ` : ''}
                                                </div>
                                            </div>
                                        </div>
                                    `}).join('')}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="dietary-restrictions">Any dietary restrictions or allergies for you or any members of your party? We will be having a set menu, so please specify the name of the person and their dietary restriction.</label>
                        <input type="text" id="dietary-restrictions" name="DietaryRestrictions" placeholder="David: Vegan, Amanda: No fish and gluten-free" value="${guestData.DietaryRestrictions || ''}">
                    </div>
                    <div class="form-group">
                        <label for="beauty-services">The venue offers hair and makeup for 95€ each. Would you like to book any beauty services for the day of the wedding?</label>
                        <input type="text" id="beauty-services" name="BeautyServices" placeholder="e.g. Hair for Enoki" value="${guestData.BeautyServices || ''}">
                    </div>
                    <div class="form-group">
                        <label for="message">Leave us a message! (optional)</label>
                        <textarea id="message" name="Message" rows="4">${guestData.Message || ''}</textarea>
                    </div>
                </div>
                <button style="display: block; margin: 0 auto;" type="submit" class="button">Submit RSVP</button>
                <p id="rsvp-status" class="status-message"></p>
            </form>
            </div>
        `;
        rsvpSection.innerHTML = formHTML;

        const dynamicFields = document.getElementById('dynamic-fields');
        const attendeeCheckboxes = document.querySelectorAll('input[name="attending_guests"]');
        const eventCheckboxes = document.querySelectorAll('.event-checkbox');
        const bringingKidsCheckbox = document.getElementById('bringing-kids-checkbox');
        const form = document.getElementById('guest-rsvp-form');

        function updateDynamicFields() {
            const attendingCount = document.querySelectorAll('input[name="attending_guests"]:checked').length;
            const anyAttending = attendingCount > 0;
            dynamicFields.style.display = anyAttending ? 'block' : 'none';

            const adultInputs = form.querySelectorAll('.adults-input input[type="number"]');
            adultInputs.forEach(input => {
                input.max = attendingCount;
            });
        }

        function toggleEventAttendanceDetails(event) {
            const details = event.target.closest('.event-container').querySelector('.event-attendance-details');
            if (details) {
                details.style.display = event.target.checked ? 'block' : 'none';
            }
        }

        function toggleKidsInputs() {
            const kidsInputContainers = form.querySelectorAll('.kids-input-container');
            kidsInputContainers.forEach(container => {
                container.style.display = bringingKidsCheckbox.checked ? 'block' : 'none';
            });
        }

        attendeeCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', updateDynamicFields);
        });

        eventCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', toggleEventAttendanceDetails);
            toggleEventAttendanceDetails({ target: checkbox });
        });

        bringingKidsCheckbox.addEventListener('change', toggleKidsInputs);

        updateDynamicFields();
        toggleKidsInputs();

        form.addEventListener('submit', handleRsvpSubmission);
    }

    function handleRsvpSubmission(e) {
        e.preventDefault();
        const rsvpStatus = document.getElementById('rsvp-status');
        rsvpStatus.textContent = 'Sending...';
        rsvpStatus.style.color = '#333';

        const form = e.target;

        const errorInputs = form.querySelectorAll('.error');
        errorInputs.forEach(input => input.classList.remove('error'));

        const formData = new FormData(form);
        const confirmedGuests = Array.from(form.querySelectorAll('input[name="attending_guests"]:checked')).map(cb => cb.value);
        const confirmedGuestsCount = confirmedGuests.length;

        if (confirmedGuestsCount === 0) {
            formData.append('Attending', 'No, with regrets.');
        } else {
            formData.append('Attending', 'Yes, with pleasure!');
            formData.append('ConfirmedGuests', confirmedGuests.join(', '));
        }

        const eventCheckboxes = form.querySelectorAll('.event-checkbox:checked');
        let validationError = false;

        for (const checkbox of eventCheckboxes) {
            const eventContainer = checkbox.closest('.event-container');
            const eventName = checkbox.value;
            const eventId = checkbox.name.replace('event-', '');
            const adultsInput = eventContainer.querySelector(`#adults-${eventId}`);
            const kidsInput = eventContainer.querySelector(`#kids-${eventId}`);
            
            const adults = parseInt(adultsInput.value, 10) || 0;
            const kids = kidsInput ? (parseInt(kidsInput.value, 10) || 0) : 0;

            if (adults > confirmedGuestsCount) {
                rsvpStatus.textContent = `For the ${eventName} event, the number of adults (${adults}) cannot exceed the number of confirmed guests (${confirmedGuestsCount}).`;
                rsvpStatus.style.color = '#a94442';
                adultsInput.classList.add('error');
                adultsInput.focus();
                validationError = true;
                break;
            }

            if (kids > 5) {
                rsvpStatus.textContent = `For the ${eventName} event, the number of kids cannot exceed 5.`;
                rsvpStatus.style.color = '#a94442';
                kidsInput.classList.add('error');
                kidsInput.focus();
                validationError = true;
                break;
            }
            
            formData.append(`${EVENT_TO_COLUMN_MAP[eventId]}Adults`, adults);
            if (kidsInput) {
                formData.append(`${EVENT_TO_COLUMN_MAP[eventId]}Kids`, kids);
            }
        }

        if (validationError) {
            return; 
        }

        fetch(SCRIPT_URL, { method: 'POST', body: formData })
            .then(response => response.json())
            .then(data => {
                if (data.result === 'success') {
                    rsvpSection.innerHTML = `
                    <div class="rsvp-page">
                    <p style="text-align:center;">Thank you! Your RSVP has been recorded.</p>
                    </div>`;
                } else { throw new Error(data.message); }
            })
            .catch(error => {
                console.error('Submit Error!', error);
                rsvpStatus.textContent = 'An error occurred. Please try again.';
                rsvpStatus.style.color = '#a94442';
            });
    }
});