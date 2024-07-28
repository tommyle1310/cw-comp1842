<template>
    <div v-if="isOpen" class="modal-overlay">
        <div class="modal">
            <div v-if="!loading" class="modal-content">
                <span class="close" @click="$emit('close-modal')">&times;</span>
                <h2>Confirm delete</h2>
                <p v-html="deleteWordMessage"></p>
                <input v-model="query" type="text">
                <button :class="type === 'delete-word' || type==='delete-language' ? 'delete action-button' : ''" @click="onClickBtn"
                    v-if="dataModal?.btnTitle">
                    {{ dataModal.btnTitle }}
                </button>
            </div>
            <CustomSpinner v-else :loading="loading"></CustomSpinner>
        </div>
    </div>
</template>


<script>
import axios from 'axios';
import { showToast } from '@/js/toast';
import CustomSpinner from './spinner.vue';

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
        }
    },
    components: {
        CustomSpinner
    },
    data() {
        return {
            dataFetch: null,
            loading: false,
            query: ''
        };
    },
    computed: {
        deleteWordMessage() {
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
            console.log('check ', this.query === this.dataFetch?.word, this.query, this.dataFetch?.name);
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
        async fetchData() {
            this.loading = true;
            try {
                if (this.type === 'delete-word') {
                    const response = await axios.get(`http://localhost:8000/dictionary/${this.itemId}`);
                    if (response.data.EC === 0) {
                        this.dataFetch = response.data.word;
                    } else {
                        showToast('Something went wrong while fetching data');
                    }
                }
                if (this.type === 'delete-language') {
                    const response = await axios.get(`http://localhost:8000/language/specific/${this.itemId}`);
                    if (response.data.EC === 0) {
                        this.dataFetch = response.data.language;
                    } else {
                        showToast('Something went wrong while fetching data');
                    }
                }
            } catch (e) {
                showToast('Something went wrong. Please try again.');
            } finally {
                this.loading = false;
            }
        }
    },
    watch: {
        isOpen(newVal) {
            if (newVal) {
                this.fetchData();
            }
        }
    }
};
</script>
