import {getAccessToken} from "@/service/auth.js";
import {ref} from "vue";

const API_HOST = import.meta.env.VITE_APP_HOST;

const stripe = ref(null);

const loadStripeCallback = () => {
  stripe.value = Stripe(import.meta.env.VITE_APP_STRIPE_PUBLIC_KEY);
}

export const loadStripeScript = (callback = loadStripeCallback) => {
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

const isProcessing = ref(false);
const errorMessage = ref("");

export const createCheckoutSession = async (orderId, centsAmount) => {
  try {
    isProcessing.value = true;
    errorMessage.value = "";

    const accessToken = getAccessToken();

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
