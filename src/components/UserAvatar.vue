<script setup>
import { logout } from '@/auth.js';
defineProps(['picture'])
</script>

<template>
  <v-menu offset-y bottom>
    <template #activator="{ props }">
      <v-btn icon v-bind="props">
        <v-avatar>
          <img :src="picture" alt="Avatar" />
        </v-avatar>
      </v-btn>
    </template>

    <v-list>
      <v-list-item link to="/profile">
        <v-list-item-title>Profile</v-list-item-title>
      </v-list-item>

      <v-divider></v-divider>

      <v-list-item @click="logout">
        <v-list-item-title>Logout</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
