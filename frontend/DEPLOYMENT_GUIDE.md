# 🚀 Production Deployment Guide - DevAgent Pro

This guide covers deploying DevAgent Pro to production with all authentication features.

## 📋 Pre-Deployment Checklist

- [ ] MongoDB database set up (Atlas recommended)
- [ ] Environment variables configured
- [ ] OAuth apps created (GitHub + Google)
- [ ] Domain name ready (if using custom domain)
- [ ] HTTPS certificate (automatic with Vercel)
- [ ] Together AI API key obtained

## 🌐 Deployment Platforms

### Option 1: Vercel (Recommended)

Vercel is the easiest and recommended platform for Next.js apps.

#### Step 1: Prepare Your Repository

```bash
# Ensure all changes are committed
git add .
git commit -m "Add authentication system"
git push origin main
```

#### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Next.js settings

#### Step 3: Configure Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

**Required Variables:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/devagent
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-production-secret-min-32-chars
TOGETHER_API_KEY=your-together-ai-api-key
```

**Optional OAuth Variables:**
```env
GITHUB_ID=your-github-oauth-id
GITHUB_SECRET=your-github-oauth-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

#### Step 4: Update OAuth Callback URLs

**GitHub OAuth:**
1. Go to GitHub OAuth App settings
2. Update "Authorization callback URL" to:
   - `https://your-domain.vercel.app/api/auth/callback/github`

**Google OAuth:**
1. Go to Google Cloud Console
2. Update "Authorized redirect URIs" to:
   - `https://your-domain.vercel.app/api/auth/callback/google`

#### Step 5: Deploy

```bash
# Deploy with Vercel CLI (optional)
npm install -g vercel
vercel

# Or push to main branch (auto-deploys)
git push origin main
```

#### Step 6: Verify Deployment

1. Visit your deployment URL
2. Test authentication:
   - Sign up with email/password
   - Sign in with OAuth providers
   - Add API keys in Settings
   - Generate code
3. Check logs in Vercel Dashboard

### Option 2: Netlify

#### Step 1: Build Configuration

Create `netlify.toml`:

```toml
[build]
  command = "cd frontend && npm install && npm run build"
  publish = "frontend/.next"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### Step 2: Deploy

1. Go to [netlify.com](https://netlify.com)
2. Connect GitHub repository
3. Set build command: `cd frontend && npm run build`
4. Set publish directory: `frontend/.next`
5. Add environment variables (same as Vercel)
6. Deploy!

#### Step 3: Update OAuth Callbacks

Update callback URLs to:
- `https://your-app.netlify.app/api/auth/callback/github`
- `https://your-app.netlify.app/api/auth/callback/google`

### Option 3: Self-Hosted (VPS/Cloud)

#### Prerequisites:
- Ubuntu 22.04 LTS or similar
- Node.js 18+ installed
- Nginx installed
- Domain with SSL certificate (Let's Encrypt)

#### Step 1: Clone and Install

```bash
# SSH into your server
ssh user@your-server-ip

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repository
git clone https://github.com/not-noobcoder99/Dev-Agent-.git
cd Dev-Agent-/frontend

# Install dependencies
npm install

# Build for production
npm run build
```

#### Step 2: Create Environment File

```bash
# Create .env.local in frontend directory
nano .env.local

# Add your production environment variables
# (Same as Vercel configuration above)
```

#### Step 3: Set Up PM2 (Process Manager)

```bash
# Install PM2
sudo npm install -g pm2

# Start application
pm2 start npm --name "devagent" -- start

# Set PM2 to start on boot
pm2 startup
pm2 save
```

#### Step 4: Configure Nginx

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/devagent

# Add this configuration:
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/devagent /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Step 5: Set Up SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renew (Certbot sets this up automatically)
sudo certbot renew --dry-run
```

## 🗄️ Production MongoDB Setup

### MongoDB Atlas (Recommended)

#### Step 1: Create Production Cluster

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create new cluster or use existing
3. Choose tier (M0 Free or paid for better performance)
4. Select region closest to your deployment

#### Step 2: Configure Network Access

1. Go to Network Access
2. Add IP addresses:
   - Vercel: Add `0.0.0.0/0` (Vercel uses dynamic IPs)
   - Self-hosted: Add your server's IP
3. For security, use VPC peering (paid tier)

#### Step 3: Create Database User

1. Go to Database Access
2. Create user with strong password
3. Grant "Read and write to any database" permissions

#### Step 4: Get Connection String

1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy connection string
4. Replace `<password>` with your user password
5. Add `/devagent` database name at the end

```
mongodb+srv://username:password@cluster.mongodb.net/devagent?retryWrites=true&w=majority
```

## 🔒 Security Hardening

### 1. Environment Variables

**Never commit** `.env.local` to Git:

```bash
# .gitignore should include:
.env.local
.env*.local
```

### 2. NEXTAUTH_SECRET

Generate strong secret for production:

```bash
# Generate 32-byte random string
openssl rand -base64 32
```

**Use different secrets** for dev and production!

### 3. HTTPS Only

Ensure `NEXTAUTH_URL` uses `https://`:

```env
# ✅ Correct
NEXTAUTH_URL=https://your-domain.com

# ❌ Wrong
NEXTAUTH_URL=http://your-domain.com
```

### 4. Rate Limiting

Add rate limiting to API routes:

```bash
npm install express-rate-limit
```

```typescript
// middleware/rateLimit.ts
import rateLimit from 'express-rate-limit'

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later'
})
```

### 5. Database Security

- ✅ Use strong database passwords
- ✅ Enable MongoDB authentication
- ✅ Use IP whitelisting
- ✅ Enable encryption at rest (Atlas M10+)
- ✅ Enable auditing (Atlas M10+)

### 6. CORS Configuration

For production, restrict CORS to your domain:

```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'https://your-domain.com' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE' },
        ],
      },
    ]
  },
}
```

## 📊 Monitoring & Logging

### Vercel Analytics

Enable in Vercel Dashboard:
1. Go to your project
2. Click "Analytics"
3. Enable analytics

### Application Monitoring

#### Option 1: Sentry

```bash
npm install @sentry/nextjs
```

```javascript
// sentry.client.config.js
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
})
```

#### Option 2: LogRocket

```bash
npm install logrocket
```

```javascript
// pages/_app.tsx
import LogRocket from 'logrocket'

if (process.env.NODE_ENV === 'production') {
  LogRocket.init('your-app-id')
}
```

### MongoDB Monitoring

1. Enable MongoDB Atlas monitoring
2. Set up alerts for:
   - High connection count
   - Slow queries
   - Storage usage
   - CPU usage

## 🔄 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: cd frontend && npm install
    
    - name: Run tests
      run: cd frontend && npm test
    
    - name: Build
      run: cd frontend && npm run build
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
        vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## 🧪 Testing in Production

### Smoke Tests

After deployment, test:

1. **Homepage loads** - `https://your-domain.com`
2. **Sign up flow** - Create test account
3. **Sign in flow** - Login with test account
4. **OAuth flow** - Test GitHub/Google login
5. **API key management** - Add/update keys
6. **Code generation** - Generate sample code
7. **Logout** - Sign out successfully

### Load Testing

```bash
# Install k6
brew install k6  # macOS
# or download from k6.io

# Create test script
cat > load-test.js << 'EOF'
import http from 'k6/http'
import { check } from 'k6'

export let options = {
  vus: 10,
  duration: '30s',
}

export default function() {
  let response = http.get('https://your-domain.com')
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  })
}
EOF

# Run load test
k6 run load-test.js
```

## 📈 Performance Optimization

### 1. Enable Next.js Image Optimization

```typescript
// next.config.js
module.exports = {
  images: {
    domains: ['avatars.githubusercontent.com', 'lh3.googleusercontent.com'],
  },
}
```

### 2. Enable Compression

Vercel automatically enables gzip/brotli.

For self-hosted:

```bash
# Nginx configuration
gzip on;
gzip_vary on;
gzip_types text/plain text/css application/json application/javascript;
```

### 3. Database Indexes

Create indexes for frequently queried fields:

```javascript
// MongoDB shell or Atlas UI
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ createdAt: -1 })
```

### 4. Caching

Add Redis for session caching (optional):

```bash
npm install redis
```

## 🐛 Troubleshooting Production Issues

### Issue: "Invalid callback URL"

**Solution:**
- Verify OAuth callback URLs match exactly
- Check `NEXTAUTH_URL` is set correctly
- Ensure using HTTPS in production

### Issue: "MongoDB connection timeout"

**Solution:**
- Check MongoDB Atlas IP whitelist
- Verify connection string is correct
- Check MongoDB cluster is running
- Increase connection pool size

### Issue: "NextAuth session expired"

**Solution:**
- Check `NEXTAUTH_SECRET` is set
- Verify cookies are being sent (check browser)
- Check if time sync is correct on server

### Issue: "500 Internal Server Error"

**Solution:**
- Check Vercel logs or server logs
- Verify all environment variables are set
- Check MongoDB connection
- Review error in Sentry/LogRocket

## 📝 Post-Deployment Checklist

- [ ] All environment variables set
- [ ] HTTPS enabled
- [ ] OAuth providers configured
- [ ] Database connected
- [ ] Monitoring enabled
- [ ] Backup strategy in place
- [ ] Load testing completed
- [ ] Smoke tests passed
- [ ] Documentation updated
- [ ] Team notified

## 🆘 Support

- **Vercel Issues:** [Vercel Support](https://vercel.com/support)
- **MongoDB Atlas:** [MongoDB Support](https://www.mongodb.com/support)
- **NextAuth.js:** [GitHub Issues](https://github.com/nextauthjs/next-auth/issues)
- **Project Issues:** [Your GitHub Repo](https://github.com/not-noobcoder99/Dev-Agent-/issues)

## 🎉 You're Live!

Congratulations! Your DevAgent Pro is now running in production! 🚀

**Next Steps:**
- Monitor performance and errors
- Collect user feedback
- Add analytics tracking
- Plan feature updates
- Scale as needed

---

**Happy coding and deploying! 🎊**
