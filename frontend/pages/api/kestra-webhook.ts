import type { NextApiRequest, NextApiResponse } from 'next'

/**
 * Kestra Webhook Integration
 * 
 * This endpoint receives workflow execution results from Kestra
 * and processes them for display in the DevAgent Pro dashboard
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const {
      workflow_id,
      execution_id,
      status,
      generation,
      review,
      evaluation,
      summary
    } = req.body

    console.log('📨 Received Kestra webhook:', {
      workflow_id,
      execution_id,
      status
    })

    // Validate webhook data
    if (!workflow_id || !execution_id) {
      return res.status(400).json({ 
        error: 'Missing required fields: workflow_id, execution_id' 
      })
    }

    // Process the workflow results
    const result = {
      success: true,
      workflow_id,
      execution_id,
      status,
      timestamp: new Date().toISOString(),
      data: {
        generation,
        review,
        evaluation,
        summary
      }
    }

    // Here you could save to database, send notifications, etc.
    console.log('✅ Kestra workflow processed successfully')

    return res.status(200).json(result)

  } catch (error) {
    console.error('❌ Kestra webhook error:', error)
    return res.status(500).json({
      error: 'Failed to process Kestra webhook',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
