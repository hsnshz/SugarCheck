import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { updateUserSettings } from "../../store/slices/userSlice";
import colors from "../../../config/colors";
import Icon from "@expo/vector-icons/AntDesign";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import { getNgrokUrl } from "../../../config/constants";
import Toast from "react-native-fast-toast";
import * as Haptics from "expo-haptics";
import SwitchToggle from "react-native-switch-toggle";
import RNPickerSelect from "react-native-picker-select";
import * as Notifications from "expo-notifications";

const NotificationsSettings = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user) || {};
  const token = useSelector((state) => state.auth.token) || "";

  const [glucoseRemindersEnabled, setGlucoseRemindersEnabled] = useState(
    user?.userSettings?.glucoseReminders?.enabled || false
  );
  const [glucoseRemindersTimes, setGlucoseRemindersTimes] = useState(
    user?.userSettings?.glucoseReminders?.times?.map(
      (time) => new Date(time)
    ) || [new Date(), new Date(), new Date()]
  );

  const [numMealReminders, setNumMealReminders] = useState(
    user?.userSettings?.mealReminders?.times?.length || 1
  );
  const [mealRemindersEnabled, setMealRemindersEnabled] = useState(
    user?.userSettings?.mealReminders?.enabled || false
  );
  const [mealRemindersTimes, setMealRemindersTimes] = useState(
    user?.userSettings?.mealReminders?.times?.map((time) => new Date(time)) || [
      new Date(),
    ]
  );

  const [exerciseNotificationEnabled, setExerciseNotificationEnabled] =
    useState(user?.userSettings?.exerciseNotificationTime?.enabled || false);
  const [exerciseNotificationTime, setExerciseNotificationTime] = useState(
    user?.userSettings?.exerciseNotificationTime?.time
      ? new Date(user?.userSettings?.exerciseNotificationTime?.time)
      : new Date()
  );

  const [activeTimePicker, setActiveTimePicker] = useState(null);
  const toastRef = useRef(null);
  const scrollViewRef = useRef(null);

  const saveNotificationSettings = async () => {
    const data = {
      glucoseReminders: {
        enabled: glucoseRemindersEnabled,
        times: glucoseRemindersTimes,
      },
      mealReminders: {
        enabled: mealRemindersEnabled,
        times: mealRemindersTimes,
      },
      exerciseNotificationTime: {
        enabled: exerciseNotificationEnabled,
        time: exerciseNotificationTime,
      },
    };

    try {
      const response = await axios.put(
        `${getNgrokUrl()}/api/profile/update-notifications/${user._id}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status == 200) {
        const {
          glucoseReminders: updatedGlucoseReminders,
          mealReminders: updatedMealReminders,
          exerciseNotificationTime: updatedExerciseNotificationTime,
        } = response.data.userSettings;

        updatedGlucoseReminders.times = updatedGlucoseReminders.times.map(
          (time) => new Date(time)
        );
        updatedMealReminders.times = updatedMealReminders.times.map(
          (time) => new Date(time)
        );
        updatedExerciseNotificationTime.time = new Date(
          updatedExerciseNotificationTime.time
        );

        dispatch(
          updateUserSettings({
            glucoseReminders: updatedGlucoseReminders,
            mealReminders: updatedMealReminders,
            exerciseNotificationTime: updatedExerciseNotificationTime,
          })
        );

        handleNotification();

        toastRef.current.show("Settings saved successfully", {
          type: "success",
        });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        scrollViewRef.current.scrollTo({ y: 0, animated: true });
      }
    } catch (error) {
      console.error(error);
    }
  };

  async function handleNotification() {
    try {
      const { status } = await Notifications.getPermissionsAsync();

      if (status !== "granted") {
        alert("You need to enable permissions in settings");
        return;
      }

      await Notifications.cancelAllScheduledNotificationsAsync();

      if (user?.userSettings?.glucoseReminders?.enabled) {
        glucoseRemindersTimes.forEach((time, index) => {
          Notifications.scheduleNotificationAsync({
            content: {
              title: "SugarCheck",
              body: "It's time to log your blood sugar level!",
              sound: "default",
            },
            trigger: {
              hour: time.getHours(),
              minute: time.getMinutes(),
              repeats: true,
            },
          });
        });
      }

      if (user?.userSettings?.mealReminders?.enabled) {
        mealRemindersTimes.forEach((time, index) => {
          Notifications.scheduleNotificationAsync({
            content: {
              title: "SugarCheck",
              body: "Looks like it's time for your meal!",
              sound: "default",
            },
            trigger: {
              hour: time.getHours(),
              minute: time.getMinutes(),
              repeats: true,
            },
          });
        });
      }

      if (user?.userSettings?.exerciseNotificationTime?.enabled) {
        Notifications.scheduleNotificationAsync({
          content: {
            title: "SugarCheck",
            body: "Time to do some exercise!",
            sound: "default",
          },
          trigger: {
            hour: exerciseNotificationTime.getHours(),
            minute: exerciseNotificationTime.getMinutes(),
            repeats: true,
          },
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
        ref={scrollViewRef}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="left" size={35} color={colors.darkBlue} />
          </TouchableOpacity>
          <Image
            source={require("../../../assets/icons/DarkAppIcon.png")}
            style={styles.logo}
          />
          <View style={{ width: 35 }} />
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.subContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.subtitle}>Glucose Notifications</Text>
              <SwitchToggle
                switchOn={glucoseRemindersEnabled}
                onPress={() =>
                  setGlucoseRemindersEnabled(!glucoseRemindersEnabled)
                }
                containerStyle={{
                  marginLeft: 20,
                  width: 65,
                  height: 30,
                  padding: 5,
                  borderRadius: 40,
                }}
                backgroundColorOn={colors.active}
                backgroundColorOff={colors.active}
                circleColorOn={colors.complementary}
                circleColorOff={colors.inactive}
                circleStyle={{
                  width: 30,
                  height: 25,
                  padding: 7,
                  borderRadius: 15,
                }}
              />
            </View>

            {glucoseRemindersEnabled &&
              Array.from({ length: 3 }, (_, index) => (
                <View style={styles.inputContainer} key={index}>
                  <Text style={styles.label}>
                    {index === 0
                      ? "First Notification Time"
                      : index === 1
                      ? "Second Notification Time"
                      : "Third Notification Time"}
                  </Text>

                  {Platform.OS === "android" && (
                    <Button
                      title="Time"
                      onPress={() =>
                        setActiveTimePicker(`glucoseReminder${index}`)
                      }
                    />
                  )}
                  {Platform.OS === "ios" ||
                  activeTimePicker === `glucoseReminder${index}` ? (
                    <DateTimePicker
                      value={glucoseRemindersTimes[index] || new Date()}
                      mode="time"
                      onChange={(event, selectedDate) => {
                        const newTimes = [...glucoseRemindersTimes];
                        newTimes[index] = selectedDate || new Date();
                        setGlucoseRemindersTimes(newTimes);
                        setActiveTimePicker(null);
                      }}
                    />
                  ) : null}
                </View>
              ))}
          </View>

          <View style={styles.subContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.subtitle}>Meal Notifications</Text>
              <SwitchToggle
                switchOn={mealRemindersEnabled}
                onPress={() => setMealRemindersEnabled(!mealRemindersEnabled)}
                containerStyle={{
                  marginLeft: 20,
                  width: 65,
                  height: 30,
                  padding: 5,
                  borderRadius: 40,
                }}
                backgroundColorOn={colors.active}
                backgroundColorOff={colors.active}
                circleColorOn={colors.complementary}
                circleColorOff={colors.inactive}
                circleStyle={{
                  width: 30,
                  height: 25,
                  padding: 7,
                  borderRadius: 15,
                }}
              />
            </View>

            {mealRemindersEnabled && (
              <>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Number of Reminders</Text>
                  <RNPickerSelect
                    placeholder={{
                      label: "Select reminders",
                      value: null,
                    }}
                    selectedValue={numMealReminders}
                    onValueChange={(itemValue) =>
                      setNumMealReminders(itemValue)
                    }
                    items={[
                      { label: "1", value: 1 },
                      { label: "2", value: 2 },
                      { label: "3", value: 3 },
                    ]}
                    style={{
                      inputIOS: styles.inputIOS,
                      inputAndroid: styles.inputAndroid,
                    }}
                  />
                </View>

                {Array.from({ length: numMealReminders }, (_, index) => (
                  <View style={styles.inputContainer} key={index}>
                    <Text style={styles.label}>
                      {index === 0
                        ? "First Notification Time"
                        : index === 1
                        ? "Second Notification Time"
                        : "Third Notification Time"}
                    </Text>

                    {Platform.OS === "android" && (
                      <Button
                        title="Time"
                        onPress={() =>
                          setActiveTimePicker(`mealReminder${index}`)
                        }
                      />
                    )}
                    {Platform.OS === "ios" ||
                    activeTimePicker === `mealReminder${index}` ? (
                      <DateTimePicker
                        value={mealRemindersTimes[index] || new Date()}
                        mode="time"
                        onChange={(_, selectedDate) => {
                          const newTimes = [...mealRemindersTimes];
                          newTimes[index] = selectedDate || new Date();
                          setMealRemindersTimes(newTimes);
                          setActiveTimePicker(null);
                        }}
                      />
                    ) : null}
                  </View>
                ))}
              </>
            )}
          </View>

          <View style={styles.subContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.subtitle}>Exercise Notifications</Text>
              <SwitchToggle
                switchOn={exerciseNotificationEnabled}
                onPress={() =>
                  setExerciseNotificationEnabled(!exerciseNotificationEnabled)
                }
                containerStyle={{
                  marginLeft: 20,
                  width: 65,
                  height: 30,
                  padding: 5,
                  borderRadius: 40,
                }}
                backgroundColorOn={colors.active}
                backgroundColorOff={colors.active}
                circleColorOn={colors.complementary}
                circleColorOff={colors.inactive}
                circleStyle={{
                  width: 30,
                  height: 25,
                  padding: 7,
                  borderRadius: 15,
                }}
              />
            </View>

            {exerciseNotificationEnabled && (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Time</Text>

                {Platform.OS === "android" && (
                  <Button
                    title="Time"
                    onPress={() => setActiveTimePicker(`exerciseReminder`)}
                  />
                )}
                {Platform.OS === "ios" ||
                activeTimePicker === `exerciseReminder` ? (
                  <DateTimePicker
                    value={exerciseNotificationTime || new Date()}
                    mode="time"
                    onChange={(event, selectedDate) => {
                      setExerciseNotificationTime(
                        selectedDate || exerciseNotificationTime
                      );
                      setActiveTimePicker(null);
                    }}
                  />
                ) : null}
              </View>
            )}
          </View>

          <TouchableOpacity
            onPress={saveNotificationSettings}
            style={styles.btnSave}
          >
            <Text style={styles.btnSaveText}>Save</Text>
          </TouchableOpacity>
        </View>

        <Toast
          ref={toastRef}
          placement="top"
          style={{ backgroundColor: colors.darkBlue, marginTop: 60 }}
          fadeInDuration={750}
          fadeOutDuration={1000}
          opacity={1}
          textStyle={{ color: colors.white, fontFamily: "MontserratRegular" }}
        />
      </ScrollView>
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
    padding: 20,
    backgroundColor: colors.background,
  },
  logo: {
    width: 50,
    height: 50,
  },
  contentContainer: {
    margin: 20,
  },
  subContainer: {
    marginBottom: 20,
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 10,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: "MontserratBold",
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  label: {
    fontFamily: "MontserratRegular",
    fontSize: 16,
  },
  btnSave: {
    width: "60%",
    alignSelf: "center",
    backgroundColor: colors.complementary,
    padding: 15,
    marginTop: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  btnSaveText: {
    color: colors.white,
    fontFamily: "MontserratRegular",
    fontSize: 18,
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
    width: 100,
    marginVertical: 10,
    fontSize: 16,
    fontFamily: "MontserratRegular",
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: colors.gray,
    color: colors.white,
    backgroundColor: colors.complementary,
  },
});

export default NotificationsSettings;
