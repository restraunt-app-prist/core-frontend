<script setup>
import SignUpWithGoogleButton from './SignUpWithGoogleButton.vue';
import { isAuthenticated } from '@/auth.js';
import UserAvatar from './UserAvatar.vue';
</script>

<template>
  <v-app-bar app color="#800000" dark>
    <!-- Centered Title -->
    <v-app-bar-title class="text-center">
      <RouterLink to="/" class="title-text">Welcome to Our Restaurant</RouterLink>
    </v-app-bar-title>

    <!-- Spacer to push content -->
    <v-spacer></v-spacer>

    <!-- Login Button -->
    <UserAvatar v-if="isAuthenticated" picture="https://randomuser.me/api/portraits/men/85.jpg"/>
    <SignUpWithGoogleButton v-else />
  </v-app-bar>
</template>

<style>
.text-center {
  flex: 1;
  text-align: center;
}
.title-text {
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}

.title-text:hover {
  text-decoration: none;
  color: inherit;
}
</style>
