<template>
  <v-container>
    <v-row class="justify-center">
      <v-col cols="12" md="8">
          <v-img
            src="https://a.storyblok.com/f/125576/2448x1220/4b08d26fdf/hero_family-style-dining.jpg/m/1440x0"
            height="400px"
            class="white--text"
          >
            <v-row
              class="fill-height"
              align="center"
              justify="center"
            >
              <v-col class="text-center">
                <v-btn
                  color="primary"
                  dark
                  large
                  @click="scrollToSection('about')"
                >
                  Learn More
                </v-btn>
              </v-col>
            </v-row>
          </v-img>

          <v-card-title class="text-center">
            <v-avatar size="120" class="mx-auto">
              <img src="/public/logo.webp" alt="Restaurant Logo" class="avatar-img" />
            </v-avatar>
          </v-card-title>


          <v-card-subtitle class="text-center">
            <h2>Welcome to Our Family Restaurant</h2>
            <p>
              Located in the heart of Kyiv, we are a family-owned restaurant offering a unique blend of Italian and Japanese cuisines, served with love and care. 
            </p>
          </v-card-subtitle>

          <v-card-text id="about">
            <v-row>
              <v-col v-for="(section, index) in sections" :key="index" cols="12" md="6">
                <v-card>
                  <v-img
                    :src="section.image"
                    height="200px"
                    :alt="section.title"
                    class="cuisine-image"
                  />
                  <v-card-title>{{ section.title }}</v-card-title>
                  <v-card-text>
                    <p>{{ section.description }}</p>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-text class="text-center">
            <p>
              As a family restaurant, we treat every guest like part of our own family. Whether you're here for a cozy meal or a special celebration, we are dedicated to providing you with the finest dining experience.
            </p>
            <p>
              Join us to experience the best of both worlds: the rich flavors of Italy and the delicate artistry of Japan, all under one roof in Kyiv.
            </p>
            <v-btn
              color="secondary"
              large
              @click="scrollToSection('contact')"
            >
              Contact Us
            </v-btn>
          </v-card-text>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      sections: [
        {
          title: "Italian Cuisine",
          description:
            "Our Italian menu features classic dishes like pasta, risotto, and wood-fired pizzas, all made with fresh, high-quality ingredients.",
          image: "https://rp-cms.imgix.net/wp-content/uploads/AdobeStock_513646998-scaled.jpeg",
        },
        {
          title: "Japanese Cuisine",
          description:
            "Dive into the world of sushi, ramen, and tempura, prepared with authenticity and precision, using the finest fish and ingredients.",
          image: "data:image/jpeg;base64,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",
        },
      ],
    };
  },
  methods: {
    scrollToSection(sectionId) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    },
  },
};
</script>

<style scoped>
/* Global Styles */
.v-container {
  padding-top: 20px;
}

.v-card-title h2 {
  font-size: 2.2rem;
  font-weight: 700;
}

.v-card-subtitle {
  font-size: 1.1rem;
  color: #555;
}

.v-card-text {
  font-size: 1rem;
  line-height: 1.6;
}

.v-btn {
  margin-top: 20px;
}

.v-divider {
  margin-top: 20px;
}

/* Ensuring images fit uniformly */
.cuisine-image {
  object-fit: cover;
  width: 100%;
  height: 200px;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
