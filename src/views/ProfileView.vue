<script setup>
import {getAccessToken, logout} from '@/auth';
import Loader from '@/components/Loader.vue';
import {ref, onMounted} from 'vue';
import BackgroundContainer from "@/components/BackgroundContainer.vue";

const currentUser = ref(null);
const loading = ref(true);

onMounted(async () => {
  const accessToken = getAccessToken();

  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${accessToken}`);

  const requestOptions = {
    method: "GET",
    headers: myHeaders
  };

  console.log(`${import.meta.env.VITE_APP_HOST}/api/user/current`);
  const response = await fetch(`${import.meta.env.VITE_APP_HOST}/api/user/current`, requestOptions);
  if (!response.ok) {
    throw new Error(`cannot get current user: status code ${response.status}`);
  }
  currentUser.value = await response.json();
  loading.value = false;
});
</script>

<template>
  <Loader v-if="loading"/>
  <v-row v-else>
    <v-col cols="12" md="6" offset-md="3">
      <v-card class="pa-3">
        <v-avatar size="100" class="mb-3">
          <img :src="currentUser.pictureUrl" alt="User Avatar"/>
        </v-avatar>
        <v-card-title>{{ currentUser.firstName }} {{ currentUser.lastName }}</v-card-title>
        <v-card-subtitle>{{ currentUser.email }}</v-card-subtitle>
        <v-card-actions>
          <v-btn color="primary" @click="logout">Logout</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped>
.v-avatar img {
  border-radius: 50%;
}
</style>
