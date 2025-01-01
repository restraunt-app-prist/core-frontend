<script setup>
import AppBar from '@/components/AppBar.vue';
import backgroundImage from '@/assets/background.png';
import BackgroundContainer from "@/components/BackgroundContainer.vue";
</script>

<template>
  <v-app>
    <AppBar/>
    <v-parallax :src="backgroundImage">
      <v-main>
        <BackgroundContainer>
          <RouterView/>
        </BackgroundContainer>
      </v-main>
    </v-parallax>
  </v-app>
</template>
