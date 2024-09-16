// Navigation functions
function openNav() {
    document.getElementById("sideNav").style.width = "250px";
    document.getElementsByClassName("content")[0].style.marginLeft = "250px";
}

function closeNav() {
    document.getElementById("sideNav").style.width = "0";
    document.getElementsByClassName("content")[0].style.marginLeft = "0";
}

// Event listeners for nav buttons
document.getElementById("openNav").addEventListener("click", openNav);
document.getElementById("closeNav").addEventListener("click", closeNav);

// Screenshot modal functions
function openModal(imgSrc) {
    var modal = document.getElementById("screenshotModal");
    var modalImg = document.getElementById("modalImage");
    modal.style.display = "block";
    modalImg.src = imgSrc;
}

function closeModal() {
    document.getElementById("screenshotModal").style.display = "none";
}

// Copy to clipboard function
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function () {
        alert("Checksum copied to clipboard!");
    }, function (err) {
        console.error('Could not copy text: ', err);
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    // Fetch and display the current download count
    try {
        const response = await fetch('/api/get-download-count');
        const data = await response.json();
        document.getElementById('download-count').textContent = data.count || 0;
    } catch (error) {
        console.error('Failed to fetch download count:', error);
    }

    // Attach the increment function to the download button click event
    const downloadLink = document.querySelector('.download-link');
    if (downloadLink) {
        downloadLink.addEventListener('click', async () => {
            try {
                const response = await fetch('/api/increment-download', { method: 'POST' });
                const data = await response.json();
                document.getElementById('download-count').textContent = data.count || 0;
            } catch (error) {
                console.error('Failed to increment download count:', error);
            }
        });
    } else {
        console.error('Download link not found.');
    }
});
