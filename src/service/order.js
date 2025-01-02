import {getAccessToken} from "@/service/auth.js";

const API_HOST = import.meta.env.VITE_APP_HOST;

export async function makeOrder(deliveryLocation, deliveryDistance, description) {
  try {
    const response = await fetch(`${API_HOST}/api/order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAccessToken()}`,
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
