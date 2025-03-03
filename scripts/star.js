 // Array of quotes with corresponding images
 const messages = [
    {
        quote: "You are not defined by the approval of others, nor should your worth be measured by how well you fit into someone else's expectations. You are worthy simply because you exist—because you breathe, because you dream, because you continue despite the storms that try to break you. No external validation can replace the power of self-acceptance, and no amount of doubt should shake the truth that you are enough, just as you are.",
        image: "resources/heart1.gif"  // Replace with your image path
    },
    {
        quote: "Stop seeking validation from those who do not see your value. You were not meant to shrink yourself into the shape of someone else's expectations. You were meant to stand tall in the fullness of who you are, to love yourself loudly, and to walk this world knowing that your existence is not only valid but necessary. The most important person who needs to believe in you is the one staring back at you in the mirror.",
        image: "resources/heart.gif"  // Replace with your image path
    },
    {
        quote: "Your worth is not measured by how much you do for others, how many compliments you receive, or how many people choose to stay in your life. Your worth is inherent, unshakable, and independent of external factors. You deserve to love yourself, to celebrate your victories—no matter how small—and to give yourself the same kindness and encouragement you so freely offer to others.",
        image: "resources/good.gif"  // Replace with your image path
    },
    {
        quote: "The most freeing moment in life is when you realize that you do not need anyone's permission to be yourself. You do not need approval to chase your dreams, to live boldly, to exist unapologetically. The love and acceptance you’ve been searching for have been within you all along. It is time to embrace yourself fully, flaws and all, because you are already whole.",
        image: "resources/go.gif"  // Replace with your image path
    },
    {
        quote: "Self-appreciation is not arrogance; it is an act of survival in a world that often tries to make you feel inadequate. It is looking at yourself in the mirror and saying, ‘I am proud of how far I’ve come. I am proud of the battles I have fought. I am proud of the person I am becoming.’ And in that moment, you realize that you do not need the world to tell you that you are enough—you already know.",
        image: "resources/heart1.gif"  // Replace with your image path
    },
    {
        quote: "You owe yourself the love that you so desperately give to others. You spend so much time uplifting, understanding, and supporting those around you, yet you hesitate to do the same for yourself. Start speaking to yourself with kindness. Start recognizing your own worth. Start appreciating yourself the way you would a dear friend. You deserve that love, too.",
        image: "resources/heart.gif"  // Replace with your image path
    },
    {
        quote: "You are not selfish for prioritizing yourself. You are not weak for needing rest. You are not unworthy just because someone else fails to see your value. Every scar, every struggle, every triumph has shaped you into the incredible person you are today. So hold your head high, embrace your journey, and remind yourself that you are doing better than you think.",
        image: "resources/good.gif"  // Replace with your image path
    },
    {
        quote: "There will always be voices—some loud, some subtle—that tell you that you are not good enough, not successful enough, not worthy enough. But those voices are not your truth. Your truth is found in the way you keep moving forward despite the doubts, in the way you continue to show up for yourself. You do not need anyone to validate your worth. You are already worthy, already enough, just as you are.",
        image: "resources/go.gif"  // Replace with your image path
    },
    {
        quote: "You have spent so much of your life trying to be enough for others—fitting into their expectations, chasing their approval, bending and breaking just to be accepted. But have you ever stopped to ask yourself: Am I enough for me? When you finally choose to embrace yourself without condition, when you decide that you are enough without external validation, that is when you truly start to live.",
        image: "resources/good.gif"  // Replace with your image path
    },
    {
        quote: "One day, you will look back and realize that the moments you felt the most unworthy were the moments when you were growing the most. The pain, the self-doubt, the struggles—they did not break you; they shaped you. So stand tall, take a deep breath, and recognize that your journey, with all its ups and downs, is still beautiful. And more importantly, so are you.",
        image: "resources/heart.gif"  // Replace with your image path
    }
];

function sendLove() {
    const overlay = document.getElementById('overlay');
    const videoPopup = document.getElementById('video-popup');
    const loveVideo = document.getElementById('love-video');
    const backgroundVideo = document.getElementById('background-video');

    overlay.style.display = 'block';
    videoPopup.style.display = 'block';
    backgroundVideo.parentElement.classList.add('blur');

    loveVideo.play();

    loveVideo.onended = () => {
        videoPopup.style.display = 'none';
        showMessage();
    };
}

function showMessage() {
    const randomIndex = Math.floor(Math.random() * messages.length);
    const message = messages[randomIndex];
    
    document.getElementById("popup-text").textContent = message.quote;
    document.getElementById("popup-image").src = message.image;
    document.getElementById("message-popup").style.display = "block";
}

function closePopup() {
    const overlay = document.getElementById('overlay');
    const messagePopup = document.getElementById('message-popup');
    const backgroundVideo = document.getElementById('background-video');

    overlay.style.display = 'none';
    messagePopup.style.display = 'none';
    backgroundVideo.parentElement.classList.remove('blur');
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
