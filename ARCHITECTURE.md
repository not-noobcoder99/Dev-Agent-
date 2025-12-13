# 🏗️ DevAgent Pro Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                           │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Next.js Frontend (Vercel)                    │  │
│  │  • React Components                                       │  │
│  │  • Tailwind CSS Styling                                   │  │
│  │  • Real-time Dashboard                                    │  │
│  │  • Code Viewer                                            │  │
│  └─────────────────────┬────────────────────────────────────┘  │
└────────────────────────┼──────────────────────────────────────┘
                         │ HTTP/REST
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API LAYER                                 │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Next.js API Routes                           │  │
│  │  • /api/generate - Main workflow endpoint                │  │
│  │  • Request validation                                     │  │
│  │  • Response formatting                                    │  │
│  └─────────────────────┬────────────────────────────────────┘  │
└────────────────────────┼──────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   STEP 1     │  │   STEP 2     │  │   STEP 3     │
│              │  │              │  │              │
│  Code Gen    │→ │  Code Review │→ │  Evaluation  │
│              │  │              │  │              │
│ ┌──────────┐ │  │ ┌──────────┐ │  │ ┌──────────┐ │
│ │ Together │ │  │ │CodeRabbit│ │  │ │  Oumi    │ │
│ │   AI     │ │  │ │   API    │ │  │ │   API    │ │
│ │          │ │  │ │          │ │  │ │          │ │
│ │ LLM for  │ │  │ │ Static + │ │  │ │ Quality  │ │
│ │ code     │ │  │ │ AI-based │ │  │ │ metrics  │ │
│ │ generation│ │  │ │ analysis │ │  │ │ scoring  │ │
│ └──────────┘ │  │ └──────────┘ │  │ └──────────┘ │
│              │  │              │  │              │
│  Cline-      │  │  Issue       │  │  Multi-      │
│  inspired    │  │  detection   │  │  dimensional │
│  workflow    │  │  Suggestions │  │  evaluation  │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                 │
       └─────────────────┼─────────────────┘
                         │
                         ▼
        ┌────────────────────────────────┐
        │   WORKFLOW ORCHESTRATION       │
        │                                │
        │      ┌──────────────┐         │
        │      │   Kestra     │         │
        │      │   Engine     │         │
        │      │              │         │
        │      │ • Sequencing │         │
        │      │ • Decision   │         │
        │      │ • Summary    │         │
        │      │ • Monitoring │         │
        │      └──────────────┘         │
        └────────────────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────┐
        │         OUTPUT & STORAGE       │
        │                                │
        │  • Generated code files        │
        │  • Review reports              │
        │  • Evaluation results          │
        │  • Workflow summaries          │
        │  • JSON artifacts              │
        └────────────────────────────────┘
```

## Component Details

### 1. User Interface Layer

**Technology**: Next.js 14, React 18, TypeScript, Tailwind CSS

**Components**:
- `Header` - Navigation and branding
- `PromptInput` - User input form
- `GeneratedCode` - Code display with tabs
- `ReviewResults` - Issue visualization
- `EvaluationResults` - Quality metrics
- `WorkflowSummary` - Final decision

**Features**:
- Responsive design
- Real-time updates
- Code syntax highlighting
- Interactive metrics

### 2. API Layer

**Technology**: Next.js API Routes

**Endpoints**:
- `POST /api/generate` - Main workflow trigger

**Responsibilities**:
- Request validation
- Workflow coordination
- Error handling
- Response formatting

### 3. Code Generation

**Technology**: Together AI, TypeScript

**Process**:
1. Parse natural language prompt
2. Generate system prompt
3. Call LLM API
4. Parse response
5. Create structured files

**Output**: Multiple code files with proper structure

### 4. Code Review

**Technology**: AI-powered analysis, TypeScript

**Analysis Types**:
- **Static Analysis**: Pattern-based checks
- **AI Review**: Deep semantic analysis

**Checks**:
- Security vulnerabilities
- Code quality issues
- Best practice violations
- Performance concerns

**Output**: Scored report with actionable suggestions

### 5. Quality Evaluation

**Technology**: Oumi AI, Python

**Metrics**:
- Code Quality (30%)
- Maintainability (20%)
- Security (20%)
- Performance (15%)
- Best Practices (15%)

**Output**: Multi-dimensional quality score

### 6. Workflow Orchestration

**Technology**: Kestra

**Workflow**:
```yaml
generate_code → review_code → evaluate_quality 
    → make_decision → generate_summary → notify
```

**Features**:
- Dependency management
- Error handling
- Decision logic
- Summary generation

## Data Flow

### Request Flow

```
1. User submits prompt
   ↓
2. Frontend validates input
   ↓
3. POST to /api/generate
   ↓
4. Generate code (Together AI)
   ↓
5. Review code (CodeRabbit logic)
   ↓
6. Evaluate quality (Oumi)
   ↓
7. Make decision (Kestra logic)
   ↓
8. Return results
   ↓
9. Display on dashboard
```

### Response Flow

```json
{
  "generation": {
    "files": [...],
    "summary": "..."
  },
  "review": {
    "score": 85,
    "issues": [...]
  },
  "evaluation": {
    "overall_score": 82.5,
    "metrics": {...}
  },
  "summary": {
    "decision": "PASS ✅",
    "metrics": {...}
  }
}
```

## Integration Points

### 1. Together AI Integration

```typescript
fetch('https://api.together.xyz/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${TOGETHER_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',
    messages: [...],
    temperature: 0.7,
    max_tokens: 4000
  })
})
```

### 2. CodeRabbit Integration

- Static analysis engine
- Pattern-based detection
- Severity classification
- Suggestion generation

### 3. Kestra Integration

```yaml
tasks:
  - id: generate_code
    type: io.kestra.core.tasks.scripts.Node
  - id: review_code
    dependsOn: [generate_code]
  - id: evaluate_quality
    dependsOn: [review_code]
```

### 4. Oumi Integration

```python
response = requests.post(
  'https://api.oumi.ai/evaluate',
  headers={'Authorization': f'Bearer {OUMI_API_KEY}'},
  json={'task': 'code_quality_evaluation', ...}
)
```

### 5. Vercel Integration

- Automatic deployment
- Edge functions
- Global CDN
- HTTPS by default

## Scalability

### Horizontal Scaling

- Serverless functions (Vercel)
- Stateless API design
- Distributed caching

### Vertical Scaling

- API rate limiting
- Queue-based processing
- Batch operations

### Performance Optimization

- Code splitting
- Lazy loading
- Response caching
- Edge caching (Vercel)

## Security

### API Security

- API key authentication
- Rate limiting
- Input validation
- Output sanitization

### Data Security

- No persistent storage of code
- Temporary file system
- Secure API communication (HTTPS)
- Environment variable protection

## Monitoring

### Application Monitoring

- Error tracking
- Performance metrics
- API usage statistics

### Workflow Monitoring

- Execution logs (Kestra)
- Task duration
- Success/failure rates
- Decision patterns

## Future Architecture

### Phase 2 Enhancements

1. **Database Layer**
   - PostgreSQL for persistence
   - Redis for caching
   - User session management

2. **Authentication**
   - OAuth integration
   - User accounts
   - API key management

3. **Advanced Features**
   - WebSocket for real-time updates
   - Queue system for heavy jobs
   - Multi-tenancy support

4. **IDE Integration**
   - VS Code extension
   - LSP server
   - Direct code insertion

## Technology Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Next.js 14, React, TypeScript | User interface |
| Styling | Tailwind CSS | Responsive design |
| API | Next.js API Routes | Backend endpoints |
| Agent | TypeScript, Node.js | Code generation |
| Review | TypeScript, AI | Code analysis |
| Evaluation | Python, Oumi | Quality scoring |
| Orchestration | Kestra YAML | Workflow management |
| AI Compute | Together AI | LLM inference |
| Deployment | Vercel | Hosting & CDN |

---

This architecture provides a solid foundation for a production-grade AI development assistant while maintaining simplicity and hackathon feasibility.
