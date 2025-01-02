<script setup>
import { ref, onMounted } from "vue";
import { getAccessToken } from "@/service/auth.js"; // Function to retrieve access token

const API_HOST = import.meta.env.VITE_APP_HOST;
const stripe = ref(null);

const productName = ref("Delicious Meal");
const amount = ref(50); // Default amount in USD
const isProcessing = ref(false);
const errorMessage = ref("");

const createCheckoutSession = async () => {
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
        productName: productName.value,
        amount: parseFloat(amount.value) * 100
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
  <div>
    <h1>Restaurant Checkout</h1>
    <form @submit.prevent="createCheckoutSession">
      <div>
        <label for="product">Product Name:</label>
        <input
            type="text"
            id="product"
            v-model="productName"
            placeholder="Enter product name"
        />
      </div>

      <div>
        <label for="amount">Amount (USD):</label>
        <input
            type="number"
            id="amount"
            v-model="amount"
            placeholder="Enter amount"
        />
      </div>

      <button type="submit" :disabled="isProcessing">
        {{ isProcessing ? "Processing..." : "Checkout" }}
      </button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 400px;
  margin: 0 auto;
}

label {
  font-weight: bold;
}

input {
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
}

button {
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #4caf50;
  color: white;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: gray;
  cursor: not-allowed;
}

.error {
  color: red;
  margin-top: 1rem;
  text-align: center;
}
</style>
