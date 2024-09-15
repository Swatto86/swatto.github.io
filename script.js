// Navigation Toggle
const navToggle = document.getElementById('nav-toggle');
const utilityNav = document.getElementById('utility-nav');
const body = document.body;

navToggle.addEventListener('click', () => {
    utilityNav.classList.toggle('open');
    body.classList.toggle('nav-open');
});

// Smooth scrolling for navigation links
document.querySelectorAll('.utility-nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        utilityNav.classList.remove('open');
        body.classList.remove('nav-open');

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Function to open the modal
function openModal(imgSrc) {
    var modal = document.getElementById("screenshotModal");
    var modalImg = document.getElementById("modalImage");
    modal.style.display = "block";
    modalImg.src = imgSrc;
}

// Function to close the modal
function closeModal() {
    var modal = document.getElementById("screenshotModal");
    modal.style.display = "none";
}

// Function to copy text to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function () {
        alert("Copied to clipboard!");
    }, function (err) {
        console.error('Could not copy text: ', err);
    });
}

// Close the modal when clicking outside the image
window.onclick = function (event) {
    var modal = document.getElementById("screenshotModal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Close navigation when clicking outside
document.addEventListener('click', function (event) {
    const isClickInsideNav = utilityNav.contains(event.target);
    const isClickOnToggle = navToggle.contains(event.target);

    if (!isClickInsideNav && !isClickOnToggle && utilityNav.classList.contains('open')) {
        utilityNav.classList.remove('open');
        body.classList.remove('nav-open');
    }
});

// Ensure navigation closes on window resize (e.g., device rotation)
window.addEventListener('resize', function () {
    if (window.innerWidth > 600) {
        utilityNav.classList.remove('open');
        body.classList.remove('nav-open');
    }
});

// Function to increment download count
async function incrementDownload(event) {
    event.preventDefault();
    try {
        const response = await fetch('/api/increment-download', { method: 'POST' });
        const data = await response.json();
        updateDownloadCount(data.count);
        window.location.href = 'downloads/SwatLauncher.exe';
    } catch (error) {
        console.error('Failed to increment download count', error);
    }
}

// Function to update download count display
async function updateDownloadCount(count) {
    document.getElementById('download-count').textContent = count;
}

// Function to fetch initial download count
async function fetchDownloadCount() {
    try {
        const response = await fetch('/api/get-download-count');
        const data = await response.json();
        updateDownloadCount(data.count);
    } catch (error) {
        console.error('Failed to get download count', error);
    }
}

// DOMContentLoaded event handler
document.addEventListener('DOMContentLoaded', function () {
    // Add event listener to download link
    const downloadLink = document.getElementById('download-link');
    if (downloadLink) {
        downloadLink.addEventListener('click', incrementDownload);
    }

    // Fetch initial download count
    fetchDownloadCount();
});