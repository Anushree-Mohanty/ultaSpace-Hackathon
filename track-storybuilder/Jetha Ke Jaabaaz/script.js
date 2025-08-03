// Gemini API Configuration - Loaded from config.js
const GEMINI_API_KEY = window.config.GEMINI_API_KEY;
const GEMINI_API_URL = window.config.GEMINI_API_URL;

// Global variables
let currentStory = '';
let isGenerating = false;

// Landing page functions
function startJourney() {
    window.location.href = 'generate.html';
}

// Story generation functions
async function generateStory(prompt = null) {
    if (isGenerating) return;
    
    isGenerating = true;
    showLoading(true);
    
    try {
        const storyPrompt = prompt || getRandomSpacePrompt();
        const story = await callGeminiAPI(storyPrompt);
        
        if (story && story.trim()) {
            currentStory = story;
            displayStory(story);
            enableShareButton();
            console.log('Story generated successfully from API');
        } else {
            console.log('API returned empty or null story, using fallback');
            // Fallback to a pre-written story if API fails
            const fallbackStory = getFallbackStory();
            currentStory = fallbackStory;
            displayStory(fallbackStory);
            enableShareButton();
        }
    } catch (error) {
        console.error('Error generating story:', error);
        // Use fallback story instead of showing error
        const fallbackStory = getFallbackStory();
        currentStory = fallbackStory;
        displayStory(fallbackStory);
        enableShareButton();
        console.log('Using fallback story due to API error');
    } finally {
        isGenerating = false;
        showLoading(false);
    }
}

function getRandomSpacePrompt() {
    const prompts = [
        "Write a short, engaging space adventure story about an astronaut discovering a mysterious alien artifact on Mars. Make it exciting and include vivid descriptions of the space environment.",
        "Create a space story about a robot exploring a distant galaxy and finding an ancient civilization. Include elements of wonder and discovery.",
        "Tell a tale about a space pirate who discovers a hidden treasure in an asteroid belt. Make it adventurous and include space combat.",
        "Write about a scientist on a space station who makes a groundbreaking discovery about dark matter. Include scientific elements but keep it accessible.",
        "Create a story about a young space explorer who gets lost near Jupiter and must find their way back home. Include the beauty and danger of space.",
        "Tell a story about a space colony on a distant planet facing an unexpected challenge. Include themes of survival and community.",
        "Write about a time traveler who visits different eras of space exploration. Include historical and futuristic elements.",
        "Create a story about a space whale that communicates with astronauts. Make it magical and heartwarming.",
        "Tell a tale about a space detective solving mysteries across the solar system. Include suspense and clever problem-solving.",
        "Write about a space gardener who grows plants in zero gravity. Include themes of hope and life in space."
    ];
    
    return prompts[Math.floor(Math.random() * prompts.length)];
}

function getFallbackStory() {
    const fallbackStories = [
        `Commander Sarah Chen floated weightlessly in the observation deck of the International Space Station, her eyes fixed on the swirling storms of Jupiter below. The gas giant's Great Red Spot churned like a cosmic whirlpool, its crimson clouds dancing in the eternal night of space.

"Commander, you need to see this," called her colleague, Dr. Marcus Rodriguez, from the science module. Sarah pushed off the window and glided through the zero-gravity environment, her heart racing with anticipation.

What she discovered would change everything they knew about the solar system. A faint signal, unlike anything they'd ever encountered, was emanating from deep within Jupiter's atmosphere. It wasn't natural, and it wasn't human.

As Sarah and Marcus prepared for what would become humanity's first contact with intelligent life beyond Earth, they realized that the greatest adventure in human history was about to begin. The stars had finally answered back.`,

        `The mining ship "Stellar Fortune" drifted through the asteroid belt, its powerful searchlights cutting through the darkness like cosmic beacons. Captain Elena Vasquez had spent twenty years searching for the legendary "Heart of the Void," a crystal said to contain the memories of an ancient alien civilization.

Her crew of misfits and dreamers had followed her across the solar system, from the ice mines of Europa to the methane lakes of Titan. But now, as their sensors picked up an unusual energy signature from a nearby asteroid, Elena knew their quest was about to reach its climax.

The asteroid, designated XK-427, was unlike any they'd seen before. Its surface shimmered with an otherworldly light, and as they approached, the crystal formations seemed to pulse with a rhythm that matched their own heartbeats.

"Prepare for landing," Elena commanded, her voice steady despite the excitement coursing through her veins. The Heart of the Void was calling to them, and they were ready to answer.`,

        `In the year 2157, the first human colony on Mars faced its greatest challenge. A massive dust storm had cut off communication with Earth, and the colony's life support systems were failing. Dr. Aisha Patel, the colony's chief engineer, worked frantically to keep her fellow colonists alive.

But as the storm raged outside their habitat, Aisha discovered something that would change everything. Buried beneath the red Martian soil, she found evidence of an ancient underground network—tunnels and chambers that spoke of intelligent life that had once called Mars home.

The discovery gave the colonists hope. If life had survived on Mars before, perhaps they could too. As Aisha led her team deeper into the mysterious tunnels, they uncovered secrets that would not only save their colony but reveal the true history of the solar system.

The red planet had one more surprise in store for humanity, and it was more incredible than anyone could have imagined.`
    ];
    
    return fallbackStories[Math.floor(Math.random() * fallbackStories.length)];
}

async function callGeminiAPI(prompt) {
    // Try different API endpoints if one fails
    const endpoints = window.config.endpoints;

    // Try with original prompt first, then with a simpler prompt
    const promptsToTry = [
        prompt,
        "Write a short space adventure story about an astronaut discovering something amazing in space. Make it exciting and engaging."
    ];

    for (let promptIndex = 0; promptIndex < promptsToTry.length; promptIndex++) {
        const currentPrompt = promptsToTry[promptIndex];
        console.log(`Trying prompt ${promptIndex + 1}:`, currentPrompt.substring(0, 100) + '...');
        
        for (let i = 0; i < endpoints.length; i++) {
            try {
                console.log(`Trying endpoint ${i + 1}: ${endpoints[i]}`);
                
                            const requestBody = {
                contents: [{
                    parts: [{
                        text: currentPrompt
                    }]
                }],
                generationConfig: window.config.generationConfig,
                safetySettings: window.config.safetySettings
            };
            
            console.log('Request body:', requestBody);
            
            const response = await fetch(`${endpoints[i]}?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Endpoint ${i + 1} failed:`, response.status, errorText);
                if (i === endpoints.length - 1) {
                    throw new Error(`All endpoints failed. Last error: HTTP ${response.status}`);
                }
                continue; // Try next endpoint
            }

            const data = await response.json();
            console.log('API Response:', data);
            
            // Check for the new Gemini 2.5 Flash response structure
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                console.log(`Success with endpoint ${i + 1}`);
                console.log('Content structure:', data.candidates[0].content);
                console.log('Parts array:', data.candidates[0].content.parts);
                
                if (data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
                    const part = data.candidates[0].content.parts[0];
                    console.log('First part structure:', part);
                    console.log('Part keys:', Object.keys(part));
                    
                    const text = part.text;
                    console.log('Extracted text:', text);
                    console.log('Text length:', text ? text.length : 0);
                    
                    if (!text || text.trim() === '') {
                        console.log('Text is empty or whitespace only');
                        console.log('Raw part value:', JSON.stringify(part));
                    }
                    
                    return text;
                } else {
                    console.log('No parts found in content');
                }
            } 
            // Fallback check for older response formats
            else if (data.candidates && data.candidates[0] && data.candidates[0].text) {
                console.log(`Success with endpoint ${i + 1} (legacy format)`);
                const text = data.candidates[0].text;
                console.log('Extracted text:', text);
                return text;
            }
            // Check if text is directly in the candidate
            else if (data.candidates && data.candidates[0] && data.candidates[0].text) {
                console.log(`Success with endpoint ${i + 1} (direct text format)`);
                const text = data.candidates[0].text;
                console.log('Extracted text:', text);
                return text;
            }
            else {
                console.error('Unexpected API response format:', data);
                console.log('Candidates structure:', data.candidates);
                if (data.candidates && data.candidates[0]) {
                    const candidate = data.candidates[0];
                    console.log('First candidate structure:', candidate);
                    console.log('First candidate keys:', Object.keys(candidate));
                    
                    // Check all possible text locations
                    if (candidate.text) {
                        console.log('Found text directly in candidate:', candidate.text);
                    }
                    if (candidate.content) {
                        console.log('Content structure:', candidate.content);
                        if (candidate.content.parts) {
                            console.log('Parts structure:', candidate.content.parts);
                            candidate.content.parts.forEach((part, index) => {
                                console.log(`Part ${index}:`, part);
                                if (part.text) {
                                    console.log(`Part ${index} text:`, part.text);
                                }
                            });
                        }
                    }
                    if (candidate.finishReason) {
                        console.log('Finish reason:', candidate.finishReason);
                    }
                }
                if (i === endpoints.length - 1) {
                    throw new Error('Invalid response format from Gemini API');
                }
                continue; // Try next endpoint
            }
        } catch (error) {
            console.error(`Endpoint ${i + 1} error:`, error);
            if (i === endpoints.length - 1 && promptIndex === promptsToTry.length - 1) {
                throw error;
            }
            // Continue to next endpoint or prompt
        }
        }
    }
}

function displayStory(story) {
    const storyContent = document.getElementById('storyContent');
    if (storyContent) {
        storyContent.innerHTML = `<p>${story.replace(/\n/g, '</p><p>')}</p>`;
    }
}

function displayError(message) {
    const storyContent = document.getElementById('storyContent');
    if (storyContent) {
        storyContent.innerHTML = `
            <div style="text-align: center; color: #ff6b6b; padding: 2rem;">
                <p style="font-size: 1.2rem; margin-bottom: 1rem;">⚠️ ${message}</p>
                <button onclick="regenerateStory()" class="action-button regenerate-btn">
                    <span class="button-icon">🔄</span>
                    Try Again
                </button>
            </div>
        `;
    }
}

function showLoading(show) {
    const loadingIndicator = document.getElementById('loadingIndicator');
    const storyContent = document.getElementById('storyContent');
    
    if (loadingIndicator) {
        loadingIndicator.style.display = show ? 'flex' : 'none';
    }
    
    if (storyContent) {
        storyContent.style.display = show ? 'none' : 'block';
    }
}

function enableShareButton() {
    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn) {
        shareBtn.disabled = false;
    }
}

// Story actions
function regenerateStory() {
    generateStory();
}

function openCustomModal() {
    const modal = document.getElementById('customModal');
    if (modal) {
        modal.style.display = 'block';
        document.getElementById('customPrompt').focus();
    }
}

function closeCustomModal() {
    const modal = document.getElementById('customModal');
    if (modal) {
        modal.style.display = 'none';
        document.getElementById('customPrompt').value = '';
    }
}

function generateCustomStory() {
    const prompt = document.getElementById('customPrompt').value.trim();
    
    if (!prompt) {
        alert('Please enter a story idea!');
        return;
    }
    
    closeCustomModal();
    
    const customPrompt = `Write a short, engaging space adventure story based on this idea: "${prompt}". Make it exciting and include vivid descriptions of the space environment. Keep it around 300-500 words.`;
    
    generateStory(customPrompt);
}

function shareStory() {
    if (!currentStory) {
        alert('No story to share!');
        return;
    }
    
    // For now, we'll just show a success message
    // In the future, this would save to Supabase
    showSuccessModal();
    
    // Optional: Copy to clipboard
    if (navigator.clipboard) {
        navigator.clipboard.writeText(currentStory).then(() => {
            console.log('Story copied to clipboard');
        });
    }
}

function showSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Navigation highlighting
function updateNavigation() {
    const currentPage = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        
        if (currentPage.includes('index.html') || currentPage === '/') {
            if (link.getAttribute('data-page') === 'home') {
                link.classList.add('active');
            }
        } else if (currentPage.includes('generate.html')) {
            if (link.getAttribute('data-page') === 'generate') {
                link.classList.add('active');
            }
        } else if (currentPage.includes('shared.html')) {
            if (link.getAttribute('data-page') === 'shared') {
                link.classList.add('active');
            }
        } else if (currentPage.includes('roleplay.html')) {
            if (link.getAttribute('data-page') === 'shared') {
                link.classList.add('active');
            }
        }
    });
}

// Modal event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Update navigation highlighting
    updateNavigation();
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        const customModal = document.getElementById('customModal');
        const successModal = document.getElementById('successModal');
        
        if (event.target === customModal) {
            closeCustomModal();
        }
        
        if (event.target === successModal) {
            closeSuccessModal();
        }
    });
    
    // Close modals with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeCustomModal();
            closeSuccessModal();
        }
    });
    
    // Auto-generate story on generate page load
    if (window.location.pathname.includes('generate.html')) {
        generateStory();
    }
});

// Shared Stories Page Functions
function loadMoreStories() {
    const storiesGrid = document.getElementById('storiesGrid');
    if (!storiesGrid) return;
    
    // Sample additional stories
    const additionalStories = [
        {
            author: '🌠 Cosmic Dreamer',
            date: '3 days ago',
            title: 'The Memory Crystal',
            preview: 'In the heart of a dying star, archaeologist Dr. James Chen discovered a crystal that contained the memories of an entire civilization. As he touched it, visions of their final moments flooded his mind, revealing a truth about the universe that would change everything.',
            likes: 89,
            comments: 34
        },
        {
            author: '🛸 Alien Hunter',
            date: '4 days ago',
            title: 'The Signal from Proxima',
            preview: 'When the first radio signal from Proxima Centauri reached Earth, it contained a message that would challenge everything we thought we knew about intelligent life. The message was simple: "We have been watching you for a thousand years."',
            likes: 156,
            comments: 67
        },
        {
            author: '🌌 Void Walker',
            date: '5 days ago',
            title: 'The Space Between Stars',
            preview: 'Navigator Elena Vasquez discovered that the empty space between stars wasn\'t empty at all. It was filled with consciousness, ancient beings that existed in the void, waiting for someone to notice them.',
            likes: 203,
            comments: 89
        }
    ];
    
    additionalStories.forEach(story => {
        const storyItem = document.createElement('div');
        storyItem.className = 'story-item';
        storyItem.innerHTML = `
            <div class="story-card-shared">
                <div class="story-meta">
                    <span class="story-author">${story.author}</span>
                    <span class="story-date">${story.date}</span>
                </div>
                <h3>${story.title}</h3>
                <p class="story-preview">${story.preview}</p>
                <div class="story-stats">
                    <span class="stat">❤️ ${story.likes}</span>
                    <span class="stat">💬 ${story.comments}</span>
                    <span class="stat">📤 Share</span>
                </div>
            </div>
        `;
        storiesGrid.appendChild(storyItem);
    });
    
    // Hide the load more button after loading
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.style.display = 'none';
    }
}

// Utility functions
function formatTimestamp() {
    return new Date().toISOString();
}

// Error handling for API failures
window.addEventListener('error', function(event) {
    console.error('Global error:', event.error);
    if (isGenerating) {
        isGenerating = false;
        showLoading(false);
        displayError('An unexpected error occurred. Please try again.');
    }
});

// Add some visual feedback for button interactions
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('button');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // Add a subtle ripple effect
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    button {
        position: relative;
        overflow: hidden;
    }
`;
document.head.appendChild(style); 