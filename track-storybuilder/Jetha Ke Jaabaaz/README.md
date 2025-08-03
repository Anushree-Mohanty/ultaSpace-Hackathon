# 🚀 Space Story Generator

An AI-powered space-themed story generator built with Vanilla JavaScript and the Gemini API. Create captivating cosmic adventures with just a click!

## ✨ Features

- **AI-Powered Stories**: Generate unique space adventures using Google's Gemini API
- **Custom Prompts**: Create personalized stories based on your ideas
- **Beautiful UI**: Space-themed design with animated backgrounds
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **No Login Required**: Start generating stories immediately
- **Share Stories**: Share your generated stories with the community (ready for database integration)

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **AI Service**: Google Gemini API
- **Styling**: Custom CSS with animations and gradients
- **Hosting**: Ready for deployment on Vercel, Netlify, or any static hosting

## 🚀 Quick Start

1. **Clone or Download** the project files
2. **Open** `index.html` in your web browser
3. **Click** "Start Your Space Journey" to begin
4. **Enjoy** generating space stories!

## 📁 Project Structure

```
SPACYY/
├── index.html          # Landing page
├── story.html          # Story generation page
├── styles.css          # All styling and animations
├── script.js           # JavaScript functionality
├── README.md           # This file
└── space_story_generator_prd.md  # Product requirements
```

## 🎯 How It Works

### Landing Page (`index.html`)
- Beautiful animated space background
- Call-to-action button to start the journey
- Feature highlights

### Story Generation Page (`story.html`)
- **Auto-generation**: Stories are generated automatically when the page loads
- **Regenerate**: Create a new random space story
- **Custom Input**: Provide your own story ideas
- **Share**: Share stories with the community

### Key Functions

1. **Random Story Generation**: Uses 10 different space-themed prompts
2. **Custom Story Creation**: Users can input their own story ideas
3. **Error Handling**: Graceful error handling for API failures
4. **Loading States**: Visual feedback during story generation
5. **Responsive Design**: Works on all device sizes

## 🔧 API Configuration

The application uses the Google Gemini API for story generation. Configuration is managed through environment variables.

### Environment Setup

1. **Create a `.env` file** in the root directory:
```bash
# Gemini API Configuration
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent
```

2. **Get a Gemini API Key**:
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Add it to your `.env` file

### Configuration Files

- **`.env`**: Environment variables (not committed to git)
- **`config.js`**: Frontend configuration loader
- **`.gitignore`**: Excludes sensitive files from version control

**Note**: For production use, consider using a backend service to handle API calls securely, as frontend environment variables are visible to users.

## 🎨 Design Features

- **Animated Background**: Moving stars, twinkling effects, and cloud animations
- **Glassmorphism**: Modern glass-like UI elements with backdrop blur
- **Gradient Text**: Animated gradient text effects
- **Smooth Animations**: Hover effects and transitions
- **Space Theme**: Cosmic color palette and space-inspired design

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🔮 Future Enhancements

The application is designed to be easily extensible. Future features could include:

- **Database Integration**: Save stories to Supabase or similar
- **Community Page**: Browse and vote on shared stories
- **Story Categories**: Different types of space stories
- **Image Generation**: AI-generated images for stories
- **Export Options**: Download stories as PDF or images
- **User Accounts**: Personal story collections

## 🚀 Deployment

### Local Development
Simply open `index.html` in your browser to run locally.

### Web Deployment
Deploy to any static hosting service:

1. **Vercel**: Drag and drop the folder
2. **Netlify**: Upload the files
3. **GitHub Pages**: Push to a repository
4. **Any Web Server**: Upload files to your server

## 🐛 Troubleshooting

### Common Issues

1. **API Errors**: Check your internet connection and API key validity
2. **Loading Issues**: Ensure JavaScript is enabled in your browser
3. **Styling Problems**: Clear browser cache if styles don't load properly

### Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Feel free to contribute to this project by:
- Reporting bugs
- Suggesting new features
- Improving the design
- Adding new story prompts

## 📞 Support

If you encounter any issues or have questions, please check the troubleshooting section above or create an issue in the project repository.

---

**Enjoy your space adventures! 🌌✨** 