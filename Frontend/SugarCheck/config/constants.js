// Use your local machine's IP address for development
const LOCAL_IP = "10.100.136.98";
const DEV_API_URL = `http://${LOCAL_IP}:3000`;
const PROD_API_URL = "https://api.example.com";

const NGROK_URL = "https://0240-161-74-224-2.ngrok-free.app";

const getConstants = () => {
  // Check if the app is running in development or production mode
  const isDev = __DEV__;

  // Return the appropriate API URL based on the environment
  const API_URL = isDev ? DEV_API_URL : PROD_API_URL;

  return {
    API_URL,
  };
};

const getNgrokUrl = () => {
  return NGROK_URL;
};

export { getConstants, getNgrokUrl };
