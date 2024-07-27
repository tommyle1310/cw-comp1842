<template>
    <section>
        <div class="container">
            <ul class="responsive-table" v-if="words.length > 0">
                <li class="table-header">
                    <div class="col col-1">
                        English
                        <img class="icon"
                            src="https://res.cloudinary.com/dtwiu86jg/image/upload/v1721917719/tskmhr3wh03jxblbwn9e.svg">
                    </div>
                    <div class="col col-2">
                        {{ words[words.length - 1]?.translations?.[0]?.name || 'Default Name' }}
                        <img class="icon" :src="words[0].translations[0].imgFlag">
                    </div>
                    <div class="col col-3">More</div>
                    <div class="col col-4">Action</div>
                </li>
                <li class="table-row" v-for="word in word2Display" :key="word.id" :value="word._id">
                    <div class="col col-1" data-label="English">{{ word.english }}</div>
                    <div class="col col-2" data-label="Japanese">{{ word.language2 }}</div>
                    <div class="col col-3" data-label="Japanese">...</div>
                    <div class="col col-4 table-action" data-label="Action">
                        <button class="action-button view"><i class="fa-solid fa-eye"></i></button>
                        <button class="action-button edit"><i class="fa-solid fa-pen"></i></button>
                        <button class="action-button delete"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </li>
            </ul>
            <ul class="responsive-table" v-else>
                <li class="table-header">
                    <div class="col col-full">Empty dictionary</div>
                </li>
                <li class="table-row">
                    <div class="col col-full" data-label="English">Dictionary is empty, try <a
                            style="font-weight: bold; text-decoration: underline; cursor: pointer"
                            @click="navigateTo('new')">create</a>
                        more dictionary that
                        you know...</div>
                </li>
            </ul>

        </div>
    </section>
</template>

<script>
const axios = require('axios');
module.exports = {
    props: {
        // your props here
    },
    data() {
        return {
            words: [],
            word2Display: []
        }
    },
    methods: {
        async fetchWords() {
            try {
                const response = await axios.get('http://localhost:8000/dictionary');
                const data = response.data;
                if (data.EC === 0) {
                    this.words = data.words

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
                        language2: language2Array[index]
                    }));

                    console.log(resultArray);

                    this.word2Display = resultArray
                }

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },
        navigateTo(page) {
            // Emit an event to the parent with the new page value
            this.$emit('update-page', page);

            // Update the URL
            const url = `/${page}`;
            window.history.pushState({ page }, '', url);
        }
    },
    computed: {

    },
    mounted() {
        this.fetchWords();
    }
}
</script>












// <!-- Vue.component('dict-table', {
    props: {
        // premium: {
        //     type: Boolean,
        //     required: true
        // }
    },
    template: ``,
    data() {
        return {
            buttonAdd: { padding: '10px' },
            inventory: 100,
            variants: [
                { id: 200, name: 'burger', image: './assets/burger.jpg', style: 'cover', inventory: 8 },
                { id: 201, name: 'taco', image: './assets/beefTaco.jpg', style: 'contain', inventory: 0 }
            ],
            brand: 'Tommy',
            details: ['grilled pork', 'spinach', 'bread', 'mayonaise'],
            product: 'Burger',
            selectedVariant: 0,
            reviews: []
        }
    },
    methods: {
        updateProduct(index) {
            this.selectedVariant = index
        },
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].id)
        },

    },
    computed: {
        image() {
            return this.variants[this.selectedVariant].image
        },
        title() {
            return this.brand + ' ' + this.product
        },
        canAdd() {
            return this.variants[this.selectedVariant].inventory > 0 ? true : false
        },
        shipping() {
            if (this.premium) return 'Free'
            return '$2.99'
        }
    },
    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview)
        })
    }
})
 -->
