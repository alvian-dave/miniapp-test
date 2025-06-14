import { NextApiRequest, NextApiResponse } from 'next';
import contract from '@/lib/contract';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { nullifierHash } = req.query;
  if (!nullifierHash || typeof nullifierHash !== 'string') {
    return res.status(400).json({ error: 'Invalid nullifierHash' });
  }

  try {
    const stakeReward = await contract.getPendingReward(nullifierHash);
    return res.status(200).json({ stakeReward });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch staking reward' });
  }
}
