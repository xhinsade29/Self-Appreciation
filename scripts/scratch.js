// Define card data with dares
const cardsData = [
    { type: 'dare', content: 'Sing a love song… but like a crying baby! 😭🎤', image: 'lib-scratch/baby_crying_sing.gif', difficulty: 'easy' },
    { type: 'dare', content: 'Dance like a worm trying to escape from a bird!', image: 'lib-scratch/worm_dance.gif', difficulty: 'easy' },
    { type: 'dare', content: 'Act like a chicken who just found out it can fly! 🐔✨', image: 'lib-scratch/flying_chicken.jpg', difficulty: 'easy' },
    { type: 'dare', content: 'Do a slow-motion fight scene with an invisible enemy! 🥋⚔️', image: 'lib-scratch/slowmo_fight.jpg', difficulty: 'medium' },
    { type: 'dare', content: 'Do the alien dance until your next turn! 👽🛸', image: 'lib-scratch/alien_dance.gif', difficulty: 'medium' },
    { type: 'dare', content: 'Pretend you are a lost tourist asking for directions… in gibberish! 🗺️🤣', image: 'lib-scratch/lost_tourist1.jpg', difficulty: 'medium' },
    { type: 'dare', content: 'Try to sell an invisible product like a TV commercial! 📺😂', image: 'lib-scratch/salesman.jpg', difficulty: 'medium' },
    { type: 'dare', content: 'Mimic the person on your right for the next 2 minutes! 🪞😆', image: 'lib-scratch/mirror_mimic.jpg', difficulty: 'medium' },
    { type: 'dare', content: 'Tell a joke, but whisper it like its a top-secret mission! 🤫', image: 'lib-scratch/whisper_joke.jpg', difficulty: 'easy' },
    { type: 'dare', content: 'Pretend youre on a cooking show and explain how to make Invisible Soup! 🍲👻', image: 'lib-scratch/cooking_show.jpg', difficulty: 'medium' },
    { type: 'dare', content: 'Do 5 jumping jacks while laughing like an evil villain! 😈😂', image: 'lib-scratch/evil_laugh.gif', difficulty: 'hard' },
    { type: 'dare', content: 'Hug the nearest object and say, "I will never let go!" 🛟💔', image: 'lib-scratch/never_let_go.gif', difficulty: 'easy' },
    { type: 'dare', content: 'Try to make the person next to you laugh within 10 seconds using only your face! 🤪', image: 'lib-scratch/funny_face.gif', difficulty: 'medium' },
    { type: 'dare', content: 'Pretend youre a cat stuck in a tree and need help! 🐱🌳', image: 'lib-scratch/cat_stuck.jpg', difficulty: 'hard' }
];

// Sound effects with error handling
const scratchSound = new Audio();
const revealSound = new Audio();
const confettiSound = new Audio();
const scoreSound = new Audio();
const levelUpSound = new Audio();
const gameOverSound = new Audio();

// Game state variables
let currentCards = [];
let currentDifficulty = 'easy';
let score = 0;
let highScore = 0;
let soundEnabled = true;
let scratchedCards = new Set(); // Track which cards have been scratched
let gameActive = true; // Track whether game is active or paused
let cardsRevealedInLevel = 0; // Track how many cards have been revealed in current level

// Initialize the sound effects with error handling
function initSoundEffects() {
    try {
        scratchSound.src = 'music-effects/scratch.mp3';
        revealSound.src = 'music-effects/reveal.mp3';
        confettiSound.src = 'music-effects/confetti.mp3';
        scoreSound.src = 'music-effects/score.mp3';
        levelUpSound.src = 'music-effects/level-up.mp3'; // Add a level up sound
        gameOverSound.src = 'music-effects/game-over.mp3'; // Add game over sound
        
        // Preload sounds
        [scratchSound, revealSound, confettiSound, scoreSound, levelUpSound, gameOverSound].forEach(sound => {
            sound.load();
            sound.volume = 0.3;
            
            // Add error handling
            sound.onerror = () => {
                console.warn(`Failed to load sound: ${sound.src}`);
                sound.muted = true;
            };
        });
        
        // Adjust scratch sound to be shorter
        scratchSound.volume = 0.3;
    } catch (e) {
        console.error("Error initializing sound effects:", e);
    }
}

// Filter cards by difficulty
function getCardsByDifficulty(difficulty) {
    return cardsData.filter(card => 
        !card.difficulty || card.difficulty === difficulty || 
        (difficulty === 'hard' && card.difficulty === 'medium')
    );
}

// Shuffle cards with Fisher-Yates algorithm
function shuffleCards() {
    const availableCards = getCardsByDifficulty(currentDifficulty);
    const shuffled = [...availableCards];
    
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    // Take only the first 8 cards
    return shuffled.slice(0, 8);
}

// Create a card element
function createCard(content, type, image, difficulty, index) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.index = index;
    
    // Add difficulty badge
    const difficultyBadge = document.createElement('div');
    difficultyBadge.classList.add('card-difficulty');
    difficultyBadge.textContent = difficulty || 'easy';
    card.appendChild(difficultyBadge);
    
    // Add a slight random rotation to each card
    const randomRotation = Math.random() * 6 - 3;
    card.style.transform = `rotate(${randomRotation}deg)`;
    
    // Add animation delay based on index
    card.style.animationDelay = `${index * 0.1}s`;
    
    // Check if card has been scratched already
    if (scratchedCards.has(index)) {
        // Apply completed card styling
        card.classList.add('scratched');
        const completedOverlay = document.createElement('div');
        completedOverlay.classList.add('completed-overlay');
        completedOverlay.innerHTML = '✓';
        card.appendChild(completedOverlay);
        
        // Add disabled attribute and title
        card.setAttribute('disabled', 'true');
        card.title = 'Already completed';
    
    } else {
        // Add click handler only if not scratched and game is active
        card.onclick = () => {
            if (gameActive && !scratchedCards.has(index)) {
                openModal(content, type, image, difficulty, index);
            }
        };
    }
    
    return card;
}

// Open the scratch modal
function openModal(content, type, image, difficulty, index) {
    const modal = document.getElementById('scratchModal');
    const modalCard = document.getElementById('modalCard');
    modalCard.innerHTML = '';

    const hiddenContent = document.createElement('div');
    hiddenContent.style.display = 'none';
    hiddenContent.classList.add('hidden-content');
    hiddenContent.dataset.difficulty = difficulty || 'easy';
    hiddenContent.dataset.index = index;

    if (image) {
        const img = document.createElement('img');
        img.src = image;
        img.alt = "Dare image";
        
        // Add error handling for missing images
        img.onerror = () => {
            console.error(`Failed to load image: ${image}`);
            img.src = './resources/404.jpg'; // Fallback image
        };
        
        hiddenContent.appendChild(img);
    }

    // Add text content
    const text = document.createElement('p');
    text.innerText = content;
    hiddenContent.appendChild(text);

    modalCard.appendChild(hiddenContent);
    
    // Initialize the scratch canvas
    initScratchEffect(modalCard, hiddenContent);
    
    // Display the modal
    modal.style.display = 'flex';
    
    // Disable scrolling on body
    document.body.style.overflow = 'hidden';
}

// Close the modal
function closeModal() {
    const modal = document.getElementById('scratchModal');
    
    // Remove existing canvas
    const existingCanvas = modal.querySelector('canvas');
    if (existingCanvas) {
        existingCanvas.remove();
    }
    
    modal.style.display = 'none';
    
    // Re-enable scrolling
    document.body.style.overflow = 'auto';
    
    // Check if all cards in current level are scratched
    checkLevelCompletion();
}

// Check if all cards in current level are scratched
function checkLevelCompletion() {
    if (cardsRevealedInLevel >= currentCards.length) {
        // All cards have been scratched in this level
        if (currentDifficulty === 'hard') {
            // Game completed - show game over modal
            showGameOverModal();
        } else {
            // Progress to next level
            progressToNextLevel();
        }
    }
}

// Progress to next difficulty level
function progressToNextLevel() {
    const difficultyOrder = ['easy', 'medium', 'hard'];
    const currentIndex = difficultyOrder.indexOf(currentDifficulty);
    if (currentIndex < difficultyOrder.length - 1) {
        // Move to next difficulty
        const nextDifficulty = difficultyOrder[currentIndex + 1];
        
        // Show level up modal
        showLevelUpModal(nextDifficulty);
        
        // Play level up sound
        if (soundEnabled) {
            levelUpSound.currentTime = 0;
            levelUpSound.play().catch(e => console.warn("Could not play level up sound:", e));
        }
    }
}

// Show level up modal
function showLevelUpModal(nextDifficulty) {
    // Create modal if it doesn't exist
    let levelUpModal = document.getElementById('levelUpModal');
    if (!levelUpModal) {
        levelUpModal = document.createElement('div');
        levelUpModal.id = 'levelUpModal';
        levelUpModal.className = 'game-modal';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        
        const title = document.createElement('h2');
        title.innerText = '🎉 Level Complete! 🎉';
        
        const message = document.createElement('p');
        message.id = 'levelUpMessage';
        
        const currentScoreText = document.createElement('p');
        currentScoreText.innerHTML = `Current Score: <span id="levelUpScore"></span>`;
        
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';
        
        const continueButton = document.createElement('button');
        continueButton.innerText = 'Continue to Next Level';
        continueButton.className = 'game-button';
        continueButton.onclick = () => {
            levelUpModal.style.display = 'none';
            setDifficulty(nextDifficulty);
            cardsRevealedInLevel = 0; // Reset counter for new level
        };
        
        buttonContainer.appendChild(continueButton);
        modalContent.appendChild(title);
        modalContent.appendChild(message);
        modalContent.appendChild(currentScoreText);
        modalContent.appendChild(buttonContainer);
        levelUpModal.appendChild(modalContent);
        document.body.appendChild(levelUpModal);
    }
    
    // Update modal content
    document.getElementById('levelUpMessage').innerText = `You've completed the ${currentDifficulty} level! Moving on to ${nextDifficulty} difficulty!`;
    document.getElementById('levelUpScore').innerText = score;
    
    // Show modal
    levelUpModal.style.display = 'flex';
}

// Show game over modal
function showGameOverModal() {
    // Create modal if it doesn't exist
    let gameOverModal = document.getElementById('gameOverModal');
    if (!gameOverModal) {
        gameOverModal = document.createElement('div');
        gameOverModal.id = 'gameOverModal';
        gameOverModal.className = 'game-modal';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        
        const title = document.createElement('h2');
        title.innerText = '🏆 Game Complete! 🏆';
        
        const message = document.createElement('p');
        message.innerText = 'Congratulations! You\'ve completed all levels!';
        
        const finalScoreText = document.createElement('p');
        finalScoreText.innerHTML = `Final Score: <span id="finalScore"></span>`;
        
        const highScoreText = document.createElement('p');
        highScoreText.id = 'newHighScore';
        highScoreText.style.display = 'none';
        highScoreText.innerHTML = '🎉 NEW HIGH SCORE! 🎉';
        
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';
        
        const playAgainButton = document.createElement('button');
        playAgainButton.innerText = 'Play Again';
        playAgainButton.className = 'game-button';
        playAgainButton.onclick = () => {
            gameOverModal.style.display = 'none';
            resetGame(true);
        };
        
        buttonContainer.appendChild(playAgainButton);
        modalContent.appendChild(title);
        modalContent.appendChild(message);
        modalContent.appendChild(finalScoreText);
        modalContent.appendChild(highScoreText);
        modalContent.appendChild(buttonContainer);
        gameOverModal.appendChild(modalContent);
        document.body.appendChild(gameOverModal);
    }
    
    // Update modal content
    document.getElementById('finalScore').innerText = score;
    
    // Check for high score
    if (score > highScore) {
        document.getElementById('newHighScore').style.display = 'block';
    } else {
        document.getElementById('newHighScore').style.display = 'none';
    }
    
    // Play game over sound
    if (soundEnabled) {
        gameOverSound.currentTime = 0;
        gameOverSound.play().catch(e => console.warn("Could not play game over sound:", e));
    }
    
    // Show modal
    gameOverModal.style.display = 'flex';
}

// Initialize the scratch effect
function initScratchEffect(container, hiddenContent) {
    // Create canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    // Set canvas dimensions to match container
    const containerRect = container.getBoundingClientRect();
    
    // Ensure canvas has valid dimensions with fallback values
    canvas.width = Math.max(300, containerRect.width || 300);
    canvas.height = Math.max(400, containerRect.height || 400);
    
    // Log dimensions for debugging
    if (canvas.width <= 0 || canvas.height <= 0) {
        console.error("Invalid canvas dimensions:", canvas.width, canvas.height);
    }

    
    container.appendChild(canvas);
    
    // Fill canvas with pattern
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#c9c9c9');
    gradient.addColorStop(1, '#a0a0a0');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw text
    ctx.font = 'bold 40px Fredoka One, cursive';
    ctx.fillStyle = '#ff4d6d';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SCRATCH!', canvas.width/2, canvas.height/2);
    
    // Add decorative elements
    ctx.font = '24px Fredoka One, cursive';
    ctx.fillText('👇', canvas.width/2, canvas.height/2 + 50);
    
    // Add small fingerprint marks around the edges
    for (let i = 0; i < 10; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = 5 + Math.random() * 10;
        
        ctx.globalAlpha = 0.1 + Math.random() * 0.2;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }
    
    ctx.globalAlpha = 1;
    
    // Track scratching state
    let isScratching = false;
    let lastX = 0;
    let lastY = 0;
    let scratchedPixels = 0;
    const totalPixels = canvas.width * canvas.height;
    
    // Event functions for scratching
    function startScratch(event) {
        if (!gameActive) return; // Skip if game is paused
        event.preventDefault();
        isScratching = true;
        performScratch(event);
    }
    
    function performScratch(event) {
        if (!isScratching || !gameActive) return; // Skip if not scratching or game is paused
        event.preventDefault();
        
        const rect = canvas.getBoundingClientRect();
        const x = (event.touches ? event.touches[0].clientX : event.clientX) - rect.left;
        const y = (event.touches ? event.touches[0].clientY : event.clientY) - rect.top;
        
        // Play scratch sound if enabled
        if (soundEnabled && !scratchSound.paused) {
            scratchSound.currentTime = 0;
            scratchSound.play().catch(e => console.warn("Could not play scratch sound:", e));
        }
        
        // Create a more dynamic scratch effect with varying sizes based on speed
        const distanceFromLast = Math.sqrt(Math.pow(x - lastX, 2) + Math.pow(y - lastY, 2));
        const brushSize = Math.min(Math.max(20, distanceFromLast * 1.5), 40);
        
        ctx.globalCompositeOperation = 'destination-out';
        
        // Draw a line from last position to current position for continuous scratching
        if (lastX && lastY && distanceFromLast < 100) {
            ctx.lineWidth = brushSize;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(x, y);
            ctx.stroke();
            
            // Approximate scratched pixels
            scratchedPixels += brushSize * distanceFromLast;
        } else {
            ctx.beginPath();
            ctx.arc(x, y, brushSize, 0, Math.PI * 2);
            ctx.fill();
            
            // Approximate scratched pixels
            scratchedPixels += Math.PI * brushSize * brushSize;
        }
        
        lastX = x;
        lastY = y;
        
        // Create spark effect
        createSparkEffect(x, y, container);
        
        // Check if enough of the card has been scratched
        const scratchPercentage = Math.min(scratchedPixels / totalPixels, 1);
        if (scratchPercentage > 0.4) {
            revealCard(hiddenContent);
        }
    }
    
    function endScratch() {
        isScratching = false;
        lastX = 0;
        lastY = 0;
        
        // Stop scratch sound
        if (!scratchSound.paused) {
            scratchSound.pause();
            scratchSound.currentTime = 0;
        }
    }
    
    // Add event listeners
    canvas.addEventListener('mousedown', startScratch);
    canvas.addEventListener('mousemove', performScratch);
    canvas.addEventListener('mouseup', endScratch);
    canvas.addEventListener('mouseleave', endScratch);
    
    canvas.addEventListener('touchstart', startScratch);
    canvas.addEventListener('touchmove', performScratch);
    canvas.addEventListener('touchend', endScratch);
    canvas.addEventListener('touchcancel', endScratch);
}

// Create a spark effect at the specified position
function createSparkEffect(x, y, container) {
    const spark = document.createElement('div');
    spark.classList.add('spark');
    spark.style.left = `${x}px`;
    spark.style.top = `${y}px`;
    
    // Randomize spark size
    const size = 20 + Math.random() * 30;
    spark.style.width = `${size}px`;
    spark.style.height = `${size}px`;
    
    container.appendChild(spark);
    setTimeout(() => spark.remove(), 500);
}

// Reveal the card content
function revealCard(hiddenContent) {
    // Show hidden content
    hiddenContent.style.display = 'flex';
    
    // Play reveal sound
    if (soundEnabled) {
        revealSound.currentTime = 0;
        revealSound.play().catch(e => console.warn("Could not play reveal sound:", e));
    }
    
    // Remove canvas
    const canvas = hiddenContent.parentElement.querySelector('canvas');
    if (canvas) {
        canvas.remove();
    }
    
    // Mark card as scratched
    const cardIndex = hiddenContent.dataset.index;
    scratchedCards.add(parseInt(cardIndex));
    cardsRevealedInLevel++;
    
    // Update card in the grid
    updateCardInGrid(cardIndex);
    
    // Trigger confetti effect
    setTimeout(() => {
        triggerConfetti();
    }, 300);
    
    // Update score based on difficulty
    const difficulty = hiddenContent.dataset.difficulty || 'easy';
    updateScore(difficulty);
}

// Update card display in the grid to show it's been scratched
function updateCardInGrid(index) {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        if (card.dataset.index === index) {
            card.classList.add('scratched');
            
            // Add completed overlay if not already there
            if (!card.querySelector('.completed-overlay')) {
                const completedOverlay = document.createElement('div');
                completedOverlay.classList.add('completed-overlay');
                completedOverlay.innerHTML = '✓';
                card.appendChild(completedOverlay);
            }
            
            // Remove click handler
            card.onclick = null;
        }
    });
}

// Update the player's score
function updateScore(difficulty) {
    const pointValues = {
        'easy': 5,
        'medium': 10,
        'hard': 15
    };
    
    const points = pointValues[difficulty] || 5;
    score += points;
    
    // Update progress bar and score display
    const progressBar = document.getElementById('progressBar');
    const scoreValue = document.getElementById('scoreValue');
    
    if (progressBar && scoreValue) {
        // Calculate progress percentage (max score 100)
        const progressPercentage = Math.min(score, 100);
        progressBar.style.width = `${progressPercentage}%`;
        scoreValue.textContent = score;
        
        // Play score sound
        if (soundEnabled) {
            scoreSound.currentTime = 0;
            scoreSound.play().catch(e => console.warn("Could not play score sound:", e));
        }
        
        // Check if high score is beaten
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore);
            
            // Update high score display if it exists
            const highScoreDisplay = document.querySelector('.high-score');
            if (highScoreDisplay) {
                highScoreDisplay.innerHTML = `High Score: ${highScore}`;
                highScoreDisplay.classList.add('pulse');
                setTimeout(() => highScoreDisplay.classList.remove('pulse'), 1000);
            }
        }
    }
}

// Create confetti effect
function triggerConfetti() {
    // Play confetti sound
    if (soundEnabled) {
        confettiSound.currentTime = 0;
        confettiSound.play().catch(e => console.warn("Could not play confetti sound:", e));
    }
    
    // Create confetti container if it doesn't exist
    let confettiContainer = document.querySelector('.confetti');
    if (!confettiContainer) {
        confettiContainer = document.createElement('div');
        confettiContainer.classList.add('confetti');
        document.body.appendChild(confettiContainer);
    }
    
    // Add confetti pieces
    for (let i = 0; i < 100; i++) {
        createConfettiPiece(confettiContainer);
    }
    
    // Clean up after animation
    setTimeout(() => {
        if (confettiContainer && confettiContainer.parentNode) {
            confettiContainer.parentNode.removeChild(confettiContainer);
        }
    }, 3000);
}

// Create a single confetti piece
function createConfettiPiece(container) {
    const colors = ['#ff4d6d', '#ff758c', '#ffb3c1', '#ffcdd2', '#ffffff'];
    const confettiPiece = document.createElement('div');
    
    // Randomize properties
    const size = Math.random() * 10 + 5;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const shape = Math.random() > 0.5 ? '50%' : '0';
    const leftPos = Math.random() * 100;
    const duration = Math.random() * 3 + 1;
    const delay = Math.random() * 0.5;
    
    // Apply styles
    confettiPiece.style.position = 'absolute';
    confettiPiece.style.width = `${size}px`;
    confettiPiece.style.height = `${size}px`;
    confettiPiece.style.backgroundColor = color;
    confettiPiece.style.borderRadius = shape;
    confettiPiece.style.left = `${leftPos}%`;
    confettiPiece.style.top = '0';
    confettiPiece.style.zIndex = '1000';
    confettiPiece.style.pointerEvents = 'none';
    confettiPiece.style.animation = `confettiFall ${duration}s linear ${delay}s forwards`;
    
    container.appendChild(confettiPiece);
    
    // Clean up after animation
    setTimeout(() => {
        if (confettiPiece.parentNode) {
            confettiPiece.parentNode.removeChild(confettiPiece);
        }
    }, (duration + delay) * 1000 + 100);
}

// Reset the game with new cards
function resetGame(fullReset = false) {
    if (fullReset) {
        // Reset all game state
        score = 0;
        currentDifficulty = 'easy';
        scratchedCards.clear();
        cardsRevealedInLevel = 0;
        gameActive = true;
        
        // Update score display
        const scoreValue = document.getElementById('scoreValue');
        if (scoreValue) {
            scoreValue.textContent = "0";
        }
        
        // Reset progress bar
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            progressBar.style.width = "0%";
        }
        
        // Update difficulty buttons
        const buttons = document.querySelectorAll('.difficulty-btn');
        buttons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.difficulty === 'easy');
        });
        
        // Update game state indicator
        updateGameStateIndicator();
    }
    
    const cardContainer = document.getElementById('cardContainer');
    if (!cardContainer) return;
    
    // Clear container
    cardContainer.innerHTML = '';
    
    // Get new set of cards
    currentCards = shuffleCards();
    
    // Create card elements
    currentCards.forEach((cardData, index) => {
        const card = createCard(
            cardData.content,
            cardData.type,
            cardData.image,
            cardData.difficulty,
            index
        );
        cardContainer.appendChild(card);
    });
}

// Handle difficulty selection
function setDifficulty(difficultyLevel) {
    currentDifficulty = difficultyLevel;
    
    // Reset scratched cards for new level
    scratchedCards.clear();
    cardsRevealedInLevel = 0;
    
    // Update active button
    const buttons = document.querySelectorAll('.difficulty-btn');
    buttons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.difficulty === difficultyLevel);
    });
    
    // Reset game with new difficulty
    resetGame();
}

// Create floating bubbles in the background
function createBubbles() {
    const bubblesContainer = document.getElementById('bubbles');
    if (!bubblesContainer) return;
    
    bubblesContainer.innerHTML = '';
    
    for (let i = 0; i < 20; i++) {
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
        
        // Random properties
        const size = Math.random() * 80 + 20;
        const left = Math.random() * 100;
        const duration = Math.random() * 10 + 15;
        const delay = Math.random() * 10;
        
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${left}%`;
        bubble.style.animationDuration = `${duration}s`;
        bubble.style.animationDelay = `${delay}s`;
        
        bubblesContainer.appendChild(bubble);
    }
}

// Toggle sound on/off
function toggleSound() {
    soundEnabled = !soundEnabled;
    
    // Update all audio elements
    [scratchSound, revealSound, confettiSound, scoreSound, levelUpSound, gameOverSound].forEach(sound => {
        sound.muted = !soundEnabled;
    });
    
    // Update icon
    const soundIcon = document.querySelector('.sound-icon');
    if (soundIcon) {
        soundIcon.textContent = soundEnabled ? '🔊' : '🔇';
    }
    
    // Save preference
    localStorage.setItem('soundEnabled', soundEnabled);
}

// Toggle game state (pause/play)
function toggleGameState() {
    gameActive = !gameActive;
    updateGameStateIndicator();
    
    // Show pause overlay if paused
    let pauseOverlay = document.getElementById('pauseOverlay');
    if (!pauseOverlay) {
        pauseOverlay = document.createElement('div');
        pauseOverlay.id = 'pauseOverlay';
        pauseOverlay = document.createElement('div');
        pauseOverlay.id = 'pauseOverlay';
        pauseOverlay.className = 'pause-overlay';
        
        const pauseMessage = document.createElement('div');
        pauseMessage.className = 'pause-message';
        pauseMessage.innerHTML = '<h2>Game Paused</h2><p>Click the play button to continue</p>';
        
        pauseOverlay.appendChild(pauseMessage);
        document.body.appendChild(pauseOverlay);
    }
    
    pauseOverlay.style.display = gameActive ? 'none' : 'flex';
}

// Update game state indicator (play/pause button)
function updateGameStateIndicator() {
    const gameStateIcon = document.querySelector('.game-state-icon');
    if (gameStateIcon) {
        gameStateIcon.textContent = gameActive ? '⏸️' : '▶️';
        gameStateIcon.setAttribute('title', gameActive ? 'Pause Game' : 'Resume Game');
    }
}

// Initialize the game
function initGame() {
    // Initialize sounds
    initSoundEffects();
    
    // Create card grid
    resetGame(true);
    
    // Create background bubbles
    createBubbles();
    
    // Load high score from local storage
    const savedHighScore = localStorage.getItem('highScore');
    if (savedHighScore !== null) {
        highScore = parseInt(savedHighScore);
        
        // Update high score display
        const highScoreDisplay = document.querySelector('.high-score');
        if (highScoreDisplay) {
            highScoreDisplay.innerHTML = `High Score: ${highScore}`;
        }
    }
    
    // Load sound preference from local storage
    const savedSoundPreference = localStorage.getItem('soundEnabled');
    if (savedSoundPreference !== null) {
        soundEnabled = savedSoundPreference === 'true';
        
        // Update sound icon
        const soundIcon = document.querySelector('.sound-icon');
        if (soundIcon) {
            soundIcon.textContent = soundEnabled ? '🔊' : '🔇';
        }
    }
    
    // Add pause/play button click handler
    const gameStateButton = document.querySelector('.game-state-button');
    if (gameStateButton) {
        gameStateButton.addEventListener('click', toggleGameState);
    }
    
    // Add sound toggle click handler
    const soundButton = document.querySelector('.sound-button');
    if (soundButton) {
        soundButton.addEventListener('click', toggleSound);
    }
    
    // Add difficulty button click handlers
    const difficultyButtons = document.querySelectorAll('.difficulty-btn');
    difficultyButtons.forEach(button => {
        button.addEventListener('click', () => {
            setDifficulty(button.dataset.difficulty);
        });
    });
    
    // Add event listener for modal close button
    const closeButton = document.querySelector('.close-modal');
    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }
    
    // Add window resize handler to adjust bubbles
    window.addEventListener('resize', createBubbles);
    
    // Initial game state
    updateGameStateIndicator();
}

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', initGame);

// Add CSS animation for confetti
const style = document.createElement('style');
style.textContent = `
@keyframes confettiFall {
    0% {
        transform: translateY(-10px) rotate(0deg);
        opacity: 1;
    }
    100% {
        transform: translateY(100vh) rotate(720deg);
        opacity: 0;
    }
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

//  CSS for game result modal
const modalStyles = document.createElement('style');
modalStyles.textContent = `
.game-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.8);
}

.modal-content {
    background: linear-gradient(135deg, #ffcdd2, #f8bbd0);
    padding: 2rem;
    border-radius: 20px;
    text-align: center;
    max-width: 90%;
    width: 400px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.modal-content h2 {
    margin-bottom: 1rem;
    font-size: 1.8rem;
}

.modal-content p {
    margin: 1rem 0;
    font-size: 1.2rem;
}

#newHighScore {
    color: #ff4d6d;
    font-weight: bold;
    font-size: 1.4rem;
    margin: 1rem 0;
}

.button-container {
    margin-top: 1.5rem;
}

.game-button {
    padding: 0.8rem 2rem;
    font-size: 1.1rem;
    border-radius: 25px;
    background: linear-gradient(135deg, #ff4d6d, #ff758f);
    color: white;
    border: none;
    cursor: pointer;
    transition: transform 0.3s ease;
}

.game-button:hover {
    transform: scale(1.05);
}
`;
document.head.appendChild(modalStyles);

// Background music setup
const bgMusic = new Audio('music-effects/blue.mp3');
bgMusic.loop = true;
bgMusic.volume = 0.3;
bgMusic.autoplay = true; // Add autoplay attribute

// Add music controls to the page
function addMusicControls() {
    const musicButton = document.createElement('button');
    musicButton.id = 'musicToggle';
    musicButton.innerHTML = '🔊';
    musicButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
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