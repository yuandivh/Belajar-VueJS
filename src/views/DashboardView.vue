<script setup>
import { ref, computed, watch, onMounted } from "vue";
import Greeting from "../components/Greeting.vue";
import UserCard from "../components/UserCard.vue";
import Counter from "../components/Counter.vue";
import { useRouter } from "vue-router";
import { apiFetch } from "../services/apiFetch.js";
import { useAuthStore } from "../stores/auth.js";
import { useProjectStore } from "../stores/project.js";
import BaseModal from "../components/BaseModal.vue";
import { useToast } from "vue-toastification";

const toast = useToast()
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
const showDeleteModal = ref(false)
const deletingProject = ref(null)

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
    closeDeleteModal()
    toast.success("Project deleted successfully")
  } catch (err) {
    console.log(err.status)
    console.log(err.message)
    console.log(err.errors)
    errors.value = err.errors;
    if(!err.errors){
      toast.error(err.message)
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
    if(!err.errors){
      toast.error(err.message)
    }
  }
}

async function submit() {
  errors.value = "";
  try{
    if (editingProject.value) {
      await projectStore.updateProject(
        editingProject.value.id,
        nameProject.value,
        descriptionProject.value,
      );
      toast.success("Project updated successfully")
    } else {
      await projectStore.createProject(
        nameProject.value,
        descriptionProject.value,
      );
      toast.success("Project created successfully")
    }
      closeModal();
  }catch(err){
    console.log(err.status)
    console.log(err.message)
    console.log(err.errors)
    errors.value = err.errors
    if(!err.errors){
      toast.error(err.message)
    }
  }
}

function openCreate() {
  editingProject.value = null;
  nameProject.value = "";
  descriptionProject.value = "";
  showModal.value = true;
  errors.value = ""
}

function openEdit(project) {
  editingProject.value = project;
  nameProject.value = project.name;
  descriptionProject.value = project.description;
  showModal.value = true;
  errors.value = ""
}

function openDelete(project){
  deletingProject.value = project
  showDeleteModal.value = true
}

function closeModal() {
  showModal.value = false;
  editingProject.value = null;
  nameProject.value = null;
  descriptionProject.value = null;
}

function closeDeleteModal(){
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
    <div class="flex mb-4 justify-between">
      <button
        @click="openCreate"
        class="bg-blue-500 py-2 px-10 rounded-md text-white"
      >
        Add Project
      </button>
      <br /><br />
      <button
        @click="handleLogout"
        class="bg-red-500 py-2 px-10 rounded-md text-white"
        :disabled="auth.loadingLogout"
        :class="auth.loadingLogout ? 'opacity-50 cursor-not-allowed' : ''"
      >
        Log out
      </button>
    </div>
    <input
      v-model="projectStore.filters.search"
      type="text"
      placeholder="Search project..."
      class="border-2 border-gray-400 px-2 py-1 w-full"
    />
    <br /><br />
    <div v-if="projectStore.loading.fetch">Loading...</div>
    <div v-else-if="projectStore.loading.delete">Deleting...</div>
    <ul v-else-if="projectStore.projects.length">
      <li
        class="flex"
        v-for="project in projectStore.projects"
        :key="project.id"
      >
        <div>
          <div class="flex">
            <div class="font-bold">{{ project.name }}</div>
            - {{ project.description }}
            <div class="cursor-pointer px-2" @click="openEdit(project)">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="size-6"
              >
                <path
                  d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z"
                />
              </svg>
            </div>
            -
            <div class="cursor-pointer px-2" @click="openDelete(project)">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="size-6"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
      </li>
    </ul>
    <div v-else>No data found</div>
    <br /><br />
    <div>Total projects: {{ projectStore.totalProjects }}</div>
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
          :class="errors.name ? 'border-red-500':'border-gray-300'"
        />
        <div v-if="errors.name" class="text-red-500 mb-2 -mt-2">
          {{ errors.name[0] }}
        </div>
        <textarea
          class="flex-1 px-2 py-1 rounded-md w-full border-2 border-gray-300 mb-4"
          type="text"
          v-model="descriptionProject"
          placeholder="Enter project description..."
          :class="errors.description ? 'border-red-500':'border-gray-300'"
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
        <h2 class="font-bold mb-2">
          Delete Project
        </h2>
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
      <div v-else class="flex justify-center items-center">
        Loading...
      </div>
    </BaseModal>
  </div>
</template>
