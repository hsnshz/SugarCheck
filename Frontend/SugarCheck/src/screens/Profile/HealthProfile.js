import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
} from "react-native";
import { ButtonSecondary } from "../../../config/styledText";
import colors from "../../../config/colors";
import { ScrollView } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { getNgrokUrl } from "../../../config/constants";
import { updateHealthProfile } from "../../store/store";

const HealthProfile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);

  const [height, setHeight] = useState(user ? user.healthProfile.height : 0);
  const [weight, setWeight] = useState(user ? user.healthProfile.weight : 0);
  const [bmi, setBmi] = useState(user ? user.healthProfile.bmi : 0);
  const [dietaryRestrictions, setDietaryRestrictions] = useState(
    user ? user.healthProfile.dietaryRestrictions : ""
  );
  const [allergies, setAllergies] = useState(
    user ? user.healthProfile.allergies : ""
  );
  const [medications, setMedications] = useState(
    user ? user.healthProfile.medications : ""
  );

  const firstTextInputRef = useRef(null);
  const secondTextInputRef = useRef(null);
  const thirdTextInputRef = useRef(null);
  const fourthTextInputRef = useRef(null);

  useEffect(() => {
    if (height && weight) {
      const heightInMeters = height / 100; // Convert height to meters
      const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(2);
      setBmi(bmiValue);
    }
  }, [height, weight]);

  const handleUpdate = () => {
    axios
      .put(
        `${getNgrokUrl()}/api/health/update/${user._id}`,
        {
          height,
          weight,
          bmi,
          dietaryRestrictions,
          allergies,
          medications,
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
            updateHealthProfile({
              height,
              weight,
              bmi,
              dietaryRestrictions,
              allergies,
              medications,
            })
          );
        }
        alert("Health Profile updated successfully");
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred while updating the profile");
      });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 200 : 200}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Text style={styles.label}>Height (cm):</Text>
        <TextInput
          style={styles.input}
          value={String(height)}
          onChangeText={(text) => setHeight(Number(text))}
          keyboardType="numeric"
          returnKeyType="next"
          onSubmitEditing={() => {
            firstTextInputRef.current.focus();
          }}
        />
        <Text style={styles.label}>Weight (kg):</Text>
        <TextInput
          ref={firstTextInputRef}
          style={styles.input}
          value={String(weight)}
          onChangeText={(text) => setWeight(Number(text))}
          keyboardType="numeric"
          returnKeyType="next"
          onSubmitEditing={() => {
            secondTextInputRef.current.focus();
          }}
        />
        <Text style={styles.label}>BMI:</Text>
        <TextInput
          style={[styles.input, styles.disabledInput]}
          value={String(bmi)}
          onChangeText={(text) => setBmi(Number(text))}
          editable={false}
        />
        <Text style={styles.label}>Dietary Restrictions:</Text>
        <TextInput
          ref={secondTextInputRef}
          style={styles.largeInput}
          value={dietaryRestrictions}
          onChangeText={setDietaryRestrictions}
          multiline={true}
          blurOnSubmit={true}
          returnKeyType="next"
          onSubmitEditing={() => {
            thirdTextInputRef.current.focus();
          }}
        />
        <Text style={styles.label}>Allergies:</Text>
        <TextInput
          ref={thirdTextInputRef}
          style={styles.largeInput}
          value={allergies}
          onChangeText={setAllergies}
          multiline={true}
          blurOnSubmit={true}
          returnKeyType="next"
          onSubmitEditing={() => {
            fourthTextInputRef.current.focus();
          }}
        />
        <Text style={styles.label}>Medications:</Text>
        <TextInput
          ref={fourthTextInputRef}
          style={styles.largeInput}
          value={medications}
          onChangeText={setMedications}
          multiline={true}
          blurOnSubmit={true}
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
  largeInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    fontSize: 18,
    borderRadius: 6,
    backgroundColor: colors.white,
    height: 100,
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

export default HealthProfile;
