# 🤖 DevAgent Pro

**An Autonomous AI Agent for Code Generation, Review, and Workflow Automation**

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org)
[![NextAuth](https://img.shields.io/badge/NextAuth.js-4.24-purple)](https://next-auth.js.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.21-green)](https://www.mongodb.com)
[![Together AI](https://img.shields.io/badge/Together%20AI-LLaMA%203.1-blue)](https://www.together.ai)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org)

> 🎉 **NEW:** Complete authentication system with secure API key storage, OAuth login (GitHub + Google), and user management!

---

## 🎯 What is DevAgent Pro?

DevAgent Pro is a **production-ready AI code generation platform** that:

- 🤖 **Generates code** from natural language using AI (Together AI - LLaMA 3.1 70B)
- 🔍 **Reviews code** automatically for quality, security, and best practices
- 📊 **Evaluates quality** with detailed metrics and scores
- 👥 **Multi-user support** with secure authentication and personal API keys
- 🔐 **OAuth integration** - Sign in with GitHub or Google
- ⚡ **Real-time processing** with progress tracking
- 📥 **Download code** as ZIP files with proper structure
- 🎨 **Beautiful UI** with dark mode support

---

## ✨ Key Features

### 🔐 Authentication System
- ✅ Email/password authentication with bcrypt hashing
- ✅ OAuth login (GitHub + Google)
- ✅ Secure session management with JWT tokens
- ✅ Protected routes and API endpoints
- ✅ User-specific API key storage (encrypted)

### 🤖 AI Code Generation
- ✅ Natural language to code conversion
- ✅ Multiple framework support (React, Vue, Angular, Express, Django, Flask)
- ✅ Intelligent context understanding
- ✅ Production-ready code output
- ✅ Real-time progress tracking

### 🔍 Code Review
- ✅ Automated quality analysis
- ✅ Security vulnerability detection
- ✅ Best practices enforcement
- ✅ Detailed feedback and suggestions
- ✅ Issue categorization (critical, warning, info)

### 📊 Quality Evaluation
- ✅ Comprehensive quality metrics
- ✅ Maintainability scoring
- ✅ Code complexity analysis
- ✅ Technical debt identification
- ✅ Performance recommendations

### 🎨 User Experience
- ✅ Clean, modern interface
- ✅ Dark mode support
- ✅ Responsive design
- ✅ Loading states and animations
- ✅ Error handling with retry
- ✅ Session history (last 10 generations)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                           │
│                    (Next.js + React + Tailwind)                  │
├─────────────────────────────────────────────────────────────────┤
│  • Sign In/Sign Up Pages     • Settings Management              │
│  • Code Generation Dashboard • Download Code as ZIP             │
│  • Code Review Results       • Session History                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION LAYER                          │
│                    (NextAuth.js + MongoDB)                       │
├─────────────────────────────────────────────────────────────────┤
│  • JWT Session Management    • OAuth Integration                │
│  • Password Hashing (bcrypt) • API Key Storage                  │
│  • Protected Routes          • User Management                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       API ROUTES LAYER                           │
│                    (Next.js API Routes)                          │
├─────────────────────────────────────────────────────────────────┤
│  • /api/generate             • /api/auth/[...nextauth]          │
│  • /api/user/api-keys        • /api/auth/signup                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     AI PROCESSING LAYER                          │
│                    (Together AI - LLaMA 3.1)                     │
├─────────────────────────────────────────────────────────────────┤
│  • Code Generation           • Context Understanding            │
│  • Natural Language Processing • Framework-specific Output      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ANALYSIS & REVIEW LAYER                       │
│                  (Static Analysis + AI Review)                   │
├─────────────────────────────────────────────────────────────────┤
│  • Code Review               • Quality Evaluation               │
│  • Security Analysis         • Best Practices Check             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       DATABASE LAYER                             │
│                      (MongoDB Atlas)                             │
├─────────────────────────────────────────────────────────────────┤
│  • User Accounts             • API Keys (Encrypted)             │
│  • Session Data              • User Preferences                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start (5 Minutes)

### Prerequisites

- **Node.js 18+** - [Download](https://nodejs.org)
- **MongoDB** - [MongoDB Atlas (Free)](https://www.mongodb.com/cloud/atlas) or Local
- **Together AI API Key** - [Get Free Key](https://api.together.xyz)

### Step 1: Clone Repository

```bash
git clone https://github.com/not-noobcoder99/Dev-Agent-.git
cd Dev-Agent-/frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment

```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local and add:
# - MONGODB_URI (MongoDB connection string)
# - NEXTAUTH_SECRET (generate with: openssl rand -base64 32)
# - NEXTAUTH_URL (http://localhost:3000)
# - TOGETHER_API_KEY (your Together AI API key)
```

**Quick Config Example:**

```env
# MongoDB
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/devagent

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-32-character-secret-key-here

# Together AI
TOGETHER_API_KEY=your-together-ai-api-key
```

### Step 4: Start Application

```bash
npm run dev
```

Visit **http://localhost:3000** 🎉

### Step 5: First Use

1. **Sign Up** - Create account at `/auth/signup`
2. **Settings** - Add your Together AI API key
3. **Generate** - Create your first AI-generated code!

---

## 📖 Comprehensive Guides

| Guide | Description | Link |
|-------|-------------|------|
| **Quick Start** | Get running in 5 minutes | [`QUICK_START.md`](frontend/QUICK_START.md) |
| **Authentication Setup** | Complete auth configuration | [`AUTH_SETUP.md`](frontend/AUTH_SETUP.md) |
| **Auth Architecture** | System design & flows | [`AUTH_ARCHITECTURE.md`](frontend/AUTH_ARCHITECTURE.md) |
| **Implementation Summary** | What's been built | [`IMPLEMENTATION_SUMMARY.md`](frontend/IMPLEMENTATION_SUMMARY.md) |
| **Deployment Guide** | Production deployment | [`DEPLOYMENT_GUIDE.md`](frontend/DEPLOYMENT_GUIDE.md) |

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **NextAuth.js 4.24** - Authentication

### Backend
- **Next.js API Routes** - Serverless functions
- **MongoDB 6.21** - Database
- **bcryptjs** - Password hashing
- **JWT** - Session tokens

### AI & APIs
- **Together AI** - LLaMA 3.1 70B for code generation
- **Static Analysis** - Code review engine
- **Quality Evaluator** - Metrics & scoring

### Deployment
- **Vercel** - Hosting & serverless
- **MongoDB Atlas** - Cloud database

---

## 📁 Project Structure

```
Dev-Agent-/
│
├── frontend/                           # Main application
│   ├── pages/                          # Next.js pages
│   │   ├── index.tsx                  # Home page (code generation)
│   │   ├── settings.tsx               # API key management
│   │   ├── auth/
│   │   │   ├── signin.tsx            # Sign in page
│   │   │   └── signup.tsx            # Sign up page
│   │   └── api/                       # API routes
│   │       ├── generate.ts            # Code generation endpoint
│   │       ├── auth/
│   │       │   ├── [...nextauth].ts  # NextAuth configuration
│   │       │   └── signup.ts         # User registration
│   │       └── user/
│   │           └── api-keys.ts       # API key management
│   │
│   ├── components/                     # React components
│   │   ├── Header.tsx                 # Header with auth UI
│   │   ├── PromptInput.tsx            # Code generation form
│   │   ├── GeneratedCode.tsx          # Code display & download
│   │   ├── ReviewResults.tsx          # Code review display
│   │   ├── EvaluationResults.tsx      # Quality metrics
│   │   └── WorkflowSummary.tsx        # Process summary
│   │
│   ├── lib/                            # Utilities
│   │   ├── db.ts                      # MongoDB connection
│   │   └── mongodb-adapter.ts         # User data access
│   │
│   ├── styles/                         # CSS files
│   │   └── globals.css                # Global styles
│   │
│   ├── public/                         # Static assets
│   │
│   ├── .env.example                   # Environment template
│   ├── QUICK_START.md                 # Quick setup guide
│   ├── AUTH_SETUP.md                  # Auth setup guide
│   ├── AUTH_ARCHITECTURE.md           # System architecture
│   ├── IMPLEMENTATION_SUMMARY.md      # Implementation details
│   ├── DEPLOYMENT_GUIDE.md            # Production deployment
│   ├── package.json                   # Dependencies
│   ├── tsconfig.json                  # TypeScript config
│   └── tailwind.config.js             # Tailwind config
│
├── agent/                              # Agent logic (deprecated)
├── kestra/                             # Workflow orchestration
├── eval/                               # Quality evaluation
├── demo/                               # Demo materials
│
├── PRD.md                              # Product requirements
└── README.md                           # This file
```

---

## 🔒 Security Features

- ✅ **Password Security** - Bcrypt hashing with 10 salt rounds
- ✅ **Session Management** - JWT tokens with httpOnly cookies
- ✅ **CSRF Protection** - Built-in NextAuth.js protection
- ✅ **API Key Encryption** - Secure storage in MongoDB
- ✅ **OAuth Security** - OAuth 2.0 standard flow
- ✅ **Protected Routes** - Authentication required for sensitive endpoints
- ✅ **HTTPS Required** - Enforced in production

---

## 🎯 Use Cases

### For Developers
- Generate boilerplate code quickly
- Get code review feedback instantly
- Learn best practices from AI suggestions
- Save time on repetitive coding tasks

### For Teams
- Standardize code quality across projects
- Onboard new developers faster
- Maintain consistent coding standards
- Reduce code review time

### For Learners
- Learn by seeing AI-generated examples
- Understand best practices
- Get detailed code explanations
- Practice with real-world scenarios

---

## 📊 What You Can Generate

### Frontend
- ✅ React components with hooks
- ✅ Vue.js components
- ✅ Angular components
- ✅ HTML/CSS/JavaScript
- ✅ Tailwind CSS layouts
- ✅ Responsive designs

### Backend
- ✅ Express.js APIs
- ✅ Flask applications
- ✅ Django projects
- ✅ REST API endpoints
- ✅ Database models
- ✅ Authentication systems

### Full-Stack
- ✅ CRUD applications
- ✅ Authentication flows
- ✅ Form validation
- ✅ API integrations
- ✅ Dashboard interfaces
- ✅ E-commerce features

---

## 🎬 Demo Workflow

1. **Sign In** - User authenticates via email/password or OAuth
2. **Enter Prompt** - "Create a React login form with validation"
3. **Select Framework** - Choose React from dropdown
4. **Generate** - AI creates complete code with files
5. **Review** - Automatic code review with suggestions
6. **Evaluate** - Quality metrics and scores displayed
7. **Download** - Get ZIP file with all generated files
8. **Deploy** - Use the code in your project!

---

## 🧪 Development

### Run Development Server

```bash
cd frontend
npm run dev
```

### Build for Production

```bash
npm run build
npm start
```

### Run Tests

```bash
npm test
```

### Lint Code

```bash
npm run lint
```

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy! ✨

**Detailed Instructions:** See [`DEPLOYMENT_GUIDE.md`](frontend/DEPLOYMENT_GUIDE.md)

### Deploy to Other Platforms

- **Netlify** - Supported
- **Railway** - Supported
- **Self-hosted** - VPS/Cloud with Node.js

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Together AI** - For LLaMA 3.1 70B API
- **NextAuth.js** - For authentication framework
- **MongoDB** - For database solution
- **Vercel** - For hosting platform
- **Next.js Team** - For amazing React framework

---

## 📧 Contact

- **GitHub:** [@not-noobcoder99](https://github.com/not-noobcoder99)
- **Project:** [Dev-Agent-](https://github.com/not-noobcoder99/Dev-Agent-)

---

## 🎉 What's New

### Latest Updates (v2.0)

✨ **Complete Authentication System**
- Email/password authentication with secure hashing
- OAuth login with GitHub and Google
- User-specific API key storage
- Protected routes and API endpoints
- Session management with JWT tokens

🚀 **Enhanced Code Generation**
- Real AI integration with Together AI (LLaMA 3.1 70B)
- Framework-specific code output
- Improved context understanding
- Better error handling

💎 **Improved User Experience**
- Session history (last 10 generations)
- Download code as ZIP files
- Framework selection UI
- Progress tracking with animations
- Quick stats dashboard

🔐 **Security Hardening**
- Password hashing with bcrypt
- API key encryption
- CSRF protection
- httpOnly cookies
- Protected API routes

---

## 🗺️ Roadmap

### Coming Soon
- [ ] Email verification for new accounts
- [ ] Password reset functionality
- [ ] User dashboard with usage stats
- [ ] Team/organization support
- [ ] API usage limits and tracking
- [ ] More AI models support
- [ ] Code diff viewer
- [ ] Export to GitHub directly

### Future Features
- [ ] VSCode extension
- [ ] CLI tool
- [ ] Desktop application
- [ ] Mobile app
- [ ] Slack/Discord integration
- [ ] Custom AI model fine-tuning

---

**⭐ Star this repo if you find it useful!**

**🎊 Happy Coding with DevAgent Pro! 🎊**
