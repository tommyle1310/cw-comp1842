<template>
    <div>
        <ul class="responsive-table" v-if="languages && languages.length > 0">
            <li class="table-header">
                <div class="col col-1">
                    Name
                </div>
                <div class="col col-2">
                    Flag
                </div>
                <div class="col col-4">Action</div>
            </li>
            <li class="table-row" v-for="language in languages" :key="language.id" :value="language._id">
                <div class="col col-1" data-label="Name">{{ language.name }}</div>
                <div class="col col-2" data-label="Flag">
                    <img class="icon" :src="language.flag.url" :alt="language.name">
                </div>
                <div class="col col-4 table-action" data-label="Action">
                    <button @click="viewLanguage(language._id)" class="action-button view"><i
                            class="fa-solid fa-eye"></i></button>
                    <button @click="editanguage(language._id)" class="action-button edit"><i
                            class="fa-solid fa-pen"></i></button>
                    <button @click="isOpenModal = true; setCurrentSelectedId(language._id)" class="action-button delete"><i
                            class="fa-solid fa-trash"></i></button>
                </div>
            </li>
        </ul>
        <ul class="responsive-table" v-else>
            <li class="table-header">
                <div class="col col-full">Empty Language list</div>
            </li>
            <li class="table-row">
                <div class="col col-full" data-label="No Languages">There are no languages found in our system. Try <a
                        style="font-weight: bold; text-decoration: underline; cursor: pointer"
                        @click="navigateTo('new')">creating</a> languages that you want to add.
                </div>
            </li>
        </ul>

        <!-- pagination -->
        <nav class="pagination-outer">
            <ul class="pagination">
                <li class="page-item">
                    <a class="page-link" @click.prevent="changeLanguagePage(currentLanguagePagination - 1)"
                        :disabled="currentLanguagePagination === 1">
                        <span aria-hidden="true">«</span>
                    </a>
                </li>
                <li v-for="page in languagePages" :key="page"
                    :class="{ 'page-item': true, active: page === currentLanguagePagination }">
                    <a class="page-link" @click.prevent="changeLanguagePage(page)">{{ page }}</a>
                </li>
                <li class="page-item">
                    <a class="page-link" @click.prevent="changeLanguagePage(currentLanguagePagination + 1)"
                        :disabled="currentLanguagePagination === totalLanguagePages">
                        <span aria-hidden="true">»</span>
                    </a>
                </li>
            </ul>
        </nav>


        <CustomModal :isOpen="isOpenModal" @close-modal="closeModal" :itemId="currentSelectedId"
            :dataModal="dataDeleteModal" type="delete-language" @delete-language="deleteLanguage"></CustomModal>
    </div>
</template>

<script>
import eventBus from '../js/eventBus.js';
import CustomModal from '../components/modal.vue'
import { showToast } from '@/js/toast.js';
import axios from 'axios';


export default {
    props: {
        languages: {
            type: Array,
            required: true
        },
        navigateTo: {
            type: Function,
            required: true
        },
        currentLanguagePagination: {
            type: Number,
            required: true
        },
        languagePages: {
            type: Array,
            required: true
        },
        totalLanguagePages: {
            type: Number,
            required: true
        },
        itemsPerLanguagePage: {
            type: Number,
            required: true
        }
    },
    components: {
        CustomModal,
    },
    data() {
        return {
            isOpenModal: false,
            currentSelectedId: '',
            dataDeleteModal: {
                btnTitle: 'Confirm'
            }
        }
    },
    methods: {
        closeModal() {
            this.isOpenModal = false
        },
        changeLanguagePage(page) {
            console.log(this.languagePages, page);
            if (page >= 1 && page <= this.languagePages.length) {
                eventBus.emit('change-language-page', page);
            }
        },
        setCurrentSelectedId(id) {
            this.currentSelectedId = id
        },
        async viewLanguage(id) {
            console.log('check id', id)
        },
        async editLanguage(id) {
            console.log('check id', id)
        },
        async viewWord(id) {
            console.log('check id', id)
        },
        async editWord(id) {
            console.log('check id', id)
        },
        async deleteLanguage() {
            console.log('check id', this.currentSelectedId)
            this.loading = true
            try {
                const response = await axios.delete(`http://localhost:8000/language/${this.currentSelectedId}`);
                if (response.data.EC === 0) {
                    showToast('Successfully deleted language')
                    eventBus.emit('refetch-languages');

                    this.$emit('refetch-words')
                } else {
                    showToast('Something went wrong while deleting language')
                }
            } catch (e) {
                showToast('Something went wrong. Please try again.')
            }
            finally {
                this.loading = false
            }
        },

    }
}
</script>