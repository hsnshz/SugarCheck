import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Button,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { ButtonSecondary } from "../../../config/styledText";
import colors from "../../../config/colors";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ScrollView } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { getNgrokUrl } from "../../../config/constants";
import { updateUser } from "../../store/store";

const PersonalInformation = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);

  const [firstName, setFirstName] = useState(user ? user.firstName : "");
  const [lastName, setLastName] = useState(user ? user.lastName : "");
  const [email, setEmail] = useState(user ? user.email : "");
  const [dob, setDob] = useState(
    user && user.dob ? new Date(user.dob) : new Date()
  );
  const [gender, setGender] = useState(
    user ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : ""
  );
  const [phoneNumber, setPhoneNumber] = useState(user ? user.phoneNumber : "");
  const [username, setUsername] = useState(user ? user.username : "");
  const [show, setShow] = useState(false);

  const firstTextInputRef = useRef(null);

  const validateInput = () => {
    if (!username) {
      alert("Username is required");
      return;
    }

    if (!email) {
      alert("Email is required");
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      alert("Email is not valid");
      return;
    }

    if (!phoneNumber) {
      alert("Phone number is required");
      return;
    } else if (!/^\d+$/.test(phoneNumber)) {
      alert("Phone number is not valid");
      return;
    }

    return true;
  };

  const onChange = (event, selectedDob) => {
    const currentDob = selectedDob || dob;
    setShow(Platform.OS === "ios");
    setDob(currentDob);
  };

  const handleDatePress = () => {
    setShow(true);
  };

  const handleUpdate = () => {
    if (!validateInput()) {
      return;
    }

    axios
      .put(
        `${getNgrokUrl()}/api/update/${user._id}`,
        {
          email,
          phoneNumber,
          username,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          // Update the user data in the Redux store
          dispatch(
            updateUser({
              email,
              phoneNumber,
              username,
            })
          );
        }
        alert("Profile updated successfully");
      })
      .catch((error) => {
        alert("An error occurred while updating the profile");
      });
  };

  useEffect(() => {
    if (Platform.OS !== "android") {
      setShow(true);
    }
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 200 : 200}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Text style={styles.label}>First Name:</Text>
        <TextInput
          style={[styles.input, styles.disabledInput]}
          value={firstName}
          onChangeText={setFirstName}
          editable={false}
        />
        <Text style={styles.label}>Last Name:</Text>
        <TextInput
          style={[styles.input, styles.disabledInput]}
          value={lastName}
          onChangeText={setLastName}
          editable={false}
        />
        <Text style={styles.label}>Gender:</Text>
        <TextInput
          style={[styles.input, styles.disabledInput]}
          value={gender}
          onChangeText={setGender}
          editable={false}
        />
        <View style={styles.dobContainer}>
          <Text style={styles.label}>Date of Birth:</Text>
          {Platform.OS === "android" ? (
            <View style={styles.btnAndroid}>
              <Button
                title="Choose Date"
                onPress={handleDatePress}
                disabled={true}
              />
            </View>
          ) : null}
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={dob}
              mode={"date"}
              is24Hour={true}
              display="default"
              onChange={onChange}
              style={styles.dob}
              disabled={true}
            />
          )}
        </View>
        <Text style={styles.label}>Email:</Text>
        <TextInput
          ref={firstTextInputRef}
          style={[styles.input, styles.disabledInput]}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          editable={false}
        />
        <Text style={styles.label}>Username:</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          returnKeyType="next"
          onSubmitEditing={() => {
            firstTextInputRef.current.focus();
          }}
        />
        <Text style={styles.label}>Phone Number:</Text>
        <TextInput
          ref={firstTextInputRef}
          style={styles.input}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="numeric"
          returnKeyType="go"
          onSubmitEditing={handleUpdate}
        />
        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          <ButtonSecondary>Update</ButtonSecondary>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 18,
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    fontSize: 18,
    borderRadius: 6,
    backgroundColor: colors.white,
  },
  disabledInput: {
    backgroundColor: colors.disabled,
  },
  button: {
    backgroundColor: colors.complementary,
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 40,
    width: "80%",
    alignSelf: "center",
  },
  dobContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 15,
    marginBottom: 5,
    width: "100%",
  },
  dob: {
    flex: 0.6,
    marginLeft: 10,
  },
  btnAndroid: {
    flex: 0.9,
    marginLeft: 60,
  },
});

export default PersonalInformation;
