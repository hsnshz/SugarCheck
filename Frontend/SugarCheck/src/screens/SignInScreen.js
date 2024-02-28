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

const SignInScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

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
      Alert.alert("Invalid input", "Fields cannot be empty");
      return false;
    }

    const emailOrUsernameRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$|^[a-zA-Z0-9_]+$/;
    if (!emailOrUsernameRegex.test(username)) {
      Alert.alert("Invalid input", "Please enter a valid email or username");
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
        Alert.alert("Error", "Invalid credentials. Please try again.");
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
          passwordRules="required: lower; required: upper; required: digit; required: length(8);"
          returnKeyType="go"
          onSubmitEditing={handleSubmit}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <ButtonSecondary>Sign In</ButtonSecondary>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondButton}
          onPress={() => navigation.navigate("SignUp")}
        >
          <ButtonPrimary>Go to Sign Up</ButtonPrimary>
        </TouchableOpacity>
      </KeyboardAvoidingView>
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
  logo: {
    width: 100,
    height: 100,
  },
  input: {
    fontFamily: "MontserratRegular",
    width: "80%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
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
    width: "40%",
    alignItems: "center",
    marginTop: 15,
  },
  heading: {
    marginBottom: 50,
  },
});

export default SignInScreen;
