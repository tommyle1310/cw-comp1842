<template>
    <nav>
        <div class="nav-items-container">
            <div class="search-container">
                <input class="nav-search" v-model="query" @input="debouncedHandleSearch" placeholder="Search..."
                    type="text" />
                <div class="result-search" v-if="query">
                    <div v-for="result in listResultWords" :key="result._id">
                        {{ result.word }}
                    </div>
                    <div v-for="result in listResultLanguages" :key="result._id">
                        {{ result.name }}
                    </div>
                </div>
            </div>
            <a @click="navigateTo('home')" :class="{ 'nav-link': true, 'active': currentPage === 'home' }"><i
                    class="fa-solid fa-soap"></i>Home</a>
            <a @click="navigateTo('new')" :class="{ 'nav-link': true, 'active': currentPage === 'new' }"><i
                    class="fa-solid fa-circle-plus"></i>New</a>
            <a @click="navigateTo('test')" :class="{ 'nav-link': true, 'active': currentPage === 'test' }"><i
                    class="fa-solid fa-graduation-cap"></i>Test</a>
            <a @click="navigateTo('about-me')" :class="{ 'nav-link': true, 'active': currentPage === 'about-me' }"><i
                    class="fa-solid fa-address-card"></i>LP3336J-About me</a>

            <a class="nav-link" @click="toggleTheme()"><i class="fa-solid fa-sun"></i><i
                    class="fa-solid fa-moon"></i></a>
        </div>
    </nav>
</template>



<script>
const { showToast } = require('@/js/toast')
const axios = require('axios')
module.exports = {
    props: {
        currentPage: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            query: '',
            listWords: [],
            listResultWords: [],
            listLanguages: [],
            listResultLanguages: []
        }
    },
    methods: {
        // your methods here
        toggleTheme() {
            document.body.classList.toggle('dark-theme')
        },
        navigateTo(page) {
            // Emit an event to the parent with the new page value
            this.$emit('update-page', page);

            // Update the URL
            const url = `/${page}`;

            window.history.pushState({ page }, '', url);
        }
        ,
        handleSearch() {
            if (this.query === '') {
                this.listResultWords = this.listWords;
                this.listResultLanguages = this.listLanguages;
            } else {
                // console.log('check listwords', this.listWords)
                const lowerCaseQuery = this.query.toLowerCase();
                this.listResultWords = this.listWords.filter(word =>
                    word.word.toLowerCase().includes(lowerCaseQuery) ||
                    word.translations.some(translation =>
                        translation.translation.toLowerCase().includes(lowerCaseQuery)
                    )
                );
                console.log('cheosaudbaosudck', this?.listResultWords[0]?.word)
                this.listResultLanguages = this.listLanguages.filter(language =>
                    language.name.toLowerCase().includes(lowerCaseQuery)
                );
            }
        },
        debounce(fn, delay) {
            let timeoutID;
            return function (...args) {
                clearTimeout(timeoutID);
                timeoutID = setTimeout(() => fn.apply(this, args), delay);
            };
        },
        async fetchLanguages() {
            this.loading = true
            try {
                const response = await axios.get(`http://localhost:8000/language/all`);
                if (response.data.EC === 0) {
                    this.listLanguages = response.data.languages
                }
            } catch (e) {
                showToast('Something went wrong when fetching languages')
            } finally {
                this.loading = false
            }
        },
        async fetchWords() {
            try {
                const response = await axios.get(`http://localhost:8000/dictionary/all`);
                const data = response.data;
                if (data.EC === 0) {
                    this.words = data.words;
                    this.listWords = this.words

                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },
    },
    computed: {
    },
    mounted() {
        this.debouncedHandleSearch = this.debounce(this.handleSearch, 300);
        window.addEventListener('popstate', (event) => {
            if (event.state && event.state.page) {
                this.currentPage = event.state.page;
            }
        });
        this.fetchWords();
        this.fetchLanguages();
    }
}
</script>