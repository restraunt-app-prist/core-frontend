<script setup>
import { login } from '@/service/auth.js';
</script>

<template>
  <GoogleLogin :callback="(response) => login(response.credential)" />
</template>
