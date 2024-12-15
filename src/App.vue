<script setup>
import AppBar from '@/components/AppBar.vue';
import backgroundImage from '@/assets/background.png';
</script>

<template>
    <v-app>
        <AppBar />
        <v-parallax :src="backgroundImage">
            <v-main>
                <RouterView />
            </v-main>
        </v-parallax>
    </v-app>
</template>
