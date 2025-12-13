import type { NextApiRequest, NextApiResponse } from 'next'
import { MongoDBAdapter } from '../../../lib/mongodb-adapter'
import crypto from 'crypto'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ error: 'Email is required' })
    }

    // Check if user exists
    const user = await MongoDBAdapter.getUser(email)
    if (!user) {
      // Don't reveal if user exists or not for security
      return res.status(200).json({ 
        message: 'If an account exists, a password reset link has been sent' 
      })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const expiry = new Date(Date.now() + 3600000) // 1 hour

    // Save reset token
    await MongoDBAdapter.setResetToken(email, resetToken, expiry)

    // In production, send email here
    // For now, we'll return the token (remove this in production!)
    const resetLink = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`
    
    console.log('Password reset link:', resetLink)

    // TODO: Send email with reset link
    // await sendEmail({
    //   to: email,
    //   subject: 'Password Reset Request',
    //   html: `Click here to reset your password: ${resetLink}`
    // })

    return res.status(200).json({ 
      message: 'If an account exists, a password reset link has been sent',
      // Remove in production:
      resetLink 
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return res.status(500).json({ error: 'Failed to process request' })
  }
}