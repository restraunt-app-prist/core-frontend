<script setup>
import { ref, onMounted } from 'vue';
import Loader from '@/components/Loader.vue'; // Optional loader component
import { getAccessToken } from '@/service/auth.js';
import {createCheckoutSession, loadStripeScript} from "@/service/payment.js";

const API_HOST = import.meta.env.VITE_APP_HOST;
const orders = ref([]);
const isLoading = ref(false);
const errorMessage = ref('');

const fetchOrders = async () => {
  const accessToken = getAccessToken();
  const headers = new Headers();
  if (accessToken) {
    headers.append("Authorization", `Bearer ${accessToken}`);
  }

  try {
    isLoading.value = true;
    const response = await fetch(`${API_HOST}/api/order/my`, { headers });
    if (!response.ok) {
      throw new Error(`Failed to fetch orders: status code ${response.status}`);
    }
    orders.value = await response.json();
  } catch (error) {
    errorMessage.value = error.message || 'Error loading orders.';
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchOrders();
  loadStripeScript();
});
</script>

<template>
  <div>
    <h1>My Orders</h1>
    <Loader v-if="isLoading" />
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>

    <v-container v-if="!isLoading && orders.length">
      <v-row>
        <v-col v-for="order in orders" :key="order.id" cols="12" md="6">
          <v-card class="mx-auto my-4">
            <v-card-title>
              Order #{{ order.id }}
              <v-chip :color="getStatusColor(order.status)" class="ml-auto">
                {{ order.status }}
              </v-chip>
              <v-btn @click="() => createCheckoutSession(order.id, order.totalPrice)" color="success" v-if="order.status === 'PENDING'">
                PAY
              </v-btn>
            </v-card-title>
            <v-card-subtitle>
              <p>Total Price: {{ order.totalPrice }} UAH </p>
              <p>Created: {{ new Date(order.creationDate).toLocaleString() }}</p>
            </v-card-subtitle>
            <v-divider></v-divider>
            <v-card-text>
              <h3>Items:</h3>
              <ul>
                <li v-for="item in order.items" :key="item.menuItemId">
                  {{ item.menuItemId }} - Quantity: {{ item.quantity }}
                </li>
              </ul>
              <p><strong>Notes:</strong> {{ order.notes || 'No notes' }}</p>
              <p><strong>Delivery Location:</strong> {{ order.location || 'Not provided' }}</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <div v-else-if="!isLoading && !orders.length">
      <p>You have no orders yet.</p>
    </div>
  </div>
</template>

<style scoped>
.error {
  color: red;
  margin-top: 20px;
}

.v-card {
  border: 1px solid #ddd;
  border-radius: 8px;
}

.v-chip {
  text-transform: capitalize;
}
</style>

<script>
function getStatusColor(status) {
  switch (status) {
    case 'PAID':
      return 'green';
    case 'PENDING':
      return 'orange';
    case 'FAILED':
      return 'red';
    default:
      return 'grey';
  }
}
</script>
