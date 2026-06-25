<script setup>
    import { ref } from 'vue';

    const count = ref(0)

    function increment(){
        count.value++
    }
    
    function decrement(){
        if(count.value > 0){
            count.value--
        }
    }
</script>

<template>
    <h2>{{ count }}</h2>
  <button @click="increment">
    [ + ]
  </button>
  <button @click="decrement">
    [ - ]
  </button>
</template>