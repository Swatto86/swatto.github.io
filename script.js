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