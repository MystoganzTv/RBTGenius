import { pingDb } from './lib/db.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  try {
    await pingDb({ timeoutMs: 5000 });
    return res.status(200).json({
      ok: true,
      database: 'ok',
      ts: Date.now(),
    });
  } catch (error) {
    console.error('[health] Database check failed:', error.message);
    return res.status(503).json({
      ok: false,
      database: 'unavailable',
      ts: Date.now(),
    });
  }
}
