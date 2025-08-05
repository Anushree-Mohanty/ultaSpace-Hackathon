class SpaceStoryBuilder {
  constructor() {
    this.initializeElements()
    this.bindEvents()
    this.storyTemplates = this.getStoryTemplates()
    this.isEditing = false
    this.editingIndex = undefined
    this.checkForEditMode() // Add this line
  }

  checkForEditMode() {
    const urlParams = new URLSearchParams(window.location.search)
    const editingData = sessionStorage.getItem("editingStory")

    if (urlParams.get("edit") === "true" && editingData) {
      const { story, index } = JSON.parse(editingData)
      this.loadStoryForEditing(story, index)
      sessionStorage.removeItem("editingStory")
    }
  }

  loadStoryForEditing(story, index) {
    // Populate form with story data
    this.protagonist.value = story.settings.protagonist
    this.setting.value = story.settings.setting
    this.conflict.value = story.settings.conflict
    this.companion.value = story.settings.companion
    this.customElement.value = story.settings.customElement

    // Display the current story
    this.displayStory({
      title: story.title,
      content: story.content,
    })

    // Store editing info
    this.editingIndex = index
    this.isEditing = true

    // Update button text
    this.generateBtn.textContent = "Update Story"

    // Show notification
    this.showTemporaryMessage("Story loaded for editing! 📝")
  }

  initializeElements() {
    this.protagonist = document.getElementById("protagonist")
    this.setting = document.getElementById("setting")
    this.conflict = document.getElementById("conflict")
    this.companion = document.getElementById("companion")
    this.customElement = document.getElementById("customElement")
    this.generateBtn = document.getElementById("generateStory")
    this.clearBtn = document.getElementById("clearForm")
    this.storyDisplay = document.getElementById("storyDisplay")
    this.storyActions = document.getElementById("storyActions")
    this.saveBtn = document.getElementById("saveStory")
    this.shareBtn = document.getElementById("shareStory")
    this.newStoryBtn = document.getElementById("newStory")
  }

  bindEvents() {
    this.generateBtn.addEventListener("click", () => this.generateStory())
    this.clearBtn.addEventListener("click", () => this.clearForm())
    this.saveBtn.addEventListener("click", () => this.saveStory())
    this.shareBtn.addEventListener("click", () => this.shareStory())
    this.newStoryBtn.addEventListener("click", () => this.createNewStory())

    // Add enter key support for custom element input
    this.customElement.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.generateStory()
      }
    })
  }

  getStoryTemplates() {
    return [
      {
        template:
          "In the vast expanse of space, {protagonist} found themselves stationed on {setting}. The cosmic winds whispered ancient secrets as they began their daily routine, unaware that destiny was about to unfold.\n\nIt was during the third rotation of the local star when they {conflict}. The discovery sent shockwaves through their very being, challenging everything they thought they knew about the universe. The implications were staggering - this could change the course of galactic civilization forever.\n\nAccompanied by {companion}, they embarked on a perilous journey that would test not only their courage but their understanding of reality itself. Together, they navigated through cosmic storms, decoded ancient alien languages, and faced challenges that pushed the boundaries of what was thought possible.\n\nAs they delved deeper into the mystery, they uncovered a network of interconnected worlds, each holding a piece of a cosmic puzzle that had been scattered across the galaxy eons ago. The truth they discovered would reshape the very fabric of space-time.",
        images: ["hero", "setting", "discovery", "journey"],
      },
      {
        template:
          "The stars aligned in a configuration not seen for millennia when {protagonist} arrived at {setting}. Ancient prophecies spoke of this moment, though few believed such tales could be true.\n\nLittle did they know that within the next solar cycle, they would {conflict}. The event triggered a cascade of phenomena that rippled across multiple dimensions, awakening dormant technologies and forgotten civilizations that had slumbered for countless ages.\n\nWith the invaluable assistance of {companion}, they discovered that the universe held layers of reality previously unknown to science. Each revelation led to ten more questions, creating a web of mystery that spanned across star systems and through the very essence of time itself.\n\nTheir quest became legendary, inspiring songs among the star-singers of Andromeda and earning them a place in the cosmic archives. They learned that true wisdom comes not from having all the answers, but from asking the right questions and having the courage to seek truth wherever it might lead.",
        images: ["prophecy", "protagonist", "cosmic-event", "companion"],
      },
      {
        template:
          "Deep in the cosmic void, where even light struggled to penetrate the darkness, {protagonist} was stationed on {setting}. The isolation was profound, broken only by the gentle hum of life support systems and the distant song of pulsars.\n\nIt was during the darkest hour of the cosmic night when the unexpected happened - they {conflict}. The discovery shattered the silence of space and sent urgent transmissions racing across the galaxy at faster-than-light speeds, alerting civilizations both ancient and new.\n\nTogether with {companion}, they faced challenges that tested not only their physical endurance but their mental fortitude and spiritual resolve. They encountered beings of pure energy, navigated through temporal anomalies, and witnessed the birth and death of stars in accelerated time.\n\nTheir adventure became a turning point in galactic history, proving that even in the darkest corners of space, hope and determination could illuminate the path forward. They returned as heroes, but more importantly, as guardians of knowledge that would guide future generations through the infinite mysteries of the cosmos.",
        images: ["void", "station", "discovery", "energy-beings"],
      },
    ]
  }

  generateStory() {
    // Validate required fields
    if (!this.protagonist.value || !this.setting.value || !this.conflict.value) {
      this.showError("Please fill in at least the Hero, Setting, and Adventure fields!")
      return
    }

    // Show loading state
    this.showLoading()

    // Simulate story generation delay for better UX
    setTimeout(() => {
      const story = this.createStory()
      this.displayStory(story)

      // If editing, update the existing story
      if (this.isEditing && this.editingIndex !== undefined) {
        this.updateExistingStory(story)
      }
    }, 1500)
  }

  updateExistingStory(story) {
    const savedStories = JSON.parse(localStorage.getItem("spaceStories") || "[]")

    if (savedStories[this.editingIndex]) {
      savedStories[this.editingIndex] = {
        ...savedStories[this.editingIndex],
        title: story.title,
        content: story.content,
        settings: {
          protagonist: this.protagonist.value,
          setting: this.setting.value,
          conflict: this.conflict.value,
          companion: this.companion.value,
          customElement: this.customElement.value,
        },
        timestamp: new Date().toISOString(), // Update timestamp
      }

      localStorage.setItem("spaceStories", JSON.stringify(savedStories))
      this.showTemporaryMessage("Story updated successfully! ✨")

      // Reset editing mode
      this.isEditing = false
      this.editingIndex = undefined
      this.generateBtn.textContent = "Generate Story"
    }
  }

  createStory() {
    // Get random template object
    const templateObj = this.storyTemplates[Math.floor(Math.random() * this.storyTemplates.length)]
    let story = templateObj.template

    // Get form values
    const protagonist = this.protagonist.value
    const setting = this.setting.value
    const conflict = this.conflict.value
    const companion = this.companion.value || "their own determination and wit"

    // Replace placeholders in template
    story = story
      .replace(/{protagonist}/g, `the ${protagonist}`)
      .replace(/{setting}/g, setting)
      .replace(/{conflict}/g, conflict)
      .replace(/{companion}/g, companion)

    // Add custom element if provided
    if (this.customElement.value.trim()) {
      const customEndings = [
        `\n\nTheir journey took an extraordinary turn when they encountered ${this.customElement.value.trim()}. This unexpected element added layers of complexity to their mission, forcing them to adapt and evolve in ways they never imagined possible.`,
        `\n\nAs if the universe itself was testing their resolve, ${this.customElement.value.trim()} appeared at the most crucial moment. This encounter would prove to be the key that unlocked secrets hidden since the dawn of time.`,
        `\n\nIn a twist that defied all probability, ${this.customElement.value.trim()} emerged from the cosmic shadows. This revelation changed not just their understanding of the current situation, but rewrote the very laws they thought governed reality.`,
      ]

      const randomEnding = customEndings[Math.floor(Math.random() * customEndings.length)]
      story += randomEnding
    }

    // Add epic conclusion
    const conclusions = [
      "\n\nIn the end, their bravery and determination saved not just themselves, but countless worlds across the galaxy. Their names were etched in the cosmic chronicles, and their story became a beacon of hope for all who dared to dream of adventures among the stars. The universe itself seemed to smile upon their courage, opening new pathways of possibility for future explorers.",
      "\n\nTheir adventure became the stuff of legends, inspiring future generations of space explorers to push beyond the boundaries of the known universe. Songs were sung of their deeds in a thousand different languages across a million worlds, and their legacy lived on in the hearts of all who yearned for discovery.",
      "\n\nWhat started as a routine mission evolved into an epic tale that would be told throughout the cosmos for eons to come. They had not only survived the impossible but had thrived in the face of cosmic adversity, proving that the spirit of exploration and discovery burns eternal in the hearts of the brave.",
      "\n\nThey returned home forever changed, carrying with them the wisdom of the stars and the bonds forged in the depths of space. Their experiences had transformed them into something more than they were before - they had become bridges between worlds, ambassadors of hope, and guardians of the infinite possibilities that await in the vast expanse of the universe.",
    ]

    story += conclusions[Math.floor(Math.random() * conclusions.length)]

    // Generate contextual images
    const images = this.generateStoryImages(templateObj.images, protagonist, setting)

    return {
      title: this.generateTitle(),
      content: story,
      images: images,
    }
  }

  generateStoryImages(imageTypes, protagonist, setting) {
    const images = []

    imageTypes.forEach((type, index) => {
      let imageQuery = ""
      let imageTitle = ""

      switch (type) {
        case "hero":
        case "protagonist":
          imageQuery = `${protagonist} in futuristic space suit cosmic background`
          imageTitle = "The Hero of Our Story"
          break
        case "setting":
        case "station":
          imageQuery = `${setting} futuristic space environment cosmic vista`
          imageTitle = "The Setting"
          break
        case "discovery":
          imageQuery = "ancient alien artifact glowing mysterious cosmic discovery"
          imageTitle = "The Discovery"
          break
        case "journey":
          imageQuery = "spaceship traveling through colorful nebula cosmic journey"
          imageTitle = "The Journey Begins"
          break
        case "prophecy":
          imageQuery = "ancient cosmic prophecy glowing symbols star alignment"
          imageTitle = "Ancient Prophecy"
          break
        case "cosmic-event":
          imageQuery = "cosmic phenomenon energy waves space-time distortion"
          imageTitle = "Cosmic Event"
          break
        case "companion":
          imageQuery = "futuristic AI companion holographic assistant space technology"
          imageTitle = "Trusted Companion"
          break
        case "void":
          imageQuery = "deep space cosmic void stars darkness infinite expanse"
          imageTitle = "The Cosmic Void"
          break
        case "energy-beings":
          imageQuery = "beings of pure energy cosmic entities glowing ethereal"
          imageTitle = "Energy Beings"
          break
        default:
          imageQuery = "epic space adventure cosmic scene futuristic"
          imageTitle = "Adventure Scene"
      }

      images.push({
        url: `/placeholder.svg?height=300&width=400&query=${encodeURIComponent(imageQuery)}`,
        title: imageTitle,
        index: index,
      })
    })

    return images
  }

  generateTitle() {
    const titlePrefixes = [
      "The Chronicles of",
      "Adventures in",
      "The Legend of",
      "Journey to",
      "The Mystery of",
      "Guardians of",
      "The Quest for",
      "Secrets of",
    ]

    const titleSuffixes = [
      "the Cosmic Frontier",
      "the Stellar Void",
      "the Galactic Beyond",
      "the Infinite Stars",
      "the Nebula's Edge",
      "the Quantum Realm",
      "the Celestial Gateway",
      "the Astral Dimension",
    ]

    const prefix = titlePrefixes[Math.floor(Math.random() * titlePrefixes.length)]
    const suffix = titleSuffixes[Math.floor(Math.random() * titleSuffixes.length)]

    return `${prefix} ${suffix}`
  }

  showLoading() {
    this.storyDisplay.innerHTML = `
            <div class="placeholder">
                <div class="loading"></div>
                <p>Generating your cosmic adventure...</p>
                <p class="hint">The universe is aligning the perfect story for you!</p>
            </div>
        `
  }

  showError(message) {
    this.storyDisplay.innerHTML = `
            <div class="placeholder">
                <div style="font-size: 3rem; margin-bottom: 20px;">⚠️</div>
                <p style="color: #ff6b6b;">${message}</p>
            </div>
        `
  }

  displayStory(story) {
    let imagesHtml = ""

    if (story.images && story.images.length > 0) {
      imagesHtml = `
        <div class="story-images">
          ${story.images
            .map(
              (img) => `
            <div class="story-image-container">
              <img src="${img.url}" alt="${img.title}" class="story-image" loading="lazy">
              <div class="image-caption">${img.title}</div>
            </div>
          `,
            )
            .join("")}
        </div>
      `
    }

    this.storyDisplay.innerHTML = `
      <div class="generated-story">
        <h2 class="story-title">${story.title}</h2>
        ${imagesHtml}
        <div class="story-content">${this.formatStoryContent(story.content)}</div>
      </div>
    `

    this.storyActions.style.display = "flex"
    this.currentStory = story

    // Add some visual flair
    this.storyDisplay.style.animation = "none"
    this.storyDisplay.offsetHeight // Trigger reflow
    this.storyDisplay.style.animation = "fadeIn 0.5s ease-in"
  }

  clearForm() {
    this.protagonist.value = ""
    this.setting.value = ""
    this.conflict.value = ""
    this.companion.value = ""
    this.customElement.value = ""

    this.storyDisplay.innerHTML = `
    <div class="placeholder">
      <div class="planet-icon">🪐</div>
      <p>Your cosmic adventure will appear here...</p>
      <p class="hint">Fill out the form and click "Generate Story" to begin!</p>
    </div>
  `

    this.storyActions.style.display = "none"

    // Reset editing mode
    this.isEditing = false
    this.editingIndex = undefined
    this.generateBtn.textContent = "Generate Story"
  }

  saveStory() {
    if (!this.currentStory) return

    const storyData = {
      title: this.currentStory.title,
      content: this.currentStory.content,
      timestamp: new Date().toISOString(),
      settings: {
        protagonist: this.protagonist.value,
        setting: this.setting.value,
        conflict: this.conflict.value,
        companion: this.companion.value,
        customElement: this.customElement.value,
      },
    }

    // Save to localStorage
    const savedStories = JSON.parse(localStorage.getItem("spaceStories") || "[]")
    savedStories.push(storyData)
    localStorage.setItem("spaceStories", JSON.stringify(savedStories))

    // Show confirmation
    this.showTemporaryMessage("Story saved to your device! 💾")
  }

  shareStory() {
    if (!this.currentStory) return

    const storyText = `${this.currentStory.title}\n\n${this.currentStory.content}\n\n--- Created with Cosmic Story Builder ---`

    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(storyText)
        .then(() => {
          this.showTemporaryMessage("Story copied to clipboard! 📋")
        })
        .catch(() => {
          this.fallbackCopyToClipboard(storyText)
        })
    } else {
      this.fallbackCopyToClipboard(storyText)
    }
  }

  fallbackCopyToClipboard(text) {
    const textArea = document.createElement("textarea")
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()

    try {
      document.execCommand("copy")
      this.showTemporaryMessage("Story copied to clipboard! 📋")
    } catch (err) {
      this.showTemporaryMessage("Unable to copy. Please select and copy manually.")
    }

    document.body.removeChild(textArea)
  }

  createNewStory() {
    this.clearForm()
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  showTemporaryMessage(message) {
    const messageDiv = document.createElement("div")
    messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(45deg, #4ecdc4, #45b7d1);
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            z-index: 1000;
            font-weight: bold;
            animation: slideIn 0.3s ease-out;
        `
    messageDiv.textContent = message

    document.body.appendChild(messageDiv)

    setTimeout(() => {
      messageDiv.style.animation = "slideOut 0.3s ease-in forwards"
      setTimeout(() => {
        document.body.removeChild(messageDiv)
      }, 300)
    }, 3000)
  }

  formatStoryContent(content) {
    return content
      .split("\n\n")
      .map((paragraph) => `<p class="story-paragraph">${paragraph}</p>`)
      .join("")
  }
}

// Add CSS animations for messages
const style = document.createElement("style")
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
`
document.head.appendChild(style)

// Initialize the story builder when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new SpaceStoryBuilder()
})

