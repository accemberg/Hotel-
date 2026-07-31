import otaLinks from '../../mocks/ota-links.json';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
  return res.status(200).json(otaLinks);
}
