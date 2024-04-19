import React from "react";
import { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
  Text,
  ScrollView,
} from "react-native";
import colors from "../../config/colors";
import {
  ButtonPrimary,
  ButtonSecondary,
  Heading,
} from "../../config/styledText";
import { CommonActions } from "@react-navigation/native";
import { getNgrokUrl } from "../../config/constants";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setToken } from "../store/slices/authSlice";
import { setUser } from "../store/slices/userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/AntDesign";
import * as Haptics from "expo-haptics";
import * as Notifications from "expo-notifications";

const SignInScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const validateInput = () => {
    if (username.trim() === "" || password.trim() === "") {
      setErrorMessage("Fields cannot be empty");
      return false;
    }

    const emailOrUsernameRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$|^[a-zA-Z0-9_]+$/;
    if (!emailOrUsernameRegex.test(username)) {
      setErrorMessage("Please enter a valid email or username");
      return false;
    }

    return true;
  };

  const signIn = async () => {
    const response = await axios.post(`${getNgrokUrl()}/api/auth/signin`, {
      username,
      password,
    });

    if (response.data.error) {
      throw new Error(response.data.error);
    } else {
      // Store the token in AsyncStorage
      await AsyncStorage.setItem("@token", response.data.token);

      // Store the token in local storage or state management library
      dispatch(setToken(response.data.token));
      dispatch(setUser(response.data.user));
    }
  };

  const handleSubmit = async () => {
    if (validateInput()) {
      try {
        await signIn();
        setUsername("");
        setPassword("");
        setErrorMessage("");
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: "Main",
              },
            ],
          })
        );
      } catch (error) {
        setErrorMessage("Invalid credentials. Please try again.");
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 50 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="left" size={30} color={colors.darkBlue} />
          </TouchableOpacity>
          <View style={{ width: 35 }} />
        </View>

        <View style={styles.container}>
          <Image
            style={styles.logo}
            source={require("../../assets/icons/DarkAppIcon.png")}
          />

          <Heading style={styles.heading}>SugarCheck</Heading>

          <TextInput
            style={styles.input}
            placeholder="Email or Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            returnKeyType="next"
            onSubmitEditing={() => {
              this.FirstTextInput.focus();
            }}
          />
          <TextInput
            ref={(input) => {
              this.FirstTextInput = input;
            }}
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            returnKeyType="go"
            onSubmitEditing={handleSubmit}
          />

          {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <ButtonSecondary>Sign In</ButtonSecondary>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnForgot}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("ResetPasswordScreen")}
          >
            <Text style={styles.btnForgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <View style={styles.signUpView}>
            <Text style={styles.signUpText}>Need to create an account?</Text>
            <TouchableOpacity
              style={styles.btnSignUp}
              onPress={() => navigation.navigate("SignUp")}
              activeOpacity={0.8}
            >
              <Text style={styles.btnSignUpText}>Go to Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 75,
    alignItems: "center",
    backgroundColor: colors.background,
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
    width: 100,
    height: 100,
  },
  input: {
    fontFamily: "MontserratRegular",
    width: "80%",
    height: 40,
    borderColor: colors.gray,
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    backgroundColor: colors.white,
  },
  button: {
    backgroundColor: colors.complementary,
    padding: 10,
    borderRadius: 5,
    width: "40%",
    alignItems: "center",
    margin: Platform.OS === "android" ? 20 : 15,
  },
  secondButton: {
    padding: 10,
    borderRadius: 5,
    width: "80%",
    alignItems: "center",
    marginTop: 15,
  },
  heading: {
    marginBottom: 50,
  },
  btnForgot: {
    marginTop: 25,
  },
  btnForgotText: {
    fontFamily: "MontserratRegular",
    fontSize: 16,
    color: colors.complementary,
  },
  signUpView: {
    width: "80%",
    alignItems: "center",
    marginTop: 30,
  },
  signUpText: {
    fontFamily: "MontserratRegular",
    fontSize: 16,
    color: colors.darkBlue,
  },
  btnSignUp: {
    padding: 5,
    // margin: Platform.OS === "android" ? 20 : 15,
  },
  btnSignUpText: {
    fontFamily: "MontserratRegular",
    fontSize: 16,
    color: colors.complementary,
  },
  errorText: {
    fontFamily: "MontserratRegular",
    fontSize: 16,
    color: colors.danger,
    marginVertical: 10,
    marginBottom: 20,
  },
});

export default SignInScreen;
