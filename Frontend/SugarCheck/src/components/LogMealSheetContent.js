import React, { useState } from "react";
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
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import colors from "../../config/colors";
import axios from "axios";
import { getNgrokUrl } from "../../config/constants";
import { useDispatch, useSelector } from "react-redux";
import * as Haptics from "expo-haptics";

const LogMealSheetContent = ({ toggleSheet }) => {
  const user = useSelector((state) => state.user) || {};
  const token = useSelector((state) => state.token) || "";
  const dispatch = useDispatch();

  const [showTimePicker, setShowTimePicker] = useState(false);

  const [timestamp, setTimestamp] = useState(new Date());
  const [mealName, setMealName] = useState("");
  const [calories, setCalories] = useState("");
  const [carbohydrates, setCarbohydrates] = useState("");
  const [fats, setFats] = useState("");
  const [proteins, setProteins] = useState("");
  const [notes, setNotes] = useState("");

  const handleShowTimePicker = () => {
    Keyboard.dismiss();
    setShowTimePicker(true);
  };

  const logMeal = async () => {
    if (
      mealName === "" ||
      calories === "" ||
      carbohydrates === "" ||
      fats === "" ||
      proteins === ""
    ) {
      Alert.alert("Incomplete Form", "Please fill all the fields");
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
        notes: notes,
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
        Alert.alert("Success", "Meal logged successfully");
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        setMealName("");
        setCalories("");
        setCarbohydrates("");
        setFats("");
        setProteins("");
        setNotes("");
        setTimestamp(new Date());
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
              this.secondTextInput.focus();
            }}
          />
        </View>

        <View style={styles.subContainer}>
          <Text style={styles.label}>Calories</Text>
          <TextInput
            ref={(input) => {
              this.secondTextInput = input;
            }}
            value={calories}
            onChangeText={setCalories}
            style={styles.input}
            returnKeyType="next"
            onSubmitEditing={() => {
              this.thirdTextInput.focus();
            }}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.subContainer}>
          <Text style={styles.label}>Carbohydrates</Text>
          <TextInput
            ref={(input) => {
              this.thirdTextInput = input;
            }}
            value={carbohydrates}
            onChangeText={setCarbohydrates}
            style={styles.input}
            returnKeyType="next"
            onSubmitEditing={() => {
              this.fourthTextInput.focus();
            }}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.subContainer}>
          <Text style={styles.label}>Fats</Text>
          <TextInput
            ref={(input) => {
              this.fourthTextInput = input;
            }}
            value={fats}
            onChangeText={setFats}
            style={styles.input}
            returnKeyType="next"
            onSubmitEditing={() => {
              this.fifthTextInput.focus();
            }}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.subContainer}>
          <Text style={styles.label}>Proteins</Text>
          <TextInput
            ref={(input) => {
              this.fifthTextInput = input;
            }}
            value={proteins}
            onChangeText={setProteins}
            style={styles.input}
            returnKeyType="next"
            onSubmitEditing={() => {
              this.sixthTextInput.focus();
            }}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.subContainer}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            ref={(input) => {
              this.sixthTextInput = input;
            }}
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
});

export default LogMealSheetContent;
