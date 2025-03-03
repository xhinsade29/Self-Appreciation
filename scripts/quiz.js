// Enhanced quiz.js with animations and improved functionality
const questions = [
    { text: "Would you rather go on a fancy dinner date or a cozy movie night?", images: ["lib-quiz/dinner.jpg", "lib-quiz/movie.jpg"] },
    { text: "Would you rather receive handwritten love letters or surprise gifts?", images: ["lib-quiz/letter.jpg", "lib-quiz/gifts.jpg"] },
    { text: "Would you rather go on a spontaneous road trip or a well-planned vacation?", images: ["lib-quiz/roadtrip.jpg", "lib-quiz/vacation.jpg"] },
    { text: "Would you rather have a picnic in the park or a candlelit dinner at home?", images: ["lib-quiz/picnic.jpg", "lib-quiz/dinnerhome.jpg"] }
];

const rouletteOptions = [
   "Give yourself five compliments in the mirror!",
   "Send yourself a kind and encouraging message!",
   "Plan a self-care day this weekend just for you!",
   "List three things you love about yourself!",
   "Cook your favorite meal and enjoy it mindfully!",
   "Write a love letter to yourself!",
   "Dance freely to your favorite song and celebrate yourself!",
   "Watch the sunset and reflect on your journey!"
];

let currentQuestion = 0;
let totalRotation = 0; // Track total rotation
const bgMusic = new Audio('music-effects/blue.mp3');
bgMusic.loop = true;
bgMusic.volume = 0.3;

// Add confetti effect function
function celebrateChoice() {
    const colors = ['#ff4d6d', '#845ec2', '#ffc75f'];
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: colors,
        disableForReducedMotion: true
    });
}

function loadQuestion() {
    if (currentQuestion < questions.length) {
        const questionContainer = document.getElementById("question-container");
        questionContainer.style.opacity = "0";
        
        setTimeout(() => {
            questionContainer.innerText = questions[currentQuestion].text;
            let options = questions[currentQuestion].text.split(" or ");
            
            // Clean up the options text
            options[0] = options[0].replace("Would you rather ", "");
            options[1] = options[1].replace("?", "");
            
            const img1 = questions[currentQuestion].images[0] || "placeholder.jpg";
            const img2 = questions[currentQuestion].images[1] || "placeholder.jpg";
            
            document.getElementById("option1-img").src = img1;
            document.getElementById("option2-img").src = img2;
            document.getElementById("option1-text").innerText = options[0];
            document.getElementById("option2-text").innerText = options[1];
            document.getElementById("option1-img").src = questions[currentQuestion].images[0];
            document.getElementById("option2-img").src = questions[currentQuestion].images[1];
            
            // Add animation when showing question
            questionContainer.style.opacity = "1";
            questionContainer.style.transform = "translateY(0)";
            
            updateProgressBar();
        }, 300);
        
    } else {
        // Transition to roulette
        document.getElementById("question-container").style.opacity = "0";
        document.querySelector(".progress-bar").style.opacity = "0";
        document.querySelector(".button-container").style.opacity = "0";
        
        setTimeout(() => {
            document.getElementById("question-container").style.display = "none";
            document.querySelector(".progress-bar").style.display = "none";
            document.querySelector(".button-container").style.display = "none";
            document.getElementById("roulette-container").style.display = "block";
            
            // Animate roulette appearance
            document.getElementById("roulette-container").style.opacity = "0";
            document.getElementById("roulette-container").style.transform = "translateY(30px)";
            
            setTimeout(() => {
                document.getElementById("roulette-container").style.opacity = "1";
                document.getElementById("roulette-container").style.transform = "translateY(0)";
            }, 100);
            
        }, 500);
    }
}

function chooseAnswer(choice) {
    // Animate the selection
    const cards = document.querySelectorAll(".btn-card");
    cards[choice ? 0 : 1].style.transform = "scale(1.05)";
    
    // Add confetti effect
    celebrateChoice();
    
    setTimeout(() => {
        currentQuestion++;
        loadQuestion();
        // Reset card styles
        cards.forEach(card => {
            card.style.transform = "";
        });
    }, 800);
}

function updateProgressBar() {
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    const progressBar = document.getElementById("progress-bar");
    progressBar.style.width = `${progress}%`;
    
    // Add pulse animation
    progressBar.classList.remove("pulse");
    void progressBar.offsetWidth; // Trigger reflow
    progressBar.classList.add("pulse");
}

function createRouletteSegments() {
    const wheel = document.getElementById("roulette-wheel");
    const numOptions = rouletteOptions.length;
    const segmentAngle = 360 / numOptions;
    
    // Create segment labels
    for (let i = 0; i < numOptions; i++) {
        const segment = document.createElement("div");
        segment.className = "segment-label";
        segment.innerText = (i + 1).toString();
        
        // Position around the wheel
        const angle = i * segmentAngle;
        const rad = angle * (Math.PI / 180);
        const radius = 110; // Slightly inside the wheel's edge
        
        const x = Math.sin(rad) * radius;
        const y = -Math.cos(rad) * radius;
        
        segment.style.transform = `translate(${x}px, ${y}px) rotate(${angle + 90}deg)`;
        
        wheel.appendChild(segment);
    }
}

function spinRoulette() {
    const wheel = document.getElementById("roulette-wheel");
    const resultText = document.getElementById("roulette-result");
    const spinBtn = document.getElementById("spin-btn");
    const popup = document.getElementById("popup-container");
    const rouletteContainer = document.getElementById("roulette-container");
    const spinDuration = 3000; // 3 seconds
    const spins = 5 + Math.random() * 5; // Random number of spins between 5-10
    const degreesPerOption = 360 / rouletteOptions.length;

    // Play spinning sound effect if available
    const spinSound = new Audio('music-effects/spin.mp3');
    spinSound.volume = 0.5;
    spinSound.play().catch(e => console.log("Could not play spin sound", e));

    // Disable spin button while spinning
    spinBtn.disabled = true;
    spinBtn.innerText = "Spinning...";

    // Randomly select an option
    const randomIndex = Math.floor(Math.random() * rouletteOptions.length);
    const selectedOption = rouletteOptions[randomIndex];

    // Calculate the new rotation by adding to previous rotation
    // Add extra offset to ensure the pointer points to the center of a segment
    const finalRotation = totalRotation + (spins * 360) + (randomIndex * degreesPerOption) + (degreesPerOption / 2);
    totalRotation = finalRotation; // Save new rotation for next spin

    // Apply spinning animation with easing
    wheel.style.transition = `transform ${spinDuration}ms cubic-bezier(0.2, 0.8, 0.2, 1)`;
    wheel.style.transform = `rotate(${finalRotation}deg)`;

    // Show result after spin with a bouncing effect at the end
    setTimeout(() => {
        // Play success sound
        const successSound = new Audio('music-effects/success.mp3');
        successSound.volume = 0.5;
        successSound.play().catch(e => console.log("Could not play success sound", e));
        
        resultText.innerText = selectedOption;
        popup.style.display = "flex";  // Show pop-up
        rouletteContainer.style.display = "none";  // Hide roulette section
        
        // Trigger confetti
        confetti({
            particleCount: 200,
            spread: 120,
            origin: { y: 0.6 },
            colors: ['#ff4d6d', '#845ec2', '#ffc75f', '#ff8fa3', '#b39cd0', '#ffd89c'],
            disableForReducedMotion: true
        });
        
        spinBtn.disabled = false;
        spinBtn.innerText = "Spin Again";
    }, spinDuration);
}

// Close pop-up with animation
function closePopup() {
    const popup = document.getElementById("popup-container");
    const popupContent = popup.querySelector("div");
    
    popupContent.style.animation = "fadeOut 0.3s ease forwards";
    
    setTimeout(() => {
        popup.style.display = "none";
        document.getElementById("roulette-container").style.display = "block"; // Show roulette again
        
        // Reset animation for next time
        popupContent.style.animation = "popIn 0.5s ease forwards";
    }, 300);
}

function goHome() {
    // Animate transition before redirecting
    document.body.style.opacity = "0";
    setTimeout(() => {
        window.location.href = "home.html";
    }, 500);
}

// Background music setup
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

// Add hover effects for buttons dynamically
function addButtonEffects() {
    const buttons = document.querySelectorAll('button:not(#musicToggle)');
    buttons.forEach(button => {
        button.addEventListener('mouseover', () => {
            button.style.transform = 'translateY(-3px)';
            button.style.boxShadow = '0 8px 15px rgba(255, 77, 109, 0.4)';
        });
        
        button.addEventListener('mouseout', () => {
            button.style.transform = '';
            button.style.boxShadow = '';
        });
        
        button.addEventListener('mousedown', () => {
            button.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('mouseup', () => {
            button.style.transform = 'translateY(-3px)';
        });
    });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    // Add CSS animations class
    document.body.classList.add('animated');
    
    // Enhance the back button
    const backButton = document.querySelector('button[onclick="window.location.href=\'home.html\'"]');
    if (backButton) {
        backButton.className = 'back-button';
        backButton.innerHTML = '← Back to Home';
    }
    
    // Create roulette segments
    createRouletteSegments();
    
    // Add music controls
    addMusicControls();
    
    // Add button effects
    addButtonEffects();
    
    // Start with initial animations
    document.getElementById("question-container").style.opacity = "0";
    document.getElementById("question-container").style.transform = "translateY(30px)";
    
    setTimeout(() => {
        loadQuestion();
    }, 300);
});

// Add these styles by creating a style element
const style = document.createElement('style');
style.textContent = `
    .pulse {
        animation: pulse 0.5s ease;
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    @keyframes fadeOut {
        from { transform: scale(1); opacity: 1; }
        to { transform: scale(0.8); opacity: 0; }
    }
    
    @keyframes float {
        0% { transform: translateY(0); }
        50% { transform: translateY(-20px); }
        100% { transform: translateY(0); }
    }
    
    .segment-label {
        position: absolute;
        top: 50%;
        left: 50%;
        font-size: 14px;
        font-weight: bold;
        color: white;
        transform-origin: center;
        text-shadow: 0 0 3px rgba(0,0,0,0.5);
    }
    
    .heart {
        position: absolute;
        animation: float infinite ease-in-out;
        pointer-events: none;
    }
`;
document.head.appendChild(style);

// Add this new function
function initThemeToggle() {
    const themeToggle = document.createElement('button');
    themeToggle.id = 'themeToggle';
    themeToggle.className = 'utility-button'; // Add utility-button class
    themeToggle.innerHTML = '🌙';
    
    // Add styles for theme toggle
    const themeStyles = document.createElement('style');
    themeStyles.textContent = `
        #themeToggle {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 50px !important;
            height: 50px !important;
            padding: 0;
            border-radius: 50%;
            border: none;
            background: rgba(255, 255, 255, 0.8);
            cursor: pointer;
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 50px;
            aspect-ratio: 1;
            font-size: 1.2rem;
            transition: all 0.3s ease;
        }
        
        #themeToggle:hover {
            transform: scale(1.1);
        }

        @media (max-width: 768px) {
            #themeToggle {
                width: 50px !important;
                height: 50px !important;
                margin: 0 10px;
            }
        }
    `;
    document.head.appendChild(themeStyles);
    
    // Load saved theme preference
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme === 'true') {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '☀️';
    }
    
    // Add click handler
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        themeToggle.innerHTML = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    });
    
    document.body.appendChild(themeToggle);
}

// Add dark mode styles
const darkModeStyles = document.createElement('style');
darkModeStyles.textContent = `
body.dark-mode {
background: linear-gradient(135deg, #2c1338, #1a0f24);
}

body.dark-mode .card {
background: linear-gradient(135deg, #3a1f47, #2c1338);
}

body.dark-mode .modal-content {
background: linear-gradient(135deg, #3a1f47, #2c1338);
color: white;
}

body.dark-mode #modalCard p {
background-color: rgba(255, 255, 255, 0.1);
color: white;
}

body.dark-mode .difficulty-btn {
background: rgba(255, 255, 255, 0.1);
}

body.dark-mode .difficulty-btn:hover,
body.dark-mode .difficulty-btn.active {
background: rgba(255, 255, 255, 0.2);
}

/* Adjust title color in dark mode */
body.dark-mode h1 {
color: #dedede; /* Lighter shade for dark mode title */
}
`;
document.head.appendChild(darkModeStyles);

// Initialize the theme toggle button   
initThemeToggle();

// Modified floating hearts function
function createFloatingHearts() {
    // Create hearts container if it doesn't exist
    let heartsBg = document.getElementById('heartsBg');
    if (!heartsBg) {
        heartsBg = document.createElement('div');
        heartsBg.id = 'heartsBg';
        heartsBg.style.position = 'fixed';
        heartsBg.style.width = '100%';
        heartsBg.style.height = '100%';
        heartsBg.style.pointerEvents = 'none';
        heartsBg.style.zIndex = '-1';
        document.body.prepend(heartsBg);
    }

    const numHearts = 15;
    
    for (let i = 0; i < numHearts; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.innerHTML = '❤️';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.top = Math.random() * 100 + '%';
        heart.style.fontSize = (Math.random() * 15 + 10) + 'px';
        heart.style.opacity = Math.random() * 0.6 + 0.2;
        heart.style.animationDuration = (Math.random() * 6 + 3) + 's';
        heart.style.animationDelay = (Math.random() * 5) + 's';
        heartsBg.appendChild(heart);
    }
}

// Add selection animation
function addSelectionAnimation() {
    const buttons = document.querySelectorAll('.btn-card');
    buttons.forEach(btn => {
        btn.addEventListener('click', function() {
            buttons.forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            
            // Add pulse animation to question container
            const questionContainer = document.getElementById('question-container');
            questionContainer.classList.add('pulse');
            setTimeout(() => {
                questionContainer.classList.remove('pulse');
            }, 500);
        });
    });
}

// Add animation to roulette result
function animateRouletteResult() {
    const result = document.getElementById('roulette-result');
    result.classList.add('reveal');
    setTimeout(() => {
        result.classList.remove('reveal');
    }, 500);
}

// Initialize all animations
document.addEventListener('DOMContentLoaded', function() {
    createFloatingHearts();
    addSelectionAnimation();
    enhancedSpinRoulette();
    setupThemeToggle();
    
    // Welcome confetti
    setTimeout(() => {
        confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.7 }
        });
    }, 1000);
});