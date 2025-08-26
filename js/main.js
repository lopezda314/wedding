function initMobileNav() {
    const primaryNav = document.querySelector('.primary-navigation');
    const navToggle = document.querySelector('.mobile-nav-toggle');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            const visibility = primaryNav.getAttribute('data-visible');

            if (visibility === "false" || visibility === null) {
                primaryNav.setAttribute('data-visible', true);
                navToggle.setAttribute('aria-expanded', true);
            } else {
                primaryNav.setAttribute('data-visible', false);
                navToggle.setAttribute('aria-expanded', false);
            }
        });
    }
}

function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (window.innerWidth < 768) {
        galleryItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
            });
        });
        return;
    }

    if (galleryItems.length > 0) {
        galleryItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                
                const imageUrl = item.getAttribute('href');
                const instance = basicLightbox.create(`
                    <div class="gallery-lightbox">
                        <img src="${imageUrl}">
                        <button class="close-button">&times;</button>
                    </div>
                `, {
                    onShow: (instance) => {
                        const lightbox = instance.element();
                        lightbox.querySelector('.close-button').onclick = instance.close;
                        lightbox.onclick = (event) => {
                            if (event.target.tagName !== 'IMG') {
                                instance.close();
                            }
                        };
                        document.addEventListener('keydown', (event) => {
                            if (event.key === 'Escape') {
                                instance.close();
                            }
                        });
                    },
                    onClose: (instance) => {
                        document.removeEventListener('keydown', (event) => {
                            if (event.key === 'Escape') {
                                instance.close();
                            }
                        });
                    }
                });
                instance.show();
            });
        });
    }
}
