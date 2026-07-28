<script setup>
import { ref, computed, watch, onMounted } from "vue";
import Greeting from "../components/Greeting.vue";
import UserCard from "../components/UserCard.vue";
import Counter from "../components/Counter.vue";
import { RouterLink, useRouter } from "vue-router";
import { apiFetch } from "../services/apiFetch.js";
import { useAuthStore } from "../stores/auth.js";
import { useProjectStore } from "../stores/project.js";
import BaseModal from "../components/BaseModal.vue";
import { useToast } from "vue-toastification";
import ProjectCard from "../components/ProjectCard.vue";
import ProjectSearch from "../components/projects/ProjectSearch.vue";
import ProjectList from "../components/projects/ProjectList.vue";

const toast = useToast();
const auth = useAuthStore();
const projectStore = useProjectStore();
const router = useRouter();
const name = ref("");
const inputProject = ref(false);
const isLogin = ref(false);
const loading = ref(true);
const search = ref("");
const nameProject = ref(null);
const descriptionProject = ref(null);
const editingProjectId = ref(null);
const editName = ref("");
const editDescription = ref("");
const showModal = ref(false);
const editingProject = ref(null);
const errors = ref("");
const showDeleteModal = ref(false);
const deletingProject = ref(null);

const filteredProjects = computed(() => {
  let result = projects.value;
  if (search.value.trim() !== "") {
    result = result.filter((project) =>
      project.name.toLowerCase().includes(search.value.toLowerCase()),
    );
  }
  return result;
});

onMounted(async () => {
  await projectStore.fetchProjects();
});

async function deleteProject(projectId) {
  errors.value = "";
  try {
    await projectStore.deleteProject(projectId);
    closeDeleteModal();
    toast.success("Project deleted successfully");
  } catch (err) {
    console.log(err.status);
    console.log(err.message);
    console.log(err.errors);
    errors.value = err.errors;
    if (!err.errors) {
      toast.error(err.message);
    }
  }
}

async function handleLogout() {
  errors.value = "";
  try {
    await auth.logout();
    router.push({ name: "login" });
  } catch (err) {
    console.log("Log out failed: ", err.message);
    errors.value = err.errors;
    if (!err.errors) {
      toast.error(err.message);
    }
  }
}

async function submit() {
  errors.value = "";
  try {
    if (editingProject.value) {
      await projectStore.updateProject(
        editingProject.value.id,
        nameProject.value,
        descriptionProject.value,
      );
      toast.success("Project updated successfully");
    } else {
      await projectStore.createProject(
        nameProject.value,
        descriptionProject.value,
      );
      toast.success("Project created successfully");
    }
    closeModal();
  } catch (err) {
    console.log(err.status);
    console.log(err.message);
    console.log(err.errors);
    errors.value = err.errors;
    if (!err.errors) {
      toast.error(err.message);
    }
  }
}

function openCreate() {
  editingProject.value = null;
  nameProject.value = "";
  descriptionProject.value = "";
  showModal.value = true;
  errors.value = "";
}

function openEdit(project) {
  editingProject.value = project;
  nameProject.value = project.name;
  descriptionProject.value = project.description;
  showModal.value = true;
  errors.value = "";
}

function openDelete(project) {
  deletingProject.value = project;
  showDeleteModal.value = true;
}

function closeModal() {
  showModal.value = false;
  editingProject.value = null;
  nameProject.value = null;
  descriptionProject.value = null;
}

function closeDeleteModal() {
  showDeleteModal.value = false;
  deletingProject.value = null;
}

let timer;
watch(
  () => projectStore.filters.search,
  () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      projectStore.filters.page = 1; // Reset page to 1 when search changes
      projectStore.fetchProjects();
    }, 500);
  },
);

// watch(editingProject, (project) => {
//   if (project) {
//     nameProject.value = project.name;
//     descriptionProject.value = project.description;
//   }
// });
</script>

<template>
  <div class="p-8">
    <!-- Button Add Project and Logout -->
    <div class="flex mb-4 justify-between">
      <button
        @click="openCreate"
        class="bg-blue-500 py-3 px-10 rounded-md text-white"
      >
        Add Project
      </button>
      <button
        @click="handleLogout"
        class="bg-red-500 py-3 px-10 rounded-md text-white"
        :disabled="auth.loadingLogout"
        :class="auth.loadingLogout ? 'opacity-50 cursor-not-allowed' : ''"
      >
        Log out
      </button>
    </div>
    <ProjectSearch> </ProjectSearch>
    <br /><br />
    <ProjectList 
    :projects="projectStore.projects"
    :loadingFetch="projectStore.loading.fetch"
    :loadingDelete="projectStore.loading.delete"
    :totalProjects="projectStore.totalProjects"
    @edit="openEdit" 
    @delete="openDelete"></ProjectList>
    <br /><br />

    <div class="flex items-center justify-center">
      <button
        class="px-2 py-1 bg-gray-400 text-white rounded-md cursor-pointer"
        @click="
          projectStore.changePage(projectStore.pagination.currentPage - 1)
        "
        :disabled="projectStore.pagination.currentPage === 1"
        :class="projectStore.pagination.currentPage === 1 ? 'opacity-50' : ''"
      >
        Previous
      </button>
      <span class="mx-2"
        >{{ projectStore.pagination.currentPage }} /
        {{ projectStore.pagination.lastPage }}</span
      >
      <button
        class="px-5 py-1 bg-gray-400 text-white rounded-md cursor-pointer"
        @click="
          projectStore.changePage(projectStore.pagination.currentPage + 1)
        "
        :disabled="
          projectStore.pagination.currentPage ===
          projectStore.pagination.lastPage
        "
        :class="
          projectStore.pagination.currentPage ===
          projectStore.pagination.lastPage
            ? 'opacity-50'
            : ''
        "
      >
        Next
      </button>
    </div>

    <br /><br />

    <!-- Create or Edit Modal -->
    <BaseModal :show="showModal">
      <div v-if="!projectStore.loading.create && !projectStore.loading.update">
        <h2 class="font-bold mb-4">
          {{ editingProject ? "Edit Project" : "Create Project" }}
        </h2>
        <input
          class="flex-1 px-2 py-1 rounded-md w-full border-2 border-gray-300 mb-4"
          type="text"
          v-model="nameProject"
          placeholder="Enter project name..."
          :class="errors.name ? 'border-red-500' : 'border-gray-300'"
        />
        <div v-if="errors.name" class="text-red-500 mb-2 -mt-2">
          {{ errors.name[0] }}
        </div>
        <textarea
          class="flex-1 px-2 py-1 rounded-md w-full border-2 border-gray-300 mb-4"
          type="text"
          v-model="descriptionProject"
          placeholder="Enter project description..."
          :class="errors.description ? 'border-red-500' : 'border-gray-300'"
        >
        </textarea>
        <div v-if="errors.description" class="text-red-500 mb-2 -mt-2">
          {{ errors.description[0] }}
        </div>

        <div class="flex">
          <button
            @click="submit"
            class="bg-green-300 hover:bg-green-400 text-gray-800 font-bold py-2 px-4 rounded-md mr-2"
          >
            {{ editingProject ? "Submit changes" : "Add Project" }}
          </button>
          <button
            @click="closeModal"
            class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md"
          >
            Close Modal
          </button>
        </div>
      </div>
      <div v-else class="flex justify-center items-center">Loading...</div>
    </BaseModal>

    <!-- Delete Modal -->
    <BaseModal :show="showDeleteModal">
      <div v-if="!projectStore.loading.delete">
        <h2 class="font-bold mb-2">Delete Project</h2>
        <p class="mb-4">
          Are you sure you want to delete
          <strong>{{ deletingProject?.name }}</strong>
        </p>
        <div class="flex">
          <button
            @click="deleteProject(deletingProject.id)"
            class="bg-red-300 hover:bg-red-400 text-gray-800 font-bold py-2 px-4 rounded-md mr-2"
          >
            Delete project
          </button>
          <button
            @click="closeDeleteModal"
            class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md"
          >
            Close Modal
          </button>
        </div>
      </div>
      <div v-else class="flex justify-center items-center">Loading...</div>
    </BaseModal>
  </div>
</template>
