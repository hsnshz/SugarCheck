import React, { useEffect, useState } from "react";
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
import axios from "axios";
import { getNgrokUrl } from "../../config/constants";
import { useSelector, useDispatch } from "react-redux";
import * as Haptics from "expo-haptics";
import LoggedMealSheetContent from "./LoggedMealSheetContent";
import Sheet from "./Sheet";

const LoggedMealComponent = ({ meal, onUpdated, onDeleted }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user) || {};
  const token = useSelector((state) => state.auth.token) || "";
  const mealLog = useSelector((state) => state.meal.mealLogs) || {};
  const foundLog = mealLog.find((log) =>
    log.meals.some((m) => m._id === meal._id)
  );
  const mealLogId = foundLog ? foundLog.id : undefined;

  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isSheetVisible, setIsSheetVisible] = useState(false);

  const image = meal.image;
  const title = meal.mealName;
  const nutrients = `Calories: ${meal.calories}\nProtein: ${meal.proteins}g\nCarbs: ${meal.carbohydrates}g\nFat: ${meal.fats}g\nFiber: ${meal.fiber}g\n`;

  const toggleSheet = () => {
    setIsSheetVisible(!isSheetVisible);
  };

  const handleOnUpdate = () => {
    toggleSheet();
    onUpdated();
  };

  const handleOnDelete = () => {
    Alert.alert(
      "Delete Meal",
      "Are you sure you want to delete this meal?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => deleteMeal(),
          style: "destructive",
        },
      ],
      { cancelable: false }
    );
  };

  const deleteMeal = async () => {
    try {
      const response = await axios.delete(
        `${getNgrokUrl()}/api/meals/delete-meal/${user._id}/${mealLogId}/${
          meal._id
        }`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        onDeleted();
      }
    } catch (error) {
      console.log("Error: ", error);
      toastRef.current.show("An error occurred. Please try again later.");
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
            <Card.Title style={[styles.titleText, { marginLeft: 30 }]}>
              {title}
            </Card.Title>
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

      <View style={styles.btnContainer}>
        <TouchableOpacity
          style={styles.btnEdit}
          onPress={toggleSheet}
          activeOpacity={0.8}
        >
          <Text style={styles.btnEditText}>Edit Meal</Text>
          <Icon name="edit" style={styles.btnEditIcon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnDelete}
          onPress={handleOnDelete}
          activeOpacity={0.8}
        >
          <Text style={styles.btnDeleteText}>Delete Meal</Text>
          <Icon name="delete" style={styles.btnDeleteIcon} />
        </TouchableOpacity>
      </View>

      {isSheetVisible && (
        <Sheet
          visible={isSheetVisible}
          onRequestClose={toggleSheet}
          height="85%"
          backgroundColor={colors.active}
          children={
            <LoggedMealSheetContent meal={meal} onUpdate={handleOnUpdate} />
          }
        />
      )}
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
  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },
  btnEdit: {
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 5,
    borderColor: colors.darkBlue,
    borderWidth: 1,
    width: "48%",
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  btnEditText: {
    color: colors.darkBlue,
    textAlign: "center",
    fontFamily: "MontserratRegular",
    fontSize: 18,
  },
  btnDelete: {
    borderColor: colors.danger,
    borderRadius: 5,
    borderWidth: 1,
    padding: 15,
    width: "48%",
    alignSelf: "center",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  btnDeleteText: {
    color: colors.danger,
    textAlign: "center",
    fontFamily: "MontserratRegular",
    fontSize: 18,
  },
  btnEditIcon: {
    color: colors.darkBlue,
    textAlign: "center",
    fontFamily: "MontserratRegular",
    fontSize: 20,
    marginLeft: 10,
  },
  btnDeleteIcon: {
    color: colors.danger,
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

export default LoggedMealComponent;
