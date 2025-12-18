# 🤖 BotZilla - AI-Powered Search & Research Platform

<div align="center">

![BotZilla Logo](https://img.shields.io/badge/BotZilla-AI%20Search-blue?style=for-the-badge&logo=robot&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-15.3.8-black?style=flat-square&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-18.0.0-61DAFB?style=flat-square&logo=react&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-2.49.4-3ECF8E?style=flat-square&logo=supabase&logoColor=white)
![Clerk](https://img.shields.io/badge/Clerk-6.19.1-6C47FF?style=flat-square&logo=clerk&logoColor=white)

*Unleash the power of AI-driven search and research with an intuitive, modern interface*

[🚀 Live Demo](#) | [📖 Documentation](#) | [🐛 Report Bug](https://github.com/yourusername/botzilla/issues) | [✨ Request Feature](https://github.com/yourusername/botzilla/issues)

</div>

---

## 🌟 Overview

BotZilla is a cutting-edge AI-powered search and research platform that combines the latest in machine learning with an elegant, user-friendly interface. Built for researchers, students, and curious minds, it provides instant access to comprehensive information through advanced AI models and real-time web search capabilities.

## ✨ Features

### 🔍 Intelligent Search
- **Multi-Modal Queries**: Search across text, images, and data with natural language processing
- **Real-Time Results**: Instant web search integration with Google Search API
- **Contextual Understanding**: AI-powered query interpretation for more accurate results

### 🧠 AI Research Assistant
- **Deep Research Mode**: Comprehensive analysis with multiple AI models
- **Citation Generation**: Automatic source referencing and bibliography creation
- **Knowledge Synthesis**: Intelligent summarization and insight extraction

### 🎨 Modern UI/UX
- **Animated Hero Section**: Stunning visual effects with Three.js integration
- **Responsive Design**: Seamless experience across all devices
- **Dark/Light Mode**: Adaptive theming for comfortable viewing
- **Intuitive Navigation**: Sidebar-based navigation with smooth transitions

### 🔐 Security & Authentication
- **Clerk Integration**: Secure user authentication and management
- **Supabase Backend**: Robust database with real-time capabilities
- **Data Privacy**: End-to-end encryption for user data

### ⚡ Performance
- **Next.js 15**: Latest framework with App Router for optimal performance
- **Background Processing**: Inngest-powered async operations
- **Optimized Bundling**: Efficient code splitting and lazy loading

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **UI Library**: React 18 with custom components
- **Styling**: Tailwind CSS with custom animations
- **Icons**: Lucide React for consistent iconography

### Backend & Database
- **Authentication**: Clerk for user management
- **Database**: Supabase for real-time data
- **Background Jobs**: Inngest for async processing
- **API Integration**: Google Search API, LLM APIs

### Development Tools
- **Language**: JavaScript/TypeScript
- **Package Manager**: npm
- **Linting**: ESLint
- **Version Control**: Git

## 🚀 Installation

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- Clerk account
- Google Search API key

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/botzilla.git
   cd botzilla
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file with your API keys:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
   CLERK_SECRET_KEY=your_clerk_secret
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
   GOOGLE_SEARCH_API_KEY=your_google_api_key
   INNGEST_SIGNING_KEY=your_inngest_key
   ```

4. **Database Setup**
   Run Supabase migrations and seed data:
   ```bash
   npx supabase db reset
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Open in Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

### Basic Search
1. Enter your query in the search box
2. Choose between "Search" or "Research" mode
3. Select your preferred AI model from the dropdown
4. Click the arrow to initiate search

### Advanced Research
- Use the "Research" tab for in-depth analysis
- Access multiple AI models for comprehensive insights
- Generate citations and export results

### API Integration
BotZilla provides RESTful APIs for programmatic access:

```javascript
// Example: Create a search query
const response = await fetch('/api/create-search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    searchInput: 'Your query here',
    type: 'search'
  })
});
```


## 🏗️ Project Structure

```
botzilla/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── (auth)/            # Authentication pages
│   ├── (routes)/          # Main application routes
│   └── _components/       # Shared components
├── components/            # Reusable UI components
│   └── ui/               # Radix UI components
├── context/              # React context providers
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── services/             # External service integrations
├── inngest/              # Background job functions
└── public/               # Static assets
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow ESLint configuration
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Supabase](https://supabase.com/) for the backend infrastructure
- [Clerk](https://clerk.com/) for authentication
- [Radix UI](https://www.radix-ui.com/) for accessible components
- [Tailwind CSS](https://tailwindcss.com/) for styling

## 📞 Support

Need help? Reach out to us:
- 📧 Email: support@botzilla.ai
- 🐛 [GitHub Issues](https://github.com/yourusername/botzilla/issues)
- 💬 [Discord Community](#)

---

<div align="center">

**Made with ❤️ by the BotZilla team**

⭐ Star us on GitHub if you find this project helpful!

</div>
