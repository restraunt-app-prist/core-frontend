<template>
  <v-container class="light-grey-container">
    <div>Home page</div>
    <RouterLink to="/about">About</RouterLink>
    <RouterLink to="/cart">Cart</RouterLink>
    <h1>Welcome to My App</h1>
    <p>
      This is some content placed below the app bar. The app bar does not
      overlap this content because it uses the `app` prop to reserve space
      in the layout.
    </p>
    <v-btn color="secondary">Click Me</v-btn>
    <Menu />
  </v-container>
</template>

<style lang="css" scoped>
.light-grey-container {
    background-color: rgba(245, 245, 245, 0.9);
    border-radius: 4px;
    min-height: 85vh;
    margin-top: 5px;
}
</style>