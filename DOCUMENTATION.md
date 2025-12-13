# 📚 DevAgent Pro Documentation

## Table of Contents

1. [Getting Started](#getting-started)
2. [Architecture](#architecture)
3. [Components](#components)
4. [API Reference](#api-reference)
5. [Deployment](#deployment)
6. [Development](#development)
7. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.9+
- npm or yarn
- API keys for sponsor services

### Quick Start

```bash
# Clone repository
git clone https://github.com/not-noobcoder99/Dev-Agent-.git
cd Dev-Agent-

# Install dependencies
npm install
cd frontend && npm install && cd ..
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your API keys

# Run development server
npm run dev
```

Visit http://localhost:3000

---

## Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────┐
│                     User Interface                       │
│                  (Next.js + Vercel)                     │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  API Layer (Next.js API)                │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
┌──────────┐  ┌──────────┐  ┌──────────┐
│  Code    │  │  Review  │  │  Eval    │
│  Gen     │→ │  Engine  │→ │  Service │
│ (Cline)  │  │(CodeRabbit)│ │ (Oumi)   │
└──────────┘  └──────────┘  └──────────┘
        │            │            │
        └────────────┼────────────┘
                     ▼
        ┌───────────────────────┐
        │ Workflow Orchestration │
        │      (Kestra)         │
        └───────────────────────┘
```

### Data Flow

1. **Input**: User submits prompt + language selection
2. **Generation**: Together AI/Cline generates code
3. **Review**: CodeRabbit analyzes for issues
4. **Evaluation**: Oumi scores quality metrics
5. **Decision**: Kestra determines pass/fail
6. **Output**: Results displayed on Vercel dashboard

---

## Components

### 1. Code Generation Agent

**Location**: `agent/generate_code.ts`

**Purpose**: Generate production-ready code from natural language

**Key Features**:
- Natural language processing
- Multi-language support
- Structured file output
- Context-aware generation

**Usage**:
```bash
npm run agent:generate -- "Create a REST API" typescript express
```

**API Integration**:
- Together AI for LLM inference
- Fallback to mock generation for testing

### 2. Code Review Handler

**Location**: `agent/review_handler.ts`

**Purpose**: Automated code quality analysis

**Key Features**:
- Static analysis
- AI-powered deep review
- Issue categorization (critical/major/minor/info)
- Actionable suggestions

**Usage**:
```bash
npm run agent:review
```

**Checks**:
- Security vulnerabilities
- Code smells
- Best practices
- Style consistency
- Performance issues

### 3. Quality Evaluator

**Location**: `eval/oumi_eval.py`

**Purpose**: Comprehensive quality scoring

**Key Features**:
- Multi-dimensional metrics
- ML-based evaluation
- Recommendation generation
- Trend analysis

**Usage**:
```bash
python eval/oumi_eval.py ./generated 85
```

**Metrics**:
- Code Quality (30%)
- Maintainability (20%)
- Security (20%)
- Performance (15%)
- Best Practices (15%)

### 4. Workflow Orchestrator

**Location**: `kestra/devagent_workflow.yaml`

**Purpose**: Pipeline automation and decision-making

**Key Features**:
- Step sequencing
- Error handling
- Decision logic
- Summary generation

**Usage**:
```bash
kestra flow run devagent_workflow
```

**Workflow Steps**:
1. generate_code
2. review_code
3. evaluate_quality
4. make_decision
5. generate_summary
6. notify

### 5. Frontend Dashboard

**Location**: `frontend/`

**Purpose**: User interface and visualization

**Key Features**:
- Real-time updates
- Code diff viewer
- Interactive metrics
- Responsive design

**Tech Stack**:
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS

---

## API Reference

### POST /api/generate

Generate and review code based on prompt.

**Request**:
```json
{
  "prompt": "Create a REST API for tasks",
  "language": "typescript",
  "framework": "express"
}
```

**Response**:
```json
{
  "success": true,
  "generation": {
    "files": [...],
    "summary": "...",
    "timestamp": "..."
  },
  "review": {
    "score": 85,
    "issues": [...],
    "summary": {...}
  },
  "evaluation": {
    "overall_score": 82.5,
    "metrics": {...},
    "recommendations": [...]
  },
  "summary": {
    "workflow_id": "...",
    "execution_id": "...",
    "metrics": {...},
    "results": {...}
  }
}
```

**Error Response**:
```json
{
  "error": "Error message",
  "message": "Detailed error description"
}
```

---

## Deployment

### Vercel Deployment

1. **Connect Repository**:
   - Link GitHub repo to Vercel
   - Select `Dev-Agent-` repository

2. **Configure Build**:
   - Framework: Next.js
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`

3. **Environment Variables**:
   ```
   TOGETHER_API_KEY=your_key
   CODERABBIT_API_KEY=your_key
   OUMI_API_KEY=your_key
   KESTRA_API_KEY=your_key
   NEXT_PUBLIC_API_URL=https://your-domain.vercel.app
   ```

4. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete
   - Access via provided URL

### Custom Domain

1. Add domain in Vercel dashboard
2. Update DNS records:
   ```
   A     @    76.76.21.21
   CNAME www  cname.vercel-dns.com
   ```
3. Wait for DNS propagation
4. Enable HTTPS (automatic)

---

## Development

### Project Structure

```
Dev-Agent-/
├── agent/               # Code generation & review
│   ├── generate_code.ts
│   ├── review_handler.ts
│   └── cline-flow.md
├── eval/                # Quality evaluation
│   └── oumi_eval.py
├── kestra/              # Workflow orchestration
│   ├── devagent_workflow.yaml
│   └── README.md
├── frontend/            # Next.js application
│   ├── pages/
│   ├── components/
│   ├── styles/
│   └── public/
├── demo/                # Demo materials
│   └── demo-script.md
├── PRD.md               # Product requirements
├── README.md            # Main documentation
└── package.json         # Dependencies
```

### Adding New Features

1. **New Code Generator**:
   - Add handler to `agent/generate_code.ts`
   - Update language support
   - Add tests

2. **New Review Rule**:
   - Add to `staticAnalysis()` in `review_handler.ts`
   - Define severity and suggestion
   - Test on sample code

3. **New Evaluation Metric**:
   - Add to `_mock_evaluate()` in `oumi_eval.py`
   - Update scoring weights
   - Document metric calculation

4. **New Frontend Component**:
   - Create in `frontend/components/`
   - Export from component file
   - Import in pages
   - Style with Tailwind

### Testing

```bash
# Test code generation
npm run agent:generate -- "Test prompt" typescript

# Test code review
npm run agent:review

# Test evaluation
python eval/oumi_eval.py ./generated

# Test frontend
cd frontend && npm run dev

# Run full workflow
npm run workflow:simple
```

---

## Troubleshooting

### Common Issues

#### 1. API Key Errors

**Problem**: `API key not found` or `Unauthorized`

**Solution**:
- Check `.env` file exists
- Verify API keys are correct
- Ensure no extra spaces in keys
- Restart dev server after changes

#### 2. Generation Fails

**Problem**: Code generation returns empty or errors

**Solution**:
- Check Together AI API quota
- Verify prompt is clear and specific
- Try with shorter prompt
- Use mock mode for testing

#### 3. Frontend Build Fails

**Problem**: `npm run build` errors

**Solution**:
```bash
cd frontend
rm -rf node_modules .next
npm install
npm run build
```

#### 4. Kestra Workflow Not Running

**Problem**: Workflow validation fails

**Solution**:
- Check YAML syntax
- Verify task dependencies
- Ensure Kestra is running
- Check logs for errors

#### 5. Review Returns No Issues

**Problem**: Review always shows 0 issues

**Solution**:
- Generate more complex code
- Check review configuration
- Verify CodeRabbit integration
- Try with known bad code

### Debug Mode

Enable verbose logging:

```bash
# In .env
DEBUG=true
LOG_LEVEL=debug

# Run with logs
npm run agent:generate -- "Test" typescript 2>&1 | tee generation.log
```

### Getting Help

1. Check documentation
2. Search GitHub issues
3. Review demo script
4. Contact maintainers

---

## Best Practices

### For Users

1. **Clear Prompts**: Be specific about requirements
2. **Appropriate Language**: Choose right language for task
3. **Review Results**: Always check generated code
4. **Iterate**: Use suggestions to improve prompts

### For Developers

1. **Code Style**: Follow TypeScript/Python conventions
2. **Error Handling**: Always handle errors gracefully
3. **Documentation**: Comment complex logic
4. **Testing**: Test before committing
5. **Performance**: Optimize for speed

### For Deployment

1. **Environment**: Use production API keys
2. **Monitoring**: Set up error tracking
3. **Backups**: Regular data backups
4. **Security**: Keep dependencies updated
5. **Scaling**: Monitor usage and scale accordingly

---

## Changelog

### v1.0.0 (2025-12-13)
- Initial release
- Code generation with Cline/Together AI
- Automated review with CodeRabbit
- Workflow orchestration with Kestra
- Quality evaluation with Oumi
- Frontend dashboard on Vercel

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT License - see [LICENSE](LICENSE) file.

## Contact

- GitHub: [@not-noobcoder99](https://github.com/not-noobcoder99)
- Issues: [GitHub Issues](https://github.com/not-noobcoder99/Dev-Agent-/issues)
