
import axios from 'axios';
import history from '@/lib/history';

const FETCH_BASE_URL = import.meta.env.VITE_FETCH_API;

/** Pre-configured single instance of the API client and reused throughout the application*/ 
const axiosClient = axios.create({
    baseURL: FETCH_BASE_URL,
    withCredentials: true,
});

// Add an Axios interceptor to handle authentication failures
axiosClient.interceptors.response.use(
    (response) => response, // No changes for successful responses
    (error) => {
      if (error.response && error.response.status === 401) {
        console.log('401 unauthorized')
        // Handle 401 Unauthorized (authentication failure)
        // You can redirect the user to the login screen here
        history.replace('/auth/login')
      }
      return Promise.reject(error);
    }
  );
  

export default axiosClient;