<script setup>
import { ref } from 'vue';
import AddToCartButton from './AddToCartButton.vue';
import { isAuthenticated } from '@/service/auth.js';

const show = ref(false);
defineProps(['title', 'description', 'price', 'picture', 'menuItemId']);
</script>

<template>
  <v-card class="mx-auto align-self-start" max-width="344">
    <v-img height="200px" :src="picture" cover></v-img>

    <v-card-title>
      {{ title }}
    </v-card-title>

    <v-card-subtitle>
      {{ description }}
    </v-card-subtitle>

    <v-card-actions>
      <v-btn color="orange-lighten-2" text="Explore"></v-btn>
      <v-spacer></v-spacer>
      <AddToCartButton v-if="isAuthenticated" :menuItemId="menuItemId" />
      <v-btn :icon="show ? 'mdi-chevron-up' : 'mdi-chevron-down'" @click="show = !show"></v-btn>
    </v-card-actions>

    <v-expand-transition>
      <div v-show="show">
        <v-divider></v-divider>
        <v-card-text>
          {{ description }}
          Price: {{ price }}
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
</template>
