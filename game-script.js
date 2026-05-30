// game-script.js
class GameModeToggle {
    constructor() {
        this.currentMode = 'game';
        this.isLoading = false;
        this.init();
    }

    init() {
        this.modeToggle = document.getElementById('modeToggle');
        this.toggleSwitch = document.getElementById('toggleSwitch');
        this.portfolioLabel = document.getElementById('portfolioLabel');
        this.gameLabel = document.getElementById('gameLabel');

        if (!this.modeToggle || !this.toggleSwitch) {
            console.error('Mode toggle elements not found');
            return;
        }

        this.updateToggleState();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Handle click on entire toggle container
        this.modeToggle.addEventListener('click', (e) => {
            if (!this.isLoading) {
                this.switchToPortfolioMode();
            }
        });

        // Prevent double-clicking during loading
        this.modeToggle.addEventListener('dblclick', (e) => {
            e.preventDefault();
        });
    }

    updateToggleState() {
        // Game mode: switch should be active (right position)
        this.toggleSwitch.classList.add('active');
        
        // Update label states
        if (this.portfolioLabel && this.gameLabel) {
            this.portfolioLabel.classList.remove('active');
            this.gameLabel.classList.add('active');
        }
    }

    showLoadingState() {
        this.isLoading = true;
        this.modeToggle.classList.add('disabled');
        this.modeToggle.innerHTML = `
            <div class="loading-text">
                <div class="loading-spinner"></div>
                <span>Loading Portfolio...</span>
            </div>
        `;
    }

    switchToPortfolioMode() {
        if (this.isLoading) return;

        this.showLoadingState();
        this.cleanupGame();
        
        // Navigate to portfolio page
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 500);
    }

    cleanupGame() {
        // Clean up game resources
        if (window.currentGame) {
            window.currentGame.destroy(true);
            window.currentGame = null;
        }
        
        if (window.game) {
            window.game.destroy(true);
            window.game = null;
        }
        
        console.log('Game cleanup complete');
    }
}

// Game initialization functions
function initializeGameMode() {
    // Initialize mode toggle
    window.gameModeToggle = new GameModeToggle();
    
    // Initialize the game
    setTimeout(() => {
        initializeGame();
    }, 100);
    
    setupGameChatListeners();
}

function initializeGame() {
    console.log('Initializing game...');
    
    // Check if Phaser is loaded
    if (typeof Phaser === 'undefined') {
        console.error('Phaser is not loaded');
        return;
    }
    
    const gameContainer = document.getElementById('game-canvas');
    if (!gameContainer) {
        console.error('Game container not found');
        return;
    }
    
    gameContainer.innerHTML = '<div id="phaser-container"></div>';
    const phaserContainer = document.getElementById('phaser-container');
    
    // Force container to be visible and properly sized
    phaserContainer.style.width = '800px';
    phaserContainer.style.height = '600px';
    phaserContainer.style.margin = '0 auto';
    phaserContainer.style.border = '2px solid #fff';
    phaserContainer.style.display = 'block';
    phaserContainer.style.visibility = 'visible';
    
    console.log('Phaser container setup complete');
    
    // Load game module
    loadGameModule();
}

async function loadGameModule() {
    try {
        await import('./game.js');
        console.log('Game module loaded successfully');
    } catch (error) {
        console.error('Failed to load game module:', error);
    }
}

function setupGameChatListeners() {
    const gameChatInput = document.getElementById('game-chat-input');
    if (gameChatInput) {
        gameChatInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                window.sendMessage && window.sendMessage();
            }
        });
    }

    const sendBtn = document.getElementById('game-chat-button');
    if (sendBtn) {
        sendBtn.addEventListener('click', () => window.sendMessage && window.sendMessage());
    }

    const closeBtn = document.querySelector('.game-close-chat');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => window.closeChatPopup && window.closeChatPopup());
    }
}

window.openChatPopup = function() {
    const chatPopup = document.getElementById('game-chat-popup');
    if (!chatPopup) return;
    chatPopup.style.display = 'flex';
    const chatInput = document.getElementById('game-chat-input');
    if (chatInput) setTimeout(() => chatInput.focus(), 100);
    if (window.currentGame && window.currentGame.input && window.currentGame.input.keyboard) {
        window.currentGame.input.keyboard.enabled = false;
    }
};

window.closeChatPopup = function() {
    const chatPopup = document.getElementById('game-chat-popup');
    if (chatPopup) chatPopup.style.display = 'none';
    if (window.currentGame && window.currentGame.input && window.currentGame.input.keyboard) {
        window.currentGame.input.keyboard.enabled = true;
    }
};

window.addMessage = function(content, isUser = false) {
    const messagesContainer = document.getElementById('game-chat-messages');
    if (!messagesContainer) return;
    const messageDiv = document.createElement('div');
    messageDiv.className = `game-message ${isUser ? 'user' : 'bot'}`;
    messageDiv.innerHTML = `<strong>${isUser ? 'You' : 'WKBot'}:</strong> ${content}`;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
};

window.showTypingIndicator = function() {
    const indicator = document.getElementById('game-typing-indicator');
    if (indicator) indicator.style.display = 'block';
};

window.hideTypingIndicator = function() {
    const indicator = document.getElementById('game-typing-indicator');
    if (indicator) indicator.style.display = 'none';
};

window.getAIResponse = async function(query) {
    try {
        const response = await fetch('https://wkbot.onrender.com/ask', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        return data.answer;
    } catch (error) {
        console.error('API Error:', error);
        return 'Sorry, I encountered an error connecting to my knowledge base. Please try again.';
    }
};

window.sendMessage = async function() {
    const input = document.getElementById('game-chat-input');
    const sendButton = document.getElementById('game-chat-button');
    if (!input || !sendButton) return;

    const message = input.value.trim();
    if (!message) return;

    window.addMessage(message, true);
    input.value = '';
    sendButton.disabled = true;
    window.showTypingIndicator();

    try {
        const response = await window.getAIResponse(message);
        window.hideTypingIndicator();
        window.addMessage(response);
    } catch (error) {
        console.error('Game chat error:', error);
        window.hideTypingIndicator();
        window.addMessage('Sorry, something went wrong. Please try again.');
    } finally {
        sendButton.disabled = false;
        input.focus();
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeGameMode();
    window.addMessage("Hi! I'm WKbot, Wing Kiu's AI bot. Ask me anything about her projects, skills, or experience!", false);
});

