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
                        <input v-model="languageName" type="text" id="language-name" placeholder="ex: Vietnamese"
                            required>
                    </div>
                    <div class="">
                        <label for="file-upload">Upload the language's flag</label>
                        <div id="file-upload" class="file-upload" @click="triggerFileInput">
                            <input type="file" id="file-input" accept="image/*" hidden @change="fileUpload">
                            <div class="upload-area">
                                <i class="fa-solid fa-upload"></i>
                                <p>Upload a File</p>
                            </div>
                        </div>
                    </div>
                    <input type="submit" @click="addLanguage" value="Submit">
                </form>
            </div>
            <div v-if="type === 'word'" class="add-edit-word">
                <form id="upload-form">
                    <div>
                        <label for="english">English word</label>
                        <textarea v-model="englishWord" type="text" cols="36" id="english" placeholder="ex: Cat"
                            required></textarea>
                    </div>
                    <div id="textareas-container">
                        <div v-for="(translation, index) in translations" :key="index">
                            <label :for="translation._id">{{ translation.text }}</label>
                            <textarea :id="translation._id" cols="36" @input="onChangeTranslations(index, $event)"
                                required></textarea>
                        </div>
                        <select id="language-dropdown" @change="handleDropdownChange">
                            <option value="" disabled selected>Add more language to translate</option>
                            <option v-for="language in languages" :key="language.id" :value="language._id">{{
                                language.name }}</option>
                        </select>
                        <input type="submit" @click="addWord" value="Submit">
                    </div>
                </form>
            </div>
        </div>
    </section>
</template>

<script>
import axios from 'axios'

export default {
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
            translations: [],
            languageName: '',
            file: null
        }
    },
    watch: {
        type(newType) {
            console.log('activate')
            if (newType === 'language') {
                this.fileUpload(); // Ensure this is correctly triggering on file input change
            }
        }
    },
    methods: {
        handleDropdownChange(event) {
            const dropdown = event.target;
            const selectedOption = dropdown.options[dropdown.selectedIndex];
            const selectedValue = selectedOption.value;

            if (selectedValue) {
                const selectedLanguage = this.languages.find(lang => lang._id === selectedValue);

                this.translations.push({ _id: selectedLanguage._id, value: selectedValue, text: selectedLanguage.name });

                let newArr = this.languages.filter(option => {
                    return option._id !== selectedValue;
                });

                this.$emit('update-languages-child', newArr);

                dropdown.selectedIndex = 0;

                // Remove the dropdown if no option left
                if (newArr.length === 0) dropdown.style.display = 'none';
            }
        },
        onChangeTranslations(index, event) {
            const translationText = event.target.value;
            this.translations[index].translationText = translationText;
        },
        addType(type) {
            this.type = type;
        },
        async addWord(e) {
            if (e) e.preventDefault();
            const arrTranslationReq = this.translations.map(item => ({
                translationText: item.translationText,
                languageId: item._id
            }));
            const dataToSubmit = {
                word: this.englishWord,
                translations: arrTranslationReq
            };

            try {
                const response = await axios.post('http://localhost:8000/dictionary', dataToSubmit);
                console.log('check res', response);
            } catch (error) {
                console.error('Error adding word:', error);
            }
        },
        async addLanguage(e) {
            if (e) e.preventDefault();
            console.log('check state', this.languageName, this.file);

            if (this.file) {
                // Create a new FormData object
                const formData = new FormData();
                formData.append('name', this.languageName);
                formData.append('flag', this.file);

                try {
                    const response = await axios.post('http://localhost:8000/language', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                    console.log('check res', response);
                } catch (error) {
                    console.error('Error adding language:', error);
                }
            } else {
                console.log('No file selected');
            }
        },
        triggerFileInput() {
            document.getElementById('file-input').click();
        },
        fileUpload(event) {
            if (!event) return; // Ensure event is not undefined
            const uploadArea = document.querySelector('.upload-area');
            if (event.target.files.length > 0) {
                const fileName = event.target.files[0].name;
                this.file = event.target.files[0];
                uploadArea.innerHTML = `<p>${fileName}</p>`;
            }
        }
    }
}
</script>
