<script setup>
import { ref, computed, watch, onMounted } from "vue";
import Greeting from "../components/Greeting.vue";
import UserCard from "../components/UserCard.vue";
import Counter from "../components/Counter.vue";
import { useRouter } from "vue-router";
import { apiFetch } from "../services/apiFetch.js";
import { useAuthStore } from "../stores/auth.js";
import { useProjectStore } from "../stores/project.js";

const auth = useAuthStore();
const projectStore = useProjectStore();
const router = useRouter();
const name = ref("");
const count = ref(0);
const username = "Yuandi123";
const BASE_URL = "http://127.0.0.1:8000";
const inputProject = ref(false)
const isLogin = ref(false);
const loading = ref(true);
const search = ref("");
const nameProject = ref(null);
const descriptionProject = ref(null);




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

async function deleteProject(projectId){
  try{
    await projectStore.deleteProject(projectId)
  } catch(error){
    console.log("Delete project failed: ", error.message)
  }
}

async function handleLogout() {
  try {
    await auth.logout();
    router.push({ name: "login" });
  } catch (error) {
    console.log("Log out failed: ", error.message);
  }
}

function showInputProjectModal(){
  inputProject.value = true;
}

async function addProject(){
  try{
    await projectStore.createProject(nameProject.value,descriptionProject.value)
    inputProject.value = false;
    nameProject.value = null;
    descriptionProject.value = null;
  } catch(error){
    console.log("Add project failed: ", error.message)
  }
}
</script>

<template>
  <div class="p-8">
    <div v-if="projectStore.loading">Loading...</div>
    <div v-else-if="projectStore.loadingDelete">Deleting... </div>
    <ul v-else-if="projectStore.projects.length">
      <li
        class="flex"
        v-for="project in projectStore.projects"
        :key="project.id"
      >
        {{ project.name }} -
        <span>{{ project.completed ? "Done" : "Pending" }} - </span>
        <span class="cursor-pointer"
        @click="deleteProject(project.id)"
          ><svg
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
        </span>
      </li>
    </ul>
    <div v-else>No data found</div>
    <br /><br />
    <button
      @click="showInputProjectModal"
      class="bg-blue-500 py-2 w-full rounded-md text-white"
    >
    Add Project
    </button>
    <br/><br/>
    <button
      @click="handleLogout"
      class="bg-red-500 py-2 w-full rounded-md text-white"
      :disabled="auth.loadingLogout"
      :class="auth.loadingLogout ? 'opacity-50 cursor-not-allowed' : ''"
    >
      Log out
    </button>

    <div class="bg-gray-100 p-4 rounded-md mt-4 justify-center items-center" v-if="inputProject">
      <div class="flex items-center mb-4">
        <span class="w-24">Name:</span>
        <input class="flex-1 px-2 py-1 rounded-md" type="text" v-model="nameProject" placeholder="Enter project name..." />
      </div>
      <div class="flex items-center mb-4">
        <span class="w-24">Description:</span>
        <input class="flex-1 px-2 py-1 rounded-md" type="text" v-model="descriptionProject" placeholder="Enter project description..." />
      </div>
      <button @click="addProject" class="bg-green-300 hover:bg-green-400 text-gray-800 font-bold py-2 px-4 rounded-md mr-2">
        Add Project
      </button>
      <button @click="inputProject = false" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md">
        Close Modal
      </button>
    </div>
  </div>
</template>
