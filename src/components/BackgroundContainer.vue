<template>
  <v-container class="light-grey-container">
    <slot></slot>
  </v-container>
</template>

<script setup lang="ts">
</script>

<style lang="css" scoped>
.light-grey-container {
  background-color: rgba(230, 225, 205, 0.9);
  border-radius: 4px;
  min-height: 85vh;
  margin-top: 10px;
}
</style>
