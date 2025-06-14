import { NextApiRequest, NextApiResponse } from 'next';
import { getClaimable } from '@/lib/contract';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { nullifierHash } = req.query;
  if (!nullifierHash || typeof nullifierHash !== 'string') {
    return res.status(400).json({ error: 'Invalid nullifierHash' });
  }

  try {
    const claimable = await getClaimable(nullifierHash);
    return res.status(200).json({ claimable });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch claimable amount' });
  }
}
