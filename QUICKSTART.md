# 🚀 Quick Start Guide

Get DevAgent Pro running in 5 minutes!

## Step 1: Prerequisites Check

Ensure you have:
- ✅ Node.js 18+ (`node --version`)
- ✅ Python 3.9+ (`python --version`)
- ✅ npm or yarn (`npm --version`)

## Step 2: Installation

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..

# Install Python dependencies
pip install -r requirements.txt
```

## Step 3: Environment Setup

```bash
# Copy environment template
cp .env.example .env
```

Edit `.env` and add your API keys:
```env
TOGETHER_API_KEY=your_key_here
CODERABBIT_API_KEY=your_key_here
OUMI_API_KEY=your_key_here
KESTRA_API_KEY=your_key_here
```

**Don't have API keys?** The system works in mock mode for testing!

## Step 4: Test the Agent

```bash
# Generate code
npm run agent:generate -- "Create a REST API for tasks" typescript

# Review the code
npm run agent:review

# Evaluate quality
python eval/oumi_eval.py ./generated
```

## Step 5: Start the Dashboard

```bash
# Start development server
cd frontend
npm run dev
```

Open http://localhost:3000 in your browser!

## Step 6: Try It Out

1. Enter a prompt: "Create a REST API for task management"
2. Select language: TypeScript
3. Click "Generate Code"
4. Watch the magic happen!

## Next Steps

- 📖 Read [DOCUMENTATION.md](DOCUMENTATION.md) for details
- 🎬 Check [demo-script.md](demo/demo-script.md) for presentation guide
- 🚀 Deploy to Vercel (see [VERCEL.md](frontend/VERCEL.md))
- 🤝 Contribute (see [CONTRIBUTING.md](CONTRIBUTING.md))

## Troubleshooting

**Port already in use?**
```bash
cd frontend
PORT=3001 npm run dev
```

**API errors?**
- Check `.env` file exists
- Verify API keys (or run in mock mode)
- Restart dev server

**Build errors?**
```bash
rm -rf node_modules frontend/node_modules
npm install
cd frontend && npm install
```

## Quick Commands

```bash
# Generate code
npm run agent:generate -- "your prompt" [language]

# Review code
npm run agent:review

# Evaluate quality
npm run eval

# Start frontend
npm run dev

# Build for production
npm run build

# Validate Kestra workflow
npm run kestra:flow
```

## Architecture at a Glance

```
📝 User Input
    ↓
🤖 Code Generation (Cline/Together AI)
    ↓
🔍 Code Review (CodeRabbit)
    ↓
⚡ Workflow Orchestration (Kestra)
    ↓
📊 Quality Evaluation (Oumi)
    ↓
✨ Dashboard (Vercel)
```

## Demo Flow

1. **Input**: "Create a REST API with auth"
2. **Generate**: AI creates structured code
3. **Review**: Finds 3 minor issues
4. **Evaluate**: 85/100 quality score
5. **Decide**: PASS ✅
6. **Display**: Beautiful dashboard

## Support

- 📫 GitHub Issues
- 📖 Documentation
- 💬 Discussions

---

**Ready to build? Let's go! 🚀**
