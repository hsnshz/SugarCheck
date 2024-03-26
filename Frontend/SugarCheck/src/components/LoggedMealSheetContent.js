import React, { useState, useRef, useEffect } from "react";
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
  Image,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import colors from "../../config/colors";
import axios from "axios";
import { getNgrokUrl } from "../../config/constants";
import { useDispatch, useSelector } from "react-redux";
import { updateMealLog } from "../store/slices/mealSlice";
import * as Haptics from "expo-haptics";

const LoggedMealSheetContent = ({ meal, onUpdate }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user) || {};
  const token = useSelector((state) => state.auth.token) || "";
  const mealLog = useSelector((state) => state.meal.mealLogs) || {};
  const mealLogId = mealLog.find((log) =>
    log.meals.some((m) => m._id === meal._id)
  ).id;

  const [showTimePicker, setShowTimePicker] = useState(false);

  const [timestamp, setTimestamp] = useState(new Date(meal.timestamp));
  const [mealName, setMealName] = useState(meal.mealName);
  const [calories, setCalories] = useState(meal.calories);
  const [carbohydrates, setCarbohydrates] = useState(meal.carbohydrates);
  const [fats, setFats] = useState(meal.fats);
  const [proteins, setProteins] = useState(meal.proteins);
  const [fiber, setFiber] = useState(meal.fiber);
  const [notes, setNotes] = useState(meal.notes);
  const [image, setImage] = useState(meal.image);

  const caloriesRef = useRef();
  const carbohydratesRef = useRef();
  const fatsRef = useRef();
  const proteinsRef = useRef();
  const fiberRef = useRef();
  const notesRef = useRef();

  const handleShowTimePicker = () => {
    Keyboard.dismiss();
    setShowTimePicker(true);
  };

  const updateMeal = async () => {
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
        image: meal.image,
      };

      const response = await axios.put(
        `${getNgrokUrl()}/api/meals/update-meal/${user._id}/${mealLogId}/${
          meal._id
        }`,
        body,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        dispatch(updateMealLog(response.data.mealLog));
        onUpdate();
      }
    } catch (error) {
      console.log(error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 200 }}>
        <Text style={styles.title}>Edit Logged Meal</Text>

        <View style={[styles.subContainer, { alignSelf: "center" }]}>
          <Image source={{ uri: image }} style={styles.image} />
        </View>

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
            value={calories?.toString()}
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
            value={carbohydrates?.toString()}
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
            value={fats?.toString()}
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
            value={proteins?.toString()}
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
            value={fiber?.toString()}
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
                onChange={(event, selectedDate) => {
                  setShowTimePicker(false);

                  if (selectedDate) {
                    setTimestamp(selectedDate);
                  }
                }}
              />
            ))
          )}
        </View>

        <TouchableOpacity
          style={styles.logBtn}
          onPress={updateMeal}
          activeOpacity={0.8}
        >
          <Text style={styles.logBtnText}>Update Meal</Text>
        </TouchableOpacity>
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
  image: {
    width: 200,
    height: 150,
    alignSelf: "center",
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
});

export default LoggedMealSheetContent;
