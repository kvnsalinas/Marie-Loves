const envelope = document.querySelector('.envelope-wrapper');
const letter = document.querySelector('.letter');

envelope.addEventListener('click', () => {
    envelope.classList.add('fade-out');
    setTimeout(() => {
        envelope.style.display = 'none';
        letter.style.display = 'block';
        document.querySelector('.music-player')?.classList.add('visible');
        startCountdown();
    }, 500);
});

// Music player functionality (if present)
const playPauseBtn = document.getElementById('play-pause-btn');
const playIcon = document.querySelector('.play-icon');
const pauseIcon = document.querySelector('.pause-icon');
const audio = document.getElementById('background-music');

playPauseBtn?.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
    } else {
        audio.pause();
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
    }
});

// Hearts animation
function createHearts() {
    const container = document.getElementById('falling-hearts');
    const heartCount = 20;
    for (let i = 0; i < heartCount; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.classList.add('heart-animation');
            heart.style.left = Math.random() * 100 + '%';
            heart.style.opacity = Math.random() * 0.7 + 0.3;
            heart.style.fontSize = Math.random() * 15 + 10 + 'px';
            heart.style.animationDuration = Math.random() * 3 + 3 + 's';
            container.appendChild(heart);
            setTimeout(() => heart.remove(), 6000);
        }, i * 300);
    }
}
envelope.addEventListener('click', () => {
    setTimeout(() => {
        createHearts();
        setInterval(createHearts, 10000);
    }, 500);
});