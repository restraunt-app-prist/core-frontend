// auth.js
import { ref } from 'vue';
import router from '../router/index.js';

const ACCESS_TOKEN = "access_token"

export const isAuthenticated = ref(!!localStorage.getItem(ACCESS_TOKEN));

export const login = async (accessToken) => {
  isAuthenticated.value = true;
  localStorage.setItem(ACCESS_TOKEN, accessToken);
  await router.push("/");
};

export const logout = async () => {
  isAuthenticated.value = false;
  localStorage.removeItem(ACCESS_TOKEN)
  await router.push("/");
};

export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN);
}