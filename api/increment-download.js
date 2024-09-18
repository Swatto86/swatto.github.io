import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    console.log('Increment download function called');
    const { utility } = req.body;

    if (!utility) {
        return res.status(400).json({ error: 'Utility name is required' });
    }

    try {
        let count = await kv.get(`downloadCount:${utility}`) || 0;
        count++;
        console.log(`New count for ${utility}:`, count);
        await kv.set(`downloadCount:${utility}`, count);
        console.log('Count updated successfully');
        res.status(200).json({ count });
    } catch (error) {
        console.error('Error in increment-download:', error);
        res.status(500).json({ error: 'Failed to update download count', details: error.message });
    }
}