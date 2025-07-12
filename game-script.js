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
        // Import your game module
        const gameModule = await import('./game.js');
        console.log('Game module loaded successfully');
        
        // Initialize the game
        const game = gameModule.initializeGame();
        console.log('Game initialized:', game);
        
        // Store game reference globally for cleanup
        window.currentGame = game;
        
    } catch (error) {
        console.error('Failed to load game module:', error);
        
        // Fallback: try loading as a regular script
        const gameScript = document.createElement('script');
        gameScript.type = 'module';
        gameScript.src = './game.js';
        gameScript.onload = () => {
            console.log('Game script loaded as fallback');
        };
        gameScript.onerror = () => {
            console.error('Failed to load game script even as fallback');
        };
        document.head.appendChild(gameScript);
    }
}

function setupGameChatListeners() {
    // Set up chat input listeners
    const gameChatInput = document.getElementById('game-chat-input');
    if (gameChatInput) {
        gameChatInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                if (window.sendMessage) {
                    window.sendMessage();
                }
            }
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeGameMode();
});

