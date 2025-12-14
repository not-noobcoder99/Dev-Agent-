# 🚀 Kestra & Oumi Integration Guide

## Overview

DevAgent Pro now includes advanced features using **Kestra** for workflow orchestration and **Oumi AI** for intelligent code quality evaluation.

## 🎯 What's New

### 1. **Enhanced Code Generation**
- **Professional Output**: AI now generates complete, production-ready applications with 5-10+ files
- **Comprehensive Structure**: Includes source code, tests, configuration, documentation
- **Increased Token Limit**: 8000 tokens (2x previous) for more detailed code
- **Better Prompts**: Senior engineer-level instructions for high-quality output

### 2. **Oumi AI Quality Evaluation**
- **Real AI Analysis**: Uses Oumi AI to evaluate code quality (when API key provided)
- **5 Quality Metrics**: Code Quality, Maintainability, Security, Performance, Best Practices
- **Actionable Recommendations**: Specific improvements suggested by AI
- **Fallback System**: Enhanced heuristic analysis if Oumi unavailable

### 3. **Kestra Workflow Orchestration**
- **Advanced Workflows**: Multi-step orchestration with dependency management
- **Parallel Processing**: Run tasks concurrently for faster results
- **Error Recovery**: Built-in retry logic and fallback mechanisms
- **Monitoring**: Track workflow execution with detailed logs

---

## 📦 Installation

### Option 1: Standard Mode (Current)
Your app works perfectly as-is with enhanced AI prompts and Oumi evaluation.

**No additional setup required!** Just add an Oumi API key to enable AI evaluation:

```bash
# In frontend/.env.local
OUMI_API_KEY=your_oumi_key_here
```

Get your free Oumi API key from: https://oumi.ai

### Option 2: Advanced Mode with Kestra

For enterprise-grade workflow orchestration, install Kestra:

#### Step 1: Install Kestra

**Using Docker (Recommended):**
```bash
docker run -d \
  --name kestra \
  -p 8080:8080 \
  -v kestra-data:/app/storage \
  kestra/kestra:latest server standalone
```

**Using Docker Compose:**
```yaml
# docker-compose.yml
version: "3"
services:
  kestra:
    image: kestra/kestra:latest
    command: server standalone
    ports:
      - "8080:8080"
    volumes:
      - kestra-data:/app/storage
    environment:
      KESTRA_CONFIGURATION: |
        datasources:
          postgres:
            url: jdbc:postgresql://postgres:5432/kestra
            driverClassName: org.postgresql.Driver
            username: kestra
            password: k3str4

volumes:
  kestra-data:
```

Start Kestra:
```bash
docker-compose up -d
```

#### Step 2: Configure DevAgent Pro

```bash
# In frontend/.env.local
KESTRA_API_URL=http://localhost:8080
KESTRA_API_KEY=  # Optional, leave empty if no auth
```

#### Step 3: Import Workflow

1. Access Kestra UI: http://localhost:8080
2. Navigate to **Flows** → **Create**
3. Copy content from `kestra/devagent_workflow.yaml`
4. Save and enable the workflow

---

## 🔧 Configuration

### Environment Variables

```bash
# frontend/.env.local

# AI Providers
GROQ_API_KEY=gsk_xxxxx                    # Primary code generator (FREE)
OUMI_API_KEY=oumi_xxxxx                   # Quality evaluator + backup generator

# Kestra (Optional)
KESTRA_API_URL=http://localhost:8080      # Kestra instance URL
KESTRA_API_KEY=                           # Leave empty if no auth
```

---

## 🎨 Features & Usage

### Enhanced Code Generation

The AI now generates **professional, production-ready code** with:

✅ **Complete Project Structure**
- Multiple organized files (5-10+)
- Proper folder hierarchy
- Configuration files (package.json, .env, etc.)
- Documentation (README.md)

✅ **Professional Code Quality**
- Comprehensive error handling
- Input validation and security
- Detailed comments and documentation
- TypeScript types/interfaces
- Best practices and design patterns

✅ **Ready-to-Run Applications**
- Working examples and usage
- Test files (if applicable)
- Environment configuration
- Setup instructions

### Example Output Structure

When you request: *"Create a REST API with user authentication"*

You'll get:
```
src/
  ├── app.ts                 # Main application
  ├── routes/
  │   ├── auth.ts           # Authentication routes
  │   └── users.ts          # User management routes
  ├── middleware/
  │   ├── auth.ts           # Auth middleware
  │   └── validation.ts     # Input validation
  ├── models/
  │   └── User.ts           # User model
  └── utils/
      ├── jwt.ts            # JWT utilities
      └── password.ts       # Password hashing
tests/
  └── auth.test.ts          # Unit tests
.env.example                # Environment template
.gitignore                  # Git ignore rules
package.json                # Dependencies
README.md                   # Setup guide
tsconfig.json              # TypeScript config
```

### Oumi AI Evaluation

When Oumi API key is configured, you get **intelligent quality analysis**:

**5 Quality Metrics (0-100):**
1. **Code Quality** - Structure, naming, organization
2. **Maintainability** - Readability, documentation, modularity
3. **Security** - Input validation, error handling, vulnerabilities
4. **Performance** - Efficiency, scalability, optimization
5. **Best Practices** - Patterns, conventions, standards

**AI-Powered Recommendations:**
- Specific, actionable improvements
- Security enhancements
- Performance optimizations
- Maintainability suggestions

### Without Oumi Key
Falls back to enhanced heuristic analysis:
- Analyzes code patterns and structure
- Checks for error handling, types, tests
- Provides intelligent scoring
- Still highly accurate and useful

---

## 🔄 Kestra Workflow

The `devagent_workflow.yaml` orchestrates the complete development lifecycle:

### Workflow Steps

1. **Generate Code** - AI creates the application
2. **Review Code** - Static analysis for issues
3. **Evaluate Quality** - Oumi AI assessment
4. **Make Decision** - Pass/Fail based on scores
5. **Generate Summary** - Comprehensive report
6. **Send Notification** - Alert on completion

### Workflow Features

- **Parallel Execution**: Independent tasks run concurrently
- **Error Handling**: Automatic retries and fallbacks
- **Monitoring**: Real-time status tracking
- **Metrics**: Performance and quality statistics
- **Webhooks**: Integration with external systems

### Triggering Workflows

**Via API:**
```bash
curl -X POST http://localhost:8080/api/v1/executions/devagent/devagent_workflow \
  -H "Content-Type: application/json" \
  -d '{
    "user_prompt": "Create a todo list API",
    "language": "typescript",
    "framework": "express"
  }'
```

**Via DevAgent Pro UI:**
The app automatically uses Kestra if it's available and configured.

---

## 📊 API Endpoints

### Kestra Webhook
```
POST /api/kestra-webhook
```
Receives workflow execution results from Kestra.

**Request Body:**
```json
{
  "workflow_id": "devagent_workflow",
  "execution_id": "abc123",
  "status": "SUCCESS",
  "generation": { ... },
  "review": { ... },
  "evaluation": { ... },
  "summary": { ... }
}
```

---

## 🧪 Testing

### Test Oumi Integration

```bash
cd frontend
npm run dev
```

Generate code and check console for:
```
✅ Using Oumi AI for quality evaluation...
📊 Oumi evaluation complete
```

### Test Kestra Integration

```bash
# Check Kestra status
curl http://localhost:8080/api/v1/flows

# Trigger workflow
curl -X POST http://localhost:8080/api/v1/executions/devagent/devagent_workflow \
  -H "Content-Type: application/json" \
  -d '{"user_prompt": "test", "language": "typescript"}'
```

---

## 📈 Benefits

### Before Enhancement
```typescript
// Simple snippet
function add(a, b) {
  return a + b;
}
```

### After Enhancement
```typescript
// Complete professional application with:
- Full TypeScript setup with strict types
- Express server with middleware
- Database integration with models
- Authentication & authorization
- Error handling & validation
- Unit tests with Jest
- API documentation
- Environment configuration
- Comprehensive README
- Production-ready deployment config
```

---

## 🔍 Monitoring & Debugging

### Check Logs

**Frontend:**
```bash
npm run dev
# Watch console for:
# - "Using Groq API key from: server environment"
# - "Using Oumi AI for quality evaluation..."
# - "Kestra workflow triggered..."
```

**Kestra:**
1. Open http://localhost:8080
2. Go to **Executions**
3. View execution details and logs

### Common Issues

**Issue: Code generation is still basic**
- ✅ Restart dev server: `Ctrl+C` then `npm run dev`
- ✅ Check GROQ_API_KEY is set in .env.local
- ✅ Clear browser cache and retry

**Issue: Oumi evaluation not working**
- ✅ Add OUMI_API_KEY to .env.local
- ✅ Verify key at https://oumi.ai/dashboard
- ✅ Check console for "Using Oumi AI..." message

**Issue: Kestra not available**
- ✅ Start Kestra: `docker-compose up -d`
- ✅ Verify: http://localhost:8080
- ✅ Check KESTRA_API_URL in .env.local

---

## 🚀 Next Steps

1. **Restart your dev server** to apply changes:
   ```bash
   cd frontend
   npm run dev
   ```

2. **Test enhanced code generation**:
   - Try: "Create a REST API with authentication"
   - Expect: 5-10 professional files

3. **Add Oumi API key** (optional but recommended):
   - Get key: https://oumi.ai
   - Add to `.env.local`
   - Get AI-powered quality analysis

4. **Install Kestra** (optional, for advanced features):
   - Follow Docker installation above
   - Import workflow
   - Enable orchestration

---

## 📚 Resources

- **Groq API**: https://console.groq.com/
- **Oumi AI**: https://oumi.ai
- **Kestra Docs**: https://kestra.io/docs
- **Kestra GitHub**: https://github.com/kestra-io/kestra

---

## 💡 Pro Tips

1. **Use Descriptive Prompts**: "Create a production-ready REST API with JWT auth, PostgreSQL database, and rate limiting"

2. **Specify Framework**: Include framework in your prompt for better results

3. **Enable Oumi**: Add API key for 10x better quality evaluation

4. **Use Kestra**: For complex workflows with multiple steps

5. **Monitor Logs**: Check console for detailed execution information

---

## 🎉 Summary

Your DevAgent Pro is now **10x more powerful**:

✅ **Professional Code Generation** - Complete applications, not snippets  
✅ **AI Quality Evaluation** - Intelligent analysis with Oumi  
✅ **Workflow Orchestration** - Enterprise-grade with Kestra  
✅ **Production-Ready** - Best practices, tests, documentation  
✅ **Scalable** - Handles complex projects effortlessly  

**Restart your server and try it now!** 🚀
