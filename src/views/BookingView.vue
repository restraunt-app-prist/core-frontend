<script setup>
import { ref, onMounted } from 'vue';
import { getAccessToken } from '@/service/auth.js';

const bookings = ref([]);
const newBooking = ref({
  bookingDateTime: '',
  numberOfGuests: 1,
  notes: '',
});
const isLoading = ref(false);
const errorMessage = ref('');
const API_HOST = import.meta.env.VITE_APP_HOST;

const rules = {
  required: (value) => !!value || 'This field is required',
  futureDate: (value) => {
    if (!value) return true; // Skip validation if empty
    const today = new Date();
    const inputDate = new Date(value);
    return inputDate > today || 'Date must be in the future';
  },
};

// Fetch bookings by user ID
const fetchBookings = async () => {
  const accessToken = getAccessToken();
  const headers = new Headers();
  if (accessToken) {
    headers.append('Authorization', `Bearer ${accessToken}`);
  }

  try {
    isLoading.value = true;
    const response = await fetch(`${API_HOST}/api/bookings/user/me`, { headers });
    if (!response.ok) {
      throw new Error(`Failed to fetch bookings: status code ${response.status}`);
    }
    bookings.value = await response.json();
  } catch (error) {
    errorMessage.value = error.message || 'Error loading bookings.';
  } finally {
    isLoading.value = false;
  }
};

// Create a new booking
const createBooking = async () => {
  const accessToken = getAccessToken();
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  if (accessToken) {
    headers.append('Authorization', `Bearer ${accessToken}`);
  }

  try {
    isLoading.value = true;
    const response = await fetch(`${API_HOST}/api/bookings`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ ...newBooking.value }),
    });
    if (!response.ok) {
      throw new Error(`Failed to create booking: status code ${response.status}`);
    }
    await fetchBookings(); // Refresh bookings list
    newBooking.value = { bookingDateTime: '', numberOfGuests: 1, notes: '' };
  } catch (error) {
    errorMessage.value = error.message || 'Error creating booking.';
  } finally {
    isLoading.value = false;
  }
};

// Cancel a booking
const cancelBooking = async (bookingId) => {
  const accessToken = getAccessToken();
  const headers = new Headers();
  if (accessToken) {
    headers.append('Authorization', `Bearer ${accessToken}`);
  }

  try {
    isLoading.value = true;
    const response = await fetch(`${API_HOST}/api/bookings/${bookingId}/cancel`, {
      method: 'PATCH',
      headers,
    });
    if (!response.ok) {
      throw new Error(`Failed to cancel booking: status code ${response.status}`);
    }
    await fetchBookings(); // Refresh bookings list
  } catch (error) {
    errorMessage.value = error.message || 'Error canceling booking.';
  } finally {
    isLoading.value = false;
  }
};

// Initialize bookings on mount
onMounted(async () => {
    await fetchBookings();
});
</script>

<template>
  <div>
    <h1>Booking Management</h1>

    <div v-if="isLoading">Loading...</div>
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>

    <!-- New Booking Form -->
    <div class="new-booking">
      <h2>Create a New Booking</h2>
      <v-form fast-fail @submit.prevent="createBooking">
        <v-text-field
        label="Booking Date and Time"
        type="datetime-local"
        v-model="newBooking.bookingDateTime"
        :rules="[rules.required, rules.futureDateTime]"
        outlined
        required
        ></v-text-field>
        <v-text-field
          label="Number of Guests"
          type="number"
          min="1"
          v-model="newBooking.numberOfGuests"
          required
        ></v-text-field>
        <v-textarea label="Notes" v-model="newBooking.notes"></v-textarea>
        <v-btn color="primary" type="submit">Create Booking</v-btn>
      </v-form>
    </div>

    <v-divider class="my-4"></v-divider>

    <!-- Booking List -->
    <div v-if="bookings.length">
      <h2>Your Bookings</h2>
      <v-row>
        <v-col v-for="booking in bookings" :key="booking.id" cols="12" md="4">
          <v-card class="mx-auto" max-width="344">
            <v-card-title>
              Booking for {{ booking.bookingDateTime }}
            </v-card-title>
            <v-card-subtitle>
              Guests: {{ booking.numberOfGuests }}
            </v-card-subtitle>
            <v-card-text>
              Status: {{ booking.status }} <br />
              Notes: {{ booking.notes || 'No notes' }}
            </v-card-text>
            <v-card-actions>
              <v-btn
                v-if="booking.status === 'CONFIRMED'"
                color="red"
                text
                @click="cancelBooking(booking.id)"
              >
                Cancel Booking
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <div v-else>No bookings found.</div>
  </div>
</template>

<style scoped>
.error {
  color: red;
  margin-bottom: 10px;
}
</style>
