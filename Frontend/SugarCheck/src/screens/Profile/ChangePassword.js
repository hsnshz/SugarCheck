import React, { useState, useRef } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import colors from "../../../config/colors";
import axios from "axios";
import * as Haptics from "expo-haptics";
import { getNgrokUrl } from "../../../config/constants";
import { useSelector, useDispatch } from "react-redux";
import Toast from "react-native-fast-toast";

const ChangePassword = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user) || {};
  const token = useSelector((state) => state.auth.token) || "";

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const toastRef = useRef(null);
  const newPasswordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const validatePassword = () => {
    if (
      currentPassword.trim() === "" ||
      newPassword.trim() === "" ||
      confirmPassword.trim() === ""
    ) {
      setErrorMessage("Fields cannot be empty");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return false;
    }

    // Password validation
    if (newPassword.length < 8) {
      setErrorMessage("Password must be at least 8 characters long");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return false;
    }

    let lowerCaseLetters = /[a-z]/g;
    if (!newPassword.match(lowerCaseLetters)) {
      setErrorMessage("Password must have at least 1 lowercase letter");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return false;
    }

    let upperCaseLetters = /[A-Z]/g;
    if (!newPassword.match(upperCaseLetters)) {
      setErrorMessage("Password must have at least 1 uppercase letter");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return false;
    }

    let numbers = /[0-9]/g;
    if (!newPassword.match(numbers)) {
      setErrorMessage("Password must have at least 1 number");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return false;
    }

    // Confirm password validation
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return false;
    }

    return true;
  };

  const handleChangePassword = async () => {
    if (!validatePassword()) {
      return;
    }

    try {
      const response = await axios.put(
        `${getNgrokUrl()}/api/profile/change-password/${user._id}`,
        {
          currentPassword: currentPassword,
          newPassword: newPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setErrorMessage("");

        toastRef.current.show("Password changed successfully");
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMessage("Invalid password");
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      console.error("Error changing password: ", error);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}>
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

        <View style={styles.container}>
          <Text style={styles.title}>Change Password</Text>
          <Text style={styles.label}>Current Password</Text>
          <TextInput
            value={currentPassword}
            style={styles.input}
            placeholder="Enter your current password"
            secureTextEntry={true}
            onChangeText={(text) => setCurrentPassword(text)}
            returnKeyType="next"
            onSubmitEditing={() => {
              newPasswordRef.current.focus();
            }}
          />

          <Text style={styles.label}>New Password</Text>
          <TextInput
            ref={newPasswordRef}
            value={newPassword}
            style={styles.input}
            placeholder="Enter your new password"
            secureTextEntry={true}
            onChangeText={(text) => setNewPassword(text)}
            returnKeyType="next"
            onSubmitEditing={() => {
              confirmPasswordRef.current.focus();
            }}
          />

          <Text style={styles.label}>Confirm New Password</Text>
          <TextInput
            ref={confirmPasswordRef}
            value={confirmPassword}
            style={styles.input}
            placeholder="Confirm your new password"
            secureTextEntry={true}
            onChangeText={(text) => setConfirmPassword(text)}
            returnKeyType="go"
            onSubmitEditing={handleChangePassword}
          />

          {errorMessage !== "" && (
            <Text style={styles.errorText}>{errorMessage}</Text>
          )}

          <TouchableOpacity
            style={styles.btnConfirm}
            onPress={handleChangePassword}
          >
            <Text style={styles.btnConfirmText}>Change Password</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Toast
        ref={toastRef}
        placement="top"
        style={{ backgroundColor: colors.darkBlue }}
        fadeInDuration={750}
        fadeOutDuration={1000}
        opacity={1}
        textStyle={{ color: colors.white, fontFamily: "MontserratRegular" }}
      />
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
    marginBottom: 50,
    justifyContent: "center",
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
  title: {
    fontFamily: "MontserratBold",
    fontSize: 24,
    color: colors.darkBlue,
    textAlign: "center",
    marginBottom: 40,
  },
  label: {
    fontFamily: "MontserratRegular",
    fontSize: 18,
    marginVertical: 10,
  },
  input: {
    fontFamily: "MontserratRegular",
    fontSize: 16,
    width: "100%",
    height: 40,
    borderColor: colors.gray,
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    backgroundColor: colors.white,
  },
  btnConfirm: {
    backgroundColor: colors.complementary,
    padding: 15,
    margin: 10,
    marginTop: 40,
    width: "60%",
    alignSelf: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  btnConfirmText: {
    color: colors.white,
    fontFamily: "MontserratRegular",
    fontSize: 16,
  },
  errorText: {
    fontFamily: "MontserratRegular",
    fontSize: 16,
    color: colors.danger,
    marginVertical: 10,
    marginBottom: 20,
    textAlign: "center",
  },
});

export default ChangePassword;
