// script.js

document.getElementById('language-dropdown').addEventListener('change', function () {
    const dropdown = this;
    const selectedOption = dropdown.options[dropdown.selectedIndex];
    const selectedValue = selectedOption.value;
    const selectedText = selectedOption.text;

    if (selectedValue) {
        // Create new div
        const newDiv = document.createElement('div');

        // Create new label
        const newLabel = document.createElement('label');
        newLabel.setAttribute('for', `language-${selectedValue}`);
        newLabel.textContent = selectedText;

        // Create new textarea
        const newTextArea = document.createElement('textarea');
        newTextArea.setAttribute('id', `language-${selectedValue}`);
        newTextArea.setAttribute('cols', `36`);
        newTextArea.required = true;

        // Append label and textarea to the new div
        newDiv.appendChild(newLabel);
        newDiv.appendChild(newTextArea);

        // Append new div to the textareas container
        document.getElementById('textareas-container').appendChild(newDiv);

        // Remove the selected option from the dropdown
        dropdown.remove(dropdown.selectedIndex);

        // Reset the dropdown to default state
        dropdown.selectedIndex = 0;
    }
    if (dropdown.options.length === 1) dropdown.style.display = 'none'
});
