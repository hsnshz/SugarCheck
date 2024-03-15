import React, { useCallback, useState } from "react";
import { StyleSheet } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import LogMealsScreen from "../screens/LogMealsScreen";
import RecipeSearchScreen from "../screens/RecipeSearchScreen";
import NutritionalAnalysisScreen from "../screens/NutritionalAnalysisScreen";
import colors from "../../config/colors";
import RecipeInfo from "../components/RecipeInfo";
import { createStackNavigator } from "@react-navigation/stack";
import LoggedMealsScreen from "../screens/LoggedMealsScreen";

const RecipeStack = createStackNavigator();

const RecipeStackScreen = () => (
  <RecipeStack.Navigator>
    <RecipeStack.Screen
      name="RecipeSearchScreen"
      options={{ headerShown: false }}
      component={RecipeSearchScreen}
    />
    <RecipeStack.Screen
      options={{ headerShown: false }}
      name="RecipeInfo"
      component={RecipeInfo}
    />
  </RecipeStack.Navigator>
);

const LogMealsStack = createStackNavigator();

const LogMealsStackScreen = () => (
  <LogMealsStack.Navigator>
    <LogMealsStack.Screen
      name="LogMealsScreen"
      component={LogMealsScreen}
      options={{ headerShown: false }}
    />
    <LogMealsStack.Screen
      name="LoggedMealsScreen"
      component={LoggedMealsScreen}
      options={{ headerShown: false }}
    />
  </LogMealsStack.Navigator>
);

const Tab = createMaterialTopTabNavigator();

const DietTabNavigator = () => {
  return (
    <Tab.Navigator
      style={styles.container}
      screenOptions={{
        tabBarStyle: { backgroundColor: colors.background },
        tabBarIndicatorStyle: { backgroundColor: colors.orange },
        tabBarLabelStyle: { fontSize: 14, fontFamily: "MontserratRegular" },
        tabBarActiveTintColor: colors.darkBlue,
        tabBarInactiveTintColor: colors.complementary,
      }}
    >
      <Tab.Screen name="Log Meals" component={LogMealsStackScreen} />
      <Tab.Screen name="Recipe Search" component={RecipeStackScreen} />
      <Tab.Screen
        name="Nutritional Analysis"
        component={NutritionalAnalysisScreen}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});

export default DietTabNavigator;
