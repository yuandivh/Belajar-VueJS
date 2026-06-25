<script setup>
import { ref, computed, watch, onMounted } from "vue";
import Greeting from "../components/Greeting.vue"
import UserCard from "../components/UserCard.vue";
import Counter from "../components/Counter.vue";
const name = ref("");
const count = ref(0);
const username = "Yuandi123";
const BASE_URL = "http://127.0.0.1:8000";

function tambah() {
  count.value++;
}
function kurang() {
  if (count.value > 0) {
    count.value--;
  }
}

const isLogin = ref(false);

const projects = ref([
  {
    id: 1,
    name: "ERP",
    completed: true,
  },
  {
    id: 2,
    name: "Task Management",
    completed: false,
  },
  {
    id: 3,
    name: "Mini Trello",
    completed: true,
  },
]);

const projects2 = ref([]);
const loading = ref(true)

const search = ref("");

const selectedOption = ref(null);
const options = [
  {
    text: "All",
    value: null,
  },
  {
    text: "Completed",
    value: true,
  },
  {
    text: "Pending",
    value: false,
  },
];

const filteredProjects = computed(() => {
  let result = projects.value;
  if (selectedOption.value !== null) {
    result = result.filter(
      (project) => project.completed === selectedOption.value,
    );
  }
  if (search.value.trim() !== "") {
    result = result.filter((project) =>
      project.name.toLowerCase().includes(search.value.toLowerCase()),
    );
  }
  return result;
});

onMounted(async () => {
  const token = "9|2Xecga1y6AYvYWKMM1zQyBlcYzhPKoZibPc3Fxlc954abe3e";
  loading.value = true
  try {
    const response = await fetch(`${BASE_URL}/api/projects`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    const data = await response.json();
    if (Array.isArray(data.data)) {
      projects2.value = data.data;
    } else {
      projects2.value = [data.data];
    }
  } catch (error) {
    console.error("Failed to fetch: ", error);
  } finally{
    loading.value = false
  }
});
</script>

<template>
  <select v-model="selectedOption">
    <option disabled value="">Please select one</option>
    <option v-for="option in options" :key="option.value" :value="option.value">
      {{ option.text }}
    </option>
  </select>
  <input type="text" v-model="search" placeholder="Search project" />
  <ul v-if="filteredProjects.length">
    <li v-for="project in filteredProjects" :key="project.id">
      {{ project.name }} -
      <span>{{ project.completed ? "Done" : "Pending" }}</span>
    </li>
  </ul>
  <div v-else>No data found</div>

  <div v-if="loading">Loading...</div>
  <ul v-else-if="projects2.length">
    <li v-for="project in projects2" :key="project.id">
      <h2>
        {{ project.name }}
      </h2>
      <h3>{{ project.description }}</h3>
    </li>
  </ul>
  <div v-else>Data not found</div>

  <h1>Tambah/Kurang Project</h1>
  <Counter />
  <Greeting :name="username" />
  <UserCard name="Yuandi Vick Halim" email="yuandivickhalim@gmail.com" />
</template>
