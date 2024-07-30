<template>
    <form id="upload-form" @submit.prevent="addEditLanguage">
        <div>
            <label for="language-name">Language name</label>
            <input :value="localLanguageName" @input="onChangeInput($event.target.value)" type="text"
                id="language-name" placeholder="ex: Vietnamese" required>
        </div>
        <div class="">
            <label for="file-upload">Upload the language's flag</label>
            <div id="file-upload" class="file-upload" @click="triggerFileInput">
                <input type="file" id="file-input" accept="image/*" hidden @change="onFileChange">
                <div class="upload-area">
                    <i class="fa-solid fa-upload"></i>
                    <p>{{ type === 'new' ? "Upload a File" : "If you do not modify the file, this language's flag remains unchanged." }}</p>
                </div>
            </div>
        </div>
        <input type="submit" value="Submit">
    </form>
    <div class="languages-display" v-if="type === 'new'">
        <h5>List existing languages</h5>
        <ul style="overflow-y: scroll; max-height: 200px;">
            <li class="language-with-img existing-language-item" v-for="language in listLanguages" :key="language.id" :value="language._id">
                <img class="icon" :src="language.flag.url">
                <div>{{ language.name }}</div>
            </li>
        </ul>
    </div>
</template>



<script>
import eventBus from '@/js/eventBus';

export default {
    props: {
        languageName: {
            type: String,
            required: true
        },
        listLanguages: {
            type: Array,
            required: true
        },
        type: {
            type: String,
            required: true
        },
        dataEdit: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            localLanguageName: this.languageName
        };
    },
    methods: {
        triggerFileInput() {
            this.$emit('trigger-file-input');
        },
        onFileChange(event) {
            if (!event) return; // Ensure event is not undefined
            if (event.target.files.length > 0) {
                const file = event.target.files[0];
                this.$emit('file-upload', file);
            }
        },
        addEditLanguage() {
            // Emit updated localLanguageName to parent before submitting
            this.$emit('update:languageName', this.localLanguageName);
            eventBus.emit('fetch-dropdown-languages')
            eventBus.emit('fetch-languages-add-dropdown')

            this.$emit('add-edit-language', this.localLanguageName);
        },
        onChangeInput(value) {
            this.localLanguageName = value;
        }
    },
    watch: {
        languageName: {
            immediate: true,
            handler(newVal) {
                this.localLanguageName = newVal;
            }
        },
        dataEdit: {
            immediate: true,
            handler(newVal) {
                this.localLanguageName = newVal?.name;
            }
        }
    }
};
</script>
