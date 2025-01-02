<script setup>
import SignUpWithGoogleButton from './SignUpWithGoogleButton.vue';
import {isAuthenticated} from '@/auth.js';
import UserAvatar from './UserAvatar.vue';
</script>

<template>
  <v-app-bar app color="#800000" dark>
    <v-app-bar-title class="logo-container">
      <v-app-bar-title class="restaurant-name">
        Mouton-Rothschild
      </v-app-bar-title>
    </v-app-bar-title>

    <!-- Navigation Links -->
    <div class="nav-links"  v-if="isAuthenticated">
      <v-btn class="nav-link" to="/">
        Menu
      </v-btn>
      <v-btn class="nav-link" to="/booking">
        Booking
      </v-btn>
      <v-btn class="nav-link" to="/about">
        About
      </v-btn>
      <v-btn class="nav-link" to="/cart">
        Cart
      </v-btn>
      <v-btn class="nav-link" to="/my-orders">
        Orders
      </v-btn>
      <v-btn class="nav-link" to="/profile">
        Profile
      </v-btn>
    </div>

    <!-- Spacer to push Login or User Avatar -->
    <v-spacer></v-spacer>

    <!-- Login Button -->
    <UserAvatar
        v-if="isAuthenticated"
        picture="https://randomuser.me/api/portraits/men/85.jpg"
    />
    <SignUpWithGoogleButton v-else/>
  </v-app-bar>
</template>

<style scoped>

@import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');

.restaurant-name {
  font-family: 'Great Vibes', cursive; /* Apply curly font */
  font-size: 2rem; /* Adjust size for visibility */
  font-weight: 400; /* Normal weight for cursive fonts */
  color: #ffe4e1; /* Soft light color to contrast with the dark app bar */
  margin: 0; /* Remove extra margin */
}

.logo-container {
  flex: 1;
  text-align: center;
}


.nav-links {
  display: flex;
  gap: 15px; /* Adds spacing between the buttons */
  margin-left: 20px; /* Adjusts positioning closer to the left */
}

.nav-link {
  font-weight: bold;
  color: #f5f5f5; /* Light color for contrast */
  text-transform: capitalize;
}

.nav-link:hover {
  color: #ffe4e1; /* Softer hover color */
}
</style>
