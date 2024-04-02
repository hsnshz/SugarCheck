import React, { useState, createRef, useRef } from "react";
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
} from "react-native";
import axios from "axios";
import { getNgrokUrl } from "../../config/constants";
import { CommonActions } from "@react-navigation/native";
import { useSelector } from "react-redux";
import colors from "../../config/colors";
import Icon from "react-native-vector-icons/AntDesign";
import Toast from "react-native-fast-toast";

const EmailVerificationScreen = ({ navigation }) => {
  const user = useSelector((state) => state.user.user) || {};
  const email = user ? user.email : "";
  const [code, setCode] = useState(Array(6).fill(""));

  const toastRef = useRef(null);

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
        toastRef.current.show("Email verified successfully", {
          type: "success",
        });

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
        toastRef.current.show("Invalid verification code", {
          type: "danger",
        });
      }
    } catch (error) {
      console.log("Error verifying email");
      console.log(error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="left" size={30} color={colors.darkBlue} />
          </TouchableOpacity>
          <Image
            source={require("../../assets/icons/DarkAppIcon.png")}
            style={styles.logo}
          />
          <View style={{ width: 35 }} />
        </View>

        <SafeAreaView style={styles.container}>
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
    width: 50,
    height: 50,
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
    backgroundColor: colors.complementary,
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
