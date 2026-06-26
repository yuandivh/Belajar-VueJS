<script setup>
import { onMounted } from 'vue';
import { getUser } from './services/auth';

onMounted(async ()=>{
  if(localStorage.getItem("token")){
    try{
      const user = await getUser();
    }catch(error){
      console.log(error.message)
    }
  }
})
</script>

<template>
  <router-view />

</template>
