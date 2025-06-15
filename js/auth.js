// Wait for the HTML document to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration ---
    // Hashed passwords. Replace these with your own generated hashes.
    // TODO: david - generate these hashes using a secure method
    const PASSWORDS = {
        // 'groupName': 'hashedPassword'
        'all': '06b557a84d9e50cb1eed5a963d848406a64dc2f0cfd781ef89f667abbfcf1c9b', // Corresponds to 'vamos'
    };
    // -------------------

    const loginForm = document.getElementById('login-form');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', (event) => {
        // Prevent the form from submitting the traditional way
        event.preventDefault();

        const enteredPassword = passwordInput.value;
        if (!enteredPassword) {
            return; // Do nothing if the field is empty
        }

        // Hash the entered password using SHA-256
        const hashedInput = CryptoJS.SHA256(enteredPassword).toString();

        // Check if the hashed input matches any of our stored password hashes
        for (const group in PASSWORDS) {
            if (hashedInput === PASSWORDS[group]) {
                // SUCCESS!
                // Store the user's group for use on other pages
                sessionStorage.setItem('guestGroup', group);
                
                // Redirect to the home page
                window.location.href = 'home.html';
                return; // Exit the function
            }
        }
        
        // If we get here, no password matched
        errorMessage.textContent = 'Incorrect password. Please try again.';
        passwordInput.value = ''; // Clear the input field
    });
});