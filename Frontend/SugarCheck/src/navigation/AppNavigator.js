import React from "react";
import { Button } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import WelcomeScreen from "../screens/WelcomeScreen";
import SignInScreen from "../screens/SignInScreen";
import SignUpScreen from "../screens/SignUpScreen";
import { useNavigation } from "@react-navigation/native";
import HeaderBackButton from "../components/HeaderBackButton";
import colors from "../../config/colors";

const Stack = createStackNavigator();

function AppNavigator() {
  const navigation = useNavigation();
  return (
    <Stack.Navigator initialRouteName="Welcome">
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SignIn"
        component={SignInScreen}
        options={{
          headerShown: true,
          title: "",
          headerLeft: () => <HeaderBackButton />,
          headerStyle: {
            backgroundColor: colors.background,
          },
        }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{
          headerShown: true,
          title: "",
          headerLeft: () => <HeaderBackButton />,
          headerStyle: {
            backgroundColor: colors.background,
          },
        }}
      />
    </Stack.Navigator>
  );
}

export default AppNavigator;
