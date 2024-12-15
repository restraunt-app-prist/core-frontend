// auth.js
import { ref } from 'vue';
import router from './router';

const ACCESS_TOKEN = "access_token"

export const isAuthenticated = ref(!!localStorage.getItem(ACCESS_TOKEN));

export const login = async (accessToken) => {
  isAuthenticated.value = true;
  localStorage.setItem(ACCESS_TOKEN, accessToken);
  router.push("/");
};

export const logout = () => {
  isAuthenticated.value = false;
  localStorage.removeItem(ACCESS_TOKEN)
  router.push("/");
};

export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN);
}