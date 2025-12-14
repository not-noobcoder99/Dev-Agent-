/**
 * Kestra Workflow Client
 * 
 * Provides functions to trigger and monitor Kestra workflows
 */

const KESTRA_API_URL = process.env.KESTRA_API_URL || 'http://localhost:8080'
const KESTRA_API_KEY = process.env.KESTRA_API_KEY || ''

export interface KestraWorkflowInput {
  user_prompt: string
  language: string
  framework?: string
}

export interface KestraWorkflowResponse {
  id: string
  namespace: string
  flowId: string
  state: {
    current: string
    histories: any[]
  }
}

/**
 * Trigger a Kestra workflow execution
 */
export async function triggerKestraWorkflow(
  input: KestraWorkflowInput
): Promise<KestraWorkflowResponse> {
  const url = `${KESTRA_API_URL}/api/v1/executions/devagent/devagent_workflow`
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(KESTRA_API_KEY && { 'Authorization': `Bearer ${KESTRA_API_KEY}` })
    },
    body: JSON.stringify(input)
  })

  if (!response.ok) {
    throw new Error(`Kestra API error: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Get Kestra workflow execution status
 */
export async function getKestraExecutionStatus(
  executionId: string
): Promise<KestraWorkflowResponse> {
  const url = `${KESTRA_API_URL}/api/v1/executions/${executionId}`
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(KESTRA_API_KEY && { 'Authorization': `Bearer ${KESTRA_API_KEY}` })
    }
  })

  if (!response.ok) {
    throw new Error(`Kestra API error: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Get Kestra workflow execution logs
 */
export async function getKestraExecutionLogs(
  executionId: string
): Promise<any[]> {
  const url = `${KESTRA_API_URL}/api/v1/executions/${executionId}/logs`
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(KESTRA_API_KEY && { 'Authorization': `Bearer ${KESTRA_API_KEY}` })
    }
  })

  if (!response.ok) {
    throw new Error(`Kestra API error: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Check if Kestra is available
 */
export async function isKestraAvailable(): Promise<boolean> {
  try {
    const response = await fetch(`${KESTRA_API_URL}/api/v1/flows`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(KESTRA_API_KEY && { 'Authorization': `Bearer ${KESTRA_API_KEY}` })
      }
    })
    return response.ok
  } catch (error) {
    console.error('Kestra not available:', error)
    return false
  }
}
