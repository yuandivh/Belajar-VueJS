<script setup>
defineProps({
    show: Boolean,
})
</script>

<template>
    <div v-if="show" class="fixed inset-0 bg-black/50 flex justify-center items-center">
        <div class="bg-white p-6 rounded-lg w-100">
            <slot></slot>
        </div>
    </div>
</template>