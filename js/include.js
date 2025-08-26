document.addEventListener('DOMContentLoaded', function() {
    // Fetch and insert the navigation
    fetch('nav.html')
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML('afterbegin', data);
            initMobileNav(); // Initialize mobile nav after loading
        })
        .catch(error => console.error('Error loading navigation:', error));

    // Fetch and insert the footer
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML('beforeend', data);
        })
        .catch(error => console.error('Error loading footer:', error));

    initGallery();
});