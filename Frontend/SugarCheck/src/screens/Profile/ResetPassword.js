import React, { createRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  Keyboard,
} from "react-native";
import colors from "../../../config/colors";
import Icon from "react-native-vector-icons/AntDesign";
import axios from "axios";
import { getNgrokUrl } from "../../../config/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { useDispatch } from "react-redux";
import { persistor } from "../../store/store";
import { signOut } from "../../store/slices/authSlice";
import { CommonActions } from "@react-navigation/native";
import * as Haptics from "expo-haptics";

const ResetPassword = ({ navigation }) => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState(Array(6).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const [steps, setSteps] = useState(1);
  const inputRefs = Array(6)
    .fill()
    .map(() => createRef());

  const validateEmail = () => {
    if (email.trim() === "") {
      setErrorMessage("Email cannot be empty");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return false;
    }

    // Email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return false;
    }

    return true;
  };

  const validatePassword = () => {
    if (newPassword.trim() === "" || confirmPassword.trim() === "") {
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

  const resetPassword = async () => {
    if (steps === 1) {
      try {
        if (!validateEmail()) {
          return;
        }

        const response = await axios.post(
          `${getNgrokUrl()}/api/profile/request-reset`,
          {
            email: email.toLowerCase(),
          }
        );

        if (response.status === 200) {
          setSteps(2);
          setErrorMessage("");
        }
      } catch (error) {
        console.log(error);
      }
    } else if (steps === 2) {
      try {
        if (!validatePassword()) {
          return;
        }

        const response = await axios.post(
          `${getNgrokUrl()}/api/profile/reset-password`,
          {
            email: email.toLowerCase(),
            code: code.join(""),
            newPassword,
          }
        );

        if (response.status === 200) {
          await handleSignOut();
        } else if (response.status === 400) {
          setErrorMessage("Wrong verification code. Please try again.");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

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
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
      >
        <Text style={styles.title}>Reset Password</Text>

        {steps === 1 && (
          <View>
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={(text) => setEmail(text.toLowerCase())}
              style={styles.input}
              returnKeyType="go"
              keyboardType="email-address"
              onSubmitEditing={resetPassword}
            />

            {errorMessage && (
              <Text style={styles.errorText}>{errorMessage}</Text>
            )}

            <TouchableOpacity style={styles.btnReset} onPress={resetPassword}>
              <Text style={styles.btnResetText}>Send Verification Code</Text>
            </TouchableOpacity>
          </View>
        )}

        {steps === 2 && (
          <View>
            <View style={styles.inputContainer}>
              {code.map((digit, index) => (
                <TextInput
                  key={index}
                  style={styles.codeInput}
                  maxLength={1}
                  keyboardType="numeric"
                  value={digit}
                  ref={inputRefs[index]}
                  onChangeText={(text) => {
                    const newCode = [...code];
                    newCode[index] = text;
                    setCode(newCode);

                    if (text !== "" && inputRefs[index + 1]) {
                      inputRefs[index + 1].current.focus();
                    } else if (index === inputRefs.length - 1) {
                      Keyboard.dismiss();
                    }
                  }}
                />
              ))}
            </View>

            <TextInput
              placeholder="New Password"
              value={newPassword}
              onChangeText={(text) => setNewPassword(text)}
              style={styles.input}
              secureTextEntry
              returnKeyType="next"
              onSubmitEditing={() => this.confirmPasswordInput.focus()}
            />

            <TextInput
              ref={(input) => (this.confirmPasswordInput = input)}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={(text) => setConfirmPassword(text)}
              style={styles.input}
              secureTextEntry
              returnKeyType="go"
              onSubmitEditing={resetPassword}
            />

            {errorMessage && (
              <Text style={styles.errorText}>{errorMessage}</Text>
            )}

            <TouchableOpacity style={styles.btnReset} onPress={resetPassword}>
              <Text style={styles.btnResetText}>Reset Password</Text>
            </TouchableOpacity>
          </View>
        )}
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
    marginBottom: 150,
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
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray,
    margin: 10,
    padding: 10,
  },
  btnReset: {
    backgroundColor: colors.complementary,
    padding: 15,
    marginTop: 30,
    margin: 10,
    alignItems: "center",
    width: "60%",
    alignSelf: "center",
    borderRadius: 5,
  },
  btnResetText: {
    fontFamily: "MontserratRegular",
    fontSize: 16,
    color: colors.white,
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 50,
    paddingHorizontal: 20,
  },
  codeInput: {
    width: 40,
    height: 50,
    borderWidth: 1,
    borderColor: "gray",
    textAlign: "center",
    marginRight: 10,
    fontSize: 20,
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

export default ResetPassword;
