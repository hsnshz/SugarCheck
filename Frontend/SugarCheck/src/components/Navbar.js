import React from "react";
import { View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import DietScreen from "../screens/DietScreen";
import HomeScreen from "../screens/HomeScreen";
import ExerciseScreen from "../screens/ExerciseScreen";
import colors from "../../config/colors";
import { CardStyleInterpolators } from "@react-navigation/stack";

const Tab = createBottomTabNavigator();

function Navbar() {
  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let iconType = Ionicons;

          switch (route.name) {
            case "HomeTab":
              iconName = focused ? "home" : "home";
              iconType = FontAwesome5;
              break;
            case "Diet":
              iconName = focused ? "utensils" : "utensils";
              iconType = FontAwesome5;
              break;
            case "Exercise":
              iconName = focused ? "running" : "running";
              iconType = FontAwesome5;
              break;
          }

          if (route.name === "HomeTab") {
            return (
              <View
                style={{
                  top: -10,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                    backgroundColor: focused
                      ? colors.buttonPrimary
                      : colors.active,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {React.createElement(iconType, {
                    name: iconName,
                    size: 35,
                    color: colors.white,
                  })}
                </View>
              </View>
            );
          }

          return React.createElement(iconType, {
            name: iconName,
            size,
            color: focused ? colors.buttonPrimary : colors.white,
          });
        },
        tabBarStyle: {
          backgroundColor: colors.navbar,
          borderTopWidth: 0,
          height: 90,
          paddingBottom: 5,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 5,
        },
        tabBarShowLabel: false,
      })}
    >
      <Tab.Screen
        name="Diet"
        component={DietScreen}
        options={{
          headerShown: true,
          headerTitle: "Diet",
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: colors.background,
            shadowColor: "transparent",
          },
          headerTintColor: colors.primary,
          tabBarLabel: "Diet",
        }}
      />
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          headerShown: true,
          headerTitle: "Home",
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: colors.background,
            shadowColor: "transparent",
          },
          headerTintColor: colors.primary,
          tabBarLabel: "Home",
          headerLeft: null,
        }}
      />
      <Tab.Screen
        name="Exercise"
        component={ExerciseScreen}
        options={{
          headerShown: true,
          headerTitle: "Exercise",
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: colors.background,
            shadowColor: "transparent",
          },
          headerTintColor: colors.primary,
          tabBarLabel: "Exercise",
        }}
      />
    </Tab.Navigator>
  );
}

export default Navbar;
