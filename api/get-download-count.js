import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    console.log('Get download count function called');
    const { utility } = req.query;

    if (!utility) {
        return res.status(400).json({ error: 'Utility name is required' });
    }

    try {
        const count = await kv.get(`downloadCount:${utility}`) || 0;
        console.log(`Current count for ${utility}:`, count);
        res.status(200).json({ count });
    } catch (error) {
        console.error('Error in get-download-count:', error);
        res.status(500).json({ error: 'Failed to get download count', details: error.message });
    }
}