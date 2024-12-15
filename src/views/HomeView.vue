<script setup lang="ts">
import Menu from '@/components/Menu.vue';
</script>

<template>
  <div>Home page</div>
  <RouterLink to="/about">About</RouterLink>
  <RouterLink to="/cart">Cart</RouterLink>
  <v-container class="light-grey-container">
    <Menu />
  </v-container>
</template>

<style lang="css" scoped>
.light-grey-container {
  background-color: rgba(230, 225, 205, 0.9);
  border-radius: 4px;
  min-height: 85vh;
  margin-top: 10px;
}
</style>