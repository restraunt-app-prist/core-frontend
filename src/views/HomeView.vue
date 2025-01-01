<script setup lang="ts">
import Menu from '@/components/Menu.vue';
import BackgroundContainer from "@/components/BackgroundContainer.vue";
</script>

<template>
  <div>Home page</div>
  <RouterLink to="/about">About</RouterLink>
  <RouterLink to="/cart">Cart</RouterLink>
  <BackgroundContainer>
    <Menu />
  </BackgroundContainer>
</template>
