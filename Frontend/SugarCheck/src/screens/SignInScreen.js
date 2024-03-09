import React from "react";
import { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
  Text,
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
import { setToken, setUser } from "../store/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/AntDesign";
import * as Haptics from "expo-haptics";

const SignInScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [moveAnimation] = useState(new Animated.Value(0));

  const keyboardDidShow = () => {
    Animated.timing(moveAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const keyboardDidHide = () => {
    Animated.timing(moveAnimation, {
      toValue: 0,
      duration: 100,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      keyboardDidShow
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      keyboardDidHide
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

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
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="left" size={30} color={colors.darkBlue} />
          </TouchableOpacity>
          <View style={{ width: 35 }} />
        </View>

        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 25 : 20}
        >
          <Image
            style={styles.logo}
            source={require("../../assets/icons/DarkAppIcon.png")}
          />
          <Animated.View style={{ transform: [{ translateY: moveAnimation }] }}>
            <Heading style={styles.heading}>SugarCheck</Heading>
          </Animated.View>

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
            style={styles.btnSignUp}
            onPress={() => navigation.navigate("SignUp")}
            activeOpacity={0.8}
          >
            <Text style={styles.btnSignUpText}>Go to Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnForgot}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("ResetPasswordScreen")}
          >
            <Text style={styles.btnForgotText}>Forgot Password?</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
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
    marginTop: 20,
  },
  btnForgotText: {
    fontFamily: "MontserratRegular",
    fontSize: 16,
    color: colors.complementary,
  },
  btnSignUp: {
    marginTop: 0,
    padding: 10,
    width: "40%",
    borderColor: colors.complementary,
    borderWidth: 1,
    borderRadius: 5,
    margin: Platform.OS === "android" ? 20 : 15,
  },
  btnSignUpText: {
    fontFamily: "MontserratRegular",
    fontSize: 16,
    textAlign: "center",
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
