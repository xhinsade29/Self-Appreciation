// Add at the beginning of the file

function createStars(count) {
    for (let i = 0; i < count; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 2}s`;
        document.body.appendChild(star);
    }
}

function createEnhancedFireflies(count) {
    for (let i = 0; i < count; i++) {
        const firefly = document.createElement('div');
        firefly.className = 'firefly';
        firefly.style.left = `${Math.random() * 100}%`;
        firefly.style.top = `${Math.random() * 100}%`;
        firefly.style.animationDelay = `${Math.random() * 15}s`;
        firefly.style.opacity = Math.random() * 0.5 + 0.5;
        firefly.style.scale = Math.random() * 0.5 + 0.5;
        document.body.appendChild(firefly);
    }
}

// Add this at the beginning of your JavaScript file

function createFireflies(count) {
    for (let i = 0; i < count; i++) {
        const firefly = document.createElement('div');
        firefly.className = 'firefly';
        firefly.style.left = Math.random() * window.innerWidth + 'px';
        firefly.style.top = Math.random() * window.innerHeight + 'px';
        firefly.style.animationDelay = Math.random() * 15 + 's';
        document.body.appendChild(firefly);
    }
}

function createSparkles() {
    setInterval(() => {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = Math.random() * window.innerWidth + 'px';
        sparkle.style.top = Math.random() * window.innerHeight + 'px';
        document.body.appendChild(sparkle);
        
        setTimeout(() => sparkle.remove(), 4000);
    }, 200);
}

// Create fireflies and sparkles when the page loads
window.addEventListener('load', () => {
    createStars(50); // Add 50 twinkling stars
    createEnhancedFireflies(30); // Increase fireflies to 30
    createSparkles();
    
    // Add dynamic bright spots
    setInterval(() => {
        const spot = document.createElement('div');
        spot.className = 'bright-spot';
        spot.style.left = `${Math.random() * 100}%`;
        spot.style.top = `${Math.random() * 100}%`;
        spot.style.opacity = '0';
        document.body.appendChild(spot);
        
        requestAnimationFrame(() => {
            spot.style.opacity = '0.5';
            spot.style.transition = 'all 3s ease-in-out';
        });
        
        setTimeout(() => {
            spot.style.opacity = '0';
            setTimeout(() => spot.remove(), 3000);
        }, 5000);
    }, 8000);
});

const messages = {
    dots: [
        "●●● ●● ●●●●",
        "●● ●●● ●●●●●",
        "●●●● ● ●●●",
        "●● ●●●● ●●",
        "●●● ●●●●●",
        "●●● ●● ●●●",
        "●●●● ● ●●",
        "●● ●●● ●●●",
        "●●●● ●● ●●●",
        "● ●●●● ●●●"
    ],
    decoded: [
        "Rise and Shine ☀️",
        "Believe in Yourself 💖",
        "Stay Strong 💪",
        "Act with Confidence 🔥",
        "Know Your Worth 🌟",
        "Think for Yourself 💭",
        "Shine Bright 💡",
        "Break Free 🎭",
        "Your Power is Within 🚀",
        "Unbreakable Spirit 💞"
    ]
};

let lastMessageIndex = -1;

const container = document.getElementById('numberContainer');
for (let i = 1; i <= 10; i++) {
    const button = document.createElement('button');
    button.className = 'number-btn';
    const span = document.createElement('span');
    span.textContent = i;
    button.appendChild(span);
    button.onclick = () => showMessage(i - 1);
    container.appendChild(button);
}

function showMessage(index) {
    lastMessageIndex = index;
    const card = document.getElementById('messageCard');
    document.getElementById('dotCode').textContent = messages.dots[index];
    document.getElementById('decodedMessage').textContent = '';
    document.getElementById('decodedMessage').classList.remove('show');
    document.getElementById('decodeButton').disabled = false;
    card.style.display = 'block';
    requestAnimationFrame(() => {
        card.classList.add('show-card');
    });
}

function decodeMessage() {
    if (lastMessageIndex === -1) return;
    
    const decodedElement = document.getElementById('decodedMessage');
    const loadingDots = document.getElementById('loadingDots');
    const decodeButton = document.getElementById('decodeButton');

    decodedElement.textContent = '';
    decodedElement.classList.remove('show');
    loadingDots.style.display = 'block';
    decodeButton.disabled = true;

    setTimeout(() => {
        loadingDots.style.display = 'none';
        decodedElement.textContent = messages.decoded[lastMessageIndex];
        decodedElement.classList.add('show');
    }, 2000);
}

function closeMessage() {
    const card = document.getElementById('messageCard');
    card.classList.remove('show-card');
    setTimeout(() => {
        card.style.display = 'none';
        randomizeMessages();
    }, 500);
}

function randomizeMessages() {
    for (let i = messages.dots.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [messages.dots[i], messages.dots[j]] = [messages.dots[j], messages.dots[i]];
        [messages.decoded[i], messages.decoded[j]] = [messages.decoded[j], messages.decoded[i]];
    }
}

// Background music setup
const bgMusic = new Audio('music-effects/blue.mp3');
bgMusic.loop = true;
bgMusic.volume = 0.3;
bgMusic.autoplay = true; // Add autoplay attribute

// Add music controls to the page
function addMusicControls() {
    const musicButton = document.createElement('button');
    musicButton.id = 'musicToggle';
    musicButton.innerHTML = '🔊'; // Start with the playing icon
    musicButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 10px;
        border-radius: 50%;
        border: none;
        background: rgba(255, 255, 255, 0.8);
        cursor: pointer;
        z-index: 1000;
    `;

    document.body.appendChild(musicButton);

    let isPlaying = true; // Assume we'll start playing

    // Start playing immediately
    bgMusic.play().catch(error => {
        console.log('Autoplay prevented, waiting for user interaction');
        isPlaying = false;
        musicButton.innerHTML = '🔇';
        
        // Add event listeners to start playing on any user interaction
        const startPlayingOnInteraction = () => {
            bgMusic.play().then(() => {
                isPlaying = true;
                musicButton.innerHTML = '🔊';
                // Remove the event listeners once music starts
                ['click', 'touchstart', 'keydown'].forEach(event => {
                    document.removeEventListener(event, startPlayingOnInteraction);
                });
            });
        };

        ['click', 'touchstart', 'keydown'].forEach(event => {
            document.addEventListener(event, startPlayingOnInteraction);
        });
    });

    musicButton.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
            musicButton.innerHTML = '🔇';
        } else {
            bgMusic.play()
                .then(() => {
                    musicButton.innerHTML = '🔊';
                })
                .catch(err => {
                    console.log('Music playback failed:', err);
                    musicButton.innerHTML = '❌';
                });
        }
        isPlaying = !isPlaying;
    });
}

// Initialize music controls when the page loads
document.addEventListener('DOMContentLoaded', addMusicControls);
