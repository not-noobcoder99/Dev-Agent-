import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { MongoDBAdapter } from '../../../lib/mongodb-adapter'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions)

  if (!session?.user?.email) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    if (req.method === 'GET') {
      // Get user profile
      const dbUser = await MongoDBAdapter.getUser(session.user.email) as any
      
      if (!dbUser) {
        return res.status(404).json({ error: 'User not found' })
      }

      // Return user data without sensitive information
      return res.status(200).json({
        email: dbUser.email,
        name: dbUser.name,
        image: dbUser.image,
        emailVerified: dbUser.emailVerified,
        preferences: dbUser.preferences,
        createdAt: dbUser.createdAt
      })
    }

    if (req.method === 'PUT') {
      // Update user profile
      const { name, image, preferences } = req.body

      const updates: any = { updatedAt: new Date() }
      if (name !== undefined) updates.name = name
      if (image !== undefined) updates.image = image
      if (preferences !== undefined) updates.preferences = preferences

      const success = await MongoDBAdapter.updateUser(session.user.email, updates)

      if (!success) {
        return res.status(500).json({ error: 'Failed to update profile' })
      }

      return res.status(200).json({ message: 'Profile updated successfully' })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('Profile API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}