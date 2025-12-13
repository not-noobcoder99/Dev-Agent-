# API Integration Guide

## Overview

DevAgent Pro now supports **real AI-powered code generation** using Together AI's LLaMA 3.1 70B model. This guide explains how to set up and use the API integrations.

## ✅ What's Integrated

### 1. **Together AI Code Generation** 🤖
- **Status**: ✅ Fully Integrated
- **Model**: `meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo`
- **Purpose**: AI-powered code generation from natural language
- **Features**:
  - Multi-file code generation
  - Framework-specific code (Express, Django, FastAPI, etc.)
  - Production-ready code with error handling
  - Smart file parsing and organization

### 2. **Static Code Review** 🔍
- **Status**: ✅ Fully Integrated
- **Purpose**: Automated code analysis and issue detection
- **Features**:
  - Syntax and pattern analysis
  - Security vulnerability detection
  - Best practices checking
  - Performance recommendations
  - Severity-based issue classification (Critical, Major, Minor, Info)

### 3. **Quality Evaluation** 📊
- **Status**: ✅ Fully Integrated
- **Purpose**: Multi-dimensional code quality scoring
- **Metrics**:
  - Code Quality (30% weight)
  - Maintainability (20% weight)
  - Security (20% weight)
  - Performance (15% weight)
  - Best Practices (15% weight)

## 🚀 Quick Start

### Option 1: Use Your Own API Key (Recommended)

1. **Get a Together AI API Key**
   - Visit: https://api.together.xyz/signup
   - Sign up for a free account
   - Navigate to Settings → API Keys
   - Create a new API key

2. **Configure in DevAgent Pro**
   - Click "⚙️ Settings" in the top navigation
   - Enter your Together AI API key
   - Click "Save Settings"
   - Keys are stored securely in your browser

3. **Start Generating Code**
   - Go back to the dashboard
   - Enter your prompt (e.g., "Create a REST API for task management")
   - Select language and framework
   - Click "Generate Code" 🚀

### Option 2: Use Mock Mode (No API Key)

If you don't have an API key, the app automatically falls back to **enhanced mock generation**:
- Generates realistic code templates
- Includes framework-specific boilerplate
- Creates multiple files (routes, models, configs)
- Adds comprehensive READMEs

## 🔑 API Key Management

### Frontend Settings Page

```
http://localhost:3000/settings
```

Features:
- ✅ Secure local storage (never sent to our servers)
- ✅ Show/hide API keys toggle
- ✅ Test connection buttons
- ✅ Clear all keys option
- ✅ Links to provider dashboards

### Environment Variables (Backend)

Create a `.env` file in the root directory:

```env
# Together AI (Code Generation)
TOGETHER_API_KEY=your_key_here

# Optional: Oumi (Quality Evaluation)
OUMI_API_KEY=your_key_here

# Optional: Kestra (Workflow Orchestration)
KESTRA_API_URL=http://localhost:8080
```

## 📡 API Endpoints

### POST `/api/generate`

**Request:**
```json
{
  "prompt": "Create a REST API for task management",
  "language": "typescript",
  "framework": "express",
  "apiKey": "optional_api_key_from_frontend"
}
```

**Response:**
```json
{
  "success": true,
  "generation": {
    "files": [
      {
        "path": "src/app.ts",
        "content": "...",
        "language": "typescript"
      }
    ],
    "summary": "Generated 3 files...",
    "timestamp": "2024-01-01T00:00:00.000Z"
  },
  "review": {
    "score": 85,
    "summary": {
      "total": 5,
      "critical": 0,
      "major": 1,
      "minor": 3,
      "info": 1
    },
    "issues": [...]
  },
  "evaluation": {
    "overall_score": 82.5,
    "metrics": {
      "code_quality": 85,
      "maintainability": 80,
      "security": 90,
      "performance": 78,
      "best_practices": 79
    }
  },
  "summary": {
    "workflow_id": "devagent_workflow",
    "metrics": {...}
  }
}
```

## 🎨 Code Generation Examples

### TypeScript + Express API

**Prompt:**
```
Create a REST API for user authentication with JWT tokens
```

**Result:**
- `src/app.ts` - Express server setup
- `src/routes/auth.ts` - Authentication routes
- `src/middleware/auth.ts` - JWT middleware
- `README.md` - Setup instructions

### Python + FastAPI

**Prompt:**
```
Build a CRUD API for managing tasks with database
```

**Result:**
- `main.py` - FastAPI application
- `models.py` - Pydantic models
- `database.py` - Database connection
- `requirements.txt` - Dependencies

### React Component

**Prompt:**
```
Create a user profile card component with avatar and edit button
```

**Result:**
- `UserProfile.tsx` - Component implementation
- `UserProfile.module.css` - Styles
- `UserProfile.stories.tsx` - Storybook stories

## 🔍 Code Review Features

### Static Analysis Checks

**TypeScript/JavaScript:**
- ✅ Console.log detection
- ✅ TODO comment tracking
- ✅ Error handling verification
- ✅ Export statement checking

**Python:**
- ✅ Print statement detection
- ✅ Exception handling verification
- ✅ PEP 8 compliance hints

### AI-Powered Review (Coming Soon)

When Together AI API is available, additional AI review includes:
- Deep security vulnerability analysis
- Performance bottleneck detection
- Code smell identification
- Refactoring suggestions

## 📊 Quality Metrics

### Score Calculation

```javascript
Overall Score = (
  Code Quality × 30% +
  Maintainability × 20% +
  Security × 20% +
  Performance × 15% +
  Best Practices × 15%
)
```

### Recommendations

Based on scores, you'll receive actionable recommendations:
- 🟢 **90-100**: Excellent! Production-ready
- 🟡 **70-89**: Good with minor improvements
- 🟠 **50-69**: Needs significant refactoring
- 🔴 **0-49**: Major issues, not production-ready

## 🛠️ Advanced Configuration

### Custom API Endpoints

Edit `frontend/pages/api/generate.ts` to customize:

```typescript
const API_ENDPOINTS = {
  togetherAI: 'https://api.together.xyz/v1/chat/completions',
  oumi: 'https://api.oumi.ai/v1/evaluate',
  kestra: 'http://localhost:8080/api/v1/executions'
}
```

### Model Selection

Change the AI model in the API call:

```typescript
model: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo'
// Other options:
// - 'meta-llama/Llama-2-70b-chat-hf'
// - 'mistralai/Mixtral-8x7B-Instruct-v0.1'
```

### Temperature & Tokens

Adjust generation parameters:

```typescript
{
  temperature: 0.7,  // 0.0-1.0 (lower = more deterministic)
  max_tokens: 4000,  // Max output length
  top_p: 0.9,        // Nucleus sampling
}
```

## 🔒 Security Best Practices

### API Key Storage

1. **Frontend**: Keys stored in `localStorage`
   - Never sent to DevAgent servers
   - Only sent directly to API providers
   - Can be cleared anytime

2. **Backend**: Use environment variables
   - Add `.env` to `.gitignore`
   - Never commit API keys
   - Use separate keys for dev/prod

### Rate Limiting

Together AI free tier limits:
- 60 requests per minute
- 1M tokens per day

Consider implementing:
- Request queuing
- User rate limiting
- Error handling for quota exceeded

## 📈 Usage Tracking

Monitor your API usage:

1. **Together AI Dashboard**
   - https://api.together.xyz/dashboard
   - View request count
   - Monitor token usage
   - Check billing

2. **DevAgent Pro Stats**
   - Session history (last 10)
   - Total files generated
   - Languages used
   - Quality scores

## 🐛 Troubleshooting

### API Key Not Working

```
Error: Together AI API error: Unauthorized
```

**Solutions:**
1. Verify key is correct (check for extra spaces)
2. Ensure key has proper permissions
3. Check if free tier quota is exhausted
4. Try generating a new API key

### Slow Generation

```
Taking longer than expected...
```

**Solutions:**
1. Simplify your prompt
2. Reduce max_tokens setting
3. Check Together AI status page
4. Use mock mode for testing

### Parse Error

```
Failed to parse generated code
```

**Solutions:**
1. Try a more specific prompt
2. Specify the framework explicitly
3. Regenerate (sometimes AI output varies)
4. Check API response in browser console

## 📞 Support

- **Documentation**: Check `/DOCUMENTATION.md`
- **Issues**: GitHub Issues
- **Discord**: Join our community
- **Email**: support@devagent.pro

## 🚀 Next Steps

1. ✅ Get your Together AI API key
2. ✅ Configure in Settings
3. ✅ Generate your first code
4. ✅ Explore different languages/frameworks
5. ✅ Share your results!

---

**Version**: 2.0  
**Last Updated**: December 2024  
**Status**: Production Ready ✅
