<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { getAccessToken } from '@/auth.js';
import BackgroundContainer from "@/components/BackgroundContainer.vue";
import CreateOrderCartContentStepView from "@/views/order/steps/CreateOrderCartContentStepView.vue";
import CreateOrderDeliveryStepView from "@/views/order/steps/CreateOrderDeliveryStepView.vue";
import CreateOrderPaymentStepView from "@/views/order/steps/CreateOrderPaymentStepView.vue";

const cart = ref(null);
const selectedLocation = ref(null);
const notes = ref('');
const includeDelivery = ref(false);
const distanceToRestaurant = ref(null);
const isLoading = ref(false);
const errorMessage = ref('');
const API_HOST = import.meta.env.VITE_APP_HOST;
const router = useRouter();

const fetchCartWithMenuItems = async () => {
  const accessToken = getAccessToken();
  const headers = new Headers();
  if (accessToken) {
    headers.append("Authorization", `Bearer ${accessToken}`);
  }

  try {
    const response = await fetch(`${API_HOST}/api/cart`, { headers });
    if (!response.ok) {
      throw new Error('Failed to fetch cart');
    }
    cart.value = await response.json();
  } catch (error) {
    errorMessage.value = error.message || 'Error loading cart.';
  }
};

const calculateDistance = () => {
  distanceToRestaurant.value = 5; // Example distance for demonstration
};

const createOrder = async () => {
  const accessToken = getAccessToken();
  const headers = new Headers();
  if (accessToken) {
    headers.append("Authorization", `Bearer ${accessToken}`);
    headers.append("Content-Type", "application/json");
  }

  const orderRequest = {
    deliveryLocation: includeDelivery.value ? selectedLocation.value : null,
    notes: notes.value,
    totalPrice: cart.value.totalPrice + (distanceToRestaurant.value || 0) * 0.5,
  };

  try {
    const response = await fetch(`${API_HOST}/api/orders`, {
      method: 'POST',
      headers,
      body: JSON.stringify(orderRequest),
    });

    if (!response.ok) {
      throw new Error('Failed to create order');
    }

    const createdOrder = await response.json();
    router.push({ name: 'order-details', params: { id: createdOrder.id } });
  } catch (error) {
    errorMessage.value = error.message || 'Error creating order.';
  }
};

fetchCartWithMenuItems();

let step = ref(1);
let steps = ['Cart content', 'Delivery', 'Payment'];

const getPrevStepperButtonText = () => {
  if (step.value === 1) {
    return "Back to cart";
  }
  return "Next";
}

const getNextStepperButtonText = () => {
  if (step.value >= 1 && step.value <= steps.length-1) {
    return "Next"
  }
  return "Make order"
}

const onStepperNextClick = () => {
  if (step.value + 1 <= steps.length) {
    step.value ++;
  } else {
    alert("MAKE order!")
  }
}

const onStepperPrevClick = () => {
  if (step.value - 1 >= 1) {
    step.value --;
  } else {
    router.push("/cart");
  }
}

</script>

<template>
    <v-stepper :items="steps" v-model="step" hide-actions >
      <template v-slot:item.1>
        <CreateOrderCartContentStepView/>
      </template>

      <template v-slot:item.2>
        <CreateOrderDeliveryStepView/>
      </template>

      <template v-slot:item.3>
        <CreateOrderPaymentStepView/>
      </template>

      <v-stepper-actions
          :disabled="false"
          :next-text="getNextStepperButtonText()"
          :prev-text="getPrevStepperButtonText()"
          @click:next="onStepperNextClick()"
          @click:prev="onStepperPrevClick()"
      ></v-stepper-actions>

    </v-stepper>
</template>

<style scoped>

</style>
