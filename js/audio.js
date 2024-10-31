let backgroundMusic;

function initAudio() {
    backgroundMusic = new Audio('assets/music/background-music.mp3');
    backgroundMusic.loop = true;

    const musicToggle = document.getElementById('music-toggle');
    musicToggle.addEventListener('click', toggleMusic);
}

function toggleMusic() {
    if (backgroundMusic.paused) {
        backgroundMusic.play();
    } else {
        backgroundMusic.pause();
    }
}

// 点击音效
function playClickSound() {
    const clickSound = new Audio('assets/music/click-sound.mp3');
    clickSound.play();
} 