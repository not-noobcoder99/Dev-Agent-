import type { NextApiRequest, NextApiResponse } from 'next'
import { isKestraAvailable } from '../../lib/kestra-client'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const available = await isKestraAvailable()
    
    return res.status(200).json({
      available,
      url: process.env.KESTRA_API_URL || 'http://localhost:8080',
      message: available 
        ? 'Kestra workflow orchestration is active' 
        : 'Kestra unavailable, using direct AI execution'
    })
  } catch (error) {
    return res.status(200).json({
      available: false,
      message: 'Kestra unavailable, using direct AI execution'
    })
  }
}
