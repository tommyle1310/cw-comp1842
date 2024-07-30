<template>
    <div v-if="isOpen" class="modal-overlay">
        <div class="modal">
            <div v-if="!loading" class="modal-content">
                <span class="close" @click="closeModal">&times;</span>
                <h2>{{ dataModal.title || dataView.englishWord }}</h2>
                <p v-html="message"></p>
                <div v-if="type==='view-word'" class="view-word-container">
                <div class="" v-for="item in dataView.translations" :key="item.id">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <img :src="item.imgFlag" class="icon" alt="">
                        <h5>{{item.name}}</h5>
                    </div>
                    <p class="translation">{{item.translation}}</p>
                </div>
            </div>

                <div v-if="type === 'delete-word' || type === 'delete-language'">

                    <input v-model="query" type="text">
                    <button :class="type === 'delete-word' || type === 'delete-language' ? 'delete action-button' : ''"
                        @click="onClickBtn" v-if="dataModal?.btnTitle">
                        {{ dataModal.btnTitle }}
                    </button>
                </div>
                <div v-else-if="type === 'edit-language'">
                    <AddEditLanguage @trigger-file-input="triggerFileInput" @update:languageName="updateLanguageName"
                        @file-upload="handleFileUpload" @add-edit-language="addEditLanguage"
                        :languageName='languageName' :listLanguages="listLanguages" :dataEdit="dataEdit">
                    </AddEditLanguage>
                </div>
                <div v-else-if="type === 'edit-word'">
                    <AddEditWord @handle-dropdown-change="handleDropdownChange" @add-edit-word="handleAddEditWord"
                        :englishWord="dataEdit ? dataEdit.englishWord : englishWord"
                        :translations="dataEdit ? dataEdit.translations : translations" :languages="languages"
                        :dataEdit="dataEdit" @on-change-translations="onChangeTranslations"
                        @update:englishWord="updateEnglishWord" @update:translations="handleDropdownChange" />

                </div>
            </div>
            <CustomSpinner v-else :loading="loading"></CustomSpinner>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { showToast } from '@/js/toast';
import CustomSpinner from './spinner.vue';
import AddEditLanguage from './addEditLanguage.vue';
import AddEditWord from './addEditWord.vue';
import eventBus from '@/js/eventBus';

export default {
    name: 'CustomModal',
    props: {
        isOpen: {
            type: Boolean,
            required: true
        },
        itemId: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        },
        dataModal: {
            type: Object,
            required: true
        },
    },
    components: {
        CustomSpinner,
        AddEditLanguage,
        AddEditWord,
    },
    data() {
        return {
            dataFetch: null,
            loading: false,
            query: '',
            languageName: '',
            languages: [],
            englishWord: '',
            translations: [],

        };
    },
    computed: {
        dataEdit() {
            if (this.dataFetch) {
                if (this.type === 'edit-language') {
                    return {
                        id: this.dataFetch._id,
                        name: this.dataFetch.name,
                        imgFlag: this.dataFetch.flag.url,
                        languageId: this.dataFetch.languageId
                    };
                }

                return {
                    englishWord: this.dataFetch.word,
                    translations: this.dataFetch.translations,
                    id: this.dataFetch._id
                }
            }
            return null;
        },
        dataView() {
            return {
                englishWord: this.dataFetch.word,
                translations: this.dataFetch.translations,
                id: this.dataFetch._id,
                name: this.dataFetch.name
            }
        },
        message() {
            if (this.type === 'delete-word' && this.dataFetch) {
                return `Type <span style='font-weight: bold;'>${this.dataFetch.word}</span> to confirm deletion`;
            } else if (this.type === 'delete-language' && this.dataFetch) {
                return `Type <span style='font-weight: bold;'>${this.dataFetch.name}</span> to confirm deletion`;
            } else {
                return '';
            }
        }
    },

    methods: {
        onClickBtn() {
            if (this.type === 'delete-word') {

                if (this.query === this.dataFetch?.word) {
                    this.$emit(this.type);
                    this.$emit('close-modal');
                    this.query = '';
                    return;
                }
            } else if (this.type === 'delete-language') {
                if (this.query === this.dataFetch?.name) {
                    this.$emit(this.type);
                    this.$emit('close-modal');
                    this.query = '';
                    return;
                }
            }
            showToast('Please type correctly to confirm deletion.');
        },
        closeModal() {
            this.$emit('close-modal')
            this.fetchLanguages()
        },
        updateLanguageName(newName) {
            this.languageName = newName;
        },
        async fetchData() {
            this.loading = true;
            try {
                if (this.type === 'delete-word' || this.type === 'edit-word' || this.type === 'view-word') {
                    const response = await axios.get(`http://localhost:8000/dictionary/${this.itemId}`);
                    if (response.data.EC === 0) {
                        this.dataFetch = response.data.word;
                        console.log('check ', this.dataFetch)
                    } else {
                        showToast('Something went wrong while fetching data');
                    }
                }
                if (this.type === 'delete-language' || this.type === 'edit-language') {
                    const response = await axios.get(`http://localhost:8000/language/specific/${this.itemId}`);
                    if (response.data.EC === 0) {
                        this.dataFetch = response.data.language;
                    } else {
                        showToast('Something went wrong while fetching data');
                    }
                }
            } catch (e) {
                console.error('Error fetching data:', e); // Add logging
                showToast('Something went wrong. Please try again.');
            } finally {
                this.loading = false;
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
            console.log('File received from child:', file);
        },
        async addEditLanguage() {
            this.loading = true
            if (this.type === 'delete-language') {

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
            }
            else if (this.type === 'edit-language') {
                console.log('check hererelrjas', this.languageName, 'fiel', this.file);

                // Create a new FormData object
                const formData = new FormData();
                formData.append('name', this.languageName);
                formData.append('flag', this.file);

                try {
                    const response = await axios.patch(`http://localhost:8000/language/${this.itemId}`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });

                    if (response.data.EC === 0) {
                        showToast(`${this.languageName} has just been edited successfully`);

                        eventBus.emit('refetch-languages');
                        this.$emit('close-modal')
                        this.query = '',
                            this.languageName = '',
                            this.dataFetch = null,

                            this.file = null

                    } else {
                        return
                    }
                } catch (error) {
                    console.error('Error editing language:', error);
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

            }
            this.loading = false
        },
        updateEnglishWord(newName) {
            this.englishWord = newName;
        },
        handleAddEditWord(localWord, localTranslations) {
            this.englishWord = localWord;
            this.addEditWord(localTranslations);
        },
        async addEditWord(translations) {
            this.loading = true;
            const arrTranslationReq = translations.map(item => ({
                translationText: item.translation,
                languageId: item.languageId,
            }));
            const dataToSubmit = {
                word: this.englishWord,
                translations: arrTranslationReq,
            };
            if (arrTranslationReq.length === 0) {
                showToast('Please select at least one language for translating');
                this.loading = false;
                return;
            }
            try {
                const response = await axios.patch(`http://localhost:8000/dictionary/${this.itemId}`, dataToSubmit);
                if (response.data.EC === 0) {
                    showToast(`${this.englishWord} has just been updated successfully`);
                    eventBus.emit('refetch-words');
                    this.englishWord = '';
                    this.translations = [];
                    this.$emit('close-modal')
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
        async fetchLanguages() {
            try {
                const response = await axios.get(`http://localhost:8000/language/all`);
                const filterEnglish = response.data.languages.filter(item => item.name !== 'English');
                this.languages = filterEnglish;
            } catch (error) {
                console.error('Error fetching language:', error);
            }
        },
        updateLanguagesChild(newLanguages) {
            this.languages = newLanguages;

        },
        handleDropdownChange(updatedTranslations) {
            this.translations = updatedTranslations;
        },
        onChangeTranslations(index, newValue) {
            this.translations[index].translation = newValue;
        },
    },
    watch: {
        dataEdit: {
            immediate: true,
            handler(newVal) {
                if (newVal && this.type === 'edit-word') {
                    this.translations = newVal.translations;
                    console.log('check', this.translations)
                    console.log('check lnauges', this.languages.filter(item => !this.translations.some(other => other.name === item.name)))
                    eventBus.emit('update-languages-child', this.languages.filter(item => !this.translations.some(other => other.name === item.name))
                    )
                }
            }
        },
        isOpen(newVal) {
            if (newVal) {
                this.fetchData();
            }
        }
    },

    mounted() {
        this.fetchLanguages()
        eventBus.on('fetch-dropdown-languages', () => {
        this.fetchLanguages()
        })
        eventBus.on('update-languages-child', (newValue) => {
            this.updateLanguagesChild(newValue)
        })
    }
};
</script>
