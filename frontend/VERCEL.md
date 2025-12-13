# Vercel Deployment

This project is configured for deployment on Vercel.

## Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/not-noobcoder99/Dev-Agent-)

## Manual Deployment

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

## Production Deployment

```bash
vercel --prod
```

## Environment Variables

Set these in your Vercel project settings:

- `TOGETHER_API_KEY` - Together AI API key
- `CODERABBIT_API_KEY` - CodeRabbit API key
- `OUMI_API_KEY` - Oumi API key
- `KESTRA_API_KEY` - Kestra API key
- `NEXT_PUBLIC_API_URL` - Public API URL

## Build Configuration

The project uses the following build settings:

- **Framework**: Next.js
- **Build Command**: `cd frontend && npm install && npm run build`
- **Output Directory**: `frontend/.next`
- **Install Command**: `npm install`
- **Dev Command**: `cd frontend && npm run dev`

## Auto Deployments

Vercel automatically deploys:
- **Production**: Commits to `main` branch
- **Preview**: Pull requests and other branches

## Custom Domains

Add custom domains in Vercel dashboard:
1. Go to Project Settings
2. Navigate to Domains
3. Add your domain
4. Update DNS records as instructed

## Performance

Vercel provides:
- Global CDN
- Automatic HTTPS
- Edge caching
- Serverless functions
- Analytics

## Monitoring

View deployment logs and analytics:
- Vercel Dashboard: https://vercel.com/dashboard
- Runtime Logs: Available in deployment details
- Analytics: Vercel Analytics (if enabled)
