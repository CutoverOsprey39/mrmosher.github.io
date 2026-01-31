// hamburger menu toggle
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking a nav link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
});

//resume dropdown toggle
document.addEventListener('DOMContentLoaded', function() {
    const dropbtn = document.querySelector('.dropbtn');
    const dropdownContent = document.querySelector('.dropdown-content');
    const arrow = document.querySelector('.arrow');

    if (dropbtn && dropdownContent && arrow) {
        dropbtn.addEventListener('click', function() {
            dropdownContent.classList.toggle('show');
            arrow.style.transform = dropdownContent.classList.contains('show') 
                ? 'rotate(0deg)' 
                : 'rotate(-90deg)';
        });
    }
});
//gallery preview toggle
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('.project-gallery .image img');
    const previewContainer = document.querySelector('.preview-image');
    const previewImage = document.querySelector('.preview-image img.zoomable');
    const previewDescription = document.querySelector('.preview-image .image-desc');
    const closeButton = document.querySelector('.preview-image span');
    const zoomInButton = document.querySelector('.zoom-btn.zoom-in');
    const zoomOutButton = document.querySelector('.zoom-btn.zoom-out');

    // Debugging: Log elements
    console.log('Images:', images);
    console.log('Preview Container:', previewContainer);
    console.log('Preview Image:', previewImage);
    console.log('Preview Description:', previewDescription);
    console.log('Close Button:', closeButton);
    console.log('Zoom In Button:', zoomInButton);
    console.log('Zoom Out Button:', zoomOutButton);

    if (!previewContainer || !previewImage || !closeButton || !previewDescription || !zoomInButton || !zoomOutButton) {
        console.error('One or more preview elements not found');
        return;
    }

    let zoomLevel = 1;
    const minZoom = 1;
    const maxZoom = 3;
    const zoomStep = 0.2;
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let translateX = 0;
    let translateY = 0;

    // Function to update zoom and pan
    function updateTransform() {
        // Constrain panning when zoomed
        if (zoomLevel > 1) {
            const rect = previewImage.getBoundingClientRect();
            const maxTranslateX = (rect.width * (zoomLevel - 1)) / (2 * zoomLevel);
            const maxTranslateY = (rect.height * (zoomLevel - 1)) / (2 * zoomLevel);
            translateX = Math.max(-maxTranslateX, Math.min(maxTranslateX, translateX));
            translateY = Math.max(-maxTranslateY, Math.min(maxTranslateY, translateY));
        } else {
            translateX = 0;
            translateY = 0;
        }
        previewImage.style.transform = `scale(${zoomLevel}) translate(${translateX}px, ${translateY}px)`;
        previewImage.style.cursor = zoomLevel > 1 ? 'move' : 'default';
        console.log('Zoom:', zoomLevel, 'Translate:', translateX, translateY);
    }

    // Open preview
    images.forEach(image => {
        image.addEventListener('click', () => {
            console.log('Image clicked:', image.src);
            previewImage.src = image.getAttribute('src');
            previewImage.alt = image.getAttribute('alt');
            previewDescription.textContent = image.getAttribute('data-desc') || 'No description available';
            zoomLevel = 1;
            translateX = 0;
            translateY = 0;
            updateTransform();
            previewContainer.style.display = 'flex';
        });
    });

    // Close preview
    closeButton.addEventListener('click', () => {
        console.log('Close button clicked');
        previewContainer.style.display = 'none';
        previewImage.src = '';
        previewDescription.textContent = '';
        zoomLevel = 1;
        translateX = 0;
        translateY = 0;
        updateTransform();
    });

    // Close preview when clicking outside
    previewContainer.addEventListener('click', (e) => {
        if (e.target === previewContainer) {
            console.log('Clicked outside image');
            previewContainer.style.display = 'none';
            previewImage.src = '';
            previewDescription.textContent = '';
            zoomLevel = 1;
            translateX = 0;
            translateY = 0;
            updateTransform();
        }
    });

    // Zoom in button
    zoomInButton.addEventListener('click', () => {
        zoomLevel = Math.min(zoomLevel + zoomStep, maxZoom);
        updateTransform();
    });

    // Zoom out button
    zoomOutButton.addEventListener('click', () => {
        zoomLevel = Math.max(zoomLevel - zoomStep, minZoom);
        if (zoomLevel <= 1) {
            translateX = 0;
            translateY = 0;
        }
        updateTransform();
    });

    // Mouse wheel zoom
    previewImage.addEventListener('wheel', (e) => {
        e.preventDefault();
        if (e.deltaY < 0) {
            zoomLevel = Math.min(zoomLevel + zoomStep, maxZoom);
        } else {
            zoomLevel = Math.max(zoomLevel - zoomStep, minZoom);
            if (zoomLevel <= 1) {
                translateX = 0;
                translateY = 0;
            }
        }
        updateTransform();
    });

    // Pinch-to-zoom for touch devices
    let initialDistance = null;
    let initialZoom = null;

    previewImage.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
            e.preventDefault();
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            initialDistance = Math.hypot(
                touch1.pageX - touch2.pageX,
                touch1.pageY - touch2.pageY
            );
            initialZoom = zoomLevel;
        } else if (e.touches.length === 1 && zoomLevel > 1) {
            e.preventDefault();
            const touch = e.touches[0];
            startX = touch.clientX - translateX;
            startY = touch.clientY - translateY;
        }
    });

    previewImage.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2) {
            e.preventDefault();
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const currentDistance = Math.hypot(
                touch1.pageX - touch2.pageX,
                touch1.pageY - touch2.pageY
            );
            if (initialDistance) {
                const scaleChange = currentDistance / initialDistance;
                zoomLevel = Math.max(minZoom, Math.min(maxZoom, initialZoom * scaleChange));
                if (zoomLevel <= 1) {
                    translateX = 0;
                    translateY = 0;
                }
                updateTransform();
            }
        } else if (e.touches.length === 1 && zoomLevel > 1) {
            e.preventDefault();
            const touch = e.touches[0];
            translateX = touch.clientX - startX;
            translateY = touch.clientY - startY;
            updateTransform();
        }
    });

    previewImage.addEventListener('touchend', () => {
        initialDistance = null;
        initialZoom = null;
    });

    // Mouse panning
    previewImage.addEventListener('mousedown', (e) => {
        if (zoomLevel > 1) {
            e.preventDefault();
            isDragging = true;
            startX = e.clientX - translateX;
            startY = e.clientY - translateY;
            previewImage.style.cursor = 'grabbing';
        }
    });

    previewImage.addEventListener('mousemove', (e) => {
        if (isDragging && zoomLevel > 1) {
            e.preventDefault();
            translateX = e.clientX - startX;
            translateY = e.clientY - startY;
            updateTransform();
        }
    });

    previewImage.addEventListener('mouseup', () => {
        isDragging = false;
        previewImage.style.cursor = zoomLevel > 1 ? 'move' : 'default';
    });

    previewImage.addEventListener('mouseleave', () => {
        isDragging = false;
        previewImage.style.cursor = zoomLevel > 1 ? 'move' : 'default';
    });
});