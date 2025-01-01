<script setup>
import { ref, onMounted, watch } from 'vue';
import { getAccessToken } from '@/auth';
import { useRouter } from 'vue-router';

const selectedLocation = ref(null);  // Holds the selected location
const notes = ref('');  // Holds the user's notes
const isLoading = ref(false);
const errorMessage = ref('');

const API_HOST = import.meta.env.VITE_APP_HOST;
const router = useRouter();

const map = ref(null);  // Holds the map instance
const marker = ref(null);  // Holds the marker instance

// Load Google Maps script dynamically
const loadGoogleMaps = () => {
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_APP_GMAPS_KEY}&libraries=places`;
  script.async = true;
  script.onload = () => {
    initMap();
  };
  document.head.appendChild(script);
};

// Initialize the map
const initMap = () => {
  const mapOptions = {
    center: { lat: 40.730610, lng: -73.935242 },  // Default location (New York)
    zoom: 14,
  };

  map.value = new google.maps.Map(document.getElementById('map'), mapOptions);

  // Add marker to the map
  marker.value = new google.maps.Marker({
    map: map.value,
    draggable: true,
    position: map.value.getCenter(),
  });

  // Update location on marker drag
  google.maps.event.addListener(marker.value, 'dragend', () => {
    const position = marker.value.getPosition();
    selectedLocation.value = {
      lat: position.lat(),
      lng: position.lng(),
    };
  });
};

// Create the order with location and notes
const createOrder = async () => {
  if (!selectedLocation.value) {
    errorMessage.value = 'Please select a delivery location.';
    return;
  }

  const accessToken = getAccessToken();
  const headers = new Headers();
  if (accessToken) {
    headers.append("Authorization", `Bearer ${accessToken}`);
    headers.append("Content-Type", "application/json");
  }

  const orderRequest = {
    deliveryLocation: selectedLocation.value,
    notes: notes.value
  };

  try {
    const response = await fetch(`${API_HOST}/api/orders`, {
      method: "POST",
      headers,
      body: JSON.stringify(orderRequest)
    });

    if (!response.ok) {
      throw new Error(`Failed to create order: status code ${response.status}`);
    }

    const createdOrder = await response.json();
    router.push({ name: 'order-details', params: { id: createdOrder.id } }); // Navigate to order details page
  } catch (error) {
    errorMessage.value = error.message || 'Error creating order.';
  }
};

// Watch for changes to selectedLocation
watch(selectedLocation, (newLocation) => {
  if (newLocation) {
    marker.value.setPosition(new google.maps.LatLng(newLocation.lat, newLocation.lng));
  }
});

onMounted(() => {
  isLoading.value = true;
  loadGoogleMaps();
});
</script>

<template>
  <div>
    <h1>Create Order</h1>

    <div v-if="isLoading">Loading...</div>
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>

    <div>
      <!-- Notes textarea -->
      <v-textarea
        v-model="notes"
        label="Additional Notes"
        rows="4"
      ></v-textarea>

      <!-- Google Maps Location Picker -->
      <div>
        <p>Please select a delivery location:</p>
        <div id="map" style="height: 400px;"></div>
      </div>

      <v-btn @click="createOrder" color="primary" class="mt-4">Create Order</v-btn>
    </div>
  </div>
</template>

<style scoped>
/* You can customize the styles as needed */
</style>
