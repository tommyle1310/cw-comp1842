<template>
  <!-- nav -->
  <nav-bar :currentPage="currentPage" @update-page="updateCurrentPage"></nav-bar>

  <!-- table -->
  <dict-table v-if="currentPage === 'home'"></dict-table>

  <!-- add new option - language or word -->
  <add-new :languages="languages" v-if="currentPage === 'new'"></add-new>

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
  },
  mounted() {
    this.fetchLanguages();
    // add language dropdown
    document.getElementById('language-dropdown').addEventListener('change', function () {
      const dropdown = this;
      const selectedOption = dropdown.options[dropdown.selectedIndex];
      const selectedValue = selectedOption.value;
      const selectedText = selectedOption.text;

      if (selectedValue) {
        // Create new div
        const newDiv = document.createElement('div');

        // Create new label
        const newLabel = document.createElement('label');
        newLabel.setAttribute('for', `language-${selectedValue}`);
        newLabel.textContent = selectedText;

        // Create new textarea
        const newTextArea = document.createElement('textarea');
        newTextArea.setAttribute('id', `language-${selectedValue}`);
        newTextArea.setAttribute('cols', `36`);
        newTextArea.required = true;

        // Append label and textarea to the new div
        newDiv.appendChild(newLabel);
        newDiv.appendChild(newTextArea);

        // Append new div to the textareas container
        document.getElementById('textareas-container').appendChild(newDiv);

        // Remove the selected option from the dropdown
        dropdown.remove(dropdown.selectedIndex);

        // Reset the dropdown to default state
        dropdown.selectedIndex = 0;
      }
      if (dropdown.options.length === 1) dropdown.style.display = 'none'
    });




    // file upload
    document.getElementById('file-upload').addEventListener('click', function () {
      document.getElementById('file-input').click();
    });

    document.getElementById('file-input').addEventListener('change', function (event) {
      const uploadArea = document.querySelector('.upload-area');
      if (event.target.files.length > 0) {
        const fileName = event.target.files[0].name;
        uploadArea.innerHTML = `<p>${fileName}</p>`;
      }
    });
  }
}





</script>


<style>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css');
</style>