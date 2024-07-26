<template>
    <nav>
        <div class="nav-items-container">
            <a @click="navigateTo('home')" class="nav-link"><i class="fa-solid fa-soap"></i>Home</a>
            <a @click="navigateTo('new')" class="nav-link"><i class="fa-solid fa-circle-plus"></i>New</a>
            <a @click="navigateTo('test')" class="nav-link"><i class="fa-solid fa-graduation-cap"></i>Test</a>
            <a @click="navigateTo('about-me')" class="nav-link"><i class="fa-solid fa-address-card"></i>LP3336J-About
                me</a>
            <a class="nav-link" @:click="toggleTheme()"><i class="fa-solid fa-sun"></i><i
                    class="fa-solid fa-moon"></i></a>
        </div>
    </nav>
</template>

<script>
module.exports = {
    props: {
        currentPage: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            currentPage: 'home'
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
    },
    computed: {
    },
    mounted() {
        window.addEventListener('popstate', (event) => {
            if (event.state && event.state.page) {
                this.currentPage = event.state.page;
            }
        });
    }
}
</script>