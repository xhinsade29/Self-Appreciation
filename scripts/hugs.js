// Initialize particles.js with better configuration
document.addEventListener('DOMContentLoaded', function() {
    particlesJS('particles-js', {
        "particles": {
            "number": {
                "value": 40,
                "density": {
                    "enable": true,
                    "value_area": 800
                }
            },
            "color": {
                "value": ["#ff6b95", "#ff90b1", "#ffc2d1", "#8a4fff", "#a77dff"]
            },
            "shape": {
                "type": ["circle", "heart"],
                "stroke": {
                    "width": 0,
                    "color": "#fff"
                },
            },
            "opacity": {
                "value": 0.6,
                "random": true,
                "anim": {
                    "enable": true,
                    "speed": 1,
                    "opacity_min": 0.1,
                    "sync": false
                }
            },
            "size": {
                "value": 12,
                "random": true,
                "anim": {
                    "enable": true,
                    "speed": 1.5,
                    "size_min": 5,
                    "sync": false
                }
            },
            "line_linked": {
                "enable": true,
                "distance": 150,
                "color": "#ffc2d1",
                "opacity": 0.2,
                "width": 1
            },
            "move": {
                "enable": true,
                "speed": 1.5,
                "direction": "none",
                "random": true,
                "straight": false,
                "out_mode": "bounce",
                "bounce": false,
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": {
                    "enable": true,
                    "mode": "grab"
                },
                "onclick": {
                    "enable": true,
                    "mode": "push"
                },
                "resize": true
            },
            "modes": {
                "grab": {
                    "distance": 140,
                    "line_linked": {
                        "opacity": 0.8
                    }
                },
                "push": {
                    "particles_nb": 3
                }
            }
        },
        "retina_detect": true
    });
    
    // Start the heart trail effect
    startHeartTrail();
    
    // Add 3D tilt effect to cards
    const card = document.getElementById('card');
    
    /* Update the tilt effect handling */
document.addEventListener('mousemove', function(e) {
if (card && !document.getElementById('popup').style.display === 'flex') {
const xAxis = (window.innerWidth / 2 - e.pageX) / 100; // Reduced sensitivity
const yAxis = (window.innerHeight / 2 - e.pageY) / 100;
requestAnimationFrame(() => {
    card.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
});
}
});
    
    // Reset transform when mouse leaves
    card.addEventListener('mouseleave', function() {
        card.style.transform = 'rotateY(0deg) rotateX(0deg)';
    });
    
    // Same for popup card
    const popupCard = document.getElementById('popup-card');
    if (popupCard) {
        document.addEventListener('mousemove', function(e) {
            if (document.getElementById('popup').style.display === 'flex') {
                const xAxis = (window.innerWidth / 2 - e.pageX) / 35;
                const yAxis = (window.innerHeight / 2 - e.pageY) / 35;
                popupCard.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
            }
        });
    }
});

// Improved heart trail effect
function startHeartTrail() {
    document.addEventListener('mousemove', function(e) {
        createHeartTrail(e.clientX, e.clientY);
    });
}

function createHeartTrail(x, y) {
    const heart = document.createElement('div');
    heart.className = 'heart-trail';
    heart.style.left = (x - 10) + 'px';
    heart.style.top = (y - 10) + 'px';
    
    // Set random heart color
    const colors = ['#ff6b95', '#ff90b1', '#8a4fff', '#ffc2d1'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Use SVG for better heart shape
    heart.innerHTML = `<svg viewBox="0 0 24 24" fill="${randomColor}" width="100%" height="100%">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>`;
    
    document.body.appendChild(heart);
    
    // Remove heart after animation completes
    setTimeout(() => heart.remove(), 1000);
}

// Enhanced send hug function
function sendHug() {
    document.getElementById("popup").style.display = "flex";
    
    // Create enhanced confetti effect
    createEnhancedConfetti();
    
    // Add celebration sound if desired
    // const celebrationSound = new Audio('url-to-celebration-sound.mp3');
    // celebrationSound.play();
    
    // Restart GIF animation
    let gif = document.querySelector(".popup-gif");
    gif.src = gif.src;
}

function closePopup() {
    // Add heart burst effect before redirecting
    const heartBurst = document.createElement('div');
    heartBurst.className = 'heart-burst';
    document.body.appendChild(heartBurst);
    
    setTimeout(() => {
        window.location.href = "home.html"; // Redirect to home.html
    }, 800);
}

        function createEnhancedConfetti() {
    const confettiCount = 150;
    const container = document.querySelector('.popup');
    const colors = ['#ff6b95', '#ff90b1', '#ffc2d1', '#8a4fff', '#a77dff', '#ffffff'];
    const shapes = ['circle', 'square', 'triangle'];
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        // Random position
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = Math.random() * 30 - 30 + '%';
        
        // Random animation delay and duration
        confetti.style.animationDelay = Math.random() * 2 + 's';
        confetti.style.animationDuration = Math.random() * 3 + 3 + 's';
        
        // Random color
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // Random shape with proper styling
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        switch(shape) {
            case 'circle':
                confetti.style.borderRadius = '50%';
                confetti.style.background = color;
                break;
            case 'triangle':
                confetti.style.width = '0';
                confetti.style.height = '0';
                confetti.style.borderLeft = '7px solid transparent';
                confetti.style.borderRight = '7px solid transparent';
                confetti.style.borderBottom = '15px solid ' + color;
                confetti.style.background = 'transparent';
                break;
            default: // square
                confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
                confetti.style.background = color;
        }

        container.appendChild(confetti);

        // Remove confetti after animation
        setTimeout(() => {
            if (confetti && confetti.parentNode) {
                confetti.remove();
            }
        }, 5000);
    }
}


 // Theme toggle
 const themeToggle = document.getElementById('themeToggle');
 const themeIcon = themeToggle.querySelector('.theme-icon');
 
 // Check saved theme on load
 if (localStorage.getItem('darkMode') === 'true') {
     document.body.classList.add('dark-mode');
     themeIcon.textContent = '☀️';
 } else {
     themeIcon.textContent = '🌙';
 }
 
 themeToggle.addEventListener('click', () => {
     document.body.classList.toggle('dark-mode');
     const isDarkMode = document.body.classList.contains('dark-mode');
     localStorage.setItem('darkMode', isDarkMode);
     
     if (isDarkMode) {
         themeIcon.textContent = '☀️';
     } else {
         themeIcon.textContent = '🌙';
     }
 });

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
