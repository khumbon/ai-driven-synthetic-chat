import type { NextApiRequest, NextApiResponse } from 'next';
import { generateChats } from '@/api/chatGenerator/index';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const data = await generateChats();
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate chats' });
  }
}
