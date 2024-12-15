<template>
  <v-container class="mt-5">
    <v-row>
      <v-col cols="12" md="6" offset-md="3">
        <v-card class="pa-3">
          <v-avatar size="100" class="mb-3">
            <img :src="user.picture" alt="User Avatar" />
          </v-avatar>
          <v-card-title>{{ user.name }}</v-card-title>
          <v-card-subtitle>{{ user.email }}</v-card-subtitle>
          <v-card-actions>
            <v-btn color="primary" @click="logout">Logout</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "ProfilePage",
  data() {
    return {
      user: {
        name: "",
        email: "",
        picture: "",
      },
    };
  },
  created() {
    this.loadUserInfo();
  },
  methods: {
    async loadUserInfo() {
      try {
        // Extract token from localStorage or cookies
        const idToken = localStorage.getItem("access_token");

        if (!idToken) {
          // Redirect to login if no token is found
          this.$router.push("/login");
          return;
        }

        // Decode the ID token to get user information
        const base64Url = idToken.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );

        this.user = JSON.parse(jsonPayload);
      } catch (error) {
        console.error("Failed to load user info:", error);
        this.$router.push("/login");
      }
    },
    logout() {
      // Clear token and redirect to login
      localStorage.removeItem("google_id_token");
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
.v-avatar img {
  border-radius: 50%;
}
</style>
