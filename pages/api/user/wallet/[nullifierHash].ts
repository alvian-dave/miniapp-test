import { NextApiRequest, NextApiResponse } from 'next';
import { getWallet } from '@/lib/contract';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { nullifierHash } = req.query;
  if (!nullifierHash || typeof nullifierHash !== 'string') {
    return res.status(400).json({ error: 'Invalid nullifierHash' });
  }

  try {
    const wallet = await getWallet(nullifierHash);
    const balance = await contract.getBalance(wallet);
    return res.status(200).json({ wallet, balance });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch wallet info' });
  }
}
