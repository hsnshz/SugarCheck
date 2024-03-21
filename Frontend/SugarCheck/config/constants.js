// Use your local machine's IP address for development
const LOCAL_IP = "10.100.136.98";
const DEV_API_URL = `http://${LOCAL_IP}:3000`;
const PROD_API_URL = "https://api.example.com";

const NGROK_URL = "https://b305-161-74-224-7.ngrok-free.app";

const RECIPE_SEARCH_APP_ID = "7f711a72";
const RECIPE_SEARCH_APP_KEY = "8927d3e7e21941f81f8fb0379b5b6d12";

const NUTRITION_APP_ID = "24dbe0ba";
const NUTRITION_APP_KEY = "f3cf0537ad13211eee37e5558f93928f";

const FOOD_DB_APP_ID = "70d01e7e";
const FOOD_DB_APP_KEY = "1807e5f921df87a5a96ee3cc5619ed7f";

const EXERCISE_API = "bbxICjNOAOt7wUrm/s4dbw==va4f46OzsDKi15Zz";

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

const getSearchAPIInfo = () => {
  return {
    RECIPE_SEARCH_APP_ID,
    RECIPE_SEARCH_APP_KEY,
  };
};

const getNutritionAPIInfo = () => {
  return {
    NUTRITION_APP_ID,
    NUTRITION_APP_KEY,
  };
};

const getFoodDBAPIInfo = () => {
  return {
    FOOD_DB_APP_ID,
    FOOD_DB_APP_KEY,
  };
};

const getExerciseAPI = () => {
  return EXERCISE_API;
};

export {
  getConstants,
  getNgrokUrl,
  getSearchAPIInfo,
  getNutritionAPIInfo,
  getFoodDBAPIInfo,
  getExerciseAPI,
};
