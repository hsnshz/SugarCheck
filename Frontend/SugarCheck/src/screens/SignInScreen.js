import React from "react";
import { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import colors from "../../config/colors";
import {
  ButtonPrimary,
  ButtonSecondary,
  Heading,
} from "../../config/styledText";

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginName = "Hassan";
  const loginEmail = "hsn-63@hotmail.com";
  const loginPswd = "12345678";

  const validateInput = () => {
    // Check if fields are not empty
    if (email.trim() === "" || password.trim() === "") {
      Alert.alert("Invalid input", "Fields cannot be empty");
      return false;
    }

    // Email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Invalid input", "Please enter a valid email");
      return false;
    }

    if (email !== loginEmail || password !== loginPswd) {
      Alert.alert("Invalid input", "Incorrect email or password");
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (validateInput()) {
      Alert.alert("Login Successful", `Welcome back, ${loginName}!`);

      setEmail("");
      setPassword("");

      navigation.reset({
        index: 0,
        routes: [{ name: "DiabetesForm" }],
      });
    }
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require("../../assets/icons/AppIcon.png")}
      />
      <Heading style={styles.heading}>SugarCheck</Heading>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
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
    </View>
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
