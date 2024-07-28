// toast.js
export function showToast(message) {
    const toastContainer = document.getElementById('toast-container');

    if (!toastContainer) {
        console.error('Toast container not found!');
        return;
    }

    // Create a new toast element
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = message;

    // Append the toast to the container
    toastContainer.appendChild(toast);

    // Make it visible
    setTimeout(() => {
        toast.classList.add('show');
    }, 10); // Short delay to trigger transition

    // Remove the toast after 5 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toastContainer.removeChild(toast);
        }, 500); // Match the CSS transition time
    }, 5000);
}
