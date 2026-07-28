<script setup>
import { useProjectStore } from "../../stores/project";

const projectStore = useProjectStore();
</script>

<template>
  <input
    v-model="projectStore.filters.search"
    type="text"
    placeholder="Search project..."
    class="border-2 border-gray-400 px-2 py-1 w-full"
  />
</template>
