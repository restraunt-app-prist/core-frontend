<script setup>
import { ref, watch, onMounted } from "vue";
import { getAccessToken } from '@/service/auth.js';

// Define props
const props = defineProps({
  deliveryNeeded: {
    type: Boolean,
    required: true,
  },
  deliveryDistance: {
    type: Number,
    required: true,
  },
});

const API_HOST = import.meta.env.VITE_APP_HOST; // Define your API host here
const totalSum = ref(null); // Store the total sum response
const errorMessage = ref("");

// Function to call the backend endpoint
const calculateTotalSum = async () => {
  try {
    const response = await fetch(`${API_HOST}/api/order/calculate-total-sum`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAccessToken()}`, // Include your JWT token
      },
      body: JSON.stringify({
        deliveryDistance: props.deliveryNeeded ? props.deliveryDistance : 0,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    totalSum.value = data.totalSum; // Assuming the response includes a `totalSum` field
  } catch (error) {
    errorMessage.value = error.message;
    console.error("Failed to calculate total sum:", error);
  }
};

watch(() => props.deliveryNeeded, calculateTotalSum);
watch(() => props.deliveryDistance, calculateTotalSum);

onMounted(() => {
  calculateTotalSum();
});
</script>

<template>
  <v-card title="Payment Step" flat>
    <v-card-text>
      <p><strong>Delivery Needed:</strong> {{ deliveryNeeded }}</p>
      <p><strong>Delivery Distance:</strong> {{ deliveryDistance }} km</p>
      <v-divider class="my-4"></v-divider>
      <p v-if="totalSum !== null">
        <strong>Total Sum:</strong> {{ totalSum.toFixed(2) }} UAH
      </p>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.error {
  color: red;
  margin-top: 10px;
}
</style>
