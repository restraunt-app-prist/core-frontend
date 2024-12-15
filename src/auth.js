// auth.js
import { ref } from 'vue';
import router from './router';

const ACCESS_TOKEN = "access_token"

export const isAuthenticated = ref(!!localStorage.getItem(ACCESS_TOKEN));

// export const getCurrentUseProfile = async (accessToken) => {
//   console.log(isAuthenticated.value);
//   if (isAuthenticated.value === false) {
//     return null;
//   }

//   console.log("fetching....");
//   const myHeaders = new Headers();
//   myHeaders.append("Authorization", `Bearer ${accessToken}`);
  
//   const requestOptions = {
//     method: "GET",
//     headers: myHeaders
//   };
  
//   console.log(`${import.meta.env.VITE_APP_HOST}/api/user/current`);
//   const response = await fetch(`${import.meta.env.VITE_APP_HOST}/api/user/current`, requestOptions);
//   if (!response.ok) {
//     throw new Error(`cannot get current user: status code ${response.status}`);
//   }
//   const json = await response.json();
//   currentUser.value = JSON.parse(json);
// };

export const login = async (accessToken) => {
  isAuthenticated.value = true;
  localStorage.setItem(ACCESS_TOKEN, accessToken)
};

export const logout = () => {
  isAuthenticated.value = false;
  localStorage.removeItem(ACCESS_TOKEN)
  router.push("/");
};

