// script.js

document.getElementById('file-upload').addEventListener('click', function () {
    document.getElementById('file-input').click();
});

document.getElementById('file-input').addEventListener('change', function (event) {
    const uploadArea = document.querySelector('.upload-area');
    if (event.target.files.length > 0) {
        const fileName = event.target.files[0].name;
        uploadArea.innerHTML = `<p>${fileName}</p>`;
    }
});
