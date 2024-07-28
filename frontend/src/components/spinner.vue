<template>
    <div class="overlay" v-if="loading === true">
      <div class="spinner"></div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'CustomSpinner',
    props: {
      loading: {
        type: Boolean,
        required: true
      }
    },
    data() {
      return {
        // your data here
      }
    },
    methods: {
      // your methods here
    },
    computed: {
      // your computed properties here
    },
    mounted() {
      // your mounted logic here
    }
  }
  </script>