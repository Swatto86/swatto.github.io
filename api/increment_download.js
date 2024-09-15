const fs = require('fs').promises;
const path = require('path');

module.exports = async (req, res) => {
    console.log('Increment download function called');
    const countFilePath = path.join(process.cwd(), 'download_count.json');

    try {
        let data = await fs.readFile(countFilePath, 'utf8');
        let count = JSON.parse(data).count;
        count++;
        await fs.writeFile(countFilePath, JSON.stringify({ count }));
        res.status(200).json({ count });
    } catch (error) {
        console.error('Error updating download count:', error);
        res.status(500).json({ error: 'Failed to update download count' });
    }
};