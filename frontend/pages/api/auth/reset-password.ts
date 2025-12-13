import type { NextApiRequest, NextApiResponse } from 'next'
import { MongoDBAdapter } from '../../../lib/mongodb-adapter'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { token, password } = req.body

    if (!token || !password) {
      return res.status(400).json({ error: 'Token and password are required' })
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' })
    }

    // Reset password
    const success = await MongoDBAdapter.resetPassword(token, password)

    if (!success) {
      return res.status(400).json({ error: 'Invalid or expired reset token' })
    }

    return res.status(200).json({ message: 'Password reset successful' })
  } catch (error) {
    console.error('Reset password error:', error)
    return res.status(500).json({ error: 'Failed to reset password' })
  }
}