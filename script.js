document.addEventListener("DOMContentLoaded", () => {
    // Fetch and display the current download count for a specific utility
    async function fetchDownloadCount(utility) {
        try {
            const response = await fetch(`/api/get-download-count?utility=${utility}`);
            const data = await response.json();
            document.getElementById(`${utility}-download-count`).textContent = data.count || 0;
        } catch (error) {
            console.error(`Failed to fetch download count for ${utility}:`, error);
        }
    }

    // Increment download count when download link is clicked
    async function incrementDownloadCount(utility) {
        try {
            const response = await fetch('/api/increment-download', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ utility }),
            });
            const data = await response.json();
            document.getElementById(`${utility}-download-count`).textContent = data.count || 0;
        } catch (error) {
            console.error(`Failed to increment download count for ${utility}:`, error);
        }
    }

    // Attach the increment function to each download button click event
    const downloadLinks = document.querySelectorAll('.download-link');
    downloadLinks.forEach(link => {
        const utility = link.getAttribute('data-utility');
        if (utility) {
            link.addEventListener('click', () => {
                incrementDownloadCount(utility);
            });
        } else {
            console.error('Download link missing data-utility attribute.');
        }
    });

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
    const sha256Values = document.querySelectorAll('.sha256-value');
    sha256Values.forEach(value => {
        value.addEventListener('click', () => copyToClipboard(value.textContent.trim()));
    });

});

// Fetch the current download count for each utility on page load
fetchDownloadCount('SwatLauncher');
fetchDownloadCount('SwatLogSweep');
fetchDownloadCount('PSTInsight');