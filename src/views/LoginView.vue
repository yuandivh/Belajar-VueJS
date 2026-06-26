<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { apiFetch } from "../services/apiFetch";
import { login } from "../services/auth";

const router = useRouter();
const email = ref("");
const password = ref("");
const BASE_URL = "http://127.0.0.1:8000";
const token = ref(localStorage.getItem("token"));
const loading = ref(false);
const errorMessage = ref("");

async function handleLogin() {
  loading.value = true;
  errorMessage.value = "";
  try {
    const data = await login(email.value,password.value)
    email.value = "";
    password.value = "";
    router.push({name: "dashboard"})
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    loading.value = false;
  }
}


</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div
      class="w-full max-w-sm border-2 rounded-xl py-4 px-4 bg-white border-gray-300"
    >
      <div class="font-semibold text-4xl">Log in</div>
      <br />
      <div class="text-center space-y-4">
        <div class="text-start">Email</div>
        <input
          type="email"
          v-model="email"
          class="bg-white border-gray-300 border-2 py-1 px-2 w-full rounded-md"
        />
        <div class="text-start">Password</div>
        <input
          type="password"
          v-model="password"
          class="bg-white border-2 border-gray-300 py-1 px-2 w-full rounded-md"
        />
        <div v-if="errorMessage" class="text-red-500">{{ loginFailed }}</div>

        <button
          @click="handleLogin"
          :disabled="loading"
          :class="loading ? 'opacity-50 cursor-not-allowed' : ''"
          class="bg-blue-500 py-2 w-full rounded-md text-white flex items-center justify-center gap-2"
        >
          <div class="pb-0.5">Log in</div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-4"
          >
            <path
              fill-rule="evenodd"
              d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
        
        <br />
      </div>
    </div>
  </div>
</template>
