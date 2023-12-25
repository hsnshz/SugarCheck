import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import DiabetesFormScreen from "../screens/DiabetesFormScreen";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Home") {
              iconName = focused ? "ios-home" : "ios-home-outline";
            } else if (route.name === "DiabetesForm") {
              iconName = focused ? "ios-list" : "ios-list-outline";
            }
            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "white",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: {
            backgroundColor: "#333333", // Use your preferred background color
          },
        })}
      >
        {/* Add other tabs if you have other screens */}
        <Tab.Screen
          name="DiabetesForm"
          component={DiabetesFormScreen}
          options={{ headerShown: false }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
