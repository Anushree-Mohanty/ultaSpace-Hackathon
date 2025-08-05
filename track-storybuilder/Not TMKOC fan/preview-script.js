class StoryGallery {
  constructor() {
    this.stories = []
    this.filteredStories = []
    this.currentStory = null
    this.initializeElements()
    this.bindEvents()
    this.loadStories()
  }

  initializeElements() {
    this.storiesGrid = document.getElementById("storiesGrid")
    this.emptyState = document.getElementById("emptyState")
    this.searchInput = document.getElementById("searchInput")
    this.searchBtn = document.getElementById("searchBtn")
    this.sortBy = document.getElementById("sortBy")
    this.clearAllBtn = document.getElementById("clearAll")

    // Modal elements
    this.modal = document.getElementById("storyModal")
    this.modalTitle = document.getElementById("modalTitle")
    this.modalContent = document.getElementById("modalStoryContent")
    this.modalDate = document.getElementById("modalDate")
    this.modalHero = document.getElementById("modalHero")
    this.modalSetting = document.getElementById("modalSetting")
    this.closeModal = document.getElementById("closeModal")
    this.shareModalStory = document.getElementById("shareModalStory")
    this.deleteModalStory = document.getElementById("deleteModalStory")
    this.editStory = document.getElementById("editStory")
  }

  bindEvents() {
    this.searchInput.addEventListener("input", () => this.filterStories())
    this.searchBtn.addEventListener("click", () => this.filterStories())
    this.sortBy.addEventListener("change", () => this.sortAndDisplayStories())
    this.clearAllBtn.addEventListener("click", () => this.clearAllStories())

    // Modal events
    this.closeModal.addEventListener("click", () => this.hideModal())
    this.shareModalStory.addEventListener("click", () => this.shareCurrentStory())
    this.deleteModalStory.addEventListener("click", () => this.deleteCurrentStory())
    this.editStory.addEventListener("click", () => this.editCurrentStory())

    // Close modal when clicking outside
    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal) {
        this.hideModal()
      }
    })

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.modal.style.display === "block") {
        this.hideModal()
      }
    })

    // Search on Enter key
    this.searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.filterStories()
      }
    })
  }

  loadStories() {
    this.showLoadingState()

    // Simulate loading delay for better UX
    setTimeout(() => {
      const savedStories = JSON.parse(localStorage.getItem("spaceStories") || "[]")
      this.stories = savedStories
      this.filteredStories = [...this.stories]
      this.sortAndDisplayStories()
    }, 800)
  }

  showLoadingState() {
    this.storiesGrid.innerHTML = `
      <div class="loading-grid">
        ${Array(6)
          .fill()
          .map(
            () => `
          <div class="loading-card">
            <div class="loading-card-title"></div>
            <div class="loading-card-content"></div>
            <div class="loading-card-meta"></div>
          </div>
        `,
          )
          .join("")}
      </div>
    `
    this.emptyState.style.display = "none"
  }

  sortAndDisplayStories() {
    const sortValue = this.sortBy.value

    this.filteredStories.sort((a, b) => {
      switch (sortValue) {
        case "newest":
          return new Date(b.timestamp) - new Date(a.timestamp)
        case "oldest":
          return new Date(a.timestamp) - new Date(b.timestamp)
        case "title":
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

    this.displayStories()
  }

  filterStories() {
    const searchTerm = this.searchInput.value.toLowerCase().trim()

    if (!searchTerm) {
      this.filteredStories = [...this.stories]
    } else {
      this.filteredStories = this.stories.filter(
        (story) =>
          story.title.toLowerCase().includes(searchTerm) ||
          story.content.toLowerCase().includes(searchTerm) ||
          story.settings.protagonist.toLowerCase().includes(searchTerm) ||
          story.settings.setting.toLowerCase().includes(searchTerm),
      )
    }

    this.sortAndDisplayStories()
  }

  displayStories() {
    if (this.filteredStories.length === 0) {
      this.storiesGrid.innerHTML = ""
      this.emptyState.style.display = "block"
      return
    }

    this.emptyState.style.display = "none"

    this.storiesGrid.innerHTML = this.filteredStories
      .map(
        (story, index) => `
      <div class="story-card" onclick="storyGallery.showStoryModal(${this.stories.indexOf(story)})">
        <h3 class="story-card-title">${story.title}</h3>
        <p class="story-card-preview">${this.truncateText(story.content, 150)}</p>
        <div class="story-card-meta">
          <span class="story-card-date">${this.formatDate(story.timestamp)}</span>
          <span class="story-card-hero">${this.capitalizeFirst(story.settings.protagonist)}</span>
        </div>
      </div>
    `,
      )
      .join("")

    // Add animation to cards
    const cards = this.storiesGrid.querySelectorAll(".story-card")
    cards.forEach((card, index) => {
      card.style.animation = `fadeInUp 0.5s ease-out ${index * 0.1}s both`
    })
  }

  showStoryModal(storyIndex) {
    this.currentStory = this.stories[storyIndex]

    this.modalTitle.textContent = this.currentStory.title

    // Format story content with images if they exist
    let contentHtml = ""
    if (this.currentStory.images && this.currentStory.images.length > 0) {
      contentHtml += `
        <div class="modal-story-images">
          ${this.currentStory.images
            .map(
              (img) => `
            <div class="modal-image-container">
              <img src="${img.url}" alt="${img.title}" class="modal-story-image" loading="lazy">
              <div class="modal-image-caption">${img.title}</div>
            </div>
          `,
            )
            .join("")}
        </div>
      `
    }

    contentHtml += `<div class="modal-story-text">${this.formatModalContent(this.currentStory.content)}</div>`

    this.modalContent.innerHTML = contentHtml
    this.modalDate.textContent = this.formatDate(this.currentStory.timestamp)
    this.modalHero.textContent = this.capitalizeFirst(this.currentStory.settings.protagonist)
    this.modalSetting.textContent = this.currentStory.settings.setting

    this.modal.style.display = "block"
    document.body.style.overflow = "hidden"

    // Add animation
    this.modal.querySelector(".modal-content").style.animation = "modalSlideIn 0.3s ease-out"
  }

  formatModalContent(content) {
    return content
      .split("\n\n")
      .map((paragraph) => `<p class="modal-story-paragraph">${paragraph}</p>`)
      .join("")
  }

  hideModal() {
    this.modal.style.display = "none"
    document.body.style.overflow = "auto"
    this.currentStory = null
  }

  shareCurrentStory() {
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

  deleteCurrentStory() {
    if (!this.currentStory) return

    if (confirm("Are you sure you want to delete this story? This action cannot be undone.")) {
      const storyIndex = this.stories.indexOf(this.currentStory)
      this.stories.splice(storyIndex, 1)

      // Update localStorage
      localStorage.setItem("spaceStories", JSON.stringify(this.stories))

      // Update filtered stories
      this.filteredStories = this.filteredStories.filter((story) => story !== this.currentStory)

      this.hideModal()
      this.displayStories()
      this.showTemporaryMessage("Story deleted successfully! 🗑️")
    }
  }

  editCurrentStory() {
    if (!this.currentStory) return

    // Store the story data in sessionStorage for the editor
    sessionStorage.setItem(
      "editingStory",
      JSON.stringify({
        story: this.currentStory,
        index: this.stories.indexOf(this.currentStory),
      }),
    )

    // Navigate to the story builder
    window.location.href = "index.html?edit=true"
  }

  clearAllStories() {
    if (this.stories.length === 0) {
      this.showTemporaryMessage("No stories to clear! 📭")
      return
    }

    if (confirm("Are you sure you want to delete ALL stories? This action cannot be undone.")) {
      localStorage.removeItem("spaceStories")
      this.stories = []
      this.filteredStories = []
      this.displayStories()
      this.showTemporaryMessage("All stories cleared! 🧹")
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

  truncateText(text, maxLength) {
    if (text.length <= maxLength) return text
    return text.substr(0, maxLength) + "..."
  }

  formatDate(timestamp) {
    const date = new Date(timestamp)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
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
      z-index: 1001;
      font-weight: bold;
      animation: slideIn 0.3s ease-out;
    `
    messageDiv.textContent = message

    document.body.appendChild(messageDiv)

    setTimeout(() => {
      messageDiv.style.animation = "slideOut 0.3s ease-in forwards"
      setTimeout(() => {
        if (document.body.contains(messageDiv)) {
          document.body.removeChild(messageDiv)
        }
      }, 300)
    }, 3000)
  }
}

// Add additional CSS animations
const additionalStyles = document.createElement("style")
additionalStyles.textContent = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes modalSlideIn {
    from {
      opacity: 0;
      transform: translateY(-50px) scale(0.9);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`
document.head.appendChild(additionalStyles)

// Initialize the gallery when the page loads
let storyGallery
document.addEventListener("DOMContentLoaded", () => {
  storyGallery = new StoryGallery()
})
