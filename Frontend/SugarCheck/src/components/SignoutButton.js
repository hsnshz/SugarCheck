import React from "react";
import { DrawerItem } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";
import { CommonActions } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { signOut, persistor } from "../store/store";
import colors from "../../config/colors";

const SignOutButton = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleSignOut = async () => {
    try {
      await SecureStore.deleteItemAsync("userToken");
      dispatch(signOut());
      await persistor.purge();

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: "Welcome",
            },
          ],
        })
      );
    } catch (error) {
      console.error("Error during sign out: ", error);
      Alert.alert(
        "Error",
        "An error occurred during sign out. Please try again."
      );
    }
  };

  return (
    <DrawerItem
      label="Sign Out"
      labelStyle={{ color: colors.danger }}
      onPress={() =>
        Alert.alert(
          "Sign Out",
          "Are you sure you want to sign out?",
          [
            {
              text: "Yes",
              onPress: handleSignOut,
              style: "destructive",
            },
            {
              text: "Cancel",
              style: "cancel",
            },
          ],
          { cancelable: false }
        )
      }
      icon={({ color, size }) => (
        <Ionicons name="ios-log-out" color={colors.danger} size={size} />
      )}
    />
  );
};

export default SignOutButton;
