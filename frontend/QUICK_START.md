# 🚀 Quick Start Guide - DevAgent Pro

Welcome to DevAgent Pro! This guide will get you up and running in 5 minutes.

## ⚡ Quick Setup (5 minutes)

### 1. Install Dependencies (2 minutes)

```bash
cd frontend
npm install
```

Already done! ✅ You have all dependencies installed.

### 2. Set Up Environment Variables (2 minutes)

Create `frontend/.env.local` file:

```bash
# Copy the example file
cp .env.example .env.local
```

**Minimum Required Configuration:**

```env
# MongoDB (Choose one option)
MONGODB_URI=mongodb+srv://your-connection-string  # Option A: MongoDB Atlas
# OR
MONGODB_URI=mongodb://localhost:27017/devagent    # Option B: Local MongoDB

# NextAuth Secret (Generate new secret)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-32-character-secret-key-here

# Together AI (Get free API key)
TOGETHER_API_KEY=your-together-ai-key
```

#### Generate NEXTAUTH_SECRET:

**PowerShell:**
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

**Or visit:** https://generate-secret.vercel.app/32

### 3. Set Up MongoDB (1 minute)

**Option A: MongoDB Atlas (Recommended - Free)**

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create free account → Create free cluster
3. Click "Connect" → "Connect your application"
4. Copy connection string
5. Replace `<password>` with your password
6. Add to `.env.local`

**Option B: Local MongoDB**

1. [Download MongoDB](https://www.mongodb.com/try/download/community)
2. Install and start MongoDB service
3. Use: `MONGODB_URI=mongodb://localhost:27017/devagent`

### 4. Get Together AI API Key (Free - 30 seconds)

1. Visit [Together AI](https://api.together.xyz/)
2. Sign up (free tier available)
3. Go to Settings → API Keys
4. Create new API key
5. Copy to `.env.local` as `TOGETHER_API_KEY`

### 5. Start the Application 🎉

```bash
npm run dev
```

Visit: **http://localhost:3000**

## 🎯 First Steps

### 1. Create Your Account

1. Click "Sign Up" in the header
2. Enter email and password
3. Submit → You're automatically signed in!

### 2. Add Your API Key

1. Go to "Settings" (⚙️ in header)
2. Paste your Together AI API key
3. Click "Save API Keys"

### 3. Generate Your First Code

1. Go to home page
2. Enter a prompt: `"Create a React login form with validation"`
3. Select framework: React
4. Click "Generate Code"
5. Watch the AI create your code!

## 🎨 Features You Can Try

### Code Generation
- Prompt: `"Create a REST API with Express.js"`
- Prompt: `"Build a todo app with React and TypeScript"`
- Prompt: `"Create a Python web scraper"`

### Code Review
- Upload or paste your code
- Get instant feedback on quality, security, bugs
- See suggestions for improvements

### Quality Evaluation
- Analyze code quality metrics
- Get maintainability scores
- Identify technical debt

### Download Code
- Generate code → Click "Download" button
- Get a ZIP file with all generated files

## 📚 Optional: Add OAuth Login (5 minutes)

### GitHub Login

1. Go to [GitHub OAuth Apps](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in:
   - Name: DevAgent Pro
   - Homepage: `http://localhost:3000`
   - Callback: `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and Secret to `.env.local`:

```env
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret
```

5. Restart dev server
6. "Continue with GitHub" button now works! 🎉

### Google Login

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create project → Enable "Google+ API"
3. Create OAuth client ID:
   - Type: Web application
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
4. Copy Client ID and Secret to `.env.local`:

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

5. Restart dev server
6. "Continue with Google" button now works! 🎉

## 🔥 Pro Tips

### Tip 1: API Keys Per User
- Each user can store their own API keys
- Keys are encrypted in database
- No need to share API keys with team members

### Tip 2: Framework Selection
- Select your framework before generating
- Get framework-specific best practices
- Supports: React, Vue, Angular, Express, Django, Flask

### Tip 3: Code Review
- Review code before merging
- Get security vulnerability detection
- Improve code quality scores

### Tip 4: Download Feature
- Download generated code as ZIP
- Includes all files with proper structure
- Ready to extract and use

## 🐛 Troubleshooting

### Error: "Cannot connect to MongoDB"

**Solution:**
- Check `MONGODB_URI` in `.env.local`
- For Atlas: Whitelist your IP address
- For local: Ensure MongoDB is running

### Error: "Invalid API key"

**Solution:**
- Sign in to your account
- Go to Settings
- Add valid Together AI API key
- Save changes

### Error: "next-auth error"

**Solution:**
- Check `NEXTAUTH_SECRET` is set (min 32 chars)
- Verify `NEXTAUTH_URL=http://localhost:3000`
- Restart dev server after changing `.env.local`

### OAuth not working?

**Solution:**
- Verify callback URLs match exactly
- Check OAuth credentials in `.env.local`
- Restart dev server

## 📖 Learn More

- **Full Authentication Guide:** See `AUTH_SETUP.md`
- **Production Deployment:** See `DEPLOYMENT_GUIDE.md`
- **API Documentation:** Visit `/docs` in the app
- **GitHub Repository:** [View source code](https://github.com/not-noobcoder99/Dev-Agent-)

## 🆘 Need Help?

- Check [Issues](https://github.com/not-noobcoder99/Dev-Agent-/issues)
- Read [NextAuth.js Docs](https://next-auth.js.org)
- Review [MongoDB Atlas Docs](https://docs.atlas.mongodb.com)

## ✅ What's Working Now

✅ User authentication (email/password)
✅ OAuth login (GitHub + Google)
✅ API key storage per user
✅ Code generation with AI
✅ Code review system
✅ Quality evaluation
✅ Download generated code
✅ Settings management
✅ Protected routes

## 🚀 Next Steps

1. ✅ Complete authentication setup
2. 📝 Add your own custom prompts
3. 🎨 Customize the UI theme
4. 🌐 Deploy to production (see `DEPLOYMENT_GUIDE.md`)
5. 📊 Add analytics and monitoring

---

**You're all set! Start building amazing code with DevAgent Pro! 🎉**
