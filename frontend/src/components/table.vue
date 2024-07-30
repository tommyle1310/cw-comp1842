<template>
  <section>
    <div class="container">
      <div style=" margin: 0 auto; width: 100%; display: flex; justify-content: center">
        <button class="change-table-type-btn" @click="switchTab">{{ isDisplayWords ? 'Switch languages list' : 'Switch Dictionary list' }}</button>
      </div>
      
      <words-table v-if="isDisplayWords" :words="words" :word2Display="word2Display" :navigateTo="navigateTo"
        :currentPage="currentPage" :pages="pages" @refetch-words="fetchWords" @change-page="changePage"></words-table>


      <languages-table v-else :languages="languages" :navigateTo="navigateTo"
      :currentLanguagePagination="currentLanguagePagination"
      :languagePages="languagePages"
      :totalLanguagePages="totalLanguagePages"
      itemsPerLanguagePage="itemsPerLanguagePage"
      ></languages-table>
    </div>
  </section>
</template>

<script>
import wordsTable from './wordsTable.vue';
import languagesTable from './languagesTable.vue';
import axios from 'axios'
import eventBus from '@/js/eventBus';

export default {
  name: 'DictTable',
  props: {
    languages: {
      type: Array,
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
    },
    refetchLanguages: {
      type: Function,
      required: true
    },
    changeLanguagePage: {
      type: Function,
      required: true
    },
  },
  components: {
    wordsTable,
    languagesTable
  },
  data() {
    return {
      words: [],
      word2Display: [],
      currentPage: 1,
      totalPages: 1,
      itemsPerPage: 10,
      isDisplayWords: true
    };
  },
  methods: {
    async fetchWords(page = 1) {
      try {
        const response = await axios.get(`http://localhost:8000/dictionary?page=${page}&limit=${this.itemsPerPage}`);
        const data = response.data;
        if (data.EC === 0) {
          this.words = data.words;
          this.totalPages = data.totalPages;
          this.currentPage = page;

          const languageName = this.words[this.words.length - 1]?.translations?.[0]?.name;

          // Find all translations that match the languageName
          const matches = this.words.map(item =>
            item.translations.find(item2 => item2.name === languageName)
          );

          // Extract the translation or default to '-'
          const language2Array = matches.map(match => match ? match.translation : '-');

          // Create the result array
          const resultArray = this.words.map((item, index) => ({
            english: item.word,
            language2: language2Array[index],
            id: item._id
          }));

          this.word2Display = resultArray;
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    switchTab() {
      this.isDisplayWords = !this.isDisplayWords;
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.fetchWords(page);
      }
    },
    navigateTo(page) {
      // Emit an event to the parent with the new page value
      this.$emit('update-page', page);

      const url = `/${page}`;
      window.history.pushState({ page }, '', url);
    }
  },
  mounted() {
    this.fetchWords();
    eventBus.on('refetch-words', () => {
      this.fetchWords()
    });
   
  },
  computed: {
    pages() {
      const pages = [];
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }
  }
}
</script>
