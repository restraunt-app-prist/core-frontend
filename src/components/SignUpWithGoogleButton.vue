<script setup>
import { login } from '@/auth.js';
</script>

<template>
  <GoogleLogin :callback="(response) => login(response.credential)" />
</template>
