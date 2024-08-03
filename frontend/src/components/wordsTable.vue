<template>
  <div>
    <ul class="responsive-table" v-if="words.length > 0">
      <li class="table-header">
        <div class="col col-1">
          English
          <img class="icon"
            src="https://res.cloudinary.com/dtwiu86jg/image/upload/v1721917719/tskmhr3wh03jxblbwn9e.svg">
        </div>
        <div class="col col-2">
          {{ words[words.length - 1]?.translations?.[0]?.name || 'Default Name' }}
          <img class="icon" :src="words[words.length - 1].translations[0].imgFlag">
        </div>
        <div class="col col-3">More</div>
        <div class="col col-4">Action</div>
      </li>
      <li class="table-row" v-for="word in word2Display" :key="word._id" :value="word._id">
        <div class="col col-1" data-label="English">{{ word.english }}</div>
        <div class="col col-2" data-label="Japanese">{{ word.language2 }}</div>
        <div class="col col-3" data-label="Japanese" style="cursor: pointer; opacity: 0.8" @click="openModalViewWord(word.id)">...</div>
        <div class="col col-4 table-action" data-label="Action">
          <button @click="openModalViewWord(word.id)" class="action-button view"><i class="fa-solid fa-eye"></i></button>
          <button @click="openModalEditWord(word.id)" class="action-button edit"><i
              class="fa-solid fa-pen"></i></button>
          <button @click="isOpenDeleteModal = true; setCurrentSelectedId(word.id)" class="action-button delete"><i
              class="fa-solid fa-trash"></i></button>

        </div>
      </li>
    </ul>
    <ul class="responsive-table" v-else>
      <li class="table-header">
        <div class="col col-full">Empty dictionary</div>
      </li>
      <li class="table-row">
        <div class="col col-full" data-label="English">Dictionary is empty, try <a
            style="font-weight: bold; text-decoration: underline; cursor: pointer" @click="navigateTo('new')">create</a>
          some words that you know...
        </div>
      </li>
    </ul>

    <!-- pagination -->
    <nav class="pagination-outer">
      <ul class="pagination">
        <li class="page-item">
          <a class="page-link" @click.prevent="changePage(currentPage - 1)" :disabled="currentPage === 1">
            <span aria-hidden="true">«</span>
          </a>
        </li>
        <li v-for="page in pages" :key="page" :class="{ 'page-item': true, active: page === currentPage }">
          <a class="page-link" :disabled="currentPage === page" @click.prevent="changePage(page)">{{ page }}</a>
        </li>
        <li class="page-item">
          <a class="page-link" @click.prevent="changePage(currentPage + 1)" :disabled="currentPage === totalPages">
            <span aria-hidden="true">»</span>
          </a>
        </li>
      </ul>
    </nav>
  </div>

  <!-- edit modal -->
  <CustomModal :isOpen="isOpenEditModal" @close-modal="closeModal" :itemId="currentSelectedId"
    :dataModal="dataEditModal" type="edit-word" @edit-word="editWord"></CustomModal>


  <!-- delete modal -->
  <CustomModal :isOpen="isOpenDeleteModal" @close-modal="closeModal" :itemId="currentSelectedId"
    :dataModal="dataDeleteModal" type="delete-word" @delete-word="deleteWord"></CustomModal>


  <!-- view modal -->
  <CustomModal :isOpen="isOpenViewModal" @close-modal="closeModal" :itemId="currentSelectedId"
    :dataModal="dataViewModal" type="view-word"></CustomModal>
</template>

<script>
import { showToast } from '@/js/toast';
import CustomModal from '../components/modal.vue'
import axios from 'axios';
import eventBus from '@/js/eventBus';


export default {
  name: 'WordsTable',
  props: {
    words: {
      type: Array,
      required: true
    },
    word2Display: {
      type: Array,
      required: true
    },
    navigateTo: {
      type: Function,
      required: true
    },
    currentPage: {
      type: Number,
      required: true
    },
    pages: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      isOpenDeleteModal: false,
      isOpenEditModal: false,
      isOpenViewModal: false,
      currentSelectedId: '',
      dataDeleteModal: {
        btnTitle: 'Confirm',
        title: 'Confirm deletion'
      },
      dataEditModal: {
        btnTitle: 'Save',
        title: 'Edit'
      },
      dataViewModal: {
        btnTitle: 'Close',
        title: ''
      },
    }
  },
  components: {
    CustomModal,
  },
  methods: {
    closeModal() {
      this.isOpenDeleteModal = false
      this.isOpenEditModal = false
      this.isOpenViewModal = false
    },
    setCurrentSelectedId(id) {
      this.currentSelectedId = id
    },
    changePage(page) {
      if (page >= 1 && page <= this.pages.length) {
        this.$emit('change-page', page);
      }
    },
    async deleteWord() {
      console.log('check id', this.currentSelectedId)
      this.loading = true
      try {
        const response = await axios.delete(`http://localhost:8000/dictionary/${this.currentSelectedId}`);
        if (response.data.EC === 0) {
          showToast('Successfully deleted word')
          eventBus.emit('refetch-words')
        } else {
          showToast('Something went wrong while deleting word')
        }
      } catch (e) {
        showToast('Something went wrong. Please try again.')
      }
      finally {
        this.loading = false
      }
    },

    openModalEditWord(id) {
      this.currentSelectedId = id;
      this.isOpenEditModal = true;
    },
    openModalViewWord(id) {
      this.currentSelectedId = id;
      this.isOpenViewModal = true;
    }

  }
}
</script>
