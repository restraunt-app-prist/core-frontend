<script setup>
import { ref, onMounted } from 'vue';
import { getAccessToken } from '@/service/auth.js';
import Loader from "@/components/Loader.vue";

const cart = ref(null);
const isLoading = ref(false);
const errorMessage = ref('');

const API_HOST = import.meta.env.VITE_APP_HOST;

// Fetch cart and its associated menu items
const fetchCartWithMenuItems = async () => {
  const accessToken = getAccessToken();
  const headers = new Headers();
  if (accessToken) {
    headers.append("Authorization", `Bearer ${accessToken}`);
  }

  try {
    // Fetch the cart
    const cartResponse = await fetch(`${API_HOST}/api/cart`, { headers });
    if (!cartResponse.ok) {
      throw new Error(`Failed to fetch cart: status code ${cartResponse.status}`);
    }
    const cartData = await cartResponse.json();

    // Fetch menu items by their IDs using Promise.all
    const menuItemsPromises = cartData.items.map(async (item) => {
      const menuItemResponse = await fetch(`${API_HOST}/api/menu/${item.menuItemId}`, { headers });
      if (!menuItemResponse.ok) {
        throw new Error(`Failed to fetch menu item ${item.menuItemId}: status code ${menuItemResponse.status}`);
      }
      const menuItem = await menuItemResponse.json();
      return { ...item, name: menuItem.name, price: menuItem.price, picture: menuItem.pictureUrl }; // Include additional details
    });

    // Resolve all menu items
    const resolvedItems = await Promise.all(menuItemsPromises);
    return { ...cartData, items: resolvedItems };

  } catch (error) {
    throw error;
  }
};

// Clear the cart
const clearCart = async () => {
  const accessToken = getAccessToken();
  const headers = new Headers();
  if (accessToken) {
    headers.append("Authorization", `Bearer ${accessToken}`);
  }

  try {
    const response = await fetch(`${API_HOST}/api/cart`, {
      method: "DELETE",
      headers,
    });
    if (!response.ok) {
      throw new Error(`Failed to clear cart: status code ${response.status}`);
    }
    cart.value = null; // Reset cart in UI
  } catch (error) {
    throw error;
  }
};


const removeItemFromCart = async (cartItemId) => {
  const accessToken = getAccessToken();
  const headers = new Headers();
  if (accessToken) {
    headers.append("Authorization", `Bearer ${accessToken}`);
  }

  try {
    const response = await fetch(`${API_HOST}/api/cart/items/${cartItemId}`, {
      method: "DELETE",
      headers,
    });
    if (!response.ok) {
      throw new Error(`Failed to clear cart: status code ${response.status}`);
    }
    cart.value = await fetchCartWithMenuItems();
  } catch (error) {
    throw error;
  }
}

// Initialize the cart with menu items on mount
onMounted(async () => {
  try {
    isLoading.value = true;
    cart.value = await fetchCartWithMenuItems();
  } catch (error) {
    errorMessage.value = error.message || 'Error loading cart.';
  } finally {
    isLoading.value = false;
  }
});
</script>
<template>
  <div>
    <Loader v-if="isLoading"/>
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>

      <div v-if="cart">
        <!-- Total Price and Button Group -->
        <v-row align="center" class="my-4">
          <v-col cols="6">
            <div class="total-price-container">
              <span>Total Price:</span>
              <span class="price">{{ cart.totalPrice.toFixed(2) }} UAH</span>
            </div>
          </v-col>

          <v-col cols="6" class="text-right">
            <v-btn-group>
              <v-btn v-if="cart.totalPrice.toFixed(2) > 1" color="orange" @click="clearCart" class="mr-2">
                Clear Cart
              </v-btn>
              <v-btn v-if="cart.totalPrice.toFixed(2) > 1" color="success" to="/cart/order">
                Make Order
              </v-btn>
            </v-btn-group>
          </v-col>
        </v-row>

        <v-divider></v-divider>

        <!-- Cart Items -->
        <v-row>
          <v-col v-for="item in cart.items" :key="item.menuItemId" cols="12" md="4">
            <v-card class="mx-auto" max-width="344">
              <v-img height="200px" :src="item.picture" alt="Cart item image" cover></v-img>

              <v-card-title>
                {{ item.name }}
              </v-card-title>

              <v-card-subtitle>
                Quantity: {{ item.quantity }}
              </v-card-subtitle>

              <v-card-actions>
                <!-- Button to remove an item from the cart -->
                <v-btn color="red" @click="() => removeItemFromCart(item.menuItemId)">Remove from Cart</v-btn>
              </v-card-actions>

              <v-divider></v-divider>

              <v-card-text>
                Price: {{ item.price }} <br />
                Total: {{ item.price * item.quantity }}
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </div>

      <div v-if="!cart && !isLoading">No items in cart yet</div>
  </div>
</template>

<style scoped>
.total-price-container {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Poppins", sans-serif; /* Use Google Fonts for a stylish look */
  font-size: 2rem; /* Large font size */
  font-weight: 700; /* Bold font */
  color: #333; /* Dark gray color for text */
  margin: 20px 0; /* Spacing above and below */
  text-transform: uppercase; /* Capitalize all letters */
}

.price {
  margin-left: 10px;
  color: #d9534f; /* Highlight price in a different color (e.g., red) */
}
</style>
