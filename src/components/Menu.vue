<script setup>
import Loader from './Loader.vue';
import MenuItem from './MenuItem.vue';
import { getAccessToken } from '@/auth';
import { ref, onMounted } from 'vue';

const categories = ref([
  'MEALS',
  'SNACKS',
  'DESSERTS',
  'DRINKS',
]);

const currentTab = ref('MEALS');
const menuItems = ref([]);
const loading = ref(false);

const fetchDishes = async () => {
  const accessToken = getAccessToken();
  const myHeaders = new Headers();
  if (accessToken) {
    myHeaders.append("Authorization", `Bearer ${accessToken}`);
  }
  const requestOptions = {
    method: "GET",
    headers: myHeaders
  };

  console.log(`${import.meta.env.VITE_APP_HOST}/api/menu/category?category=${currentTab.value}`);
  const response = await fetch(`${import.meta.env.VITE_APP_HOST}/api/menu/category?category=${currentTab.value}`, requestOptions);
  if (!response.ok) {
    throw new Error(`cannot get current user: status code ${response.status}`);
  }
  return await response.json();
}

onMounted(async () => {
  try {
    loading.value = true;
    menuItems.value = await fetchDishes();
  } finally {
    loading.value = false;
  }
});

</script>

<template>
  <v-container>
    <v-tabs v-model="currentTab" color="#800000" background-color="white" grow>
      <v-tab v-for="category in categories" :key="category" :value="category"
        @click="async () => menuItems = await fetchDishes()">
        {{ category }}
      </v-tab>
    </v-tabs>
  </v-container>
  <Loader v-if="loading" />
  <div v-else class="d-flex justify-end mb-6 flex-wrap ga-4">
    <MenuItem 
      v-for="{ name, description, pictureUrl, price } in menuItems" 
      :title="name" 
      :description="description"
      :price="price" 
      :picture="pictureUrl" />
  </div>
</template>