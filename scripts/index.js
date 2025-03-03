// Background music setup
const bgMusic = new Audio('music-effects/blue.mp3');
bgMusic.loop = true;
bgMusic.volume = 0.3;

// Self-love quotes collection
const selfLoveQuotes = [
    "You yourself, as much as anybody in the entire universe, deserve your love and affection.",
    "Love yourself first and everything else falls into line.",
    "To love oneself is the beginning of a lifelong romance.",
    "Self-care is how you take your power back.",
    "You are enough just as you are.",
    "The most powerful relationship you will ever have is the relationship with yourself.",
    "Be proud of who you are, and not ashamed of how others see you.",
    "Your task is not to seek love, but to seek and find all the barriers within yourself that you have built against it.",
    "Talk to yourself like someone you love.",
    "You have been criticizing yourself for years and it hasn't worked. Try approving of yourself and see what happens."
];

// Positive affirmations collection
const positiveAffirmations = [
    "You are capable of amazing things.",
    "Your potential is limitless.",
    "You radiate positivity and love.",
    "Today is full of possibilities because you are in it.",
    "You bring joy to those around you.",
    "Your uniqueness is your strength.",
    "You are worthy of all good things.",
    "Every day is a new opportunity to shine.",
    "Your heart and mind are open to new possibilities.",
    "You are becoming the best version of yourself."
];

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Preload heart images to avoid delay
    preloadImages([
        'lib-hearts/heart1.png',
        'lib-hearts/heart2.png',
        'lib-hearts/heart3.png'
    ]);
    
    // Initialize animations and events
    createFloatingHearts();
    
    // Set up envelope interaction with improved animations
    const envelope = document.getElementById('envelope');
    if (envelope) {
        envelope.addEventListener('click', function() {
            // Add open class to animate the envelope
            this.classList.add('open');
            
            // After the envelope animation completes, show the message
            setTimeout(openMessage, 1500);
            
            // Make sure the click instruction disappears
            this.classList.add('clicked');
        });
        
        // Add keyboard accessibility
        envelope.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    }
    
    // Set up music button if it exists
    const musicBtn = document.getElementById('musicBtn');
    if (musicBtn) {
        musicBtn.addEventListener('click', toggleMusic);
    }
    
    // Add pulse effect to open button
    addButtonPulse();
    
    // Show initial random quote
    showRandomQuote();
    
    // Set up quote rotation every 5 seconds
    setInterval(showRandomQuote, 5000);
    
    // Refresh floating hearts every 10 seconds
    setInterval(createFloatingHearts, 10000);
    
    // Add envelope hint
    addEnvelopeHint();
    
    // Set current year in footer
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
});

// Add envelope hint
function addEnvelopeHint() {
    const envelope = document.getElementById('envelope');
    if (!envelope) return;
    
    // Add a separate hint element instead of using ::after
    const clickHint = document.createElement('div');
    clickHint.className = 'envelope-hint';
    clickHint.textContent = 'Click me';
    clickHint.style.position = 'absolute';
    clickHint.style.bottom = '-30px';
    clickHint.style.left = '50%';
    clickHint.style.transform = 'translateX(-50%)';
    clickHint.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    clickHint.style.padding = '5px 15px';
    clickHint.style.borderRadius = '20px';
    clickHint.style.fontSize = '14px';
    clickHint.style.color = '#ff758f';
    clickHint.style.opacity = '0.8';
    clickHint.style.transition = 'opacity 0.3s ease';
    clickHint.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
    
    envelope.parentNode.appendChild(clickHint);
    
    envelope.addEventListener('mouseover', function() {
        clickHint.style.opacity = '1';
    });
    
    envelope.addEventListener('mouseout', function() {
        clickHint.style.opacity = '0.8';
    });
    
    envelope.addEventListener('click', function() {
        clickHint.style.opacity = '0';
        setTimeout(() => {
            clickHint.style.display = 'none';
        }, 300);
    });
}

// Add pulse effect to button
function addButtonPulse() {
    const openBtn = document.getElementById('openBtn');
    if (openBtn) {
        openBtn.classList.add('pulse-effect');
    }
}

// Toggle background music
function toggleMusic() {
    const musicBtn = document.getElementById('musicBtn');
    if (!musicBtn) return;
    
    if (bgMusic.paused) {
        bgMusic.play()
            .then(() => {
                musicBtn.textContent = '🔊';
                musicBtn.setAttribute('aria-label', 'Mute background music');
            })
            .catch(error => {
                console.log('Audio playback prevented: ', error);
                musicBtn.textContent = '🔇';
                musicBtn.setAttribute('aria-label', 'Play background music');
            });
    } else {
        bgMusic.pause();
        musicBtn.textContent = '🔇';
        musicBtn.setAttribute('aria-label', 'Play background music');
    }
}

// Create and display floating hearts
function createFloatingHearts() {
    const heartsContainer = document.getElementById('floatingHearts');
    if (!heartsContainer) return;
    
    const heartImages = [
        'lib-hearts/heart1.png',
        'lib-hearts/heart2.png',
        'lib-hearts/heart3.png'
    ];
    
    // Clear any existing hearts
    heartsContainer.innerHTML = '';
    
    for (let i = 0; i < 30; i++) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        
        const img = document.createElement('img');
        img.src = heartImages[Math.floor(Math.random() * heartImages.length)];
        img.alt = 'Floating heart';
        
        // Randomize size for more depth
        const scale = 0.5 + Math.random() * 1.5;
        img.style.width = `${30 * scale}px`;
        img.style.height = `${30 * scale}px`;
        
        // Randomize opacity based on size (smaller ones appear further away)
        const opacity = 0.2 + (scale * 0.3);
        img.style.opacity = opacity.toString();
        heart.style.setProperty('--opacity', opacity.toString());
        
        // Randomize animation properties
        const duration = 15 + Math.random() * 15;
        const delay = Math.random() * 20;
        const leftPos = Math.random() * 100;
        
        // Randomize animation path slightly
        const sway = 10 + Math.random() * 20;
        const leftMid = leftPos + (Math.random() > 0.5 ? sway : -sway);
        
        heart.appendChild(img);
        heart.style.left = `${leftPos}vw`;
        heart.style.animationDuration = `${duration}s`;
        heart.style.animationDelay = `${delay}s`;
        
        // Add custom animation path
        heart.style.setProperty('--left-mid', `${leftMid}vw`);
        
        heartsContainer.appendChild(heart);
    }
}

// Modify the openMessage function to ensure music plays correctly
function openMessage() {
    const loveMessage = document.getElementById('loveMessage');
    const envelopeWrapper = document.querySelector('.envelope-wrapper');
    
    if (!loveMessage || !envelopeWrapper) return;
    
    // Hide the envelope wrapper
    envelopeWrapper.style.display = 'none';
    
    // Hide the quote container as well (optional)
    const quoteContainer = document.querySelector('.quote-container');
    if (quoteContainer) {
        quoteContainer.style.display = 'none';
    }
    
    // Ensure message is properly displayed
    loveMessage.style.display = 'block';
    
    // Make sure message is centered in the viewport
    window.scrollTo({
        top: loveMessage.offsetTop - 20,
        behavior: 'smooth'
    });
    
    // Play background music directly as a result of user interaction
    bgMusic.play()
        .then(() => {
            // Update music button if it exists
            const musicBtn = document.getElementById('musicBtn');
            if (musicBtn) {
                musicBtn.textContent = '🔊';
                musicBtn.setAttribute('aria-label', 'Mute background music');
            }
        })
        .catch(error => {
            console.log('Audio playback prevented: ', error);
            // Update button state if play fails
            const musicBtn = document.getElementById('musicBtn');
            if (musicBtn) {
                musicBtn.textContent = '🔇';
                musicBtn.setAttribute('aria-label', 'Play background music');
            }
        });
    
    // Add confetti effect
    createConfetti();
    
    // Add subtle entrance animation for message paragraphs
    const paragraphs = document.querySelectorAll('#loveMessage p');
    paragraphs.forEach((p, index) => {
        p.style.opacity = '0';
        p.style.animation = `fadeInUp 0.8s ${0.3 + index * 0.2}s forwards`;
    });
}
     
    // Add confetti effect
    createConfetti();
    
    // Add subtle entrance animation for message paragraphs
    const paragraphs = document.querySelectorAll('#loveMessage p');
    paragraphs.forEach((p, index) => {
        p.style.opacity = '0';
        p.style.animation = `fadeInUp 0.8s ${0.3 + index * 0.2}s forwards`;
    });
    
   // Add to your DOMContentLoaded event handler
document.addEventListener('DOMContentLoaded', function() {
    bgMusic.preload = 'auto';
    bgMusic.load();
});

// Create confetti celebration effect
function createConfetti() {
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'confetti-container';
    document.body.appendChild(confettiContainer);
    
    const colors = ['#ff758f', '#ff7eb3', '#ffb6c1', '#ffc0cb', '#ffffff'];
    
    for (let i = 0; i < 150; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        
        // Randomize confetti properties
        const size = Math.random() * 10 + 5;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const rotation = Math.random() * 360;
        const left = Math.random() * 100;
        const duration = Math.random() * 3 + 2;
        const delay = Math.random() * 0.5;
        
        // Apply styles
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        confetti.style.backgroundColor = color;
        confetti.style.left = `${left}%`;
        confetti.style.top = '-20px';
        confetti.style.transform = `rotate(${rotation}deg)`;
        confetti.style.animationDuration = `${duration}s`;
        confetti.style.animationDelay = `${delay}s`;
        
        confettiContainer.appendChild(confetti);
    }
    
    // Clean up after animation completes
    setTimeout(() => {
        if (confettiContainer && confettiContainer.parentNode) {
            confettiContainer.parentNode.removeChild(confettiContainer);
        }
    }, 5000);
}

// Show a random self-love quote
function showRandomQuote() {
    const quoteElement = document.getElementById('randomQuote');
    if (!quoteElement) return;
    
    const randomIndex = Math.floor(Math.random() * selfLoveQuotes.length);
    
    // Reset animation by removing and re-adding class
    quoteElement.classList.remove('quote-fade');
    void quoteElement.offsetWidth; // Trigger reflow to restart animation
    
    quoteElement.textContent = selfLoveQuotes[randomIndex];
    quoteElement.classList.add('quote-fade');
}

// Add these variables at the top with your other constants
const maxAffirmations = 5; // Maximum number of affirmations to show
let usedAffirmations = []; // Track used affirmations
let affirmationCount = 0; // Track number of shown affirmations

// Modify the showMoreLove function
function showMoreLove() {
    const messageContainer = document.querySelector('.message-content');
    const clickButton = document.querySelector('.click-button');
    
    if (!messageContainer || !clickButton) return;
    
    // Check if we've reached the maximum number of affirmations
    if (affirmationCount >= maxAffirmations) {
        // Disable the button and change its appearance
        clickButton.disabled = true;
        clickButton.style.opacity = '0.5';
        clickButton.textContent = 'No more messages';
        return;
    }
    
    // Get a new, unique affirmation
    const newAffirmation = getUniqueAffirmation();
    if (!newAffirmation) return; // Return if no new affirmations available
    
    // Create and add the new message
    const newMessage = document.createElement('p');
    newMessage.textContent = newAffirmation;
    newMessage.style.opacity = '0';
    
    // Insert before the button
    messageContainer.insertBefore(newMessage, clickButton.parentNode);
    
    // Animate new message
    setTimeout(() => {
        newMessage.style.animation = 'fadeInUp 0.8s forwards';
    }, 50);
    
    // Create heart burst effect
    createSmallHeartBurst();
    
    // Increment counter
    affirmationCount++;
    
    // Update button text to show remaining messages
    clickButton.textContent = `Show More Love (${maxAffirmations - affirmationCount} left)`;
}

// Add this new function to get unique affirmations
function getUniqueAffirmation() {
    // Filter out used affirmations
    const availableAffirmations = positiveAffirmations.filter(
        affirmation => !usedAffirmations.includes(affirmation)
    );
    
    // If no more unique affirmations, return null
    if (availableAffirmations.length === 0) return null;
    
    // Get random affirmation from remaining ones
    const randomIndex = Math.floor(Math.random() * availableAffirmations.length);
    const selectedAffirmation = availableAffirmations[randomIndex];
    
    // Add to used list
    usedAffirmations.push(selectedAffirmation);
    
    return selectedAffirmation;
}

// Create smaller heart burst for the "Show More Love" button
function createSmallHeartBurst() {
    const button = document.querySelector('.click-button');
    if (!button) return;
    
    const buttonRect = button.getBoundingClientRect();
    
    for (let i = 0; i < 10; i++) {
        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        heart.style.position = 'absolute';
        heart.style.fontSize = '16px';
        heart.style.left = `${buttonRect.left + buttonRect.width/2}px`;
        heart.style.top = `${buttonRect.top + buttonRect.height/2}px`;
        heart.style.zIndex = '1000';
        heart.style.pointerEvents = 'none';
        
        // Random direction
        const angle = Math.random() * Math.PI * 2;
        const distance = 30 + Math.random() * 50;
        const duration = 0.5 + Math.random() * 1;
        
        // Animation
        heart.style.transition = `all ${duration}s ease-out`;
        document.body.appendChild(heart);
        
        // Start animation after a small delay to ensure it triggers
        setTimeout(() => {
            heart.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(${0.5 + Math.random()})`;
            heart.style.opacity = '0';
            
            // Remove heart after animation completes
            setTimeout(() => {
                if (heart.parentNode) {
                    heart.parentNode.removeChild(heart);
                }
            }, duration * 1000);
        }, 10);
    }
}

// Preload images to avoid delay
function preloadImages(sources) {
    sources.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Share message functionality
function shareMessage() {
    const modal = document.getElementById('shareModal');
    if (!modal) return;
    
    modal.style.display = 'flex';
    
    // Close modal when clicking X
    const closeButton = document.querySelector('.close-button');
    if (closeButton) {
        closeButton.onclick = function() {
            modal.style.display = 'none';
        };
    }
    
    // Close modal when clicking outside
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
    
    // Copy link functionality
    const copyButton = document.getElementById('copyButton');
    if (copyButton) {
        copyButton.onclick = function() {
            const linkInput = document.getElementById('shareLink');
            if (linkInput) {
                // Update this line to your desired share link
                linkInput.value = 'https://xhinsade29.github.io/Self-Appreciation/';
                linkInput.select();
                document.execCommand('copy');
                this.textContent = 'Copied!';
                setTimeout(() => {
                    this.textContent = 'Copy';
                }, 2000);
            }
        };
    }
    
    // Share buttons functionality
    document.querySelectorAll('.share-button').forEach(button => {
        button.onclick = function() {
            const platform = this.getAttribute('data-platform');
            // Update this line to your desired share link
            const url = encodeURIComponent('https://xhinsade29.github.io/Self-Appreciation/');
            const text = encodeURIComponent('I found this beautiful self-love letter and wanted to share it with you!');
            
            let shareUrl;
            switch(platform) {
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                    break;
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
                    break;
                case 'whatsapp':
                    shareUrl = `https://wa.me/?text=${text}%20${url}`;
                    break;
                case 'email':
                    shareUrl = `mailto:?subject=A Special Message For You&body=${text}%20${url}`;
                    break;
            }
            
            window.open(shareUrl, '_blank');
        };
    });
}

function createConfetti() {
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'confetti-container';
    document.body.appendChild(confettiContainer);
  
    const colors = ['#ff758f', '#ff8fab', '#ffa6c1', '#ffb6c1', '#ffd3e0'];
    const shapes = ['circle', 'square', 'triangle'];
  
    for (let i = 0; i < 100; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      
      // Random properties
      const color = colors[Math.floor(Math.random() * colors.length)];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const left = Math.random() * 100 + 'vw';
      const animationDuration = (Math.random() * 3 + 2) + 's';
      const size = Math.random() * 8 + 6 + 'px';
  
      // Apply styles
      confetti.style.cssText = `
        left: ${left};
        width: ${size};
        height: ${size};
        background-color: ${color};
        animation: confettiFall ${animationDuration} linear forwards;
        border-radius: ${shape === 'circle' ? '50%' : '0'};
        clip-path: ${shape === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'none'};
      `;
  
      confettiContainer.appendChild(confetti);
  
      // Remove confetti after animation
      confetti.addEventListener('animationend', () => {
        confetti.remove();
      });
    }
  
    // Remove container after all confetti are done
    setTimeout(() => {
      confettiContainer.remove();
    }, 5000);
  }
  
  // Update your existing envelope click handler
  envelope.addEventListener('click', () => {
    envelope.classList.add('open');
    createConfetti(); // Add confetti effect
    setTimeout(() => {
      loveMessage.style.display = 'block';
    }, 1000);
  });


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