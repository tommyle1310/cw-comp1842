<template>
    <section class="add-new-container">
        <h1>Which one do you want to add new?</h1>
        <div class="add-new-options">
            <div class="add-new-option" @click="addType('word')">
                Word with translations
                <img src="https://res.cloudinary.com/dtwiu86jg/image/upload/v1721917965/translate-language-svgrepo-com_z8gnic.svg"
                    class="icon" alt="Icon" />

            </div>
            <div class="add-new-option" @click="addType('language')">
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
                        <textarea type="text" cols="36" id="language-name" placeholder="ex: Cat" required></textarea>
                    </div>
                    <div id="textareas-container"></div>
                    <select id="language-dropdown" language in langauges>
                        <option value="" disabled selected>Add more language to translate</option>
                        <option v-for="language in languages" :key="language.id" :value="language.id">
                            {{ language.name }}
                        </option>

                    </select>
                    <input type="submit" value="Submit">
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
            type: ''
        }
    },
    methods: {
        addType(type) {
            if (type === 'word') {
                this.type = 'word';
            } else if (type === 'language') {
                this.type = 'language';
            }
        }
    },
    computed: {

    },
    mounted() {


    }
}
</script>