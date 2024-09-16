document.addEventListener("DOMContentLoaded", () => {
    // Fetch and display the current download count
    async function fetchDownloadCount() {
        try {
            const response = await fetch('/api/get-download-count');
            const data = await response.json();
            document.getElementById('download-count').textContent = data.count || 0;
        } catch (error) {
            console.error('Failed to fetch download count:', error);
        }
    }

    // Increment download count when download link is clicked
    async function incrementDownloadCount() {
        try {
            const response = await fetch('/api/increment-download', { method: 'POST' });
            const data = await response.json();
            document.getElementById('download-count').textContent = data.count || 0;
        } catch (error) {
            console.error('Failed to increment download count:', error);
        }
    }

    // Fetch the current download count on page load
    fetchDownloadCount();

    // Attach the increment function to the download button click event
    const downloadLink = document.querySelector('.download-link');
    if (downloadLink) {
        downloadLink.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default link action during testing
            incrementDownloadCount();
        });
    } else {
        console.error('Download link not found.');
    }

    // Simplified event listener to copy SHA256 value to clipboard
    const sha256Value = document.querySelector('.sha256-value');
    if (sha256Value) {
        sha256Value.addEventListener('click', () => {
            navigator.clipboard.writeText(sha256Value.textContent).then(() => {
                alert("Checksum copied to clipboard!");
            }).catch(err => {
                console.error('Could not copy text:', err);
            });
        });
    } else {
        console.error('SHA256 value element not found.');
    }
});
