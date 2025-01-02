<script setup>
import {onMounted, ref} from 'vue';
import { useRouter } from 'vue-router';
import CreateOrderCartContentStepView from "@/views/order/steps/CreateOrderCartContentStepView.vue";
import CreateOrderDeliveryStepView from "@/views/order/steps/CreateOrderDeliveryStepView.vue";
import CreateOrderPaymentStepView from "@/views/order/steps/CreateOrderPaymentStepView.vue";
import { getAccessToken } from "@/auth"; // Function to retrieve access token

const API_HOST = import.meta.env.VITE_APP_HOST;

const router = useRouter();

const deliveryNeeded = ref(false);
const deliveryDistance = ref(0);

const step = ref(1);
const steps = ['Cart content', 'Delivery', 'Payment'];

const stripe = ref(null);

const isProcessing = ref(false);
const errorMessage = ref("");

// Handles the deliveryNeeded event emitted by the child
const handleDeliveryNeeded = (isDeliveryNeeded, distance) => {
  deliveryNeeded.value = isDeliveryNeeded;
  deliveryDistance.value = distance;
  console.log("Delivery Needed:", isDeliveryNeeded, "Distance:", distance);
};

const getPrevStepperButtonText = () => {
  if (step.value === 1) {
    return "Back to cart";
  }
  return "Prev";
}

const getNextStepperButtonText = () => {
  if (step.value >= 1 && step.value <= steps.length-1) {
    return "Next"
  }
  return "Make order"
}

const onStepperNextClick = async () => {
  if (step.value + 1 <= steps.length) {
    step.value ++;
  } else {
    const {id, totalPrice} = await makeOrder("location of restaurant:)", deliveryDistance.value, "some description of order");
    alert(`order id=${id}, price = ${totalPrice}`)
    await createCheckoutSession(id, totalPrice);
  }
}

const onStepperPrevClick = () => {
  if (step.value - 1 >= 1) {
    step.value --;
  } else {
    router.push("/cart");
  }
}

async function makeOrder(deliveryLocation, deliveryDistance, description) {
  try {
    const response = await fetch(`${API_HOST}/api/order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAccessToken()}`, // Include the JWT token
      },
      body: JSON.stringify({
        deliveryLocation,
        deliveryDistance,
        description,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    // Parse and return the created order
    return await response.json();
  } catch (error) {
    console.error("Failed to create order:", error);
    throw error;
  }
}

const createCheckoutSession = async (orderId, centsAmount) => {
  try {
    isProcessing.value = true;
    errorMessage.value = "";

    const accessToken = getAccessToken(); // Retrieve the access token

    const response = await fetch(`${API_HOST}/api/payment/create-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`, // Add the auth header
      },
      body: JSON.stringify({
        orderId,
        centsAmount: parseFloat(centsAmount) * 100
      }),
    });

    const { sessionId } = await response.json();

    const result = await stripe.value.redirectToCheckout({ sessionId });

    if (result.error) {
      errorMessage.value = result.error.message;
    }
  } catch (error) {
    errorMessage.value = "An error occurred while creating the session.";
    console.error(error);
  } finally {
    isProcessing.value = false;
  }
};

onMounted(() => {
  loadStripeScript(() => {
    stripe.value = Stripe(import.meta.env.VITE_APP_STRIPE_PUBLIC_KEY);
  });
});

const loadStripeScript = (callback) => {
  if (document.getElementById("stripe-js")) {
    callback(); // If Stripe is already loaded, just call the callback
    return;
  }

  const script = document.createElement("script");
  script.id = "stripe-js";
  script.src = "https://js.stripe.com/v3/";
  script.async = true;
  script.onload = callback;
  document.head.appendChild(script);
};

</script>

<template>
    <v-stepper :items="steps" v-model="step" hide-actions >
      <template v-slot:item.1>
        <CreateOrderCartContentStepView/>
      </template>

      <template v-slot:item.2>
        <CreateOrderDeliveryStepView @deliveryNeeded="handleDeliveryNeeded"/>
      </template>

      <template v-slot:item.3>
        <CreateOrderPaymentStepView :deliveryNeeded="deliveryNeeded" :deliveryDistance="deliveryDistance"/>
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
