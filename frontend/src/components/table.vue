<template>
    <section>
        <div class="container">
            <ul class="responsive-table">
                <li class="table-header">
                    <div class="col col-1">English</div>
                    <div class="col col-2">Japanese</div>
                    <div class="col col-3">More</div>
                    <div class="col col-4">Action</div>
                </li>
                <li class="table-row">
                    <div class="col col-1" data-label="English">Thank you</div>
                    <div class="col col-2" data-label="Japanese">Ohaya</div>
                    <div class="col col-3" data-label="Japanese">...</div>
                    <div class="col col-4 table-action" data-label="Action">
                        <button class="action-button view"><i class="fa-solid fa-eye"></i></button>
                        <button class="action-button edit"><i class="fa-solid fa-pen"></i></button>
                        <button class="action-button delete"><i class="fa-solid fa-trash"></i></button>
                    </div>
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
            words: [] // Your data here
        }
    },
    methods: {
        async fetchWords() {
            try {
                const response = await axios.get('http://localhost:8000/dictionary');
                this.words = response.data;
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },
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
