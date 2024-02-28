import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { setHeaderOptions } from "../components/HeaderOptions";
import Icon from "react-native-vector-icons/FontAwesome";
import colors from "../../config/colors";
import { useDispatch } from "react-redux";
import { Alert } from "react-native";
import { CommonActions } from "@react-navigation/native";
import { persistor, signOut } from "../store/store";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SettingsItem = ({ title, iconName, textStyle, onPress }) => (
  <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
    <View style={styles.iconContainer}>
      <Icon name={iconName} size={24} color={colors.black} />
    </View>
    <Text style={[styles.itemText, textStyle]}>{title}</Text>
    <Icon name="angle-right" size={24} color={colors.black} />
  </TouchableOpacity>
);

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleSignOut = async () => {
    try {
      // Remove the token from AsyncStorage
      await AsyncStorage.removeItem("@token");

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
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.section}>
          <SettingsItem
            title="Personal Information"
            iconName="user"
            onPress={() =>
              navigation.navigate("Profile", { screen: "PersonalInformation" })
            }
          />
        </View>
        <View style={styles.section}>
          <SettingsItem
            title="Health Profile"
            iconName="heartbeat"
            onPress={() =>
              navigation.navigate("Profile", { screen: "HealthProfile" })
            }
          />
          <SettingsItem
            title="Personal Preferences"
            iconName="sliders"
            onPress={() => {}}
          />
          <SettingsItem
            title="Notification Settings"
            iconName="bell"
            onPress={() => {}}
          />
          <SettingsItem
            title="Change Password"
            iconName="lock"
            onPress={() => {}}
          />
          <SettingsItem
            title="Terms & Conditions"
            iconName="file-text"
            onPress={() => {}}
          />
          <SettingsItem
            title="Account Settings"
            iconName="gear"
            onPress={() => {}}
          />
        </View>
        <View style={styles.section}>
          <SettingsItem
            textStyle={styles.logout}
            title="Log Out"
            iconName="sign-out"
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
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginTop: 20,
    backgroundColor: colors.white,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eaeaea",
  },
  iconContainer: {
    width: 30,
    alignItems: "center",
  },
  itemText: {
    flex: 1,
    marginLeft: 25,
    fontSize: 16,
  },
  logout: {
    color: colors.danger,
  },
});

export default ProfileScreen;
