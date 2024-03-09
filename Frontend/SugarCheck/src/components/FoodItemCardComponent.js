import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Keyboard,
  Alert,
} from "react-native";
import { Card } from "react-native-elements";
import colors from "../../config/colors";
import Icon from "react-native-vector-icons/AntDesign";
import Collapsible from "react-native-collapsible";
import Dialog from "react-native-dialog";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import { getNgrokUrl } from "../../config/constants";
import { useSelector, useDispatch } from "react-redux";
import * as Haptics from "expo-haptics";

const FoodItemCardComponent = ({ item }) => {
  const user = useSelector((state) => state.user) || {};
  const token = useSelector((state) => state.token) || {};
  const dispatch = useDispatch();

  const [isCollapsed, setIsCollapsed] = useState(true);

  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [notes, setNotes] = useState("");
  const [selectedTime, setSelectedTime] = useState(new Date());

  const image = item.food.image;
  const title = item.food.label;
  const text = `Category: ${item.food.category}\nCategory Label: ${item.food.categoryLabel}\n`;
  const btnText = "Log Meal";
  const nutrients = `Calories: ${Math.round(
    item.food.nutrients.ENERC_KCAL
  )}\nProtein: ${Math.round(item.food.nutrients.PROCNT)}g\nCarbs: ${Math.round(
    item.food.nutrients.CHOCDF
  )}g\nFat: ${Math.round(item.food.nutrients.FAT)}g\nFiber: ${Math.round(
    item.food.nutrients.FIBTG
  )}g\n`;

  const handleCancel = () => {
    setIsDialogVisible(false);
  };

  const handleShowTimePicker = () => {
    Keyboard.dismiss();
    setShowTimePicker(true);
  };

  const logMeal = async (item, notes, timestamp) => {
    try {
      let body = {
        timestamp: timestamp,
        mealName: item.food.label,
        calories: Math.round(item.food.nutrients.ENERC_KCAL),
        carbohydrates: Math.round(item.food.nutrients.CHOCDF),
        fats: Math.round(item.food.nutrients.FAT),
        proteins: Math.round(item.food.nutrients.PROCNT),
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
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card containerStyle={styles.container}>
      <TouchableOpacity
        onPress={() => setIsCollapsed(!isCollapsed)}
        activeOpacity={0.9}
      >
        <View style={styles.imageContainer}>
          {image && (
            <Card.Image
              source={{ uri: image }}
              style={styles.image}
              resizeMode="cover"
            />
          )}
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.contentSubContainer}>
            <Card.Title style={styles.titleText}>{title}</Card.Title>
            <Text style={styles.textContainer}>{text}</Text>
          </View>
          <View style={styles.buttonSubContainer}>
            <Icon
              name={isCollapsed ? "down" : "up"}
              style={styles.conatinerIcon}
              size={24}
            />
          </View>
        </View>
      </TouchableOpacity>

      <Collapsible style={styles.collapsedContainer} collapsed={isCollapsed}>
        <Text style={styles.titleText}>Nutritional Information</Text>
        <Card.Divider />
        <Text style={styles.textContainer}>{nutrients}</Text>
      </Collapsible>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => {
          setIsDialogVisible(true);
        }}
        activeOpacity={0.8}
      >
        <Text style={styles.btnText}>{btnText}</Text>
        <Icon name="plus" style={styles.btnIcon} />
      </TouchableOpacity>

      <View>
        <Dialog.Container visible={isDialogVisible}>
          <Dialog.Title>Log Meal</Dialog.Title>
          <Dialog.Description>
            Please fill the form to log your meal.
          </Dialog.Description>
          <Dialog.Input
            onChangeText={(text) => setNotes(text)}
            autoFocus={true}
            placeholder="Notes"
            multiline={true}
          />

          {isDialogVisible && Platform.OS === "android" ? (
            <View style={styles.androidBtn}>
              <Button title="Time" onPress={handleShowTimePicker} />
            </View>
          ) : (
            isDialogVisible &&
            (showTimePicker || Platform.OS === "ios") && (
              <DateTimePicker
                testID="dateTimePicker"
                mode={"datetime"}
                value={selectedTime}
                is24Hour={true}
                display="default"
                onChange={(event, selectedTime) => {
                  setShowTimePicker(false);

                  if (selectedTime) {
                    setSelectedTime(selectedTime);
                  }
                }}
                style={{ alignSelf: "center", marginBottom: 20 }}
              />
            )
          )}
          <Dialog.Button label="Cancel" onPress={handleCancel} />
          <Dialog.Button
            label="Add"
            onPress={() => {
              logMeal(item, notes, selectedTime);
              setIsDialogVisible(false);
            }}
          />
        </Dialog.Container>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 10,
    marginHorizontal: 15,
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: { width: 3, height: 5 },
    elevation: 5,
    padding: 0,
    marginBottom: 10,
  },
  imageContainer: {
    width: "100%",
  },
  contentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  contentSubContainer: {
    width: "90%",
  },
  buttonSubContainer: {
    width: "10%",
    justifyContent: "center",
  },
  conatinerIcon: {
    color: colors.darkBlue,
    fontSize: 20,
    alignSelf: "center",
    marginRight: 10,
  },
  image: {
    width: "100%",
    height: 170,
    alignSelf: "center",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  titleText: {
    fontFamily: "MontserratBold",
    fontSize: 20,
    marginTop: 10,
  },
  textContainer: {
    fontFamily: "MontserratRegular",
    fontSize: 18,
    textAlign: "center",
  },
  btn: {
    backgroundColor: colors.darkBlue,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    padding: 12,
    width: "100%",
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  btnText: {
    color: colors.white,
    textAlign: "center",
    fontFamily: "MontserratRegular",
    fontSize: 18,
  },
  btnIcon: {
    color: colors.white,
    textAlign: "center",
    fontFamily: "MontserratRegular",
    fontSize: 20,
    marginLeft: 10,
  },
  collapsedContainer: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  androidBtn: {
    width: 100,
    marginLeft: 20,
    marginTop: 10,
    alignSelf: "center",
  },
});

export default FoodItemCardComponent;
