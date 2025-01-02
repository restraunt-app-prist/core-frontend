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
  futureDateTime: (value) => {
    if (!value) return 'Date and time are required';
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
  if (!newBooking.value.bookingDateTime) {
    errorMessage.value = 'Booking date and time is required.';
    return;
  }

  const inputDate = new Date(newBooking.value.bookingDateTime);
  if (inputDate <= new Date()) {
    errorMessage.value = 'Booking date and time must be in the future.';
    return;
  }

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

const     formatDateTime = (dateTime) => {
      const date = new Date(dateTime);
      return date.toLocaleString();
    }

// Determine the CSS class for the status
const statusClass = (status) => {
  switch (status) {
    case 'CONFIRMED':
      return 'confirmed';
    case 'PENDING':
      return 'pending';
    case 'CANCELLED':
      return 'cancelled';
    case 'COMPLETED':
      return 'completed';
    default:
      return '';
  }
};

// Initialize bookings on mount
onMounted(async () => {
    await fetchBookings();
});
</script>

<template>
  <div class="container">
    <h1 class="text-center">Booking Management</h1>

    <div v-if="isLoading" class="loading-message">Loading...</div>
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
          <v-card class="mx-auto booking-card">
            <v-card-title>
              Booking Details
            </v-card-title>
            <v-card-subtitle>
              <strong>Guests:</strong> {{ booking.numberOfGuests }}
            </v-card-subtitle>
            <v-card-text>
              <strong>Date & Time:</strong> 
              {{ formatDateTime(booking.bookingDateTime) }}<br />
              Status: <span :class="['status-tag', booking.status.toLowerCase()]">{{ booking.status }}</span><br />
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
/* Container Styles */
.container {
  width: 80%;
  margin: 0 auto;
  padding: 20px;
}

.text-center {
  text-align: center;
}

.loading-message {
  text-align: center;
  color: blue;
}

.error {
  color: red;
  margin-bottom: 10px;
}

.new-booking {
  margin-bottom: 40px;
}

v-btn {
  margin-top: 10px;
}

v-divider {
  margin-top: 20px;
}

/* Booking Card Styles */
.booking-card {
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background-color: #fafafa;
  padding: 15px;
}

.booking-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

.v-card-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
}

.v-card-subtitle {
  font-size: 1rem;
  color: #777;
}

.v-card-text {
  font-size: 0.95rem;
  color: #555;
  line-height: 1.6;
}

.v-card-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.v-card-actions .v-btn {
  font-size: 0.875rem;
}

.v-btn.red {
  background-color: #f44336;
  color: white;
}

.v-btn.red:hover {
  background-color: #d32f2f;
}

.v-btn.primary {
  background-color: #007bff;
  color: white;
}

.v-btn.primary:hover {
  background-color: #0056b3;
}

/* Grid Layout for Bookings */
.v-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.v-col {
  max-width: 350px;
  margin-bottom: 20px;
}

.v-card-actions .v-btn {
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 500;
}

/* Status Tag Styles */
.status-tag {
  display: inline-block;
  padding: 2px 4px;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: uppercase;
  color: white;
  text-align: center;
}

.status-tag.confirmed {
  background-color: #4caf50; /* Green */
}

.status-tag.pending {
  background-color: #ff9800; /* Orange */
}

.status-tag.cancelled {
  background-color: #f44336; /* Red */
}

.status-tag.completed {
  background-color: #2196f3; /* Blue */
}

/* Make Card Titles and Subtitles More Readable */
.v-card-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #333;
}

.v-card-subtitle {
  font-size: 1rem;
  color: #666;
}

.v-card-text {
  line-height: 1.6;
}
</style>
