const fetch = require('node-fetch');

module.exports = async (req, res) => {
    const githubToken = process.env.GITHUB_PAT;

    try {
        const response = await fetch('https://api.github.com/repos/Swatto86/swatto.github.io/dispatches', {
            method: 'POST',
            headers: {
                'Authorization': `token ${githubToken}`,
                'Accept': 'application/vnd.github.everest-preview+json'
            },
            body: JSON.stringify({
                event_type: 'increment_download'
            })
        });

        if (response.ok) {
            res.status(200).json({ message: 'Download count incremented' });
        } else {
            res.status(response.status).json({ error: 'Failed to increment download count' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};