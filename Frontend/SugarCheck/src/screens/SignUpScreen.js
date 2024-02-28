import React, { useCallback } from "react";
import { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Platform,
  Button,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Animated,
} from "react-native";
import colors from "../../config/colors";
import { ButtonSecondary, Heading } from "../../config/styledText";
import DateTimePicker from "@react-native-community/datetimepicker";
import RNPickerSelect from "react-native-picker-select";
import axios from "axios";
import { getNgrokUrl } from "../../config/constants";
import { CommonActions } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "../store/store";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignUpScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDob] = useState(new Date());
  const [gender, setGender] = useState("male");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [step, setStep] = useState(1);

  const [moveAnimation] = useState(new Animated.Value(0));

  const keyboardDidShow = useCallback(() => {
    Animated.timing(moveAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  });

  const keyboardDidHide = useCallback(() => {
    Animated.timing(moveAnimation, {
      toValue: 0,
      duration: 100,
      useNativeDriver: false,
    }).start();
  });

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

  const showDatepicker = () => {
    setShowDatePicker((previousState) => !previousState);
  };

  const validateStep1 = () => {
    // Check if fields are not empty
    if (
      firstName.trim() === "" ||
      lastName.trim() === "" ||
      dob === "" ||
      gender === ""
    ) {
      Alert.alert("Invalid input", "Fields cannot be empty");
      return false;
    }

    //Name Validation
    const nameRegex = /^[a-zA-Z\s]*$/;
    if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
      Alert.alert("Invalid input", "Name can only contain letters");
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const validateStep2 = () => {
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

  //SIGN UP API CALL
  const API_ENDPOINT = `${getNgrokUrl()}/api/auth/signup`;

  const signUp = async (userData) => {
    try {
      const response = await axios.post(API_ENDPOINT, userData);

      if (response.data.error) {
        throw new Error(response.data.error);
      } else {
        // Store the token in AsyncStorage
        await AsyncStorage.setItem("@token", response.data.token);

        // Store the token in local storage or state management library
        dispatch(setToken(response.data.token));
        dispatch(setUser(response.data.user));
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const handleSubmit = async () => {
    if (validateStep1() && validateStep2()) {
      const userData = {
        firstName: firstName,
        lastName: lastName,
        username: username,
        email: email,
        password: password,
        dob: dob,
        gender: gender,
        phoneNumber: phoneNumber,
      };

      try {
        await signUp(userData);

        setFirstName("");
        setLastName("");
        setUsername("");
        setEmail("");
        setPassword("");
        setDob(new Date());
        setGender("male");
        setPhoneNumber("");

        navigation.navigate("EmailVerificationScreen");

        // navigation.dispatch(
        //   CommonActions.reset({
        //     index: 0,
        //     routes: [
        //       {
        //         name: "Main",
        //       },
        //     ],
        //   })
        // );
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "There was an error creating your account");
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 50 : 20}
      >
        <Image
          style={styles.logo}
          source={require("../../assets/icons/DarkAppIcon.png")}
        />
        <Animated.View style={{ transform: [{ translateY: moveAnimation }] }}>
          <Heading style={styles.heading}>SugarCheck</Heading>
        </Animated.View>
        {step === 1 && (
          <>
            <TextInput
              style={styles.input}
              placeholder="First Name"
              value={firstName}
              onChangeText={setFirstName}
              returnKeyType="next"
              onSubmitEditing={() => {
                this.secondTextInput.focus();
              }}
            />
            <TextInput
              ref={(input) => {
                this.secondTextInput = input;
              }}
              style={styles.input}
              placeholder="Last Name"
              value={lastName}
              onChangeText={setLastName}
            />
            <View style={styles.dobContainer}>
              <Text style={styles.dobTxt}>Date of Birth</Text>
              {Platform.OS === "android" && (
                <View style={styles.androidBtn}>
                  <Button title="Select Date" onPress={showDatepicker} />
                </View>
              )}
              {(showDatePicker || Platform.OS === "ios") && (
                <DateTimePicker
                  value={dob}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    const currentDate = selectedDate || dob;
                    setDob(currentDate);
                  }}
                  style={styles.dobPicker}
                />
              )}
            </View>
            <RNPickerSelect
              placeholder={{ label: "Choose Gender", value: null }}
              onValueChange={(value) => {
                if (value !== null) {
                  setGender(value);
                } else {
                  Alert.alert("Invalid selection", "Please choose a gender");
                }
              }}
              items={[
                { label: "Male", value: "male" },
                { label: "Female", value: "female" },
              ]}
              style={{
                inputIOS: styles.inputIOS,
                inputAndroid: styles.inputAndroid,
              }}
            />
            <TouchableOpacity style={styles.button} onPress={handleNext}>
              <ButtonSecondary>Continue</ButtonSecondary>
            </TouchableOpacity>
          </>
        )}

        {step === 2 && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={() => {
                this.ThirdTextInput.focus();
              }}
            />
            <TextInput
              ref={(input) => {
                this.ThirdTextInput = input;
              }}
              style={styles.input}
              placeholder="Phone Number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={() => {
                this.FourthTextInput.focus();
              }}
            />
            <TextInput
              ref={(input) => {
                this.FourthTextInput = input;
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
              <ButtonSecondary>Sign Up</ButtonSecondary>
            </TouchableOpacity>
          </>
        )}
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
  heading: {
    marginBottom: 50,
  },
  dobContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
  },
  dobTxt: {
    fontFamily: "MontserratRegular",
    fontSize: 16,
    marginBottom: 10,
  },
  dobPicker: {
    marginBottom: Platform.OS === "android" ? 40 : 10,
    padding: 10,
  },
  androidBtn: {
    width: 150,
    marginLeft: 20,
    marginTop: 10,
    alignSelf: "center",
    marginBottom: 20,
  },
  inputIOS: {
    width: "80%",
    alignSelf: "center",
    marginBottom: 10,
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    color: "black",
    paddingRight: 30,
  },
  inputAndroid: {
    width: "80%",
    alignSelf: "center",
    marginBottom: 10,
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: "purple",
    borderRadius: 8,
    color: "black",
    paddingRight: 30,
  },
});

export default SignUpScreen;
