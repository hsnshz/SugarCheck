import React from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import SplashScreen from "../screens/SplashScreen";
import HomeScreen from "../screens/HomeScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import SignInScreen from "../screens/SignInScreen";
import SignUpScreen from "../screens/SignUpScreen";
import DiabetesFormScreen from "../screens/DiabetesFormScreen";
import Navbar from "../components/Navbar";
import HeaderBackButton from "../components/HeaderBackButton";
import colors from "../../config/colors";
import ProfileScreen from "../screens/ProfileScreen";
import { Heading } from "../../config/styledText";
import { Ionicons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/AntDesign";
import GlucoseMonitorScreen from "../screens/GlucoseMonitorScreen";
import PersonalInformation from "../screens/Profile/PersonalInformation";
import HealthProfile from "../screens/Profile/HealthProfile";
import EmailVerificationScreen from "../screens/EmailVerificationScreen";
import DietTabNavigator from "./DietTabNavigator";
import RecipeInfo from "../components/RecipeInfo";
import RecipeSearchScreen from "../screens/RecipeSearchScreen";
import DietScreen from "../screens/DietScreen";
import FavoriteRecipesScreen from "../screens/FavoriteRecipesScreen";
import SignOutButton from "../components/SignoutButton";
import ResetPassword from "../screens/Profile/ResetPassword";
import DeleteAccount from "../screens/Profile/DeleteAccount";
import ChangePassword from "../screens/Profile/ChangePassword";
import LoggedMealsScreen from "../screens/LoggedMealsScreen";

const Stack = createStackNavigator();

export function RootStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
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
          headerShown: false,
          // title: "",
          // headerLeft: () => <HeaderBackButton />,
          // headerStyle: {
          //   backgroundColor: colors.background,
          //   borderBottomWidth: 0,
          //   shadowOpacity: 0,
          // },
        }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{
          headerShown: false,
          // title: "",
          // headerLeft: () => <HeaderBackButton />,
          // headerStyle: {
          //   backgroundColor: colors.background,
          //   borderBottomWidth: 0,
          //   shadowOpacity: 0,
          // },
        }}
      />
      <Stack.Screen
        name="EmailVerificationScreen"
        component={EmailVerificationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Main"
        component={DrawerNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ResetPasswordScreen"
        component={ResetPassword}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

const ProfileStack = createStackNavigator();

export function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={({ navigation }) => ({
          drawerLabel: "Profile Settings",
          headerTitle: "Profile Settings",
          animationEnabled: true,
          headerStyle: {
            height: 130,
            backgroundColor: colors.background,
            borderBottomWidth: 0,
            shadowOpacity: 0,
          },
          headerLeft: () => (
            <TouchableOpacity
              style={{ marginLeft: 20 }}
              onPress={() => navigation.openDrawer()}
            >
              <Ionicons name="ios-menu" size={35} color={colors.primary} />
            </TouchableOpacity>
          ),
        })}
      />
      <ProfileStack.Screen
        name="PersonalInformation"
        component={PersonalInformation}
        options={{
          headerShown: false,
        }}
      />
      <ProfileStack.Screen
        name="HealthProfile"
        component={HealthProfile}
        options={{
          headerShown: false,
        }}
      />
      <ProfileStack.Screen
        name="ResetPassword"
        component={ResetPassword}
        options={{
          headerShown: false,
          // headerTitle: "Reset Password",
          // headerStyle: {
          //   height: 130,
          //   backgroundColor: colors.background,
          //   borderBottomWidth: 0,
          //   shadowOpacity: 0,
          // },
          // headerBackImage: () => (
          //   <Icon
          //     name="left"
          //     size={30}
          //     color={colors.darkBlue}
          //     style={{ marginLeft: 20 }}
          //   />
          // ),
          // headerBackTitleVisible: false,
        }}
      />
      <ProfileStack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{
          headerShown: false,
        }}
      />
      <ProfileStack.Screen
        name="DeleteAccount"
        component={DeleteAccount}
        options={{
          headerShown: false,
        }}
      />
    </ProfileStack.Navigator>
  );
}

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView
      {...props}
      style={{ backgroundColor: colors.background }}
    >
      <View
        style={{
          padding: 50,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          source={require("../../assets/icons/DarkAppIcon.png")}
          style={{ width: 70, height: 70 }}
        />
        <Heading>SugarCheck</Heading>
      </View>
      <DrawerItemList
        {...props}
        labelStyle={{ color: colors.primary }}
        activeBackgroundColor={{ color: colors.active }}
        inactiveBackgroundColor={{ color: colors.inactive }}
        activeTintColor={{ color: colors.active }}
        inactiveTintColor={{ color: colors.inactive }}
      />
    </DrawerContentScrollView>
  );
}

const RecipeStack = createStackNavigator();

export function RecipeStackNavigator() {
  return (
    <RecipeStack.Navigator>
      <RecipeStack.Screen
        name="FavoriteRecipesScreen"
        component={FavoriteRecipesScreen}
        options={{
          headerShown: false,
          drawerIcon: ({ color, size }) => (
            <Ionicons name="ios-heart" color={color} size={size} />
          ),
        }}
      />
      <RecipeStack.Screen
        name="RecipeInfo"
        component={RecipeInfo}
        options={{
          headerShown: false,
        }}
      />
    </RecipeStack.Navigator>
  );
}

const Drawer = createDrawerNavigator();

export function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        gestureEnabled: true,
      }}
      drawerContent={(props) => (
        <DrawerContentScrollView
          style={{ backgroundColor: colors.background }}
          {...props}
        >
          <CustomDrawerContent {...props} />
          <SignOutButton />
        </DrawerContentScrollView>
      )}
    >
      <Drawer.Screen
        name="Navbar"
        component={Navbar}
        options={{
          headerShown: false,
          drawerLabel: "Home",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="ios-home" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="DiabetesForm"
        component={DiabetesFormScreen}
        options={{
          headerLeft: null,
          drawerLabel: "Diabetes Prediction",
          headerTitle: "Diabetes Prediction",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="ios-list" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="Glucose Monitor"
        component={GlucoseMonitorScreen}
        options={{
          headerLeft: null,
          headerTitle: "Glucose Logging",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="ios-pulse" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="Favorite Recipes"
        component={RecipeStackNavigator}
        options={{
          headerShown: false,
          drawerIcon: ({ color, size }) => (
            <Ionicons name="ios-heart" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={{
          headerShown: false,
          drawerIcon: ({ color, size }) => (
            <Ionicons name="ios-person" color={color} size={size} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}
