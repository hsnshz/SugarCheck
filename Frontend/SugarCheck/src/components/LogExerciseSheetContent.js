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
import RNPickerSelect from "react-native-picker-select";
// import { addExerciseLog } from "../store/slices/exerciseSlice";

const LogExerciseSheetContent = ({ toggleSheet, onAdd }) => {
  const user = useSelector((state) => state.user.user) || {};
  const token = useSelector((state) => state.auth.token) || "";
  const dispatch = useDispatch();

  const [showDatePicker, setShowDatePicker] = useState(false);

  const [activityType, setActivityType] = useState("");
  const [duration, setDuration] = useState("");
  const [intensity, setIntensity] = useState("");
  const [caloriesBurned, setCaloriesBurned] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(new Date());

  const durationRef = useRef();
  const caloriesBurnedRef = useRef();
  const notesRef = useRef();

  const handleShowDatePicker = () => {
    Keyboard.dismiss();
    setShowDatePicker(true);
  };

  const logActivity = async () => {
    try {
      if (!activityType || !duration || !caloriesBurned || !intensity) {
        toastRef.current.show("Please fill in all fields", { type: "danger" });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
      }

      if (notes.trim() === "") {
        setNotes("No notes");
      }

      const selectedDate = date.toISOString();

      const response = await axios.post(
        `${getNgrokUrl()}/api/exercise/log-activity/${user._id}`,
        {
          activityType,
          duration,
          caloriesBurned,
          intensity,
          notes,
          date: selectedDate,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);

      if (response.status == 200) {
        onAdd();
      }
    } catch (error) {
      console.log(error);
      toastRef.current.show("Error logging activity", { type: "danger" });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 200 }}>
        <Text style={styles.title}>Log Exercise Activity</Text>

        <View style={styles.subContainer}>
          <Text style={styles.label}>Activity Type</Text>
          <TextInput
            value={activityType}
            onChangeText={setActivityType}
            style={styles.input}
            returnKeyType="next"
            onSubmitEditing={() => {
              durationRef.current.focus();
            }}
          />
        </View>

        <View style={styles.subContainer}>
          <Text style={styles.label}>Duration (mins)</Text>
          <TextInput
            ref={durationRef}
            value={duration}
            onChangeText={setDuration}
            style={styles.input}
            returnKeyType="next"
            onSubmitEditing={() => {
              caloriesBurnedRef.current.focus();
            }}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.subContainer}>
          <Text style={styles.label}>Calories Burned</Text>
          <TextInput
            ref={caloriesBurnedRef}
            value={caloriesBurned}
            onChangeText={setCaloriesBurned}
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
          />
        </View>

        <View style={styles.subContainer}>
          <Text style={styles.label}>Intensity</Text>
          <RNPickerSelect
            placeholder={{ label: "Choose intensity", value: null }}
            onValueChange={(value) => setIntensity(value)}
            items={[
              { label: "Low", value: "Low" },
              { label: "Moderate", value: "Moderate" },
              { label: "High", value: "High" },
            ]}
            style={{
              inputIOS: styles.inputIOS,
              inputAndroid: styles.inputAndroid,
              placeholder: {
                color: colors.darkBlue,
              },
            }}
          />
        </View>

        <View style={styles.subContainer}>
          <Text style={styles.label}>Date</Text>
          {Platform.OS === "android" ? (
            <View style={styles.androidBtn}>
              <Button title="Date" onPress={handleShowDatePicker} />
            </View>
          ) : (
            showDatePicker ||
            (Platform.OS === "ios" && (
              <DateTimePicker
                testID="dateTimePicker"
                mode={"date"}
                value={date}
                is24Hour={true}
                display="default"
                maximumDate={new Date()}
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setDate(selectedDate);
                  }
                }}
              />
            ))
          )}
        </View>

        <TouchableOpacity
          style={styles.logBtn}
          onPress={logActivity}
          activeOpacity={0.8}
        >
          <Text style={styles.logBtnText}>Log Activity</Text>
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
  inputIOS: {
    width: "100%",
    marginVertical: 10,
    fontSize: 16,
    fontFamily: "MontserratRegular",
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: colors.gray,
    color: colors.darkBlue,
  },
  inputAndroid: {
    width: "100%",
    marginVertical: 10,
    fontSize: 16,
    fontFamily: "MontserratRegular",
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: colors.gray,
    color: colors.darkBlue,
    backgroundColor: colors.background,
  },
});

export default LogExerciseSheetContent;
