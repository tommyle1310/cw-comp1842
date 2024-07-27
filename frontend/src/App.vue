<template>
  <!-- nav -->
  <nav-bar :currentPage="currentPage" @update-page="updateCurrentPage"></nav-bar>

  <!-- table -->
  <dict-table v-if="currentPage === 'home'" @update-page="updateCurrentPage"></dict-table>

  <!-- add new option - language or word -->
  <add-new @update-languages-child="updateLanguagesChild" :languages="languages" v-if="currentPage === 'new'"></add-new>

  <!-- about me -->
  <about-me v-if="currentPage === 'about-me'"></about-me>
</template>

<script>
import axios from 'axios'
import './css/styles.css'
import './css/nav.css'
import './css/addNew.css'
import './css/table.css'
import './js/addWord.js'
import './js/fileUpload.js'

import NavBar from './components/nav.vue'
import DictTable from './components/table.vue'
import AddNew from './components/addNew.vue'
import AboutMe from './components/aboutMe.vue'

export default {
  name: 'App',
  components: {
    DictTable,
    AddNew,
    AboutMe,
    NavBar
  },
  data() {
    return {
      currentPage: 'home',
      languages: []

    }
  },
  methods: {
    updateCurrentPage(newPage) {
      this.currentPage = newPage;
    },
    async fetchLanguages() {
      try {
        const response = await axios.get('http://localhost:8000/language');
        const filterEnglish = response.data.data.filter(item => item.name !== 'English')
        this.languages = filterEnglish
      } catch (error) {
        console.error('Error fetching lagnuage:', error);
      }
    },
    updateLanguagesChild(newLanguages) {
      this.languages = newLanguages;
    }
  },
  mounted() {
    this.fetchLanguages();
  }
}



</script>


<style>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css');
</style>