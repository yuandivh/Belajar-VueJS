<script setup>
defineProps({
    name: String,
    email: String
})
</script>

<template>
    <div class="bg-gray-600 py-10">
        <h1>Name: {{ name }}</h1>
        <p>Email: {{ email }}</p>
    </div>
</template>