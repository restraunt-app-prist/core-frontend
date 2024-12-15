<template>
  <div class="loader-overlay">
    <v-progress-circular
      color="red"
      size="70"
      indeterminate
    ></v-progress-circular>
  </div>
</template>

<style scoped>
.loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* Ensure it's on top of all other content */
}
</style>
