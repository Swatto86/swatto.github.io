const fs = require('fs').promises;
const path = require('path');

module.exports = async (req, res) => {
    console.log('Get download count function called');
    const countFilePath = path.join(process.cwd(), 'download_count.json');

    try {
        console.log('Reading file:', countFilePath);
        let data = await fs.readFile(countFilePath, 'utf8');
        console.log('File contents:', data);
        let count = JSON.parse(data).count;
        res.status(200).json({ count });
    } catch (error) {
        console.error('Error in get-download-count:', error);
        res.status(500).json({ error: 'Failed to get download count', details: error.message });
    }
};