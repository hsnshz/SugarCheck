import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Platform,
  StyleSheet,
  Keyboard,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import colors from "../../config/colors";
import axios from "axios";
import { getNgrokUrl } from "../../config/constants";
import { useDispatch, useSelector } from "react-redux";
import { addMealLog } from "../store/slices/mealSlice";
import * as Haptics from "expo-haptics";
import Toast from "react-native-fast-toast";

const LogMealSheetContent = ({ toggleSheet, onAdd }) => {
  const user = useSelector((state) => state.user.user) || {};
  const token = useSelector((state) => state.auth.token) || "";
  const dispatch = useDispatch();

  const [showTimePicker, setShowTimePicker] = useState(false);

  const [timestamp, setTimestamp] = useState(new Date());
  const [mealName, setMealName] = useState("");
  const [calories, setCalories] = useState("");
  const [carbohydrates, setCarbohydrates] = useState("");
  const [fats, setFats] = useState("");
  const [proteins, setProteins] = useState("");
  const [fiber, setFiber] = useState("");
  const [notes, setNotes] = useState("");
  const [image, setImage] = useState("https://i.imgur.com/NxIC7gE.png");

  const caloriesRef = useRef();
  const carbohydratesRef = useRef();
  const fatsRef = useRef();
  const proteinsRef = useRef();
  const fiberRef = useRef();
  const notesRef = useRef();

  const toastRef = useRef();
  const [errorMessage, setErrorMessage] = useState("");

  const handleShowTimePicker = () => {
    Keyboard.dismiss();
    setShowTimePicker(true);
  };

  const validateInput = () => {
    const regex = /^[a-zA-Z0-9 ]+$/;
    const noNumberRegex = /^[a-zA-Z ]+$/;

    // Validate Meal Name
    if (!mealName.trim().match(noNumberRegex)) {
      setErrorMessage("Invalid Meal Name");
      return false;
    }

    // Validate Notes
    if (notes === "") {
      setNotes("No notes");
    } else if (!notes.trim().match(regex)) {
      setErrorMessage("Invalid Notes");
      return false;
    }

    // Validate Calories
    if (
      Number(calories) <= 0 ||
      isNaN(Number(calories)) ||
      Number(calories) > 5000
    ) {
      setErrorMessage("Invalid Calories");
      return false;
    }

    // Validate Carbohydrates
    if (
      Number(carbohydrates) <= 0 ||
      isNaN(Number(carbohydrates)) ||
      Number(carbohydrates) > 5000
    ) {
      setErrorMessage("Invalid Carbohydrates");
      return false;
    }

    // Validate Fats
    if (Number(fats) <= 0 || isNaN(Number(fats)) || Number(fats) > 5000) {
      setErrorMessage("Invalid Fats");
      return false;
    }

    // Validate Proteins
    if (
      Number(proteins) <= 0 ||
      isNaN(Number(proteins)) ||
      Number(proteins) > 5000
    ) {
      setErrorMessage("Invalid Proteins");
      return false;
    }

    // Validate Fiber
    if (Number(fiber) <= 0 || isNaN(Number(fiber)) || Number(fiber) > 5000) {
      setErrorMessage("Invalid Fiber");
      return false;
    }

    return true;
  };

  const logMeal = async () => {
    if (!validateInput()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    } else if (notes === "") {
      setNotes("No notes");
    }

    try {
      let body = {
        timestamp: timestamp,
        mealName: mealName,
        calories: calories,
        carbohydrates: carbohydrates,
        fats: fats,
        proteins: proteins,
        fiber: fiber,
        notes: notes,
        image: image,
      };

      const response = await axios.post(
        `${getNgrokUrl()}/api/meals/log-meal/${user._id}`,
        body,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const mealLog = response.data.mealLog.meals[0];
        dispatch(addMealLog(mealLog));

        setMealName("");
        setCalories("");
        setCarbohydrates("");
        setFats("");
        setProteins("");
        setFiber("");
        setNotes("");
        setTimestamp(new Date());

        onAdd();
        toggleSheet();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 200 }}>
        <Text style={styles.title}>Log Meal</Text>

        <View style={styles.subContainer}>
          <Text style={styles.label}>Meal Name</Text>
          <TextInput
            value={mealName}
            onChangeText={setMealName}
            style={styles.input}
            returnKeyType="next"
            onSubmitEditing={() => {
              caloriesRef.current.focus();
            }}
          />
        </View>

        <View style={styles.subContainer}>
          <Text style={styles.label}>Calories</Text>
          <TextInput
            ref={caloriesRef}
            value={calories}
            onChangeText={setCalories}
            style={styles.input}
            returnKeyType="next"
            onSubmitEditing={() => {
              carbohydratesRef.current.focus();
            }}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.subContainer}>
          <Text style={styles.label}>Carbohydrates</Text>
          <TextInput
            ref={carbohydratesRef}
            value={carbohydrates}
            onChangeText={setCarbohydrates}
            style={styles.input}
            returnKeyType="next"
            onSubmitEditing={() => {
              fatsRef.current.focus();
            }}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.subContainer}>
          <Text style={styles.label}>Fats</Text>
          <TextInput
            ref={fatsRef}
            value={fats}
            onChangeText={setFats}
            style={styles.input}
            returnKeyType="next"
            onSubmitEditing={() => {
              proteinsRef.current.focus();
            }}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.subContainer}>
          <Text style={styles.label}>Proteins</Text>
          <TextInput
            ref={proteinsRef}
            value={proteins}
            onChangeText={setProteins}
            style={styles.input}
            returnKeyType="next"
            onSubmitEditing={() => {
              fiberRef.current.focus();
            }}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.subContainer}>
          <Text style={styles.label}>Fiber</Text>
          <TextInput
            ref={fiberRef}
            value={fiber}
            onChangeText={setFiber}
            style={styles.input}
            returnKeyType="next"
            onSubmitEditing={() => {
              notesRef.current.focus();
            }}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.subContainer}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            ref={notesRef}
            value={notes}
            onChangeText={setNotes}
            style={[styles.input, { height: 80 }]}
            multiline={true}
            numberOfLines={4}
            returnKeyType="default"
          />
        </View>

        <View style={styles.subContainer}>
          <Text style={styles.label}>Time</Text>
          {Platform.OS === "android" ? (
            <View style={styles.androidBtn}>
              <Button title="Time" onPress={handleShowTimePicker} />
            </View>
          ) : (
            showTimePicker ||
            (Platform.OS === "ios" && (
              <DateTimePicker
                testID="dateTimePicker"
                mode={"datetime"}
                value={timestamp}
                is24Hour={true}
                display="default"
                maximumDate={new Date()}
                onChange={(event, selectedTime) => {
                  setShowTimePicker(false);

                  if (selectedTime) {
                    setTimestamp(selectedTime);
                  }
                }}
              />
            ))
          )}
        </View>

        <TouchableOpacity
          style={styles.logBtn}
          onPress={logMeal}
          activeOpacity={0.8}
        >
          <Text style={styles.logBtnText}>Log Meal</Text>
        </TouchableOpacity>

        <Toast
          ref={toastRef}
          placement="top"
          style={{ backgroundColor: colors.darkBlue }}
          fadeInDuration={750}
          fadeOutDuration={1000}
          opacity={1}
          textStyle={{ color: colors.white, fontFamily: "MontserratRegular" }}
        />

        {errorMessage !== "" && (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    padding: 10,
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontFamily: "MontserratBold",
    marginBottom: 40,
    textAlign: "center",
  },
  subContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  label: {
    flex: 1,
    fontFamily: "MontserratRegular",
    fontSize: 16,
  },
  input: {
    flex: 2,
    borderWidth: 1,
    borderColor: colors.gray,
    padding: 10,
    marginLeft: 20,
    backgroundColor: colors.white,
  },
  androidBtn: {
    width: 100,
    marginLeft: 20,
    marginTop: 10,
    alignSelf: "center",
  },
  logBtn: {
    backgroundColor: colors.complementary,
    padding: 15,
    borderRadius: 5,
    marginTop: 30,
    width: "50%",
    alignSelf: "center",
  },
  logBtnText: {
    fontFamily: "MontserratRegular",
    fontSize: 18,
    color: colors.white,
    textAlign: "center",
  },
  errorMessage: {
    fontFamily: "MontserratRegular",
    fontSize: 16,
    color: colors.danger,
    textAlign: "center",
    marginTop: 20,
  },
});

export default LogMealSheetContent;
