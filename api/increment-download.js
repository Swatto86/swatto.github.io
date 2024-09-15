import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    console.log('Increment download function called');
    try {
        let count = await kv.get('downloadCount') || 0;
        count++;
        console.log('New count:', count);
        await kv.set('downloadCount', count);
        console.log('Count updated successfully');
        res.status(200).json({ count });
    } catch (error) {
        console.error('Error in increment-download:', error);
        res.status(500).json({ error: 'Failed to update download count', details: error.message });
    }
}