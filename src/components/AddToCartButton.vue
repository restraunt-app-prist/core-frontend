<script setup>
import { ref } from 'vue';
import { getAccessToken } from '@/auth';

const props = defineProps({
  menuItemId: {
    type: String,
    required: true,
  },
});

const quantity = ref(1);
const dialog = ref(false);
const loading = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const addItemToCart = async (menuItemId, quantity) => {
  const accessToken = getAccessToken();
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  if (accessToken) {
    headers.append("Authorization", `Bearer ${accessToken}`);
  }

  const body = JSON.stringify({ menuItemId, quantity });

  try {
    const response = await fetch(`${import.meta.env.VITE_APP_HOST}/api/cart/items`, {
      method: "POST",
      headers,
      body,
    });
    if (!response.ok) {
      throw new Error(`Failed to add item to cart: status code ${response.status}`);
    }
  } catch (error) {
    throw error;
  }
};

const handleAddToCart = async () => {
  try {
    loading.value = true;
    await addItemToCart(props.menuItemId, quantity.value);
    successMessage.value = 'Item added to cart successfully!';
    errorMessage.value = '';
    dialog.value = false;
  } catch (error) {
    successMessage.value = '';
    errorMessage.value = error.message || 'Failed to add item to cart.';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div>
    <!-- Popup dialog -->
    <v-dialog v-model="dialog" max-width="400">
      <template #activator="{ props }">
        <v-btn v-bind="props" color="primary">Add to Cart</v-btn>
      </template>
      <v-card>
        <v-card-title>Select Quantity</v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <v-text-field
                v-model="quantity"
                label="Quantity"
                type="number"
                min="1"
                max="99"
              />
            </v-col>
          </v-row>
          <div v-if="successMessage" class="text-success">{{ successMessage }}</div>
          <div v-if="errorMessage" class="text-error">{{ errorMessage }}</div>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="handleAddToCart" :loading="loading" :disabled="loading">
            Confirm
          </v-btn>
          <v-btn text @click="dialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
