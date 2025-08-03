
# 🚀 Space Story Generator - Product Requirement Document

## 1. **Overview**
The **Space Story Generator** is an open-access website that generates AI-powered space-themed stories using the **Gemini API**. Users can:
- Generate a random space story.
- Regenerate stories.
- Provide custom input for personalized stories.
- Share stories with the community without logging in.

The site will be built using **HTML, CSS, and Vanilla JavaScript**. **Supabase** will be used for backend services and database storage.

---

## 2. **Goals**
- Provide an engaging platform for users to generate space-themed stories.
- Ensure a smooth, minimalistic, and user-friendly experience.
- Allow story sharing without requiring user authentication.

---

## 3. **Key Features**
### **Landing Page**
- **UI Elements:**
  - A space-themed background (animated stars/galaxy effect).
  - A prominent **"Start Your Space Journey"** button.
- **Functionality:**
  - Clicking the button navigates to the story generation page.

---

### **Story Generation Page**
- **Layout:**
  - Generated story text displayed in a styled container.
  - Three main buttons:
    1. **Regenerate Story** → Generates a new random space story.
    2. **Custom Story Input** → Opens a text box/modal where users can provide input (e.g., “An astronaut lost near Jupiter”).
    3. **Share with Community** → Saves the current story to **Supabase**.

- **Functional Flow:**
  - **Default Behavior:** When the page loads, an AI story is generated using Gemini API.
  - **Regenerate:** Fetches a new AI story.
  - **Custom Input:** Sends the user input to the Gemini API for generating a story.
  - **Share:** Sends the story and timestamp to **Supabase** for community access.

---

### **Community Page** *(Optional for later phase)*
- Displays all shared stories in a list or grid format.
- Publicly accessible.

---

## 4. **Technology Stack**
- **Frontend:** HTML, CSS, Vanilla JavaScript
- **AI Service:** Gemini API (for text generation)
- **Database & Backend:** Supabase (PostgreSQL + REST API)
- **Hosting:** Vercel / Netlify (Static hosting)

---

## 5. **Data Model**
### **Stories Table (Supabase)**
| Field        | Type       | Description                      |
|-------------|-----------|----------------------------------|
| id          | UUID      | Unique identifier               |
| story       | TEXT      | AI-generated story text         |
| created_at  | TIMESTAMP | Time of creation               |

---

## 6. **User Flow**
1. **Landing Page**
   - User clicks **Start** → Redirect to **Story Page**.
2. **Story Page**
   - Auto-generates a story.
   - User can **Regenerate**, **Customize**, or **Share**.
3. **Share**
   - Saves story to Supabase.

---

## 7. **UI Components**
- **Landing Page**
  - Fullscreen background with animated stars.
  - Centered button.
- **Story Page**
  - Header: Logo/Title.
  - Story Section: Text container.
  - Button Group:
    - Regenerate
    - Custom Input
    - Share
- **Modal for Custom Input**
  - Textbox + Submit button.

---

## 8. **APIs**
- **Gemini API**
  - Input: Optional prompt (user input)
  - Output: Story text
- **Supabase API**
  - **POST** story
  - **GET** community stories

---

## 9. **Non-Functional Requirements**
- **Performance:** Stories should load within 2-3 seconds.
- **Scalability:** Support at least 100 concurrent users.
- **Security:** No personal data collection.
- **Availability:** 99.9% uptime.

---

## 10. **Future Enhancements**
- Add **Community Page** with voting.
- Add **Download Story as Image/PDF** feature.
- Add **AI-generated images** for stories.

---

## 11. **Timeline**
| Task                         | Duration |
|-----------------------------|----------|
| UI Design & Landing Page   | 2 Days   |
| Story Page Development     | 2 Days   |
| Gemini API Integration     | 1 Day    |
| Supabase Integration       | 1 Day    |
| Testing & Deployment       | 2 Days   |

---

## 12. **Success Metrics**
- **Primary Metric:** Number of stories generated & shared.
- **Secondary Metric:** Average session duration.
- **User Feedback:** Ratings and community engagement.

---

### **Author:** [Your Name]  
### **Date:** 2025-08-03
