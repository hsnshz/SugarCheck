import React, { useState } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import colors from "../../../config/colors";
import axios from "axios";
import { getNgrokUrl } from "../../../config/constants";
import { useSelector, useDispatch } from "react-redux";
import { signOut, persistor } from "../../store/store";
import { CommonActions } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import Icon from "react-native-vector-icons/AntDesign";

const DeleteAccount = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);

  const handleDeleteAccount = async () => {
    try {
      console.log(`${getNgrokUrl()}/api/profile/delete-account/${user._id}`);
      const response = await axios.delete(
        `${getNgrokUrl()}/api/profile/delete-account/${user._id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        dispatch(signOut());
        await AsyncStorage.removeItem("@token");
        await SecureStore.deleteItemAsync("userToken");
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
      }
    } catch (error) {
      console.error("Error during account deletion: ", error);
      Alert.alert(
        "Error",
        "An error occurred during account deletion. Please try again."
      );
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="left" size={30} color={colors.darkBlue} />
        </TouchableOpacity>
        <Image
          source={require("../../../assets/icons/DarkAppIcon.png")}
          style={styles.logo}
        />
        <View style={{ width: 35 }} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 100,
          justifyContent: "center",
        }}
      >
        <View>
          <View style={styles.textContainer}>
            <Text style={styles.questionText}>
              Are you sure you want to delete your account?
            </Text>
            <Text style={styles.labelText}>
              This action cannot be reversed and all your data will be
              permanently deleted
            </Text>
          </View>

          <TouchableOpacity
            style={styles.btnDelete}
            onPress={() =>
              Alert.alert(
                "Delete Account",
                "Please confirm if you want to delete your account",
                [
                  {
                    text: "Yes",
                    onPress: handleDeleteAccount,
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
          >
            <Text style={styles.btnDeleteText}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.background,
    marginTop: 60,
    padding: 20,
  },
  logo: {
    width: 50,
    height: 50,
  },
  // subContainer: {
  //   backgroundColor: colors.white,
  //   borderWidth: 1,
  //   borderColor: colors.gray,
  //   borderRadius: 10,
  //   padding: 20,
  // },
  textContainer: {
    margin: 20,
    marginBottom: 20,
  },
  questionText: {
    fontSize: 20,
    fontFamily: "MontserratBold",
    textAlign: "center",
  },
  labelText: {
    fontSize: 16,
    fontFamily: "MontserratRegular",
    textAlign: "center",
    marginTop: 20,
  },
  btnDelete: {
    backgroundColor: colors.danger,
    padding: 15,
    width: "60%",
    alignSelf: "center",
    borderRadius: 5,
    margin: 20,
  },
  btnDeleteText: {
    fontFamily: "MontserratRegular",
    color: colors.white,
    textAlign: "center",
    fontSize: 18,
  },
});

export default DeleteAccount;
