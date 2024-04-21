import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  UIManager,
  Platform,
  LayoutAnimation,
  Dimensions,
  Alert,
  Keyboard,
  Button,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import colors from "../../config/colors";
import Icon from "react-native-vector-icons/AntDesign";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import {
  updateGlucoseValueSlice,
  deleteGlucoseValueSlice,
} from "../store/slices/userSlice";
import { getNgrokUrl } from "../../config/constants";
import Dialog from "react-native-dialog";
import DateTimePicker from "@react-native-community/datetimepicker";

const screenWidth = Dimensions.get("window").width;

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ListComponent = ({
  glucoseValues,
  timestamps,
  dates,
  times,
  glucoseIds,
  selectedDate,
  onRemove = () => {},
  onUpdate = () => {},
}) => {
  const user = useSelector((state) => state.user.user) || {};
  const token = useSelector((state) => state.auth.token) || "";
  const dispatch = useDispatch();

  const swipeableRefs = useRef([]);
  const [openSwipeable, setOpenSwipeable] = useState(null);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [expanded, setExpanded] = useState(true);
  const [animation] = useState(new Animated.Value(0));
  const [arrow, setArrow] = useState("up");

  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [inputText, setInputText] = useState("");

  const [currentReadingId, setCurrentReadingId] = useState(null);
  const [currentValue, setCurrentValue] = useState(null);
  const [currentTimestamp, setCurrentTimestamp] = useState(null);

  const handleShowTimePicker = () => {
    Keyboard.dismiss();
    setShowTimePicker(true);
  };

  useEffect(() => {
    toggleAnimation();
  }, [expanded]);

  const toggleAnimation = () => {
    const initialValue = expanded ? 0 : 1;
    const finalValue = expanded ? 1 : 0;

    animation.setValue(initialValue);

    Animated.timing(animation, {
      toValue: finalValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);

    if (expanded) {
      setArrow("down");
    } else {
      setArrow("up");
    }

    swipeableRefs.current.forEach((ref) => ref && ref.close());
  };

  if (glucoseValues.length === 0) {
    return null;
  }

  const maxHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 500],
  });

  const handleSwipeableOpen = (index) => {
    if (
      openSwipeable !== null &&
      openSwipeable !== index &&
      swipeableRefs.current[openSwipeable]
    ) {
      swipeableRefs.current[openSwipeable].close();
    }
    setOpenSwipeable(index);
  };

  const updateGlucoseValue = async (value, readingId) => {
    try {
      // Create the new Date object
      const updatedTimestamp = new Date(
        selectedTime.getFullYear(),
        selectedTime.getMonth(),
        selectedTime.getDate(),
        selectedTime.getHours(),
        selectedTime.getMinutes(),
        selectedTime.getSeconds()
      );

      // Convert timestamp to ISO string
      const recordedTimestamp = updatedTimestamp.toISOString();

      const response = await axios.put(
        `${getNgrokUrl()}/api/log/update-glucose/${user._id}/${readingId}`,
        {
          glucoseValue: value,
          timestamp: recordedTimestamp,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        onUpdate(value, recordedTimestamp, readingId);
        dispatch(
          updateGlucoseValueSlice({
            glucoseValue: value,
            timestamp: recordedTimestamp,
            id: readingId,
          })
        );

        swipeableRefs.current.forEach((ref) => ref && ref.close());
      }

      setCurrentTimestamp(recordedTimestamp);
      setIsDialogVisible(false);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteGlucoseValue = async (readingId) => {
    try {
      const response = await axios.delete(
        `${getNgrokUrl()}/api/log/delete-glucose/${user._id}/${readingId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        dispatch(deleteGlucoseValueSlice({ id: readingId }));
        onRemove(readingId);

        swipeableRefs.current.forEach((ref) => ref && ref.close());
        swipeableRefs.current = swipeableRefs.current.filter(
          (ref, index) => index !== openSwipeable
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (value, oldTimestamp, readingId) => {
    let selectedDateObj = new Date(selectedDate);
    const timeParts = oldTimestamp.split(/[:\s]/);

    if (
      timeParts.length !== 3 ||
      isNaN(parseInt(timeParts[0])) ||
      isNaN(parseInt(timeParts[1]))
    ) {
      console.error("Invalid timestamp:", oldTimestamp);
      return;
    }

    let hours = parseInt(timeParts[0]);
    let minutes = parseInt(timeParts[1]);

    if (timeParts[2] === "PM") {
      hours = (hours + 12) % 24;
    }

    const selectedDateObjUTC = new Date(
      Date.UTC(
        selectedDateObj.getFullYear(),
        selectedDateObj.getMonth(),
        selectedDateObj.getDate(),
        hours,
        minutes,
        0
      )
    );

    selectedDateObj.setHours(hours, minutes, 0);

    setCurrentReadingId(readingId);
    setCurrentValue(value);
    setCurrentTimestamp(selectedDateObjUTC);
    setSelectedTime(selectedDateObjUTC);
    setIsDialogVisible(true);
  };

  const handleCancel = () => {
    setIsDialogVisible(false);

    swipeableRefs.current.forEach((ref) => ref && ref.close());
  };

  const handleRemove = async (readingId) => {
    Alert.alert(
      "Delete Glucose Value",
      "Are you sure you want to delete this glucose value?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => deleteGlucoseValue(readingId),
          style: "destructive",
        },
      ],
      { cancelable: false }
    );
  };

  const renderRightActions = (value, oldTimestamp, readingId) => (
    <View style={{ flexDirection: "row" }}>
      <TouchableOpacity
        style={styles.swipeButton1}
        onPress={() => handleEdit(value, oldTimestamp, readingId)}
      >
        <Text style={styles.btnText1}>Edit</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.swipeButton2}
        onPress={() => handleRemove(readingId)}
      >
        <Text style={styles.btnText2}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View>
      <TouchableOpacity onPress={toggleExpand}>
        <View style={styles.labelBar}>
          <Text style={styles.labelText}>Glucose Values</Text>
          <Icon
            name={arrow}
            size={18}
            color={colors.white}
            style={{ marginRight: 10 }}
          />
        </View>
      </TouchableOpacity>
      <Animated.View style={[styles.listContainer, { maxHeight }]}>
        {glucoseValues.map((value, index) => (
          <Swipeable
            key={index}
            ref={(ref) => (swipeableRefs.current[index] = ref)}
            renderRightActions={() =>
              renderRightActions(value, times[index], glucoseIds[index])
            }
            onSwipeableOpen={() => handleSwipeableOpen(index)}
            friction={0.6}
          >
            <View style={styles.listItem}>
              <Text style={styles.listItemText}>{value} mg/dL</Text>
              <Text style={styles.listItemTime}>{times[index]}</Text>
            </View>
          </Swipeable>
        ))}
      </Animated.View>

      <View>
        <Dialog.Container visible={isDialogVisible}>
          <Dialog.Title>Edit Glucose Value</Dialog.Title>
          <Dialog.Description>
            Please enter the new glucose value and time
          </Dialog.Description>
          <Dialog.Input
            onChangeText={(text) => setCurrentValue(text)}
            keyboardType="number-pad"
            autoFocus={true}
            placeholder="Enter glucose value"
            value={currentValue ? currentValue.toString() : ""}
          />
          {isDialogVisible && Platform.OS === "android" && (
            <View style={styles.androidBtn}>
              <Button title="Time" onPress={handleShowTimePicker} />
            </View>
          )}
          {isDialogVisible && (showTimePicker || Platform.OS === "ios") && (
            <DateTimePicker
              testID="dateTimePicker"
              value={selectedTime}
              mode={"time"}
              is24Hour={true}
              display="default"
              onChange={(event, selectedDate) => {
                setShowTimePicker(false);
                const currentTime = selectedDate || new Date();
                setSelectedTime(currentTime);
              }}
              style={{ alignSelf: "center", marginBottom: 20 }}
            />
          )}
          <Dialog.Button label="Cancel" onPress={handleCancel} />
          <Dialog.Button
            label="Update"
            onPress={() => updateGlucoseValue(currentValue, currentReadingId)}
          />
        </Dialog.Container>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  labelBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderRadius: 5,
    alignSelf: "center",
    width: "90%",
    backgroundColor: colors.complementary,
  },
  labelText: {
    fontSize: 18,
    fontFamily: "MontserratRegular",
    color: colors.white,
  },
  listContainer: {
    overflow: "hidden",
  },
  listItem: {
    width: "90%",
    alignSelf: "center",
    marginTop: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 5,
    backgroundColor: colors.white,
    borderBottomColor: colors.inactive,
  },
  listItemText: {
    fontSize: 15,
    fontFamily: "MontserratRegular",
  },
  listItemTime: {
    fontSize: 15,
    fontFamily: "MontserratRegular",
  },
  swipeButton1: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
    borderRadius: 5,
    marginRight: 5,
    backgroundColor: colors.complementary,
    width: screenWidth * 0.2,
  },
  swipeButton2: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
    borderRadius: 5,
    marginRight: 21,
    backgroundColor: colors.danger,
    width: screenWidth * 0.2,
  },
  btnText1: {
    color: colors.white,
    fontFamily: "MontserratRegular",
  },
  btnText2: {
    color: colors.white,
    fontFamily: "MontserratRegular",
  },
  androidBtn: {
    width: 100,
    marginLeft: 20,
    marginTop: 10,
    alignSelf: "center",
  },
});

export default ListComponent;
