import React, { useLayoutEffect, useState, useEffect, useRef } from "react";
import {
  Button,
  StyleSheet,
  TextInput,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
  Image,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { setHeaderOptions } from "../components/HeaderOptions";
import colors from "../../config/colors";
import { ScrollView } from "react-native-gesture-handler";
import axios from "axios";
import { getNgrokUrl } from "../../config/constants";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useDispatch, useSelector } from "react-redux";
import {
  addGlucoseValueSlice,
  addA1cReadingSlice,
} from "../store/slices/userSlice";
import ChartComponent from "../components/ChartComponent";
import ListComponent from "../components/ListComponent";
import AntDesign from "react-native-vector-icons/AntDesign";
import { Ionicons } from "@expo/vector-icons";
import { ProgressBar } from "react-native-paper";
import Sheet from "../components/Sheet";
import Dialog from "react-native-dialog";
import Toast from "react-native-fast-toast";
import * as Haptics from "expo-haptics";

const GlucoseMonitorScreen = ({ navigation }) => {
  useLayoutEffect(() => {
    setHeaderOptions(navigation);
  }, [navigation]);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user) || {};
  const token = useSelector((state) => state.auth.token) || {};

  const [valuesPerDay, setValuesPerDay] = useState({});
  const [animation, setAnimation] = useState(new Animated.Value(0));

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());

  const [showTimePicker, setShowTimePicker] = useState(false);
  const [lastIndexSent, setLastIndexSent] = useState(0);

  const [glucoseValues, setGlucoseValues] = useState([]);
  const [timestamps, setTimestamps] = useState([]);
  const [glucoseIds, setGlucoseIds] = useState([]);

  const [inputValue, setInputValue] = useState("");
  const [glucoseCount, setGlucoseCount] = useState(0);
  const [latestGlucoseValues, setLatestGlucoseValues] = useState([]);

  const [sheetVisible, setSheetVisible] = useState(false);
  const [isDialogVisible, setIsDialogVisible] = useState(false);

  const [dates, setDates] = useState([]);
  const [times, setTimes] = useState([]);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const [riskScore, setRiskScore] = useState("");

  const [bmi] = useState(user?.healthProfile?.bmi ? user.healthProfile.bmi : 0);
  const [age] = useState(
    user?.healthProfile?.riskFactors?.age
      ? user.healthProfile.riskFactors.age
      : 0
  );
  const [gender] = useState(
    user ? user?.gender?.charAt(0).toUpperCase() + user?.gender?.slice(1) : ""
  );
  const [A1cReading, setA1cReading] = useState(0);

  const [formData, setFormData] = useState({
    age: age,
    bmi: bmi,
    gender_female: gender_female,
    gender_male: gender_male,
    glucose_values: latestGlucoseValues,
  });

  let gender_male = 0;
  let gender_female = 0;

  const toastRef = useRef();
  const scrollRef = useRef();

  useEffect(() => {
    fetchGlucoseValues(selectedDate);
    getAllGlucoseValues();
  }, []);

  useEffect(() => {
    gender === "male" ? (gender_male = 1) : (gender_female = 1);

    const updatedFormData = {
      age: age,
      bmi: bmi,
      glucose_values: latestGlucoseValues,
      gender_male,
      gender_female,
    };

    setFormData(updatedFormData);
  }, [latestGlucoseValues]);

  const isToday = (someDate) => {
    const today = new Date();
    return (
      someDate.getDate() == today.getDate() &&
      someDate.getMonth() == today.getMonth() &&
      someDate.getFullYear() == today.getFullYear()
    );
  };

  const handleShowTimePicker = () => {
    Keyboard.dismiss();
    setShowTimePicker(true);
  };

  const onTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || new Date();
    setShowTimePicker(Platform.OS === "ios");
    setSelectedTime(currentTime);
  };

  const onSwipeLeft = () => {
    if (!isToday(selectedDate)) {
      const newDate = new Date(selectedDate);
      newDate.setDate(newDate.getDate() + 1);
      setSelectedDate(newDate);

      setInputValue("");
      fetchGlucoseValues(newDate);

      Animated.timing(animation, {
        toValue: -Dimensions.get("window").width,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        setAnimation(new Animated.Value(0));
      });
    }
  };

  const onSwipeRight = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);

    setInputValue("");
    fetchGlucoseValues(newDate);

    Animated.timing(animation, {
      toValue: Dimensions.get("window").width,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setAnimation(new Animated.Value(0));
    });
  };

  // Helper function to sort arrays based on timestamps
  const sortArrays = (
    newTimes,
    newGlucoseValues,
    newTimestamps,
    newGlucoseIds
  ) => {
    const sortedIndices = newTimestamps
      .map((value, index) => ({ value, index }))
      .sort((a, b) => new Date(a.value) - new Date(b.value))
      .map(({ index }) => index);

    setTimes(sortedIndices.map((index) => newTimes[index]));
    setGlucoseValues(sortedIndices.map((index) => newGlucoseValues[index]));
    setTimestamps(sortedIndices.map((index) => newTimestamps[index]));
    setGlucoseIds(sortedIndices.map((index) => newGlucoseIds[index]));
  };

  useEffect(() => {
    const dateString = selectedDate.toISOString().split("T")[0];

    if (valuesPerDay[dateString] >= 3) {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }
  }, [glucoseValues, timestamps, valuesPerDay, inputValue]);

  const fetchGlucoseValues = (date) => {
    const dateString = date.toISOString().split("T")[0];

    axios
      .get(`${getNgrokUrl()}/api/log/fetch-glucose/${user._id}/${dateString}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const newDates = response.data.data.timestamps.map((timestamp) => {
          const date = new Date(timestamp);
          if (isNaN(date.getTime())) {
            console.error(`Invalid timestamp: ${timestamp}`);
            return null;
          }
          return date.toISOString().split("T")[0];
        });

        const newTimes = response.data.data.timestamps.map((timestamp) => {
          const date = new Date(timestamp);
          if (isNaN(date.getTime())) {
            console.error(`Invalid timestamp: ${timestamp}`);
            return null;
          }
          return date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          });
        });

        const newGlucoseValues = response.data.data.glucoseValues;
        const newTimestamps = response.data.data.timestamps;
        const newGlucoseIds = response.data.data.glucoseIds;

        sortArrays(newTimes, newGlucoseValues, newTimestamps, newGlucoseIds);

        setDates(newDates);
        setValuesPerDay((prevValues) => ({
          ...prevValues,
          [dateString]: newGlucoseValues.length,
        }));
      })
      .catch((error) => {
        console.error("Failed to fetch glucose values:", error);
        console.error(error.message, error.config);
      });
  };

  const addGlucoseValue = async () => {
    const dateString = selectedDate.toISOString().split("T")[0];
    const currentValues = valuesPerDay[dateString] || 0;

    if (currentValues >= 3) {
      toastRef.current.show("You can only log 3 values per day", {
        type: "danger",
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    const timestamp = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      selectedTime.getHours(),
      selectedTime.getMinutes()
    );

    // Convert timestamp to ISO string
    const recordedTime = timestamp.toISOString();

    setInputValue("");
    setValuesPerDay({
      ...valuesPerDay,
      [dateString]: currentValues + 1,
    });

    const dataToSend = {
      glucose_value: Number(inputValue),
      timestamp: recordedTime,
    };

    axios
      .post(`${getNgrokUrl()}/api/log/glucose/${user._id}`, dataToSend, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setLastIndexSent(glucoseValues.length);

        const newTime = timestamp.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        });

        // Create new arrays with the new values
        const newTimes = [...times, newTime];
        const newGlucoseValues = [...glucoseValues, Number(inputValue)];
        const newTimestamps = [...timestamps, recordedTime];
        const newGlucoseIds = [...glucoseIds, response.data.data.id];

        // Call the helper function to sort the arrays
        sortArrays(newTimes, newGlucoseValues, newTimestamps, newGlucoseIds);

        dispatch(
          addGlucoseValueSlice({
            glucoseValue: Number(inputValue),
            recordedTimestamp: recordedTime,
          })
        );
      })
      .catch((error) => {
        console.error("Failed to log glucose value:", error);
        console.error(error.message, error.config);
      });
  };

  const handleCancel = () => {
    setIsDialogVisible(false);
  };

  const handleSubmit = async () => {
    await addGlucoseValue();
  };

  const handleUpdate = (newValue, newTimestamp, readingId) => {
    const index = glucoseIds.indexOf(readingId);

    if (index !== -1) {
      const newGlucoseValues = [...glucoseValues];
      const newTimestamps = [...timestamps];
      const newTimes = [...times];

      newGlucoseValues[index] = newValue;
      newTimestamps[index] = newTimestamp;

      const date = new Date(newTimestamp);
      const newTime = date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });

      newTimes[index] = newTime;

      setGlucoseValues(newGlucoseValues);
      setTimestamps(newTimestamps);
      setTimes(newTimes);

      toastRef.current.show("Glucose value updated successfully", {
        type: "success",
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }
  };

  const handleRemove = (readingId) => {
    const index = glucoseIds.indexOf(readingId);

    if (index !== -1) {
      const newGlucoseValues = [...glucoseValues];
      const newTimestamps = [...timestamps];
      const newGlucoseIds = [...glucoseIds];
      newGlucoseValues.splice(index, 1);
      newTimestamps.splice(index, 1);
      newGlucoseIds.splice(index, 1);

      setGlucoseValues(newGlucoseValues);
      setTimestamps(newTimestamps);
      setGlucoseIds(newGlucoseIds);
      setButtonDisabled(false);

      toastRef.current.show("Glucose value removed successfully", {
        type: "success",
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }
  };

  const getAllGlucoseValues = () => {
    axios
      .get(`${getNgrokUrl()}/api/log/fetch-latest-values/${user._id}/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setGlucoseCount(response.data.data.glucoseValues.length);
        setLatestGlucoseValues(response.data.data.glucoseValues);
      })
      .catch((error) => {
        console.error("Failed to fetch all glucose values:", error);
        console.error(error.message, error.config);
      });
  };

  useEffect(() => {
    getAllGlucoseValues();
  }, [glucoseValues]);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 0.5,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  const toggleSheet = () => {
    if (sheetVisible) {
      setSheetVisible(false);
      fadeOut();
    } else {
      setSheetVisible(true);
      fadeIn();
    }
  };

  const getA1cReadingStyle = (A1cReading) => {
    if (A1cReading < 6) {
      return styles.a1cNormal;
    } else if (A1cReading >= 6 && A1cReading < 6.4) {
      return styles.a1cPrediabetic;
    } else {
      return styles.a1cDiabetic;
    }
  };

  const convertToMgPerDl = (A1cReading) => {
    return (28.7 * A1cReading - 46.7).toFixed(2);
  };

  const renderSheetContent = () => {
    return (
      <View>
        <Text style={styles.title}>Estimate HbA1c</Text>
        <Text style={styles.a1cText}>
          This feature estimates your HbA1c level based on the glucose values
          you have logged in the past week.
        </Text>
        {glucoseCount < 10 ? (
          <View>
            <Text style={styles.a1cText}>
              You need to log at least 10 values in the past week to estimate
              your HbA1c.
            </Text>
            <Text style={styles.a1cText}>
              You currently have {glucoseCount} / 10 values logged in the past
              week.
            </Text>
          </View>
        ) : (
          <View>
            <Text style={{ ...styles.a1cText, paddingBottom: 40 }}>
              Please tap the button below to receive your estimated HbA1c level
            </Text>
            <TouchableOpacity style={styles.a1cBtn} onPress={estimateA1c}>
              <Text style={styles.a1cBtnText}>Estimate HbA1c</Text>
            </TouchableOpacity>

            {A1cReading !== 0 && (
              <View style={styles.a1cPredictionContainer}>
                <Text
                  style={[getA1cReadingStyle(A1cReading), styles.a1cReading]}
                >
                  Your estimated HbA1c is {A1cReading}% (
                  {convertToMgPerDl(A1cReading)} mg/dL)
                </Text>

                <TouchableOpacity
                  style={styles.btnNext}
                  onPress={() => {
                    navigation.navigate("A1cResult", {
                      A1cReading: A1cReading,
                    });
                    toggleSheet();
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text style={styles.btnNextText}>What's Next</Text>
                    <AntDesign
                      name="right"
                      size={20}
                      color={colors.complementary}
                      style={{ paddingLeft: 5 }}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  const estimateA1c = () => {
    axios
      .post(`${getNgrokUrl()}/api/pred/estimate-a1c/${user._id}`, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          dispatch(
            addA1cReadingSlice({
              estimatedA1c: response.data.A1cValue,
              timestamp: new Date(),
            })
          );
        }

        setA1cReading(response.data.A1cValue);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        if (response.data.A1cValue < 5.7) {
          setRiskScore("Low Risk");
        } else if (
          response.data.A1cValue >= 5.7 &&
          response.data.A1cValue <= 6.4
        ) {
          setRiskScore("Moderate Risk");
        } else {
          setRiskScore("High Risk");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    riskScore && saveRiskScore();
  }, [riskScore]);

  const saveRiskScore = async () => {
    try {
      const response = await axios.put(
        `${getNgrokUrl()}/api/health/risk-score/${user._id}`,
        {
          riskScore: riskScore,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log("Risk score saved successfully");
      }
    } catch (error) {
      console.log("Error saving risk score", error);
    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={sheetVisible ? toggleSheet : Keyboard.dismiss}
    >
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        ref={scrollRef}
      >
        <SafeAreaView style={styles.mainContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Ionicons name="ios-menu" size={35} color={colors.darkBlue} />
            </TouchableOpacity>
            <Image
              source={require("../../assets/icons/DarkAppIcon.png")}
              style={styles.logo}
            />
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: buttonDisabled
                    ? colors.disabled
                    : colors.complementary,
                },
              ]}
              onPress={() => {
                setIsDialogVisible(true);
              }}
              disabled={buttonDisabled}
            >
              <AntDesign name="plus" size={25} color="white" />
            </TouchableOpacity>
          </View>

          <ChartComponent
            selectedDate={selectedDate}
            onSwipeLeft={onSwipeLeft}
            onSwipeRight={onSwipeRight}
            isToday={isToday}
            glucoseValues={glucoseValues.map(Number)}
            timestamps={timestamps}
            times={times}
            animation={animation}
          />

          <TouchableOpacity onPress={toggleSheet}>
            <View style={styles.labelBar}>
              <Text style={styles.labelText}>Estimate HbA1c</Text>
              <Text
                style={[
                  styles.labelText,
                  { fontSize: 14, marginLeft: "35%", marginTop: 2 },
                ]}
              >
                {glucoseCount} / 10
              </Text>
              <AntDesign name="right" size={18} color={colors.white} />
            </View>
            <ProgressBar
              progress={glucoseCount / 10}
              color={colors.inactive}
              style={styles.progressBar}
            />
          </TouchableOpacity>

          <Sheet
            visible={sheetVisible}
            onRequestClose={toggleSheet}
            height="80%"
          >
            {renderSheetContent()}
          </Sheet>

          <Animated.View
            pointerEvents={sheetVisible ? "auto" : "none"}
            style={[styles.overlay, { opacity: fadeAnim }]}
          />

          <Dialog.Container visible={isDialogVisible}>
            <Dialog.Title>Add Glucose Value</Dialog.Title>
            <Dialog.Description>
              Please enter the glucose value and time
            </Dialog.Description>
            <Dialog.Input
              placeholder="Enter glucose value"
              value={inputValue}
              onChangeText={(text) => setInputValue(text)}
              keyboardType="numeric"
              returnKeyType="done"
              autoFocus={true}
            />

            {Platform.OS === "android" && (
              <View style={styles.androidBtn}>
                <Button title="Time" onPress={handleShowTimePicker} />
              </View>
            )}
            {(showTimePicker || Platform.OS === "ios") && (
              <View style={styles.dialogContainer}>
                <Text style={styles.dialogText}>Select time:</Text>
                <DateTimePicker
                  testID="timePicker"
                  value={selectedTime}
                  mode={"time"}
                  is24Hour={true}
                  display="default"
                  onChange={onTimeChange}
                  paddingHorizontal={10}
                />
              </View>
            )}
            <Dialog.Button label="Cancel" onPress={handleCancel} />
            <Dialog.Button
              label="Submit"
              onPress={() => {
                handleSubmit();
                setIsDialogVisible(false);
              }}
            />
          </Dialog.Container>

          <View style={styles.listComponent}>
            <ListComponent
              glucoseValues={glucoseValues}
              timestamps={timestamps}
              dates={dates}
              times={times}
              glucoseIds={glucoseIds}
              selectedDate={selectedDate}
              onUpdate={handleUpdate}
              onRemove={handleRemove}
            />
          </View>

          <Toast
            ref={toastRef}
            placement="top"
            style={{ backgroundColor: colors.darkBlue }}
            fadeInDuration={750}
            fadeOutDuration={1000}
            opacity={1}
            textStyle={{ color: colors.white, fontFamily: "MontserratRegular" }}
          />
        </SafeAreaView>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
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
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 10,
    paddingHorizontal: 10,
    flex: 1,
  },
  dialogContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  dialogText: {
    fontSize: 16,
    color: colors.white,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
    justifyContent: "center",
    alignItems: "center",
  },
  androidBtn: {
    width: 100,
    marginLeft: 20,
    marginTop: 10,
    alignSelf: "center",
  },
  itemContainer: {
    width: Dimensions.get("window").width,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  labelBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
    padding: 15,
    marginTop: 20,
    marginBottom: 15,
    width: "90%",
    borderRadius: 5,
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    backgroundColor: colors.complementary,
  },
  labelText: {
    fontSize: 18,
    fontFamily: "MontserratRegular",
    color: colors.white,
  },
  progressBar: {
    width: "90%",
    height: 10,
    alignSelf: "center",
    backgroundColor: colors.active,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.complementary,
  },
  listComponent: {
    marginVertical: 30,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 10,
  },
  title: {
    fontSize: 20,
    fontFamily: "MontserratBold",
    textAlign: "center",
    padding: 10,
    marginBottom: 30,
  },
  a1cText: {
    fontSize: 18,
    fontFamily: "MontserratRegular",
    textAlign: "center",
    padding: 10,
  },
  a1cBtnText: {
    fontSize: 18,
    fontFamily: "MontserratRegular",
    color: colors.white,
    textAlign: "center",
  },
  a1cBtn: {
    padding: 15,
    backgroundColor: colors.complementary,
    borderRadius: 5,
    alignSelf: "center",
  },
  a1cPredictionContainer: {
    marginTop: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 5,
  },
  a1cReading: {
    fontSize: 18,
    fontFamily: "MontserratBold",
    textAlign: "center",
    padding: 10,
  },
  a1cNormal: {
    color: colors.green,
  },
  a1cPrediabetic: {
    color: colors.orange,
  },
  a1cDiabetic: {
    color: colors.danger,
  },
  btnNext: {
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  btnNextText: {
    fontSize: 18,
    fontFamily: "MontserratRegular",
    textAlign: "center",
    color: colors.complementary,
  },
});

export default GlucoseMonitorScreen;
