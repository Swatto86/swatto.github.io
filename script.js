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

    // Screenshot modal functions
    function openModal(imgSrc) {
        const modal = document.getElementById("screenshotModal");
        const modalImg = document.getElementById("modalImage");
        if (modal && modalImg) {
            modal.style.display = "block";
            modalImg.src = imgSrc;
        } else {
            console.error('Modal elements not found.');
        }
    }

    function closeModal() {
        const modal = document.getElementById("screenshotModal");
        if (modal) {
            modal.style.display = "none";
        } else {
            console.error('Modal element not found.');
        }
    }

    // Add event listeners to screenshots to open modal
    const thumbnails = document.querySelectorAll('.screenshot-thumbnail');
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', () => openModal(thumbnail.src));
    });

    // Event listener to close the modal
    const closeModalButton = document.querySelector('.screenshot-modal-close');
    if (closeModalButton) {
        closeModalButton.addEventListener('click', closeModal);
    } else {
        console.error('Close modal button not found.');
    }

    // Copy to clipboard function
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            alert("Checksum copied to clipboard!");
        }).catch(err => {
            console.error('Could not copy text:', err);
        });
    }

    // Add event listener to SHA256 value for copy to clipboard functionality
    const sha256Value = document.querySelector('.sha256-value');
    if (sha256Value) {
        sha256Value.addEventListener('click', () => copyToClipboard(sha256Value.textContent));
    } else {
        console.error('SHA256 value element not found.');
    }
});
