<template>
    <form id="upload-form" @submit.prevent="addEditWord">
        <div>
            <label class="language-with-img" for="english">
                <img class="icon"
                    src='https://res.cloudinary.com/dtwiu86jg/image/upload/v1721917719/tskmhr3wh03jxblbwn9e.svg'>
                English word
            </label>
            <textarea :value="localWord" @input="onChangeInput($event.target.value)" type="text" cols="36" id="english"
                placeholder="ex: Cat" required></textarea>
        </div>
        <div id="textareas-container">
            <div v-for="(translation, index) in localTranslations" :key="index">
                <label style="display: flex; align-items: center;  justify-content: space-between" :for="translation._id">
                    <div class="language-with-img">
                        <img class="icon" :src="translation.imgFlag">{{ translation.text || translation.name }}
                    </div>
                    <button v-if="!dataEdit" style="align-self:end; padding: 5px 10px; border: 1px solid #ddd" @click="handleRemoveLanguage(translation._id || translation.id)" class="action-button">X</button>
                </label>
                <textarea :id="translation._id" cols="36" @input="onChangeTranslation($event, index)"
                    :value="translation.translationText || translation.translation" required></textarea>
            </div>
            <select id="language-dropdown" @change="handleDropdownChange($event)">
                <option value="" disabled selected>Add more language to translate</option>
                <option v-for="language in languages" :key="language.id" :value="language._id">{{ language.name }}
                </option>
            </select>
            <input type="submit" value="Submit">
        </div>
    </form>
</template>

<script>
import eventBus from '@/js/eventBus';

export default {
    props: {
        translations: {
            type: Array,
            required: true
        },
        englishWord: {
            type: String,
            required: true
        },
        languages: {
            type: Array,
            required: true
        },
        dataEdit: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            localWord: this.englishWord,
            localTranslations: JSON.parse(JSON.stringify(this.translations))
        };
    },
    methods: {
        handleDropdownChange(event) {
            const selectedLanguageId = event.target.value;
            const selectedLanguage = this.languages.find(lang => lang._id === selectedLanguageId);
            if (selectedLanguage) {
                this.localTranslations.push({
                    _id: selectedLanguage._id,
                    value: selectedLanguageId,
                    text: selectedLanguage.name,
                    imgFlag: selectedLanguage.flag.url,
                    languageId: selectedLanguage._id,
                    translationText: ''
                });

                this.$emit('update:translations', this.localTranslations);
                eventBus.emit('update-languages-child', this.languages.filter(lang => !this.localTranslations.some(t => t.languageId === lang._id)));
                eventBus.emit('update-languages-add-dropdown', this.languages.filter(lang => !this.localTranslations.some(t => t.languageId === lang._id)));
                event.target.selectedIndex = 0;
            }
        },
        handleRemoveLanguage(languageId) {
        const index = this.localTranslations.findIndex(t => t.languageId === languageId);
        if (index !== -1) {
            this.localTranslations.splice(index, 1);

            this.$emit('update:translations', this.localTranslations);
            eventBus.emit('update-languages-child', this.languages.filter(lang => !this.localTranslations.some(t => t.languageId === lang._id)));
            eventBus.emit('update-languages-add-dropdown', this.languages.filter(lang => !this.localTranslations.some(t => t.languageId === lang._id)));
            eventBus.emit('fetch-languages-add-dropdown')
        }
    },


        addEditWord() {
            this.$emit('update:englishWord', this.localWord);
            this.$emit('add-edit-word', this.localWord, this.localTranslations);
            console.log('add-edit-word', this.localTranslations);
        },
        onChangeInput(value) {
            this.localWord = value;
        },
        onChangeTranslation(event, index) {
            if (this.localTranslations[index]) {
                this.localTranslations[index].translation = event.target.value;
                this.$emit('on-change-translations', index, this.localTranslations[index].translation);
            } else {
                console.error(`Translation at index ${index} not found.`);
            }
        }
    },
    watch: {
        englishWord: {
            immediate: true,
            handler(newVal) {
                this.localWord = newVal;
            }
        },
        translations: {
            immediate: true,
            handler(newVal) {
                this.localTranslations = JSON.parse(JSON.stringify(newVal)); // Update localTranslations whenever the prop changes
            }
        },
        dataEdit: {
            immediate: true,
            handler(newVal) {
                if (newVal) {
                    this.localWord = newVal.englishWord;
                    this.localTranslations = JSON.parse(JSON.stringify(newVal.translations));
                }
            }
        }
    }
};
</script>
