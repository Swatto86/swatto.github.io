const fs = require('fs').promises;
const path = require('path');

module.exports = async (req, res) => {
    console.log('Increment download function called');
    const countFilePath = path.join(process.cwd(), 'download_count.json');

    try {
        console.log('Reading file:', countFilePath);
        let data = await fs.readFile(countFilePath, 'utf8');
        console.log('File contents:', data);
        let count = JSON.parse(data).count;
        count++;
        console.log('New count:', count);
        await fs.writeFile(countFilePath, JSON.stringify({ count }));
        console.log('File updated successfully');
        res.status(200).json({ count });
    } catch (error) {
        console.error('Error in increment-download:', error);
        res.status(500).json({ error: 'Failed to update download count', details: error.message });
    }
};