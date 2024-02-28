import React, { useState, createRef } from "react";
import {
  Button,
  Image,
  SafeAreaView,
  TextInput,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Heading } from "../../config/styledText";
import axios from "axios";
import { getNgrokUrl } from "../../config/constants";
import { CommonActions } from "@react-navigation/native";
import { useSelector } from "react-redux";
import colors from "../../config/colors";

const EmailVerificationScreen = ({ navigation }) => {
  const user = useSelector((state) => state.user);
  const email = user ? user.email : "";
  const [code, setCode] = useState(Array(6).fill(""));

  const inputRefs = Array(6)
    .fill()
    .map(() => createRef());

  const verifyEmail = async () => {
    try {
      const response = await axios.post(
        `${getNgrokUrl()}/api/email/verify-email`,
        {
          email,
          code: code.join(""),
        }
      );

      const data = response.data;

      if (data.message === "Email verified successfully") {
        Alert.alert("Success", "Account created successfully");

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
      } else {
        console.log("Email verification failed");
        Alert.alert("Email verification failed", "Please try again", [
          { text: "OK" },
        ]);
      }
    } catch (error) {
      console.log("Error verifying email");
      console.log(error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <View>
          <Image
            style={styles.logo}
            source={require("../../assets/icons/DarkAppIcon.png")}
          />
          <Heading style={styles.heading}>SugarCheck</Heading>
        </View>
        <Text style={styles.infoTxt}>
          Please enter the verification code sent to your email:
        </Text>
        <View style={styles.inputContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              style={styles.input}
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
        <TouchableOpacity style={styles.btnVerify} onPress={verifyEmail}>
          <Text style={styles.btnText}>Verify Email</Text>
        </TouchableOpacity>
      </SafeAreaView>
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
    alignSelf: "center",
  },
  heading: {
    marginBottom: 60,
  },
  infoTxt: {
    fontFamily: "MontserratRegular",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 50,
  },
  input: {
    width: 40,
    height: 50,
    borderWidth: 1,
    borderColor: "gray",
    textAlign: "center",
    marginRight: 10,
    fontSize: 20,
  },
  btnVerify: {
    backgroundColor: colors.navbar,
    padding: 15,
    borderRadius: 5,
  },
  btnText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: "MontserratRegular",
  },
});

export default EmailVerificationScreen;
