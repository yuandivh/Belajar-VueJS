<script setup>
import { onMounted } from "vue";
import { getUser } from "./services/auth";
import { useAuthStore } from "./stores/auth";

const auth = useAuthStore();

onMounted(async () => {
  if (localStorage.getItem("token")) {
    await auth.fetchUser();
  }

  // if(localStorage.getItem("token")){
  //   try{
  //     const user = await getUser();
  //   }catch(error){
  //     console.log(error.message)
  //   }
  // }
});
</script>

<template>
  <router-view />
</template>
