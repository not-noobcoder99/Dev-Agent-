# Kestra Workflow Integration

## Overview

This directory contains Kestra workflow definitions for orchestrating the DevAgent Pro pipeline.

## What is Kestra?

Kestra is an open-source orchestration and scheduling platform that helps automate complex workflows. In DevAgent Pro, it coordinates:

1. Code generation
2. Code review
3. Quality evaluation
4. Decision making
5. Summary generation

## Workflow File

`devagent_workflow.yaml` - Main workflow definition

## Workflow Steps

### 1. Generate Code
- **Task**: `generate_code`
- **Action**: Calls code generation agent
- **Input**: User prompt, language, framework
- **Output**: Generated code files

### 2. Review Code
- **Task**: `review_code`
- **Action**: Reviews generated code
- **Dependencies**: generate_code
- **Output**: Review results with issues and score

### 3. Evaluate Quality
- **Task**: `evaluate_quality`
- **Action**: Uses Oumi to evaluate quality
- **Dependencies**: review_code
- **Output**: Quality metrics and scores

### 4. Make Decision
- **Task**: `make_decision`
- **Action**: Determines if code passes quality threshold
- **Dependencies**: evaluate_quality
- **Output**: PASS or NEEDS IMPROVEMENT

### 5. Generate Summary
- **Task**: `generate_summary`
- **Action**: Creates comprehensive workflow summary
- **Dependencies**: make_decision
- **Output**: JSON summary file

### 6. Notify
- **Task**: `notify`
- **Action**: Logs completion status
- **Dependencies**: generate_summary

## Running the Workflow

### Using Kestra CLI

```bash
# Install Kestra CLI
curl -o- https://cli.kestra.io/install.sh | bash

# Start Kestra server (if needed)
kestra server standalone

# Validate workflow
kestra flow validate kestra/devagent_workflow.yaml

# Execute workflow
kestra flow run devagent_workflow \
  --inputs user_prompt="Create a REST API for tasks" \
  --inputs language="typescript"
```

### Using Kestra UI

1. Open Kestra UI: http://localhost:8080
2. Navigate to Flows
3. Import `devagent_workflow.yaml`
4. Click "Execute"
5. Enter inputs:
   - user_prompt: Your code generation request
   - language: Programming language
   - framework: Optional framework

### Using API

```bash
curl -X POST http://localhost:8080/api/v1/executions/devagent/devagent_workflow \
  -H "Content-Type: application/json" \
  -d '{
    "inputs": {
      "user_prompt": "Create a REST API for tasks",
      "language": "typescript",
      "framework": "express"
    }
  }'
```

## Workflow Inputs

| Input | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| user_prompt | STRING | Yes | - | Natural language code description |
| language | STRING | No | typescript | Programming language |
| framework | STRING | No | - | Optional framework |

## Workflow Variables

| Variable | Value | Description |
|----------|-------|-------------|
| output_dir | ./generated | Directory for generated code |
| review_threshold | 70 | Minimum score to pass (0-100) |

## Workflow Outputs

Each task produces outputs that can be accessed by downstream tasks:

```yaml
# Access generation results
{{ outputs.generate_code.generation_result }}

# Access review score
{{ outputs.review_code.review_result.score }}

# Access evaluation results
{{ outputs.evaluate_quality.eval_result }}
```

## Decision Logic

The workflow makes decisions based on quality scores:

```
IF review_score >= 70 AND eval_score >= 70:
  DECISION: PASS ✅
ELSE:
  DECISION: NEEDS IMPROVEMENT ⚠️
```

## Summary Output

The workflow generates a comprehensive summary saved to:
`./generated/workflow-summary.json`

Example structure:
```json
{
  "workflow_id": "devagent_workflow",
  "execution_id": "abc123",
  "timestamp": "2025-12-13T10:30:00Z",
  "input": {
    "prompt": "Create a REST API",
    "language": "typescript"
  },
  "results": {
    "generation": { ... },
    "review": { ... },
    "evaluation": { ... },
    "decision": "PASS"
  },
  "metrics": {
    "total_duration": "45s",
    "files_generated": 3,
    "issues_found": 2,
    "quality_score": 85
  }
}
```

## Error Handling

The workflow includes error handling:
- Failed tasks are logged
- Summary generation runs even if decision fails
- Error details included in execution logs

## Monitoring

View workflow execution:
1. Kestra UI: http://localhost:8080/executions
2. Check logs for each task
3. Download summary JSON

## Integration with Frontend

The frontend can:
1. Trigger workflows via API
2. Poll for execution status
3. Display results from summary JSON
4. Show real-time progress

## Alternative: Simplified Workflow

If Kestra is not available, use the simplified orchestration script:

```bash
# Run complete workflow
npm run workflow:simple
```

This runs all steps sequentially without Kestra.

## Best Practices

1. **Validation**: Always validate workflow before running
2. **Testing**: Test with simple prompts first
3. **Monitoring**: Check Kestra UI for execution status
4. **Logging**: Review task logs for debugging
5. **Thresholds**: Adjust review_threshold based on needs

## Troubleshooting

### Workflow fails at generation
- Check TOGETHER_API_KEY in .env
- Verify network connectivity
- Review generation logs

### Review task fails
- Ensure generated files exist
- Check file permissions
- Verify reviewer configuration

### Evaluation fails
- Check OUMI_API_KEY
- Verify Python environment
- Review evaluation logs

### Decision always fails
- Lower review_threshold
- Check score calculations
- Review quality metrics

## Advanced Features

### Scheduled Execution

Enable scheduled runs:
```yaml
triggers:
  - id: scheduled
    type: io.kestra.core.models.triggers.types.Schedule
    cron: "0 0 * * *"
    disabled: false  # Enable trigger
```

### Notifications

Add email/Slack notifications:
```yaml
- id: notify_slack
  type: io.kestra.plugins.notifications.slack.SlackExecution
  url: "{{ secrets.SLACK_WEBHOOK }}"
  channel: "#devagent"
```

### Parallel Execution

Run multiple generations in parallel:
```yaml
- id: parallel_generation
  type: io.kestra.core.tasks.flows.Parallel
  tasks:
    - id: gen_typescript
      type: io.kestra.core.tasks.scripts.Node
      ...
    - id: gen_python
      type: io.kestra.core.tasks.scripts.Python
      ...
```
