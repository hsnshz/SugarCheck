import React, { useLayoutEffect, useState, useEffect, useRef } from "react";
import {
  Button,
  StyleSheet,
  TextInput,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Alert,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
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
import { ProgressBar } from "react-native-paper";
import Sheet from "../components/Sheet";

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

  const [dates, setDates] = useState([]);
  const [times, setTimes] = useState([]);
  const [buttonDisabled, setButtonDisabled] = useState(false);

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

  useEffect(() => {
    const dateString = selectedDate.toISOString().split("T")[0];

    if (inputValue == "" || valuesPerDay[dateString] >= 3) {
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
        console.log(
          "Fetched glucose values:",
          response.data.data.glucoseValues
        );
        console.log("Fetched timestamps:", response.data.data.timestamps);

        const dates = response.data.data.timestamps.map((timestamp) => {
          const date = new Date(timestamp);
          if (isNaN(date.getTime())) {
            console.error(`Invalid timestamp: ${timestamp}`);
            return null;
          }
          return date.toISOString().split("T")[0];
        });

        const times = response.data.data.timestamps.map((timestamp) => {
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

        setDates(dates);
        setTimes(times);

        setGlucoseValues(response.data.data.glucoseValues);
        setTimestamps(response.data.data.timestamps);
        setGlucoseIds(response.data.data.glucoseIds);
        setValuesPerDay((prevValues) => ({
          ...prevValues,
          [dateString]: response.data.data.glucoseValues.length,
        }));

        console.log("");
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
      Alert.alert("You can only enter 3 glucose values per day.");
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

    console.log("Data to send: ", dataToSend);
    console.log(`${getNgrokUrl()}/api/log/glucose/${user._id}`);

    axios
      .post(`${getNgrokUrl()}/api/log/glucose/${user._id}`, dataToSend, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setLastIndexSent(glucoseValues.length);
        console.log("Success:", response.data);

        const newTime = timestamp.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        });
        setTimes((prevTimes) => [...prevTimes, newTime]);
        setGlucoseValues((prevGlucoseValues) => [
          ...prevGlucoseValues,
          Number(inputValue),
        ]);
        setTimestamps((prevTimestamps) => [...prevTimestamps, recordedTime]);
        setGlucoseIds((prevGlucoseIds) => [
          ...prevGlucoseIds,
          response.data.data.id,
        ]);

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
        console.log(
          "Fetched latest glucose values:",
          response.data.data.glucoseValues
        );
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

  const convertToMmolPerMol = (A1cReading) => {
    return (10.929 * (A1cReading - 2.15)).toFixed(2);
  };

  const renderSheetContent = () => {
    if (glucoseCount < 10) {
      return (
        <View>
          <Text style={styles.a1cText}>
            You need to log at least 10 values in the past week to estimate your
            HbA1c.
          </Text>
          <Text style={styles.a1cText}>
            You currently have {glucoseCount} / 10 values logged in the past
            week.
          </Text>
        </View>
      );
    } else {
      return (
        <View>
          <Text style={{ ...styles.a1cText, paddingBottom: 40 }}>
            Please tap the button below to receive your estimated HbA1c
          </Text>
          <TouchableOpacity style={styles.a1cBtn} onPress={estimateA1c}>
            <Text style={styles.a1cBtnText}>Estimate HbA1c</Text>
          </TouchableOpacity>
          {A1cReading !== 0 && (
            <Text style={[getA1cReadingStyle(A1cReading), styles.a1cReading]}>
              Your estimated HbA1c is {A1cReading}% (
              {convertToMmolPerMol(A1cReading)} mmol/mol)
            </Text>
          )}
        </View>
      );
    }
  };

  const estimateA1c = () => {
    console.log(`${getNgrokUrl()}/api/pred/estimate-a1c/${user._id}`);
    console.log("Form data: ", formData);
    console.log("Token: ", token);
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
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <TouchableWithoutFeedback
      onPress={sheetVisible ? toggleSheet : Keyboard.dismiss}
    >
      <ScrollView
        style={styles.mainContainer}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
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
            <AntDesign name="right" size={18} color={colors.primary} />
          </View>
          <ProgressBar
            progress={glucoseCount / 10}
            color={colors.inactive}
            style={{
              width: "90%",
              height: 10,
              alignSelf: "center",
              backgroundColor: colors.active,
              borderRadius: 5,
              borderWidth: 1,
              borderColor: colors.complementary,
            }}
          />
        </TouchableOpacity>

        <Sheet visible={sheetVisible} onRequestClose={toggleSheet}>
          {renderSheetContent()}
        </Sheet>

        <Animated.View
          pointerEvents={sheetVisible ? "auto" : "none"}
          style={[styles.overlay, { opacity: fadeAnim }]}
        />

        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Enter glucose value"
              value={inputValue}
              onChangeText={(text) => setInputValue(text)}
              style={styles.input}
              keyboardType="numeric"
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
            />

            {Platform.OS === "android" && (
              <View style={styles.androidBtn}>
                <Button title="Time" onPress={handleShowTimePicker} />
              </View>
            )}
            {(showTimePicker || Platform.OS === "ios") && (
              <DateTimePicker
                testID="timePicker"
                value={selectedTime}
                mode={"time"}
                is24Hour={true}
                display="default"
                onChange={onTimeChange}
                paddingHorizontal={10}
              />
            )}
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: buttonDisabled
                  ? colors.disabled
                  : colors.primary,
              },
            ]}
            onPress={handleSubmit}
            disabled={buttonDisabled}
          >
            <Icon name="plus" size={15} color="white" />
          </TouchableOpacity>
        </View>

        <View>
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
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    marginTop: 20,
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
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: 5,
    marginBottom: 10,
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    margin: 20,
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
    backgroundColor: colors.active,
  },
  labelText: {
    fontSize: 18,
    fontFamily: "MontserratRegular",
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
    backgroundColor: colors.primary,
    borderRadius: 5,
    alignSelf: "center",
  },
  a1cReading: {
    fontSize: 18,
    fontFamily: "MontserratBold",
    textAlign: "center",
    padding: 10,
    marginTop: 20,
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
});

export default GlucoseMonitorScreen;
