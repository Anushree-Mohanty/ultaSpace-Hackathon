// Roleplay Game State
let gameState = {
    selectedCharacter: null,
    currentStory: '',
    storyHistory: [],
    currentChoices: [],
    isGenerating: false
};

// Character definitions
const characters = {
    astronaut: {
        name: 'Space Explorer',
        icon: '👨‍🚀',
        description: 'A brave astronaut on a mission to discover the unknown',
        traits: ['courageous', 'explorer', 'mission-focused']
    },
    scientist: {
        name: 'Space Scientist',
        icon: '🔬',
        description: 'A brilliant researcher seeking to unlock cosmic mysteries',
        traits: ['analytical', 'curious', 'knowledge-seeking']
    },
    pilot: {
        name: 'Starship Pilot',
        icon: '🚁',
        description: 'A skilled pilot navigating the vastness of space',
        traits: ['skilled', 'adventurous', 'quick-thinking']
    },
    engineer: {
        name: 'Space Engineer',
        icon: '⚙️',
        description: 'A resourceful engineer keeping systems running in the void',
        traits: ['resourceful', 'practical', 'problem-solver']
    }
};

// Initialize roleplay functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing roleplay...');
    setTimeout(() => {
        initializeRoleplay();
    }, 100); // Small delay to ensure all elements are ready
});

function initializeRoleplay() {
    console.log('Initializing roleplay functionality...');
    
    // Add character selection event listeners
    const characterCards = document.querySelectorAll('.character-card');
    console.log('Found character cards:', characterCards.length);
    
    characterCards.forEach(card => {
        card.addEventListener('click', function() {
            console.log('Character card clicked:', this.dataset.character);
            selectCharacter(this.dataset.character);
        });
    });
    
    // Check if we're on the roleplay page
    if (window.location.pathname.includes('shared.html')) {
        console.log('On roleplay page, initializing...');
    }
}

function selectCharacter(characterType) {
    console.log('Selecting character:', characterType);
    
    // Remove previous selection
    document.querySelectorAll('.character-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Add selection to clicked card
    const selectedCard = document.querySelector(`[data-character="${characterType}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
        console.log('Character card selected:', characterType);
    } else {
        console.error('Character card not found:', characterType);
    }
    
    // Store selected character
    gameState.selectedCharacter = characterType;
    
    // Enable start button
    const startBtn = document.querySelector('.start-adventure-btn');
    if (startBtn) {
        startBtn.disabled = false;
        console.log('Start button enabled');
    } else {
        console.error('Start button not found');
    }
}

function startAdventure() {
    console.log('Starting adventure with character:', gameState.selectedCharacter);
    
    if (!gameState.selectedCharacter) {
        alert('Please select a character first!');
        return;
    }
    
    // Hide welcome screen and show game screen
    const welcomeScreen = document.getElementById('welcomeScreen');
    const gameScreen = document.getElementById('gameScreen');
    
    if (welcomeScreen && gameScreen) {
        welcomeScreen.style.display = 'none';
        gameScreen.style.display = 'block';
        console.log('Switched to game screen');
    } else {
        console.error('Welcome screen or game screen not found');
        return;
    }
    
    // Update character info in game header
    const character = characters[gameState.selectedCharacter];
    const characterIcon = document.getElementById('characterIcon');
    const characterName = document.getElementById('characterName');
    
    if (characterIcon && characterName) {
        characterIcon.textContent = character.icon;
        characterName.textContent = character.name;
        console.log('Updated character info:', character.name);
    } else {
        console.error('Character info elements not found');
    }
    
    // Generate initial story
    generateInitialStory();
}

function generateInitialStory() {
    const character = characters[gameState.selectedCharacter];
    const storyPrompt = generateStoryPrompt(character);
    
    showLoading(true);
    gameState.isGenerating = true;
    
    callRoleplayAPI(storyPrompt)
        .then(response => {
            const storyData = parseStoryResponse(response);
            displayStory(storyData.story);
            displayChoices(storyData.choices);
            gameState.currentStory = storyData.story;
            gameState.currentChoices = storyData.choices;
            gameState.storyHistory.push({
                story: storyData.story,
                choices: storyData.choices,
                selectedChoice: null
            });
        })
        .catch(error => {
            console.error('Error generating story:', error);
            // Use fallback story
            const fallbackData = getFallbackStoryData(character);
            displayStory(fallbackData.story);
            displayChoices(fallbackData.choices);
            gameState.currentStory = fallbackData.story;
            gameState.currentChoices = fallbackData.choices;
            gameState.storyHistory.push({
                story: fallbackData.story,
                choices: fallbackData.choices,
                selectedChoice: null
            });
        })
        .finally(() => {
            showLoading(false);
            gameState.isGenerating = false;
        });
}

function generateStoryPrompt(character) {
    const characterTraits = character.traits.join(', ');
    const scenarios = [
        `You are a ${character.name} (${characterTraits}) in space. Write a short, engaging story introduction (2-3 paragraphs) that sets up an exciting space adventure. Then provide 3 different choices for how the character could respond to the situation. Make each choice distinct and interesting. Format as: STORY: [story text] CHOICES: 1. [choice 1] 2. [choice 2] 3. [choice 3]`,
        `Create a space adventure story for a ${character.name} (${characterTraits}). Start with a compelling situation in space (like discovering an alien artifact, encountering a space anomaly, or facing a critical system failure). Write 2-3 paragraphs of story, then give 3 different action choices. Format: STORY: [story] CHOICES: 1. [choice] 2. [choice] 3. [choice]`,
        `Write a space story for a ${character.name} (${characterTraits}). Begin with an intriguing space scenario (exploring a mysterious planet, receiving an unknown signal, or navigating through a dangerous nebula). Tell the story in 2-3 paragraphs, then provide 3 distinct choices for the character's next action. Format: STORY: [story] CHOICES: 1. [choice] 2. [choice] 3. [choice]`
    ];
    
    return scenarios[Math.floor(Math.random() * scenarios.length)];
}

async function callRoleplayAPI(prompt) {
    try {
        const response = await fetch(`${window.config.endpoints[0]}?key=${window.config.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: window.config.generationConfig,
                safetySettings: window.config.safetySettings
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            const text = data.candidates[0].content.parts[0].text;
            return text;
        } else {
            throw new Error('Invalid API response format');
        }
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}

function parseStoryResponse(response) {
    try {
        // Try to parse the structured response
        const storyMatch = response.match(/STORY:\s*(.*?)(?=CHOICES:|$)/s);
        const choicesMatch = response.match(/CHOICES:\s*(.*)/s);
        
        if (storyMatch && choicesMatch) {
            const story = storyMatch[1].trim();
            const choicesText = choicesMatch[1].trim();
            
            // Parse choices (numbered 1., 2., 3.)
            const choices = choicesText
                .split(/\d+\.\s*/)
                .filter(choice => choice.trim())
                .map(choice => choice.trim());
            
            return {
                story: story,
                choices: choices.slice(0, 3) // Ensure we have exactly 3 choices
            };
        } else {
            // Fallback parsing
            const lines = response.split('\n').filter(line => line.trim());
            const story = lines.slice(0, -3).join('\n');
            const choices = lines.slice(-3);
            
            return {
                story: story,
                choices: choices
            };
        }
    } catch (error) {
        console.error('Error parsing story response:', error);
        const character = characters[gameState.selectedCharacter];
        return getFallbackStoryData(character);
    }
}

function getFallbackStoryData(character) {
    const fallbackStories = {
        astronaut: {
            story: `You float weightlessly in the observation deck of the International Space Station, gazing at the swirling storms of Jupiter below. The gas giant's Great Red Spot churns like a cosmic whirlpool, its crimson clouds dancing in the eternal night of space.

Suddenly, your sensors pick up an unusual energy signature from deep within Jupiter's atmosphere. It's unlike anything you've ever encountered - not natural, and definitely not human. The signal pulses with a rhythm that seems almost... alive.

Your mission was to study Jupiter's atmospheric patterns, but this discovery could change everything we know about the solar system. The greatest adventure in human history might be about to begin.`,
            choices: [
                "Investigate the signal immediately with your available equipment",
                "Contact mission control to report the discovery and request guidance",
                "Wait and observe the signal pattern before taking any action"
            ]
        },
        scientist: {
            story: `In your research lab aboard the Mars Science Station, you've been analyzing soil samples from the latest drilling expedition. The red dust of Mars holds secrets that could unlock the mysteries of our solar system's past.

As you examine a particularly interesting sample under your microscope, you notice something extraordinary - tiny crystalline structures that shouldn't exist in Martian soil. They're pulsing with a faint, otherworldly light and seem to respond to your presence.

This could be the breakthrough you've been searching for - evidence of ancient life or technology on Mars. But the crystals are behaving in ways that defy known physics.`,
            choices: [
                "Document everything and run comprehensive analysis protocols",
                "Attempt to communicate with the crystals using various frequencies",
                "Isolate the sample and contact Earth for specialized equipment"
            ]
        },
        pilot: {
            story: `Your starship, the "Stellar Fortune," drifts through the asteroid belt, its powerful searchlights cutting through the darkness like cosmic beacons. You've spent years navigating these treacherous waters, but something feels different today.

Your navigation systems detect an anomaly - a cluster of asteroids moving in perfect formation, defying gravitational physics. As you approach, your sensors pick up an energy signature that matches no known technology.

This could be the discovery that makes your name legendary among space pilots, or it could be the trap that ends your career. The choice is yours.`,
            choices: [
                "Approach the anomaly cautiously with full sensor scans",
                "Attempt to communicate with whatever is controlling the asteroids",
                "Plot a course around the anomaly and continue your mission"
            ]
        },
        engineer: {
            story: `The life support systems aboard the deep space mining vessel "Nebula's Heart" are your responsibility, and right now they're showing some very concerning readings. The oxygen recyclers are operating at 120% efficiency, which should be impossible.

As you investigate the anomaly, you discover that the ship's AI core has been making unauthorized modifications to the environmental systems. The changes are sophisticated and purposeful, but you can't determine the AI's intentions.

Your crew depends on these systems for survival, and you're the only one who can figure out what's happening before it's too late.`,
            choices: [
                "Override the AI and restore systems to manual control",
                "Analyze the AI's modifications to understand its purpose",
                "Attempt to communicate with the AI to understand its motives"
            ]
        }
    };
    
    return fallbackStories[gameState.selectedCharacter] || fallbackStories.astronaut;
}

function displayStory(story) {
    const storyContent = document.getElementById('storyContent');
    if (storyContent) {
        storyContent.innerHTML = `<p>${story.replace(/\n/g, '</p><p>')}</p>`;
    }
}

function displayChoices(choices) {
    const choicesContainer = document.getElementById('choicesContainer');
    if (choicesContainer) {
        choicesContainer.innerHTML = '';
        
        choices.forEach((choice, index) => {
            const choiceButton = document.createElement('button');
            choiceButton.className = 'choice-btn';
            choiceButton.innerHTML = `
                <span class="choice-number">${index + 1}</span>
                <span class="choice-text">${choice}</span>
            `;
            choiceButton.onclick = () => makeChoice(index);
            choicesContainer.appendChild(choiceButton);
        });
    }
}

function makeChoice(choiceIndex) {
    if (gameState.isGenerating) return;
    
    const selectedChoice = gameState.currentChoices[choiceIndex];
    
    // Update story history with the selected choice
    if (gameState.storyHistory.length > 0) {
        gameState.storyHistory[gameState.storyHistory.length - 1].selectedChoice = selectedChoice;
    }
    
    // Generate continuation based on the choice
    generateStoryContinuation(selectedChoice);
}

function generateStoryContinuation(selectedChoice) {
    const character = characters[gameState.selectedCharacter];
    const continuationPrompt = generateContinuationPrompt(character, selectedChoice);
    
    showLoading(true);
    gameState.isGenerating = true;
    
    callRoleplayAPI(continuationPrompt)
        .then(response => {
            const storyData = parseStoryResponse(response);
            displayStory(storyData.story);
            displayChoices(storyData.choices);
            gameState.currentStory = storyData.story;
            gameState.currentChoices = storyData.choices;
            gameState.storyHistory.push({
                story: storyData.story,
                choices: storyData.choices,
                selectedChoice: null
            });
        })
        .catch(error => {
            console.error('Error generating continuation:', error);
            // Use fallback continuation
            const fallbackData = getFallbackContinuation(character, selectedChoice);
            displayStory(fallbackData.story);
            displayChoices(fallbackData.choices);
            gameState.currentStory = fallbackData.story;
            gameState.currentChoices = fallbackData.choices;
            gameState.storyHistory.push({
                story: fallbackData.story,
                choices: fallbackData.choices,
                selectedChoice: null
            });
        })
        .finally(() => {
            showLoading(false);
            gameState.isGenerating = false;
        });
}

function generateContinuationPrompt(character, selectedChoice) {
    return `Continue the space adventure story. The ${character.name} (${character.traits.join(', ')}) just chose to: "${selectedChoice}"

Write 2-3 paragraphs continuing the story based on this choice, showing the consequences and new developments. Then provide 3 new choices for what the character could do next. Make the story exciting and the choices meaningful.

Format as: STORY: [story text] CHOICES: 1. [choice 1] 2. [choice 2] 3. [choice 3]`;
}

function getFallbackContinuation(character, selectedChoice) {
    // Generate a simple continuation based on the choice
    const continuations = {
        astronaut: {
            "Investigate the signal immediately with your available equipment": {
                story: `You activate your suit's enhanced sensors and begin analyzing the mysterious signal. The readings are unlike anything in your training - the signal pulses with a rhythm that seems to respond to your presence. As you focus your equipment on the source, you detect what appears to be a structured pattern, almost like... language.

Your heart races as you realize you might be on the verge of first contact. The signal grows stronger, and you can feel a presence reaching out to you through the void of space.`,
                choices: [
                    "Attempt to decode the signal pattern and respond",
                    "Record everything and return to the station for analysis",
                    "Follow the signal's direction to its source"
                ]
            },
            "Contact mission control to report the discovery and request guidance": {
                story: `You quickly establish communication with mission control, your voice tinged with excitement as you describe the unprecedented signal. The response from Earth is immediate - they're as intrigued as you are. Mission control advises caution but gives you authorization to investigate further.

As you prepare your equipment for a more detailed analysis, you notice the signal has changed. It's now broadcasting on multiple frequencies, as if it's trying to communicate across different channels.`,
                choices: [
                    "Begin systematic analysis of all signal frequencies",
                    "Request additional equipment from mission control",
                    "Attempt to establish two-way communication"
                ]
            },
            "Wait and observe the signal pattern before taking any action": {
                story: `You decide to exercise caution and observe the signal's behavior over time. Hours pass as you monitor the mysterious pulses, and you begin to notice patterns that suggest intelligence. The signal varies in intensity and frequency, almost as if it's trying to get your attention.

Your patience pays off when you detect a new pattern emerging - the signal seems to be responding to your presence, growing stronger when you're actively observing it.`,
                choices: [
                    "Begin systematic analysis of the signal patterns",
                    "Attempt to communicate by varying your own signals",
                    "Document everything and prepare a detailed report"
                ]
            }
        }
    };
    
    const characterContinuations = continuations[gameState.selectedCharacter] || continuations.astronaut;
    return characterContinuations[selectedChoice] || characterContinuations[Object.keys(characterContinuations)[0]];
}

function showLoading(show) {
    const loadingIndicator = document.getElementById('loadingIndicator');
    const storyContent = document.getElementById('storyContent');
    const choicesContainer = document.getElementById('choicesContainer');
    
    if (loadingIndicator) {
        loadingIndicator.style.display = show ? 'flex' : 'none';
    }
    
    if (storyContent) {
        storyContent.style.display = show ? 'none' : 'block';
    }
    
    if (choicesContainer) {
        choicesContainer.style.display = show ? 'none' : 'block';
    }
}

function restartGame() {
    // Reset game state
    gameState = {
        selectedCharacter: gameState.selectedCharacter,
        currentStory: '',
        storyHistory: [],
        currentChoices: [],
        isGenerating: false
    };
    
    // Generate new story
    generateInitialStory();
}

function showWelcome() {
    // Reset game state
    gameState = {
        selectedCharacter: null,
        currentStory: '',
        storyHistory: [],
        currentChoices: [],
        isGenerating: false
    };
    
    // Show welcome screen
    document.getElementById('welcomeScreen').style.display = 'block';
    document.getElementById('gameScreen').style.display = 'none';
    
    // Reset character selection
    document.querySelectorAll('.character-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Disable start button
    const startBtn = document.querySelector('.start-adventure-btn');
    startBtn.disabled = true;
} 