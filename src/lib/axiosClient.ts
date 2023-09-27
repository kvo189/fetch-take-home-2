import { DELAY_API_CALLS_MS, ERROR_PROBABILITY, FETCH_BASE_URL } from '@/config';

import axios from 'axios';
import history from '@/lib/history';

/** Pre-configured single instance of the API client and reused throughout the application*/
const axiosClient = axios.create({
  baseURL: FETCH_BASE_URL,
  withCredentials: true,
});

axiosClient.interceptors.request.use((config) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < ERROR_PROBABILITY) {
        reject({ response: { status: 500, data: 'Simulated error' } });
      } else {
        resolve(config);
      }
    }, DELAY_API_CALLS_MS);
  });
});

// Add an Axios interceptor to handle authentication failures
axiosClient.interceptors.response.use(
  (response) => response, // No changes for successful responses
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log('401 unauthorized')
      // Handle 401 Unauthorized (authentication failure)
      // Redirect the user to the login screen
      history.replace('/auth/login')
    }
    return Promise.reject(error);
  }
);


export default axiosClient;