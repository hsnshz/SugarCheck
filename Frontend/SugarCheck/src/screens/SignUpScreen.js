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
import Icon from "react-native-vector-icons/AntDesign";
import moment from "moment";
import * as Haptics from "expo-haptics";

const SignUpScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dob, setDob] = useState(new Date());
  const [gender, setGender] = useState("male");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [step, setStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");

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

  const handleNext = () => {
    if (validateStep1()) {
      setErrorMessage("");
      setStep(2);
    }
  };

  const validateStep1 = () => {
    // Check if fields are not empty
    if (
      firstName.trim() === "" ||
      lastName.trim() === "" ||
      dob === "" ||
      gender === ""
    ) {
      setErrorMessage("Fields cannot be empty");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return false;
    }

    //Name Validation
    const nameRegex = /^[a-zA-Z\s]*$/;
    if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
      setErrorMessage("Name can only contain letters");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return false;
    }

    // Age validation
    const age = moment().diff(dob, "years");
    if (age < 18) {
      setErrorMessage("You must be at least 18 years old");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return false;
    }

    return true;
  };

  const validateStep2 = () => {
    if (
      email.trim() === "" ||
      phoneNumber.trim() === "" ||
      username.trim() === "" ||
      password.trim() === ""
    ) {
      setErrorMessage("Fields cannot be empty");
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

    // Password validation
    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return false;
    }

    let lowerCaseLetters = /[a-z]/g;
    if (!password.match(lowerCaseLetters)) {
      setErrorMessage("Password must have at least 1 lowercase letter");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return false;
    }

    let upperCaseLetters = /[A-Z]/g;
    if (!password.match(upperCaseLetters)) {
      setErrorMessage("Password must have at least 1 uppercase letter");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return false;
    }

    let numbers = /[0-9]/g;
    if (!password.match(numbers)) {
      setErrorMessage("Password must have at least 1 number");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return false;
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
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
        setConfirmPassword("");
        setDob(new Date());
        setGender("male");
        setPhoneNumber("");

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

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
                      setShowDatePicker(false);
                    }}
                    minimumDate={new Date(1940, 0, 1)}
                    maximumDate={new Date()}
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
              {errorMessage && (
                <Text style={styles.errorText}>{errorMessage}</Text>
              )}

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

              <View style={styles.requirementsView}>
                <Text style={styles.passwordRequirementsLabel}>
                  Password Requirements
                </Text>
                <View>
                  <Text style={styles.passwordRequirements}>
                    • 8 characters
                  </Text>
                  <Text style={styles.passwordRequirements}>
                    • 1 uppercase letter
                  </Text>
                  <Text style={styles.passwordRequirements}>
                    • 1 lowercase letter
                  </Text>
                  <Text style={styles.passwordRequirements}>• 1 number</Text>
                </View>
              </View>

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
                returnKeyType="next"
                onSubmitEditing={() => {
                  this.FifthTextInput.focus();
                }}
              />

              <TextInput
                ref={(input) => {
                  this.FifthTextInput = input;
                }}
                style={styles.input}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={true}
                returnKeyType="go"
                onSubmitEditing={handleSubmit}
              />

              {errorMessage && (
                <Text style={styles.errorText}>{errorMessage}</Text>
              )}

              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <ButtonSecondary>Sign Up</ButtonSecondary>
              </TouchableOpacity>
            </>
          )}
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
    borderColor: colors.gray,
    color: colors.black,
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
    color: colors.black,
    paddingRight: 30,
  },
  requirementsView: {
    width: "80%",
    marginBottom: 10,
    marginTop: 10,
    padding: 20,
    borderRadius: 5,
    backgroundColor: colors.active,
  },
  passwordRequirementsLabel: {
    fontFamily: "MontserratBold",
    fontSize: 18,
    color: colors.darkBlue,
    marginBottom: 10,
  },
  passwordRequirements: {
    fontFamily: "MontserratRegular",
    fontSize: 16,
    color: colors.darkBlue,
  },
  errorText: {
    fontFamily: "MontserratRegular",
    fontSize: 16,
    color: colors.danger,
    marginVertical: 10,
    marginBottom: 20,
  },
});

export default SignUpScreen;
