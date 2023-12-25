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

const SignUpScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validateInput = () => {
    // Check if fields are not empty
    if (name.trim() === "" || email.trim() === "" || password.trim() === "") {
      Alert.alert("Invalid input", "Fields cannot be empty");
      return false;
    }

    //Name Validation
    const nameRegex = /^[a-zA-Z\s]*$/;
    if (!nameRegex.test(name)) {
      Alert.alert("Invalid input", "Name can only contain letters");
      return false;
    }

    // Email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Invalid input", "Please enter a valid email");
      return false;
    }

    // Password validation
    if (password.length < 8) {
      Alert.alert(
        "Invalid input",
        "Password must be at least 8 characters long"
      );
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (validateInput()) {
      Alert.alert("Success", "Account created successfully");

      setName("");
      setEmail("");
      setPassword("");
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
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
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
        <ButtonSecondary>Sign Up</ButtonSecondary>
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
  heading: {
    marginBottom: 50,
  },
});

export default SignUpScreen;
