import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Image,
  SafeAreaView,
} from "react-native";
import { ButtonSecondary } from "../../../config/styledText";
import colors from "../../../config/colors";
import { ScrollView } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { getNgrokUrl } from "../../../config/constants";
import { updateHealthProfile } from "../../store/slices/userSlice";
import Toast from "react-native-fast-toast";
import * as Haptics from "expo-haptics";
import Icon from "react-native-vector-icons/AntDesign";

const HealthProfile = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user) || {};
  const token = useSelector((state) => state.auth.token) || "";

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
  const toastRef = useRef(null);

  useEffect(() => {
    if (height && weight) {
      const heightInMeters = height / 100;
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

          toastRef.current.show("Health Profile updated successfully", {
            type: "success",
          });
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        toastRef.current.show("An error occurred while updating the profile", {
          type: "danger",
        });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="left" size={30} color={colors.darkBlue} />
        </TouchableOpacity>
        <Image
          source={require("../../../assets/icons/DarkAppIcon.png")}
          style={styles.logo}
        />
        <View style={{ width: 35 }} />
      </View>

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 300,
          padding: 20,
        }}
      >
        <Text style={styles.label}>Height (cm):</Text>
        <TextInput
          style={styles.input}
          value={String(height)}
          onChangeText={(text) => {
            const newHeight = Number(text);

            if (newHeight > 300) {
              toastRef.current.show("Height cannot be greater than 300 cm", {
                type: "danger",
              });
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
              return;
            } else if (newHeight < 0) {
              toastRef.current.show("Height cannot be negative", {
                type: "danger",
              });
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
              return;
            } else {
              setHeight(Number(text));
            }
          }}
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
          onChangeText={(text) => {
            const newWeight = Number(text);

            if (newWeight > 300) {
              toastRef.current.show("Weight cannot be greater than 300 kg", {
                type: "danger",
              });
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
              return;
            } else if (newWeight < 0) {
              toastRef.current.show("Weight cannot be negative", {
                type: "danger",
              });
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
              return;
            } else {
              setWeight(Number(text));
            }
          }}
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

      <Toast
        ref={toastRef}
        placement="top"
        style={{ backgroundColor: colors.darkBlue, marginTop: 50 }}
        fadeInDuration={750}
        fadeOutDuration={1000}
        opacity={1}
        textStyle={{ color: colors.white, fontFamily: "MontserratRegular" }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.background,
    padding: 20,
  },
  logo: {
    width: 50,
    height: 50,
  },
  label: {
    fontFamily: "MontserratRegular",
    fontSize: 18,
    marginVertical: 10,
  },
  input: {
    fontFamily: "MontserratRegular",
    fontSize: 16,
    width: "100%",
    height: 40,
    borderColor: colors.gray,
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    backgroundColor: colors.white,
  },
  largeInput: {
    borderWidth: 1,
    borderColor: colors.gray,
    padding: 10,
    fontSize: 16,
    fontFamily: "MontserratRegular",
    backgroundColor: colors.white,
    height: 100,
  },
  disabledInput: {
    backgroundColor: colors.disabled,
  },
  button: {
    backgroundColor: colors.complementary,
    padding: 15,
    margin: 10,
    marginTop: 40,
    width: "60%",
    alignSelf: "center",
    alignItems: "center",
    borderRadius: 5,
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
