<script setup>
import {ref, onMounted, watch} from "vue";

const RESTAURANT_LOCATION_LAT = parseFloat(import.meta.env.VITE_APP_RESTAURANT_LOCATION_LAT);
const RESTAURANT_LOCATION_LNG = parseFloat(import.meta.env.VITE_APP_RESTAURANT_LOCATION_LNG);

const RESTAURANT_LOCATION = {lat: RESTAURANT_LOCATION_LAT, lng: RESTAURANT_LOCATION_LNG};
const userLocation = ref(null); // User's current location
const roadDistance = ref(0); // Shortest distance between the restaurant and the user

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_APP_GMAPS_KEY;

const emit = defineEmits(["deliveryNeeded"]);

const deliveryNeeded = ref(false);

watch(deliveryNeeded, (newValue) => {
  const distance = newValue === true ? roadDistance.value : 0;
  console.log(userLocation.value)
  emit("deliveryNeeded", newValue, distance, userLocation.value);
});

onMounted(() => {
  loadGoogleMaps(() => {
    initMap();
  });
});

// Function to dynamically load the Google Maps script
const loadGoogleMaps = (callback) => {
  if (document.getElementById("google-maps-script")) {
    callback();
    return;
  }

  const script = document.createElement("script");
  script.id = "google-maps-script";
  script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
  script.async = true;
  script.onload = callback;
  document.head.appendChild(script);
};

// Function to initialize the map and calculate road distance
const initMap = () => {
  const map = new google.maps.Map(document.getElementById("map"), {
    center: RESTAURANT_LOCATION,
    zoom: 12,
  });

  // Add marker for the restaurant
  new google.maps.Marker({
    position: RESTAURANT_LOCATION,
    map: map,
    title: "Restaurant Location",
  });

  // Get user's current location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        (position) => {
          userLocation.value = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          // Add marker for the user's location
          new google.maps.Marker({
            position: userLocation.value,
            map: map,
            title: "Your Location",
            icon: {
              url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png", // Blue marker for user
            },
          });

          // Calculate road distance using Directions API and draw the route
          calculateAndDrawRoute(map);
        },
        () => {
          alert("Unable to retrieve your location.");
        }
    );
  } else {
    alert("Geolocation is not supported by your browser.");
  }
};

// Function to calculate distance by roads and draw the route
const calculateAndDrawRoute = (map) => {
  if (!userLocation.value) {
    return;
  }

  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer({
    map: map, // Attach the renderer to the map
    suppressMarkers: true, // Suppress default markers to use custom ones
  });

  directionsService.route(
      {
        origin: userLocation.value,
        destination: RESTAURANT_LOCATION,
        travelMode: google.maps.TravelMode.DRIVING, // Mode of transport
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          const route = result.routes[0];
          const distanceInMeters = route.legs[0].distance.value; // Distance in meters
          roadDistance.value = distanceInMeters / 1000; // Convert to km

          // Render the route on the map
          directionsRenderer.setDirections(result);
        } else {
          alert("Failed to calculate road distance: " + status);
        }
      }
  );
};
</script>

<template>
  <v-switch
      v-model="deliveryNeeded"
      label="Deliver the order?"
      color="primary"
      inset
  ></v-switch>
  <div v-if="roadDistance" class="distance-wrapper">
    <p class="distance-text">Road Distance: {{ roadDistance.toFixed(2) }} km</p>
  </div>
  <div id="map" style="height: 400px; width: 100%;"></div>
</template>

<style scoped>
#map {
  margin-top: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.distance-wrapper {
  margin-top: 15px;
  padding: 10px;
  background-color: #f5f5f5; /* Light background for contrast */
  border: 1px solid #ddd;
  border-radius: 8px;
  text-align: center; /* Center the text */
}

.distance-text {
  font-family: "Poppins", sans-serif; /* Stylish font */
  font-size: 1.2rem; /* Increase font size */
  font-weight: bold; /* Bold text for emphasis */
  color: #4caf50; /* Green color for the text */
}
</style>
