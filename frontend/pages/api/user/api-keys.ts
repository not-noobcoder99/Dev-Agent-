import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { MongoDBAdapter } from '../../../lib/mongodb-adapter';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.email) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const email = session.user.email;

  if (req.method === 'GET') {
    try {
      const apiKeys = await MongoDBAdapter.getApiKeys(email);
      
      // Return masked keys for security
      const maskedKeys = apiKeys ? {
        togetherAI: apiKeys.togetherAI ? `${apiKeys.togetherAI.slice(0, 8)}...${apiKeys.togetherAI.slice(-4)}` : undefined,
        codeRabbit: apiKeys.codeRabbit ? `${apiKeys.codeRabbit.slice(0, 8)}...${apiKeys.codeRabbit.slice(-4)}` : undefined,
        oumi: apiKeys.oumi ? `${apiKeys.oumi.slice(0, 8)}...${apiKeys.oumi.slice(-4)}` : undefined,
      } : {};

      res.status(200).json({ apiKeys: maskedKeys });
    } catch (error) {
      console.error('Error fetching API keys:', error);
      res.status(500).json({ error: 'Failed to fetch API keys' });
    }
  } else if (req.method === 'POST') {
    try {
      const { togetherAI, codeRabbit, oumi } = req.body;

      const success = await MongoDBAdapter.updateApiKeys(email, {
        togetherAI: togetherAI || undefined,
        codeRabbit: codeRabbit || undefined,
        oumi: oumi || undefined,
      });

      if (success) {
        res.status(200).json({ message: 'API keys updated successfully' });
      } else {
        res.status(500).json({ error: 'Failed to update API keys' });
      }
    } catch (error) {
      console.error('Error updating API keys:', error);
      res.status(500).json({ error: 'Failed to update API keys' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
