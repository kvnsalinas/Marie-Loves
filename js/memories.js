const photos = document.querySelectorAll('.photo');
const photoCount = document.getElementById('photo-count');
const photoCaption = document.getElementById('photo-caption');
let currentPhoto = 0;

function updatePhotoGallery() {
    photoCount.textContent = `Photo ${currentPhoto + 1} of ${photos.length}`;
    photos.forEach((photo, index) => {
        photo.classList.toggle('active', index === currentPhoto);
        if (index === currentPhoto) {
            const customCaption = photo.getAttribute('data-caption');
            photoCaption.textContent = customCaption || 'Our special moments together ❤️';
        }
    });
    document.querySelectorAll('.dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === currentPhoto);
    });
}

document.querySelector('.left-arrow').addEventListener('click', () => {
    currentPhoto = (currentPhoto > 0) ? currentPhoto - 1 : photos.length - 1;
    updatePhotoGallery();
});

document.querySelector('.right-arrow').addEventListener('click', () => {
    currentPhoto = (currentPhoto < photos.length - 1) ? currentPhoto + 1 : 0;
    updatePhotoGallery();
});

function createDots() {
    const dotContainer = document.querySelector('.photo-dots');
    if (dotContainer) {
        dotContainer.innerHTML = '';
        for (let i = 0; i < photos.length; i++) {
            const dot = document.createElement('div');
            dot.className = 'dot' + (i === currentPhoto ? ' active' : '');
            dot.addEventListener('click', () => {
                currentPhoto = i;
                updatePhotoGallery();
            });
            dotContainer.appendChild(dot);
        }
    }
}

createDots();
updatePhotoGallery();