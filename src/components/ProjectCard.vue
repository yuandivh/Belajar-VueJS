<script setup>
defineProps({
    name: String,
    description: String
})
</script>

<template>
  <div
    class="bg-yellow-300 hover:bg-yellow-400 p-8 rounded-xl cursor-pointer h-full"
  >
    <div
      class="mb-8 bg-white rounded-full p-2 inline-flex items-center justify-center"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        class="size-6"
      >
        <path
          d="M19.5 21a3 3 0 0 0 3-3v-4.5a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3V18a3 3 0 0 0 3 3h15ZM1.5 10.146V6a3 3 0 0 1 3-3h5.379a2.25 2.25 0 0 1 1.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 0 1 3 3v1.146A4.483 4.483 0 0 0 19.5 9h-15a4.483 4.483 0 0 0-3 1.146Z"
        />
      </svg>
    </div>
    <div class="pl-2">
      <div class="font-bold text-xl mb-2">{{ name?? "" }}</div>
      <div class="text-sm wrap-break-word">{{ description?? "" }}</div>
    </div>
    <slot></slot>
  </div>
</template>
