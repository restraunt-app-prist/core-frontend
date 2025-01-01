<script setup>
import { ref, onMounted, watch } from 'vue';
import { getAccessToken } from '@/auth';
import { useRouter } from 'vue-router';

const selectedLocation = ref(null);  // Holds the selected location
const notes = ref('');  // Holds the user's notes
const isLoading = ref(false);
const errorMessage = ref('');
const distanceToRestaurant = ref(null);  // Holds the calculated distance to the restaurant

const API_HOST = import.meta.env.VITE_APP_HOST;
const router = useRouter();

// Function to generate a random latitude and longitude within Kyiv
const generateRandomKyivLocation = () => {
  const kyivLat = 50.4501;  // Latitude of Kyiv
  const kyivLng = 30.6400;  // Longitude of Kyiv

  // Generate a random offset (within a small range around Kyiv's center)
  const latOffset = (Math.random() - 0.5) * 0.1;  // Random offset between -0.05 and 0.05 degrees
  const lngOffset = (Math.random() - 0.5) * 0.1;  // Random offset between -0.05 and 0.05 degrees

  // Return a random location in Kyiv
  return {
    lat: kyivLat + latOffset,
    lng: kyivLng + lngOffset,
  };
};

// Define restaurant location (Random within Kyiv)
const restaurantLocation = generateRandomKyivLocation();

const map = ref(null);  // Holds the map instance
const marker = ref(null);  // Holds the marker instance

// Load Google Maps script dynamically
const loadGoogleMaps = () => {
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_APP_GMAPS_KEY}&libraries=places,geometry`;
  script.async = true;
  script.onload = () => {
    initMap();
  };
  document.head.appendChild(script);
};

// Initialize the map
const initMap = () => {
  // Default map options
  const mapOptions = {
    zoom: 14,
  };

  // Check for geolocation and use it if available, otherwise use the restaurant location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        mapOptions.center = userLocation;

        // Initialize map with user location
        map.value = new google.maps.Map(document.getElementById('map'), mapOptions);

        // Add marker for the restaurant
        new google.maps.Marker({
          map: map.value,
          position: restaurantLocation,
          label: 'Restaurant',
        });

        // Add marker for the user (draggable)
        marker.value = new google.maps.Marker({
          map: map.value,
          draggable: true,
          position: userLocation,  // Initially set marker to user's geolocation
        });

        // Update location and calculate distance on marker drag
        google.maps.event.addListener(marker.value, 'dragend', () => {
          const userLatLng = marker.value.getPosition();
          selectedLocation.value = {
            lat: userLatLng.lat(),
            lng: userLatLng.lng(),
          };
          calculateDistanceToRestaurant();
        });

        // Calculate distance initially when the marker is placed at user's location
        calculateDistanceToRestaurant();
      },
      () => {
        // If geolocation fails, default to restaurant location
        mapOptions.center = restaurantLocation;
        map.value = new google.maps.Map(document.getElementById('map'), mapOptions);
        
        new google.maps.Marker({
          map: map.value,
          position: restaurantLocation,
          label: 'Restaurant',
        });

        marker.value = new google.maps.Marker({
          map: map.value,
          draggable: true,
          position: restaurantLocation,  // Default to restaurant location
        });

        calculateDistanceToRestaurant();
      }
    );
  } else {
    // If geolocation is not available, default to restaurant location
    mapOptions.center = restaurantLocation;
    map.value = new google.maps.Map(document.getElementById('map'), mapOptions);
    
    new google.maps.Marker({
      map: map.value,
      position: restaurantLocation,
      label: 'Restaurant',
    });

    marker.value = new google.maps.Marker({
      map: map.value,
      draggable: true,
      position: restaurantLocation,  // Default to restaurant location
    });

    calculateDistanceToRestaurant();
  }
};

// Calculate the distance to the restaurant
const calculateDistanceToRestaurant = () => {
  if (selectedLocation.value) {
    const userLatLng = new google.maps.LatLng(selectedLocation.value.lat, selectedLocation.value.lng);
    const restaurantLatLng = new google.maps.LatLng(restaurantLocation.lat, restaurantLocation.lng);

    // Calculate the distance in meters
    distanceToRestaurant.value = google.maps.geometry.spherical.computeDistanceBetween(userLatLng, restaurantLatLng);
  }
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
    notes: notes.value,
  };

  try {
    const response = await fetch(`${API_HOST}/api/orders`, {
      method: "POST",
      headers,
      body: JSON.stringify(orderRequest),
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
watch(selectedLocation, () => {
  calculateDistanceToRestaurant();
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

      <div v-if="distanceToRestaurant !== null">
        <p>Distance to restaurant: {{ (distanceToRestaurant / 1000).toFixed(2) }} km</p> <!-- Display distance in km -->
      </div>

      <v-btn @click="createOrder" color="primary" class="mt-4">Create Order</v-btn>
    </div>
  </div>
</template>

<style scoped>
/* You can customize the styles as needed */
</style>
