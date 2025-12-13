import { NextApiRequest, NextApiResponse } from 'next';
import { MongoDBAdapter } from '../../../lib/mongodb-adapter';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if user exists
    const existingUser = await MongoDBAdapter.getUser(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password and create user
    const hashedPassword = await MongoDBAdapter.hashPassword(password);
    const user = await MongoDBAdapter.createUser({
      email,
      password: hashedPassword,
      name: name || undefined,
    });

    res.status(201).json({ 
      message: 'User created successfully',
      user: { email: user.email, name: user.name }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
}
