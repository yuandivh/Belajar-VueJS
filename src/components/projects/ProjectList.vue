<script setup>
import ProjectItem from "./ProjectItem.vue";

const props = defineProps({
  projects: Array,
  loadingFetch: Boolean,
  loadingDelete: Boolean,
  totalProjects: Number,
});

const emit = defineEmits(["edit", "delete"]);
</script>
<template>
  <div
    v-if="props.loadingFetch"
    class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3"
  >
    <div v-for="i in 15" :key="i">
      <div
        class="bg-gray-200 px-8 py-9 h-80 rounded-xl cursor-pointer min-h-full animate-pulse"
      >
        <div class="flex justify-between items-center mb-8">
          <div
            class="bg-gray-300 rounded-full p-5 flex items-center justify-center"
          ></div>
          <div class="flex">
            <div class="px-2">
              <div class="bg-gray-300 p-4 rounded-md"></div>
            </div>
            <div class="px-2">
              <div class="bg-gray-300 p-4 rounded-md"></div>
            </div>
          </div>
        </div>
        <div class="pl-2">
          <div class="bg-gray-300 flex-1 space-y-6 py-1 rounded-md"></div>
          <br />
          <div class="bg-gray-300 flex-1 space-y-6 py-1 rounded-md"></div>
          <br />
          <div class="bg-gray-300 flex-1 space-y-6 py-1 rounded-md"></div>
          <br />
          <div class="bg-gray-300 flex-1 space-y-6 py-1 rounded-md"></div>
          <br />
          <div class="bg-gray-300 flex-1 space-y-6 py-1 rounded-md"></div>
          <br />
          <div class="bg-gray-300 flex-1 space-y-6 py-1 rounded-md"></div>
          <br />
        </div>
      </div>
    </div>
  </div>
  <div
    v-else-if="props.projects?.length"
    class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3"
  >
    <ProjectItem
      v-for="project in props.projects"
      :project="project"
      @edit="emit('edit', $event)"
      @delete="emit('delete', $event)"
    ></ProjectItem>
  </div>
  <div v-else-if="props.loadingDelete">Deleting...</div>
  <div v-else>No data found</div>
  <br /><br />
  <div>Total projects: {{ props.totalProjects }}</div>
</template>
