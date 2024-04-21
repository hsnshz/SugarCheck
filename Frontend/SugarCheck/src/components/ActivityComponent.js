import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Button,
  Platform,
} from "react-native";
import Collapsible from "react-native-collapsible";
import RNPickerSelect from "react-native-picker-select";
import Icon2 from "react-native-vector-icons/AntDesign";
import colors from "../../config/colors";
import axios from "axios";
import { getNgrokUrl } from "../../config/constants";
import { useSelector, useDispatch } from "react-redux";
import Toast from "react-native-fast-toast";
import * as Haptics from "expo-haptics";
import DateTimePicker from "@react-native-community/datetimepicker";

const ActivityComponent = ({
  activity,
  collapsedStates,
  setCollapsedStates,
  loadingStates,
  activityType,
  setActivityType,
  duration,
  setDuration,
  caloriesBurned,
  setCaloriesBurned,
  intensity,
  setIntensity,
  notes,
  setNotes,
  onAdd,
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user) || {};
  const token = useSelector((state) => state.auth.token) || null;

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const toastRef = useRef(null);

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

      const date = selectedDate.toISOString();

      const response = await axios.post(
        `${getNgrokUrl()}/api/exercise/log-activity/${user._id}`,
        {
          activityType,
          duration,
          caloriesBurned,
          intensity,
          notes,
          date: date,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
      <View style={styles.activityView}>
        <View style={styles.activityTextView}>
          <Text style={styles.activityText}>{activity}</Text>
          {collapsedStates[activity] ? (
            <Icon2 name="up" size={20} color={colors.darkBlue} />
          ) : (
            <Icon2 name="down" size={20} color={colors.darkBlue} />
          )}
        </View>

        <Collapsible collapsed={!collapsedStates[activity]}>
          {loadingStates[activity] ? (
            <ActivityIndicator
              size="small"
              color={colors.darkBlue}
              style={{ marginTop: 10 }}
            />
          ) : (
            <View style={styles.collapsedView}>
              <Text style={styles.collapsedText}>Activity: {activityType}</Text>
              <Text style={styles.collapsedText}>
                Duration: {duration} minutes
              </Text>
              <Text style={styles.collapsedText}>
                Calories Burned: {caloriesBurned} kcal
              </Text>
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
                }}
              />
              <TextInput
                value={notes}
                onChangeText={setNotes}
                placeholder="Add notes"
                style={styles.notesInput}
              />

              {Platform.OS === "android" && (
                <TouchableOpacity
                  style={styles.androidBtn}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={styles.androidBtnText}>Date</Text>
                </TouchableOpacity>
              )}
              {(showDatePicker || Platform.OS === "ios") && (
                <DateTimePicker
                  style={styles.datePicker}
                  value={selectedDate}
                  onChange={(event, selectedDate) => {
                    const currentDate = selectedDate || selectedDate;
                    setSelectedDate(currentDate);
                    setShowDatePicker(false);
                  }}
                  mode="date"
                  maximumDate={new Date()}
                />
              )}

              <TouchableOpacity
                style={styles.btnLogActivity}
                onPress={logActivity}
              >
                <Text style={styles.btnLogActivityText}>Log Activity</Text>
              </TouchableOpacity>
            </View>
          )}
        </Collapsible>
      </View>

      <Toast
        ref={toastRef}
        placement="top"
        style={{ backgroundColor: colors.darkBlue, marginTop: 10 }}
        fadeInDuration={750}
        fadeOutDuration={1000}
        opacity={1}
        textStyle={{ color: colors.white, fontFamily: "MontserratRegular" }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  activityView: {
    backgroundColor: colors.white,
    padding: 20,
    borderColor: colors.complementary,
    borderWidth: 1,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 10,
    paddingHorizontal: 20,
  },
  activityTextView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  activityText: {
    fontFamily: "MontserratRegular",
    fontSize: 16,
    color: colors.darkBlue,
  },
  noActivityView: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    marginTop: 200,
  },
  collapsedView: {
    marginTop: 30,
    height: 400,
  },
  collapsedText: {
    fontFamily: "MontserratRegular",
    fontSize: 16,
    color: colors.darkBlue,
    marginBottom: 5,
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
  notesInput: {
    width: "100%",
    height: 80,
    marginVertical: 10,
    fontSize: 16,
    fontFamily: "MontserratRegular",
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: colors.gray,
    color: colors.darkBlue,
  },
  btnLogActivity: {
    width: "60%",
    alignSelf: "center",
    backgroundColor: colors.complementary,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  btnLogActivityText: {
    fontFamily: "MontserratRegular",
    fontSize: 16,
    color: colors.white,
  },
  datePicker: {
    marginTop: 15,
    alignSelf: "center",
  },
  androidBtn: {
    width: "60%",
    padding: 10,
    borderRadius: 5,
    backgroundColor: colors.complementary,
    alignItems: "center",
    alignSelf: "center",
  },
  androidBtnText: {
    fontFamily: "MontserratRegular",
    fontSize: 16,
    color: colors.white,
  },
});

export default ActivityComponent;
