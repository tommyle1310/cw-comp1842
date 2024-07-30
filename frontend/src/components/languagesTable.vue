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
            <li class="table-row" v-for="language in languages" :key="language._id">
                <div class="col col-1" data-label="Name">{{ language.name }}</div>
                <div class="col col-2" data-label="Flag">
                    <img class="icon" :src="language.flag.url" :alt="language.name">
                </div>
                <div class="col col-4 table-action" data-label="Action">
                    <button @click="viewLanguage(language._id)" class="action-button view"><i class="fa-solid fa-eye"></i></button>
                    <button @click="openEditModal(language._id)" class="action-button edit"><i class="fa-solid fa-pen"></i></button>
                    <button @click="openDeleteModal(language._id)" class="action-button delete"><i class="fa-solid fa-trash"></i></button>
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

        <!-- edit modal -->
        <CustomModal :isOpen="isOpenEditModal" @close-modal="closeModal" :itemId="currentSelectedId"
            :component="EditComponent" :dataModal="dataModal" type="edit-language" @edit-language="editLanguage">
        </CustomModal>


        <!-- delete modal -->
        <CustomModal :isOpen="isOpenDeleteModal" @close-modal="closeModal" :itemId="currentSelectedId"
            :dataModal="dataModal" type="delete-language" @delete-language="deleteLanguage"></CustomModal>
    </div>
</template>

<script>
import eventBus from '../js/eventBus.js';
import CustomModal from '../components/modal.vue'
import { showToast } from '@/js/toast.js';
import axios from 'axios';

export default {
    props: {
        navigateTo: {
            type: Function,
            required: true
        },
    },
    components: {
        CustomModal,
    },
    data() {
        return {
            isOpenDeleteModal: false,
            isOpenEditModal: false,
            languages: [],
            currentSelectedId: '',
            dataModal: {
                btnTitle: '',
                title: ''
            },
            currentLanguagePagination: 1,
            totalLanguagePages: 1,
            itemsPerLanguagePage: 5
        }
    },
    methods: {
        async fetchLanguages(page = 1) {
            try {
                const response = await axios.get(`http://localhost:8000/language?page=${page}&limit=${this.itemsPerLanguagePage}`);
                const filterEnglish = response.data.data.filter(item => item.name !== 'English');
                this.languages = filterEnglish;
                this.totalLanguagePages = response.data.totalPages;
                this.currentLanguagePagination = page; // Correct the pagination state
            } catch (error) {
                console.error('Error fetching language:', error);
            }
        },
        closeModal() {
            this.isOpenDeleteModal = false;
            this.isOpenEditModal = false;

        },
        changeLanguagePage(page) {
        if (page >= 1 && page <= this.totalLanguagePages) {
            this.fetchLanguages(page); // Fetch languages for the selected page
        }
    },
        setCurrentSelectedId(id) {
            this.currentSelectedId = id
        },
        async viewLanguage(id) {
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

                    eventBus.emit('refetch-words')
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
        openDeleteModal(id) {
            this.isOpenDeleteModal = true;
            this.setCurrentSelectedId(id)
            this.dataModal = {
                title: 'Confirm deletion',
                btnTitle: 'Confirm'
            }
        },
        openEditModal(id) {
            this.isOpenEditModal = true;
            this.setCurrentSelectedId(id)
            this.dataModal = {
                title: 'Edit Language',
                btnTitle: 'Save'
            }
        }

    },
    mounted() {
        this.fetchLanguages();

    },
    computed: {
        languagePages() {
            const pages = [];
            for (let i = 1; i <= this.totalLanguagePages; i++) {
                pages.push(i);
            }
            return pages;
        }
    }
}
</script>