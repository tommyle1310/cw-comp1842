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
                <div class="languages-display">
                    <h5>List existing languages</h5>
                    <ul style="overflow-y:scroll; max-height: 200px;">
                        <li class="language-with-img existing-language-item" v-for="language in listLanguages"
                            :key="language.id" :value="language._id">
                            <img class="icon" :src="language.flag.url">
                            <div>{{ language.name }}</div>
                        </li>
                    </ul>
                </div>

            </div>
            <div v-if="type === 'word'" class="add-edit-word">
                <form id="upload-form">
                    <div>
                        <label class="'language-with-img" for="english"><img class="icon"
                                src='https://res.cloudinary.com/dtwiu86jg/image/upload/v1721917719/tskmhr3wh03jxblbwn9e.svg'>
                            English word</label>
                        <textarea v-model="englishWord" type="text" cols="36" id="english" placeholder="ex: Cat"
                            required></textarea>
                    </div>
                    <div id="textareas-container">
                        <div v-for="(translation, index) in translations" :key="index">
                            <label class="language-with-img" :for="translation._id"><img class="icon"
                                    :src='translation.imgFlag'>{{ translation.text }}</label>

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
        <CustomSpinner :loading="loading"></CustomSpinner>
    </section>
</template>

<script>
import axios from 'axios'
import { showToast } from '../js/toast.js'
import '../css/toast.css'
import CustomSpinner from '../components/spinner.vue'


export default {
    props: {
        languages: {
            type: Array,
            required: true
        }
    },
    components: {
        CustomSpinner,
    },
    data() {
        return {
            type: '',
            englishWord: '',
            translations: [],
            languageName: '',
            listLanguages: [],
            loading: false,
            file: null
        }
    },
    watch: {
        type(newType) {
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

                this.translations.push({ _id: selectedLanguage._id, value: selectedValue, text: selectedLanguage.name, imgFlag: selectedLanguage.flag.url });

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
            console.log(this.languages);
            this.loading = true
            if (e) e.preventDefault();
            const arrTranslationReq = this.translations.map(item => ({
                translationText: item.translationText,
                languageId: item._id
            }));

            const dataToSubmit = {
                word: this.englishWord,
                translations: arrTranslationReq
            };
            if (this.translations.length === 0) {
                showToast('Please select at least one language for translating')
                this.loading = false
                return
            }
            try {
                const response = await axios.post('http://localhost:8000/dictionary', dataToSubmit);
                console.log('check resx', response);
                if (response.data.EC === 0) {
                    showToast(`${this.englishWord} has just been added successfully`);
                    this.$emit('refetch-languages');
                    this.englishWord = ''
                    this.translations = []
                }
            } catch (error) {
                console.error('Error adding word:', error);
                if (error.response) {
                    const { data } = error.response;
                    this.errorMessage = data.message || 'An error occurred';

                    showToast(`Error: ${this.errorMessage}`);
                } else {
                    showToast(this.errorMessage);
                }
                console.error('Error adding word:', error);
            } finally {
                this.loading = false;
            }
        },
        async addLanguage(e) {
            if (e) e.preventDefault();
            this.loading = true

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

                    if (response.data.EC === 0) {
                        showToast(`${this.languageName} has just been added successfully`);

                        this.$emit('refetch-languages');
                        this.englishWord = ''
                        this.translations = []
                        this.languageName = ''
                        this.file = null
                        const uploadArea = document.querySelector('.upload-area');
                        uploadArea.innerHTML = ` <i class="fa-solid fa-upload"></i>
                                <p>Upload a File</p>`;

                    } else {
                        return
                    }
                } catch (error) {
                    console.error('Error adding language:', error);
                    if (error.response) {
                        const { data } = error.response;
                        this.errorMessage = data.message || 'An error occurred';

                        showToast(`Error: ${this.errorMessage}`);
                    } else {
                        showToast(this.errorMessage);
                    }
                    console.error('Error adding language:', error);
                } finally {
                    this.loading = false;
                }
            } else {
                showToast('Please add a flag image for this language')
            }
            this.loading = false
        },
        async fetchLanguages() {
            this.loading = true
            try {

                const response = await axios.get(`http://localhost:8000/language/all`);
                if (response.data.EC === 0) {
                    this.listLanguages = response.data.languages
                }
            } catch (e) {
                showToast('Something went wrong when fetching languages')
            } finally {
                this.loading =false
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
    },
    mounted() {
        this.fetchLanguages();
    },
}
</script>
