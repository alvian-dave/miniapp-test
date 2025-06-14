import { NextApiRequest, NextApiResponse } from 'next';
import { getStakingBalance } from '@/lib/contract';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { nullifierHash } = req.query;
  if (!nullifierHash || typeof nullifierHash !== 'string') {
    return res.status(400).json({ error: 'Invalid nullifierHash' });
  }

  try {
    const stake = await getStakingBalance(nullifierHash);
    return res.status(200).json({ stake });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch staking balance' });
  }
}
