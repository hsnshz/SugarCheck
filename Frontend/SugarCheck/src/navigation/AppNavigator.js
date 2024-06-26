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
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";
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
import ExerciseScreen from "../screens/ExerciseScreen";
import ActivityProgress from "../components/ActivityProgress";
import LogMealsScreen from "../screens/LogMealsScreen";
import ReportGenerationScreen from "../screens/ReportGenerationScreen";
import PdfViewerScreen from "../screens/PDFViewerScreen";
import ResourcesScreen from "../screens/ResourcesScreen";
import ResourceViewerScreen from "../screens/ResourceViewerScreen";
import NotificationsSettings from "../screens/Profile/NotificationsSettings";
import TermsConditions from "../screens/Profile/TermsConditions";
import A1cResultComponent from "../components/A1cResultComponent";
import GetStartedScreen from "../screens/GetStartedScreen";

const Stack = createStackNavigator();

export function RootStackNavigator() {
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
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="TermsandConditions"
        component={TermsConditions}
        options={{
          headerShown: false,
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
      <Stack.Screen
        name="ActivityProgress"
        component={ActivityProgress}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="GetStarted"
        component={GetStartedScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="HealthProfileScreen"
        component={HealthProfile}
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
        name="NotificationsSettings"
        component={NotificationsSettings}
        options={{
          headerShown: false,
        }}
      />
      <ProfileStack.Screen
        name="TermsConditions"
        component={TermsConditions}
        options={{
          headerShown: false,
        }}
      />
      <ProfileStack.Screen
        name="ResetPassword"
        component={ResetPassword}
        options={{
          headerShown: false,
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

const PDFStack = createStackNavigator();

export function PDFStackNavigator() {
  return (
    <PDFStack.Navigator>
      <PDFStack.Screen
        name="ReportGenerationScreen"
        component={ReportGenerationScreen}
        options={{
          headerShown: false,
        }}
      />
      <PDFStack.Screen
        name="PdfViewerScreen"
        component={PdfViewerScreen}
        options={{
          headerShown: false,
        }}
      />
    </PDFStack.Navigator>
  );
}

const ResourcesStack = createStackNavigator();

export function ResourcesStackNavigator() {
  return (
    <ResourcesStack.Navigator>
      <ResourcesStack.Screen
        name="ResourcesScreen"
        component={ResourcesScreen}
        options={{
          headerShown: false,
        }}
      />
      <ResourcesStack.Screen
        name="ResourceViewerScreen"
        component={ResourceViewerScreen}
        options={{
          headerShown: false,
        }}
      />
    </ResourcesStack.Navigator>
  );
}

const GlucoseMonitorStack = createStackNavigator();

export function GlucoseMonitorStackNavigator() {
  return (
    <GlucoseMonitorStack.Navigator>
      <GlucoseMonitorStack.Screen
        name="GlucoseMonitorScreen"
        component={GlucoseMonitorScreen}
        options={{
          headerShown: false,
        }}
      />
      <GlucoseMonitorStack.Screen
        name="A1cResult"
        component={A1cResultComponent}
        options={{
          headerShown: false,
        }}
      />
    </GlucoseMonitorStack.Navigator>
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
          headerShown: false,
          drawerLabel: "Diabetes Prediction",
          drawerIcon: ({ color, size }) => (
            <MaterialIcon name="diabetes" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="Glucose Monitor"
        component={GlucoseMonitorStackNavigator}
        options={{
          headerShown: false,
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
        name="ReportGeneration"
        component={PDFStackNavigator}
        options={{
          headerShown: false,
          drawerIcon: ({ color, size }) => (
            <MaterialIcon name="file-document" color={color} size={size} />
          ),
          drawerLabel: "Generate Report",
        }}
      />
      <Drawer.Screen
        name="Resources"
        component={ResourcesStackNavigator}
        options={{
          headerShown: false,
          drawerIcon: ({ color, size }) => (
            <Ionicons name="ios-book" color={color} size={size} />
          ),
          drawerLabel: "Resources",
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
