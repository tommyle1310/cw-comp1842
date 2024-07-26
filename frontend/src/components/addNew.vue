<template>
    <section class="add-new-container">
        <h1 style="text-align: center">Add New</h1>
        <div class="add-new-options">
            <div :class="['add-new-option', type === 'word' ? 'active' : '']" @click="addType('word')">
                Word with translations
                <img src="https://res.cloudinary.com/dtwiu86jg/image/upload/v1721917965/translate-language-svgrepo-com_z8gnic.svg"
                    class="icon" alt="Icon" />

            </div>
            <div :class="['add-new-option', type === 'language' ? 'active' : '']" @click="addType('language')">
                Language
                <img src="https://res.cloudinary.com/dtwiu86jg/image/upload/v1721917719/tskmhr3wh03jxblbwn9e.svg"
                    class="icon" alt="Icon" />

            </div>
        </div>
        <div class='add-edit'>

            <div v-if="type === 'language'" class="add-edit-language">
                <form id="upload-form">
                    <div>
                        <label for="language-name">Language name</label>
                        <input type="text" id="language-name" placeholder="ex: Vietnamese" required>
                    </div>
                    <div class="">
                        <label for="file-upload">Upload the language's flag</label>
                        <div id="file-upload" class="file-upload">
                            <input type="file" id="file-input" hidden>
                            <div class="upload-area">
                                <i class="fa-solid fa-upload"></i>
                                <p>Upload a File</p>
                            </div>
                        </div>
                    </div>
                    <input type="submit" value="Submit">
                </form>
            </div>
            <div v-if="type === 'word'" class="add-edit-word">
                <form id="upload-form">
                    <div>
                        <label for="language-name">English word</label>
                        <textarea v-model="englishWord" type="text" cols="36" id="language-name" placeholder="ex: Cat"
                            required></textarea>
                    </div>
                    <div id="textareas-container"></div>
                    <select id="language-dropdown" language in langauges @change="handleDropdownChange">
                        <option value="" disabled selected>Add more language to translate</option>
                        <option v-for="language in languages" :key="language.id" :value="language.id">
                            {{ language.name }}
                        </option>

                    </select>
                    <input type="submit" @click="addWord" value="Submit">
                </form>
            </div>
        </div>

    </section>
</template>

<script>

module.exports = {
    props: {
        languages: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            type: '',
            englishWord: '',
            translations: []
        }
    },
    methods: {
        handleDropdownChange(event) {
            const dropdown = event.target;
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

                // Hide dropdown if only one option remains
                if (dropdown.options.length === 1) dropdown.style.display = 'none';
            }
        },

        addType(type) {
            if (type === 'word') {
                this.type = 'word';
            } else if (type === 'language') {
                this.type = 'language';
            }
        },
        onChangeEnglishWord(query) {
            this.englishWord += query
        },
        onChangeTranslations(translationObj) {
            // this.translations.push()
            console.log(translationObj)
        },
        addWord(e) {
            if (e) e.preventDefault(); // Prevent default behavior if e is defined
            console.log('word:', this.englishWord);
        },

    },
    computed: {

    },
    mounted() { }
}
</script>