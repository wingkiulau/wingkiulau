let matrixInterval;
let effectsRunning = false;
let activeParticles = 0;

// Configuration for particle performance tuning
const PARTICLE_CONFIG = {
    maxParticles: 10,   
    spawnRate: 400,       
    minDuration: 3,        
    maxDuration: 6,         
    chars: '01▓░▒▓█▄▌▐▀'    
};

function isPortfolioMode() {
    const gameMode = document.getElementById('gameMode');
    return !gameMode || gameMode.style.display !== 'block';
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing portfolio...');
    
    // Initialize all components
    initializeAuth();
    initializeTabSwitching();
    initializePortfolioChat();
    initializeAnimations();
    initializeParticleEffects();
    initializePortfolioMode();
});

class PortfolioModeToggle {
    constructor() {
        this.currentMode = 'portfolio';
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
        this.modeToggle.addEventListener('click', this.handleToggleClick.bind(this));
        this.modeToggle.addEventListener('dblclick', this.handleDoubleClick.bind(this));
        
        // Handle other game mode triggers
        this.setupGameModeLinks();
    }

    setupGameModeLinks() {
        const gameLinks = ['tryGameLink', 'gameToggleBtn'];
        gameLinks.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.switchToGameMode();
                });
            }
        });
    }

    handleToggleClick(e) {
        if (!this.isLoading) {
            this.switchToGameMode();
        }
    }

    handleDoubleClick(e) {
        e.preventDefault();
    }

    updateToggleState() {
        this.toggleSwitch.classList.remove('active');
        
        if (this.portfolioLabel && this.gameLabel) {
            this.portfolioLabel.classList.add('active');
            this.gameLabel.classList.remove('active');
        }
    }

    showLoadingState() {
        this.isLoading = true;
        this.modeToggle.classList.add('disabled');
        this.modeToggle.innerHTML = `
            <div class="loading-text">
                <div class="loading-spinner"></div>
                <span>Loading Game...</span>
            </div>
        `;
    }

    switchToGameMode() {
        if (this.isLoading) return;
        
        this.showLoadingState();
        this.stopPortfolioEffects();
        
        // Navigate with a slight delay for visual feedback
        setTimeout(() => {
            window.location.href = 'game.html';
        }, 500);
    }

    stopPortfolioEffects() {
        stopPortfolioEffects();
        console.log('Portfolio effects stopped for game mode');
    }
}

// Portfolio initialization functions
function initializePortfolioMode() {
    window.portfolioModeToggle = new PortfolioModeToggle();
    
    // Only start effects if in portfolio mode
    if (isPortfolioMode()) {
        startPortfolioEffects();
    }
}

// Authentication functionality
function initializeAuth() {
    const loginBtn = document.getElementById('loginBtn');
    const authScreen = document.getElementById('authScreen');
    const closeAuthBtn = document.getElementById('closeAuthBtn');
    const authenticateBtn = document.getElementById('authenticateBtn');
    const bypassBtn = document.getElementById('bypassBtn');
    const usernameInput = document.getElementById('usernameInput');
    const passwordInput = document.getElementById('passwordInput');

    if (!loginBtn || !authScreen) {
        console.error('Authentication elements not found');
        return;
    }

    loginBtn.addEventListener('click', () => {
        authScreen.style.display = 'flex';
        if (usernameInput) usernameInput.focus();
    });

    if (closeAuthBtn) {
        closeAuthBtn.addEventListener('click', () => {
            authScreen.style.display = 'none';
            if (usernameInput) usernameInput.value = '';
            if (passwordInput) passwordInput.value = '';
        });
    }

    if (authenticateBtn) {
        authenticateBtn.addEventListener('click', () => {
            const username = usernameInput?.value.trim() || '';
            const password = passwordInput?.value.trim() || '';
            
            if (username && password) {
                console.log(`User ${username} authenticated`);
                authScreen.style.display = 'none';
                showLoadingSequence(username);
                // Clear inputs
                if (usernameInput) usernameInput.value = '';
                if (passwordInput) passwordInput.value = '';
            } else {
                alert('Please enter both username and password');
            }
        });
    }

    // Bypass button functionality
    if (bypassBtn) {
        bypassBtn.addEventListener('click', () => {
            console.log('Authentication bypassed');
            authScreen.style.display = 'none';
            showLoadingSequence('Guest');
            // Clear inputs
            if (usernameInput) usernameInput.value = '';
            if (passwordInput) passwordInput.value = '';
        });
    }

    // Enter key support for login
    if (passwordInput) {
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                authenticateBtn?.click();
            }
        });
    }
}

// Tab switching functionality
function initializeTabSwitching() {
    window.switchTab = function(event, tabName) {
        console.log(`Switching to tab: ${tabName}`);
        
        // Remove active class from all tabs and content
        document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        if (event && event.target) {
            event.target.classList.add('active');
        }
        
        const tabContent = document.getElementById(tabName);
        if (tabContent) {
            tabContent.classList.add('active');
        } else {
            console.error(`Tab content not found: ${tabName}`);
        }
    };
}

// Portfolio chat functionality
function initializePortfolioChat() {
    const chatInput = document.getElementById('chatInput');
    const wkbotChat = document.getElementById('wkbotChat');
    
    if (!chatInput || !wkbotChat) {
        console.error('Portfolio chat elements not found');
        return;
    }

    // Make chat functions global
    window.handleEnter = function(event) {
        if (event.key === 'Enter') {
            sendMessage();
        }
    };

    window.sendMessage = async function() {
        const message = chatInput.value.trim();
        if (!message) return;

        const sendButton = document.getElementById('chatSendButton');
        if (sendButton && sendButton.disabled) return;

        console.log(`Sending message: ${message}`);

        addMessage(message, true);
        chatInput.value = '';
        if (sendButton) sendButton.disabled = true;

        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'message bot typing';
        typingIndicator.innerHTML = '<strong>WKbot:</strong> <span class="typing-dots">...</span>';
        wkbotChat.appendChild(typingIndicator);

        try {
            const response = await getAIResponse(message);
            wkbotChat.removeChild(typingIndicator);
            addMessage(response, false);
        } catch (error) {
            console.error('Chat error:', error);
            wkbotChat.removeChild(typingIndicator);
            addMessage('Sorry, I encountered an error. Please try again.', false);
        } finally {
            if (sendButton) sendButton.disabled = false;
            chatInput.focus();
        }
    };

    function addMessage(content, isUser) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
        messageDiv.innerHTML = `<strong>${isUser ? 'You' : 'WKbot'}:</strong> ${content}`;
        wkbotChat.appendChild(messageDiv);
        wkbotChat.scrollTop = wkbotChat.scrollHeight;
    }
}

function initializeAnimations() {
    // Timeline animations
    const timelineItems = document.querySelectorAll(".timeline-item");
    if (timelineItems.length > 0) {
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                }
            });
        }, { threshold: 0.1 });

        timelineItems.forEach(item => {
            timelineObserver.observe(item);
        });
    }

    // General section animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'all 0.6s ease';
        observer.observe(section);
    });
}

function initializeParticleEffects() {
    // Only start particles if in portfolio mode
    if (isPortfolioMode()) {
        startPortfolioEffects();
    }
}

function startPortfolioEffects() {
    if (effectsRunning) return;
    effectsRunning = true;
    activeParticles = 0;
    
    console.log('Starting optimized portfolio effects');
    
    const matrixBg = document.getElementById('matrix-bg');
    if (!matrixBg) {
        console.warn('Matrix background element not found');
        return;
    }

    // Matrix rain with particle limits
    matrixInterval = setInterval(() => {
        if (!effectsRunning || !isPortfolioMode()) return;
        
        // Limit particle count for performance
        if (activeParticles >= PARTICLE_CONFIG.maxParticles) return;
        
        createMatrixParticle(matrixBg);
    }, PARTICLE_CONFIG.spawnRate);
}

function createMatrixParticle(container) {
    const char = document.createElement('div');
    char.className = 'matrix-char';
    char.textContent = PARTICLE_CONFIG.chars[Math.floor(Math.random() * PARTICLE_CONFIG.chars.length)];
    char.style.left = Math.random() * 100 + '%';

    // Calculate animation properties
    const pageHeight = Math.max(document.body.scrollHeight, window.innerHeight);
    const startY = -100;
    const endY = pageHeight + 100;
    const duration = Math.random() * (PARTICLE_CONFIG.maxDuration - PARTICLE_CONFIG.minDuration) + PARTICLE_CONFIG.minDuration;

    // Set initial position 
    char.style.top = startY + 'px';
    char.style.transition = `transform ${duration}s linear, opacity 0.5s ease-in-out`;
    char.style.opacity = '0';

    container.appendChild(char);
    activeParticles++;

    // Start animation on next frame
    requestAnimationFrame(() => {
        char.style.opacity = '1';
        char.style.transform = `translateY(${endY - startY}px)`;
    });

    // Clean up particle when animation completes
    setTimeout(() => {
        removeParticle(char);
    }, duration * 1000);
}

function removeParticle(particle) {
    if (particle && particle.parentNode) {
        particle.parentNode.removeChild(particle);
        activeParticles = Math.max(0, activeParticles - 1);
    }
}

function stopPortfolioEffects() {
    if (!effectsRunning) return;
    effectsRunning = false;
    
    console.log('Stopping portfolio effects');
    
    // Clear the interval
    if (matrixInterval) {
        clearInterval(matrixInterval);
        matrixInterval = null;
    }
    
    // Remove all existing particles
    cleanupAllParticles();
}

function cleanupAllParticles() {
    const matrixBg = document.getElementById('matrix-bg');
    if (matrixBg) {
        const particles = matrixBg.querySelectorAll('.matrix-char');
        particles.forEach(particle => removeParticle(particle));
    }
    activeParticles = 0;
}

// Loading sequence
function showLoadingSequence(username) {
    const portfolioMode = document.getElementById('portfolioMode');
    const portfolioContent = document.getElementById('portfolioContent');
    
    if (!portfolioMode || !portfolioContent) {
        console.error('Loading sequence elements not found');
        return;
    }

    // Hide the initial terminal hero
    portfolioMode.style.opacity = '0';
    portfolioMode.style.transform = 'translateY(-50px)';
    
    setTimeout(() => {
        portfolioMode.style.display = 'none';
        portfolioContent.style.display = 'block';
        
        // Add loading messages
        const loadingMessages = [
            '> Access Granted',
            `> Welcome, ${username}`
        ];
        
        showLoadingMessages(loadingMessages, () => {
            setTimeout(() => {
                portfolioContent.classList.add('show');
                animatePortfolioSections();
                initializeSpotify();
                fetchSubstackFeed();
            }, 200);
        });
    }, 300);
}

function showLoadingMessages(messages, callback) {
    const loadingContainer = document.createElement('div');
    loadingContainer.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1000;
        text-align: center;
        font-family: 'Courier New', monospace;
        color: #8fbc5a;
        font-size: 1.2em;
        text-shadow: 0 0 8px rgba(143, 188, 90, 0.4);
    `;
    
    document.body.appendChild(loadingContainer);
    
    let messageIndex = 0;
    const showNextMessage = () => {
        if (messageIndex < messages.length) {
            const messageEl = document.createElement('div');
            messageEl.textContent = messages[messageIndex];
            messageEl.classList.add('loading-text');
            loadingContainer.appendChild(messageEl);
            
            messageIndex++;
            setTimeout(showNextMessage, 300);
        } else {
            setTimeout(() => {
                if (loadingContainer.parentNode) {
                    loadingContainer.parentNode.removeChild(loadingContainer);
                }
                callback();
            }, 1000);
        }
    };
    
    showNextMessage();
}

function animatePortfolioSections() {
    const sections = document.querySelectorAll('.fade-transition');
    sections.forEach((section, index) => {
        setTimeout(() => {
            section.classList.add('active');
        }, index * 100);
    });
}

async function getAIResponse(query) {
    console.log(`Getting AI response for: ${query}`);
    
    try {
        const response = await fetch('https://wkbot.onrender.com/ask', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.answer || 'No response received';
    } catch (error) {
        console.error('API Error:', error);
        return 'Sorry, I encountered an error connecting to my knowledge base. Please try again.';
    }
}

// scrolling for anchor links
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Error handling for uncaught errors
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});

// Clean up effects when page is unloaded
window.addEventListener('beforeunload', () => {
    stopPortfolioEffects();
});

// Make stop function globally available
window.stopPortfolioEffects = stopPortfolioEffects;

console.log('Script loaded successfully');

// ── Spotify Now Playing ──────────────────────────────────────────────────────
// Requires a GET /now-playing endpoint on wkbot.onrender.com returning:
// { is_playing, track_name, artist_name, album_art_url, spotify_url }

async function fetchSubstackFeed() {
    const container = document.getElementById('blog-feed-container');
    if (!container) return;

    const RSS_URL = 'https://wingkiulau.substack.com/feed';
    const API_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}&count=10`;

    try {
        const res = await fetch(API_URL);
        const data = await res.json();

        if (data.status !== 'ok' || !data.items.length) {
            container.innerHTML = '<div class="blog-card blog-coming-soon"><h3>No posts yet — check back soon.</h3></div>';
            return;
        }

        container.innerHTML = data.items.map(item => {
            const date = new Date(item.pubDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            const excerpt = item.description.replace(/<[^>]+>/g, '').slice(0, 160).trim() + '…';
            return `
            <div class="blog-card">
                <div class="blog-meta">
                    <span class="blog-date">${date}</span>
                    <span class="blog-platform">Substack</span>
                </div>
                <h3>${item.title}</h3>
                <p>${excerpt}</p>
                <a href="${item.link}" class="project-link btn btn-2" target="_blank" rel="noopener noreferrer">Read →</a>
            </div>`;
        }).join('') + `<div class="blog-see-more"><a href="https://substack.com/@wingkiulau" target="_blank" rel="noopener noreferrer">See all posts on Substack →</a></div>`;
    } catch {
        container.innerHTML = '<div class="blog-card blog-coming-soon"><h3>Could not load posts.</h3><p><a href="https://substack.com/@wingkiulau" target="_blank">Visit Substack →</a></p></div>';
    }
}

function initializeSpotify() {
    const widget = document.getElementById('spotify-widget');
    if (!widget) return;
    widget.style.display = 'block';

    const toggleBtn = document.getElementById('spotifyToggle');
    const expanded  = document.getElementById('spotifyExpanded');
    let minimized   = false;

    if (toggleBtn && expanded) {
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            minimized = !minimized;
            expanded.style.display = minimized ? 'none' : 'flex';
            toggleBtn.textContent  = minimized ? '+' : '−';
        });
    }

    makeDraggable(widget);

    fetchNowPlaying();
    setInterval(fetchNowPlaying, 30000);
}

function makeDraggable(el) {
    const handle = el.querySelector('.spotify-top') || el;
    let startX, startY, startLeft, startTop;

    function onStart(e) {
        if (e.target.closest('button') || e.target.closest('a')) return;
        e.preventDefault();

        const rect = el.getBoundingClientRect();
        // switch from bottom/left to top/left so dragging works cleanly
        el.style.bottom = 'auto';
        el.style.right  = 'auto';
        el.style.left   = rect.left + 'px';
        el.style.top    = rect.top  + 'px';

        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        startX    = clientX;
        startY    = clientY;
        startLeft = rect.left;
        startTop  = rect.top;

        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup',   onEnd);
        document.addEventListener('touchmove', onMove, { passive: false });
        document.addEventListener('touchend',  onEnd);
        handle.style.cursor = 'grabbing';
    }

    function onMove(e) {
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const dx = clientX - startX;
        const dy = clientY - startY;
        const maxX = window.innerWidth  - el.offsetWidth;
        const maxY = window.innerHeight - el.offsetHeight;
        el.style.left = Math.min(Math.max(0, startLeft + dx), maxX) + 'px';
        el.style.top  = Math.min(Math.max(0, startTop  + dy), maxY) + 'px';
    }

    function onEnd() {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup',   onEnd);
        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('touchend',  onEnd);
        handle.style.cursor = 'grab';
    }

    handle.style.cursor = 'grab';
    handle.addEventListener('mousedown', onStart);
    handle.addEventListener('touchstart', onStart, { passive: false });
}

async function fetchNowPlaying() {
    try {
        const res = await fetch('https://wkbot.onrender.com/now-playing');
        if (!res.ok) throw new Error('not ok');
        updateSpotifyWidget(await res.json());
    } catch {
        updateSpotifyWidget(null);
    }
}

function updateSpotifyWidget(data) {
    const widget   = document.getElementById('spotify-widget');
    const trackEl  = document.getElementById('spotifyTrack');
    const artistEl = document.getElementById('spotifyArtist');
    const artEl    = document.getElementById('spotifyAlbumArt');
    const labelEl  = document.getElementById('spotifyLabel');
    const eqEl     = document.getElementById('eqBars');
    const linkEl   = document.getElementById('spotifyTrackLink');
    if (!widget) return;

    if (!data || !data.track_name) {
        widget.classList.add('spotify-offline');
        if (trackEl)  trackEl.textContent  = 'Nothing playing';
        if (artistEl) artistEl.textContent = '—';
        if (artEl)    artEl.style.display  = 'none';
        if (labelEl)  labelEl.textContent  = 'SPOTIFY';
        if (eqEl)     eqEl.style.display   = 'none';
        return;
    }

    widget.classList.remove('spotify-offline');
    if (trackEl)  trackEl.textContent  = data.track_name;
    if (artistEl) artistEl.textContent = data.artist_name || '—';
    if (labelEl)  labelEl.textContent  = data.is_playing ? 'NOW PLAYING' : 'LAST PLAYED';
    if (eqEl)     eqEl.style.display   = data.is_playing ? 'flex' : 'none';

    if (artEl && data.album_art_url) {
        artEl.src          = data.album_art_url;
        artEl.style.display = 'block';
    }

    if (linkEl) linkEl.href = data.spotify_url || '#';
}