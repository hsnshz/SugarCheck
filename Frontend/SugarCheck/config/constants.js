import Constants from "expo-constants";

// Use your local machine's IP address for development
const LOCAL_IP = "192.168.8.10";
const DEV_API_URL = `http://${LOCAL_IP}:5000`;
const PROD_API_URL = "https://api.example.com";

const getConstants = () => {
  // Check if the app is running in development or production mode
  const isDev = __DEV__;

  // Return the appropriate API URL based on the environment
  const API_URL = isDev ? DEV_API_URL : PROD_API_URL;
  console.log(API_URL);

  return {
    API_URL,
  };
};

export default getConstants;
