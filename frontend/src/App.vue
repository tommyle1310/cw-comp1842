<template>
  <!-- nav -->
  <NavBar :currentPage="currentPage" @update-page="updateCurrentPage"></NavBar>

  <!-- table -->
  <DictTable 
    v-if="currentPage === 'home'"
    :languages="languages"
    @update-page="updateCurrentPage"

    :refetchLanguages="fetchLanguages"
    :currentLanguagePagination="currentLanguagePagination"
    :languagePages="languagePages"
    :totalLanguagePages="totalLanguagePages"
    :itemsPerLanguagePage="itemsPerLanguagePage"
  ></DictTable>

  <!-- <WordsTable></WordsTable> -->

  <!-- add new option - language or word -->
  <add-new @update-languages-child="updateLanguagesChild" :languages="languages" v-if="currentPage === 'new'"></add-new>



  <!-- about me -->
  <about-me v-if="currentPage === 'about-me'"></about-me>


  
  <div id="toast-container"></div>
</template>

<script>
import axios from 'axios';
import './css/styles.css';
import './css/nav.css';
import './css/addNew.css';
import './css/table.css';
import './css/toast.css';
import './css/pagination.css';
import './css/modal.css';
import './js/toast.js';
import NavBar from './components/nav.vue';
import DictTable from './components/table.vue';
import AddNew from './components/addNew.vue';
// import WordsTable from './components/wordsTable.vue';
import AboutMe from './components/aboutMe.vue';
import eventBus from './js/eventBus';

export default {
  name: 'App',
  components: {
    DictTable,
    AddNew,
    AboutMe,
    NavBar,
    // WordsTable
  },
  data() {
    return {
      currentPage: 'home',
      languages: [],
      currentLanguagePagination: 1,
      totalLanguagePages: 1,
      itemsPerLanguagePage: 5
    };
  },
  methods: {
    updateCurrentPage(newPage) {
      this.currentPage = newPage;
    },
    async fetchLanguages(page = 1) {
      try {
        const response = await axios.get(`http://localhost:8000/language?page=${page}&limit=${this.itemsPerLanguagePage}`);
        const filterEnglish = response.data.data.filter(item => item.name !== 'English');
        this.languages = filterEnglish;
        this.totalLanguagePages = response.data.totalPages;
        this.currentPagination = page;
      } catch (error) {
        console.error('Error fetching language:', error);
      }
    },
    changeLanguagePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.fetchLanguages(page);
      }
    },
    updateLanguagesChild(newLanguages) {
      this.languages = newLanguages;

    }
  },
  mounted() {
    this.fetchLanguages();
    eventBus.on('change-language-page', (page) => {
      if (page >= 1 && page <= this.totalLanguagePages) {
        this.fetchLanguages(page);
      }
    });
    eventBus.on('refetch-languages', () => {
      this.fetchLanguages()
    });
    eventBus.on('update-languages-child', (newValue) => {
      this.updateLanguagesChild(newValue)
    })
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
};
</script>


<style>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css');
</style>