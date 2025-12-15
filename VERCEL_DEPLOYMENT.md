# Vercel Deployment Guide

This guide explains how to properly deploy the Dev-Agent Next.js frontend to Vercel from this monorepo.

## Problems That Were Fixed

### 1. Vercel Configuration Issue
The original `vercel.json` was fighting against Vercel's monorepo support by:
- Skipping the install command entirely
- Manually doing `cd frontend && npm install` in the build command
- Specifying output directory relative to repo root

This caused **recurring deployment failures** because Vercel's caching and build system couldn't work consistently.

### 2. TypeScript Path Alias Resolution Error
The `frontend/tsconfig.json` had path aliases configured (`@/*`) but was missing `baseUrl`, causing:
```
Type error: Cannot find module '@/components/Header' or its corresponding type declarations.
```

This failed during `next build` type-checking phase on Vercel, even though it might work locally.

## Current Configuration

### 1. Repository Structure
```
Dev-Agent-/
├── frontend/          # Next.js app (deployment target)
│   ├── package.json
│   ├── next.config.js
│   └── ...
├── agent/            # Agent tooling (not deployed)
├── eval/             # Evaluation scripts (not deployed)
└── vercel.json       # Deployment config
```

### 2. Files Configured

#### `vercel.json`
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

#### `.vercelignore`
Excludes `agent/`, `eval/`, and other non-frontend files from deployment uploads.

#### `frontend/tsconfig.json`
```json
{
  "compilerOptions": {
    "baseUrl": ".",      // ← CRITICAL: Required for path alias resolution
    "paths": {
      "@/*": ["./*"]     // Maps @/components to ./components, etc.
    },
    // ... other options
  }
}
```

**Why this matters**: Without `baseUrl`, TypeScript cannot resolve the `@/` path alias during Vercel's build process, causing compilation errors.

## Setup Instructions

### Step 1: Configure Root Directory in Vercel Dashboard

**This is the most critical step!**

1. Go to your Vercel project settings
2. Navigate to **Settings** → **General**
3. Find the **Root Directory** setting
4. Set it to: `frontend`
5. Check **"Include source files outside of the Root Directory in the Build Step"** if you need root-level files
6. Save the changes

### Step 2: Set Environment Variables

In Vercel project settings → **Environment Variables**, add:

**Required for NextAuth:**
- `NEXTAUTH_URL` - Your deployment URL (e.g., `https://your-app.vercel.app`)
- `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`

**Required for MongoDB:**
- `MONGODB_URI` - Your MongoDB connection string
- `MONGODB_DB` - Database name (e.g., `devagent`)

**Optional (API integrations):**
- `NEXT_PUBLIC_API_URL` - Your API endpoint if different from default
- Any other API keys your app needs

### Step 3: Pin Node.js Version (Recommended)

1. In Vercel settings → **General** → **Node.js Version**
2. Select: `20.x` (matches your `package.json` requirements)

OR add to `frontend/package.json`:
```json
{
  "engines": {
    "node": ">=18.17.0"
  }
}
```

### Step 4: Deploy

#### Option A: Push to Git
Vercel will auto-deploy when you push to your connected branch (typically `main`).

#### Option B: Manual Deploy via CLI
```bash
# Install Vercel CLI if needed
npm i -g vercel

# Deploy from repo root
vercel --cwd frontend

# For production
vercel --cwd frontend --prod
```

## How This Fixed the "Recurring" Issue

### Before (Problematic)
```json
{
  "buildCommand": "cd frontend && npm install && npm run build",
  "installCommand": "echo 'Skipping root install'",
  "outputDirectory": "frontend/.next"
}
```
**Issues:**
- Vercel couldn't cache dependencies properly
- Build commands ran from wrong directory
- Output directory path was ambiguous
- No framework detection at correct level

### After (Correct)
```json
{
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "outputDirectory": ".next"
}
```
**+ Root Directory setting: `frontend`**

**Benefits:**
- Vercel runs all commands from `frontend/` directory
- Standard Next.js build process with proper caching
- Dependencies installed consistently
- Clear output directory relative to project root

## Troubleshooting

### Build Still Failing?

1. **Check Root Directory**: Ensure it's set to `frontend` in Vercel dashboard
2. **Clear Build Cache**: In deployment settings, try "Redeploy" with cache cleared
3. **Check Logs**: Look for missing environment variables or dependency issues
4. **Verify Node Version**: Make sure Vercel is using Node 18+

### Environment Variables Not Working?

- Make sure they're set for the correct environment (Production/Preview/Development)
- Check that `NEXTAUTH_URL` matches your actual deployment URL
- Don't include quotes around values in Vercel dashboard

### Still Getting Errors?

Check the full build log in Vercel dashboard:
1. Go to Deployments
2. Click on the failing deployment
3. Check the "Building" step logs
4. Look for specific error messages about:
   - Missing dependencies
   - Environment variables
   - Build command failures

## Testing Locally

Before deploying, test the build locally from the `frontend/` directory:

```bash
cd frontend
npm install
npm run build
npm start
```

If this works locally, it should work on Vercel with the correct configuration.

## Additional Resources

- [Vercel Monorepo Documentation](https://vercel.com/docs/monorepos)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Environment Variables in Vercel](https://vercel.com/docs/environment-variables)
