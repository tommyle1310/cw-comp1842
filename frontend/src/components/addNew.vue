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
                <AddEditLanguage @trigger-file-input="triggerFileInput" @update:languageName="updateLanguageName"
                    @file-upload="handleFileUpload" @add-edit-language="addEditLanguage" :languageName='languageName'
                    :listLanguages="listLanguages" type='new'></AddEditLanguage>
            </div>
            <div v-if="type === 'word'" class="add-edit-word">
                <AddEditWord @handle-dropdown-change="handleDropdownChange" :englishWord="englishWord"
                    @add-edit-word="addEditWord" :translations="translations" :languages="languages"
                    @on-change-translations="onChangeTranslations" @update:englishWord="updateEnglishWord"
                    @update:translations="handleDropdownChange"></AddEditWord>
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
import AddEditLanguage from '../components/addEditLanguage.vue'
import AddEditWord from '../components/addEditWord.vue'
import eventBus from '@/js/eventBus.js'

export default {
    props: {
    },
    components: {
        CustomSpinner,
        AddEditLanguage,
        AddEditWord
    },
    data() {
        return {
            type: '',
            englishWord: '',
            translations: [],
            languages: [],
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
        handleDropdownChange(updatedTranslations) {
            this.translations = updatedTranslations;
        },
        onChangeTranslations(index, newValue) {
            this.translations[index].translationText = newValue;
            // console.log('check i', index, 'nv', newValue, 'finaly', this.translations);
        },
        async fetchDropdownAddLanguages() {
            try {
                const response = await axios.get(`http://localhost:8000/language/all`)
                const filterEnglish = response.data.languages.filter(item => item.name !== 'English');
                this.languages = filterEnglish;
                console.log('filterEnglish', response);
            } catch (error) {
                console.error('Error fetching language:', error);
            }
        },

        addType(type) {
            this.type = type;
        },
        async addEditWord() {
            this.loading = true
            const arrTranslationReq = this.translations.map(item => ({
                translationText: item.translationText || item.translation,
                languageId: item._id
            }));
            console.log('check here', arrTranslationReq, 'check thistaranstlion:', this.translations);
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
                    showToast(`${this.englishWord} has just been added successfully`)
                    this.$emit('refetch-languages')
                    this.fetchDropdownAddLanguages()
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
        updateLanguageName(newName) {
            this.languageName = newName;
        },
        updateEnglishWord(newName) {
            this.englishWord = newName;
        },
        async addEditLanguage() {
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

                        eventBus.emit('refetch-languages');
                        this.fetchLanguages()
                        this.englishWord = ''
                        this.translations = []
                        this.languageName = ''
                    this.fetchDropdownAddLanguages()

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
        updateLanguagesAddDropdown(newLanguages) {
            this.languages = newLanguages;
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
                this.loading = false
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
        },
        handleFileUpload(file) {
            this.file = file;
            const uploadArea = document.querySelector('.upload-area');
            uploadArea.innerHTML = `<p>${file.name}</p>`;
        },
    },
    mounted() {
        this.fetchLanguages();
        this.fetchDropdownAddLanguages()
        eventBus.on('update-languages-add-dropdown', (newValue) => {
            this.updateLanguagesAddDropdown(newValue)
        })
        eventBus.on('fetch-languages-add-dropdown', () => {
            this.fetchDropdownAddLanguages()
            console.log('check finally', this.languages);

        })
    },
}
</script>
