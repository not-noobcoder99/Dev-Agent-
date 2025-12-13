# Authentication Setup Guide

This guide will help you set up the complete authentication system for DevAgent Pro.

## 🔧 Prerequisites

- Node.js 18+ installed
- MongoDB database (Atlas cloud or local)
- GitHub OAuth App (optional, for GitHub login)
- Google OAuth credentials (optional, for Google login)

## 📦 Step 1: Install Dependencies

```bash
cd frontend
npm install next-auth@^4.24.5 mongodb@^6.3.0 bcryptjs@^2.4.3
npm install --save-dev @types/bcryptjs@^2.4.6
```

## 🗄️ Step 2: Set Up MongoDB

### Option A: MongoDB Atlas (Cloud - Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Click "Connect" → "Connect your application"
5. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
6. Replace `<password>` with your database password
7. Add `/devagent` at the end: `mongodb+srv://username:password@cluster.mongodb.net/devagent`

### Option B: Local MongoDB

1. Install MongoDB locally: [Download MongoDB](https://www.mongodb.com/try/download/community)
2. Start MongoDB service
3. Your connection string: `mongodb://localhost:27017/devagent`

## 🔑 Step 3: Configure Environment Variables

Create or update `frontend/.env.local`:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/devagent

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-min-32-characters-long

# GitHub OAuth (Optional)
GITHUB_ID=your-github-oauth-app-id
GITHUB_SECRET=your-github-oauth-app-secret

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Together AI API Key (for code generation)
TOGETHER_API_KEY=your-together-ai-api-key
```

### Generate NEXTAUTH_SECRET

Run this command to generate a secure secret:

```bash
# PowerShell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})

# Or use OpenSSL
openssl rand -base64 32
```

## 🔐 Step 4: Set Up OAuth Providers (Optional)

### GitHub OAuth

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Fill in:
   - Application name: DevAgent Pro
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copy the Client ID and generate a Client Secret
5. Add to `.env.local` as `GITHUB_ID` and `GITHUB_SECRET`

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable "Google+ API"
4. Go to Credentials → Create Credentials → OAuth client ID
5. Configure consent screen
6. Create OAuth client ID:
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
7. Copy Client ID and Client Secret
8. Add to `.env.local` as `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`

## 🚀 Step 5: Start the Application

```bash
cd frontend
npm run dev
```

Visit `http://localhost:3000`

## ✅ Step 6: Test Authentication

### Test Email/Password Authentication

1. Visit `http://localhost:3000/auth/signup`
2. Create a new account with email and password
3. You should be automatically signed in
4. Check header for your email/name and "Logout" button

### Test OAuth Authentication

1. Visit `http://localhost:3000/auth/signin`
2. Click "Continue with GitHub" or "Continue with Google"
3. Authorize the application
4. You should be redirected back and signed in

### Test API Key Storage

1. Sign in to your account
2. Go to Settings (`/settings`)
3. Add your Together AI API key
4. Save changes
5. Try generating code - it should use your stored API key

### Test Protected Routes

1. Sign out
2. Try to access `/settings` - should redirect to sign in
3. Try to use code generation - should return 401 Unauthorized

## 🗂️ Database Collections

The authentication system creates these MongoDB collections:

### `users` Collection

```json
{
  "_id": "ObjectId",
  "email": "user@example.com",
  "password": "hashed-password",
  "name": "User Name",
  "image": "profile-image-url",
  "apiKeys": {
    "togetherAI": "encrypted-api-key"
  },
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## 🔒 Security Features

- ✅ **Password Hashing**: Passwords hashed with bcrypt (10 salt rounds)
- ✅ **JWT Sessions**: Secure session management with NextAuth.js
- ✅ **API Key Masking**: Keys masked in responses (show first 8 + last 4 chars)
- ✅ **Protected Routes**: API routes require authentication
- ✅ **HTTPS Required**: Production must use HTTPS
- ✅ **CSRF Protection**: Built-in NextAuth.js CSRF protection
- ✅ **OAuth Security**: Secure third-party authentication

## 🐛 Troubleshooting

### "Error: Cannot find module 'next-auth'"

**Solution**: Install dependencies:
```bash
npm install next-auth mongodb bcryptjs
```

### "MongooseServerSelectionError: connect ECONNREFUSED"

**Solution**: Check your MongoDB connection:
- Verify `MONGODB_URI` in `.env.local`
- Ensure MongoDB is running (if local)
- Check network access in MongoDB Atlas
- Whitelist your IP address in Atlas

### "Error: [next-auth][error][SIGNIN_EMAIL_ERROR]"

**Solution**: 
- Check your email provider configuration
- Verify SMTP settings in `.env.local`
- For development, email verification is optional

### OAuth callback errors

**Solution**:
- Verify callback URLs match exactly in OAuth provider settings
- Check `NEXTAUTH_URL` matches your development URL
- Ensure OAuth credentials are correct

### "Invalid API key" when generating code

**Solution**:
- Sign in to your account
- Go to Settings
- Add a valid Together AI API key
- Save changes

## 📝 Environment Variables Checklist

Before deploying to production:

- [ ] `MONGODB_URI` - MongoDB connection string
- [ ] `NEXTAUTH_URL` - Your production URL (e.g., https://devagent.com)
- [ ] `NEXTAUTH_SECRET` - Secure random string (min 32 chars)
- [ ] `TOGETHER_API_KEY` - Together AI API key (fallback)
- [ ] `GITHUB_ID` - GitHub OAuth (optional)
- [ ] `GITHUB_SECRET` - GitHub OAuth (optional)
- [ ] `GOOGLE_CLIENT_ID` - Google OAuth (optional)
- [ ] `GOOGLE_CLIENT_SECRET` - Google OAuth (optional)

## 🚢 Production Deployment

See `DEPLOYMENT_GUIDE.md` for complete production deployment instructions.

## 📚 Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)
- [GitHub OAuth Apps](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)

## 🆘 Need Help?

- Check the [GitHub Issues](https://github.com/not-noobcoder99/Dev-Agent-/issues)
- Review NextAuth.js [common issues](https://next-auth.js.org/getting-started/client#options)
- MongoDB [connection troubleshooting](https://docs.mongodb.com/manual/reference/connection-string/)
