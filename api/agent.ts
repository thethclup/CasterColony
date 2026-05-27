import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS setup
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      name: "Caster Colony Orchestrator",
      status: "active",
      wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6",
      platform: "Caster Colony",
      version: "1.0.0"
    });
  }

  if (req.method === 'POST') {
    try {
      const body = req.body || {};
      return res.status(200).json({
        success: true,
        data: body
      });
    } catch (e) {
      return res.status(400).json({ status: "error", message: "Invalid JSON" });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
