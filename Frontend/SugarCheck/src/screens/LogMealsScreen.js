import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import colors from "../../config/colors";
import { getFoodDBAPIInfo } from "../../config/constants";
import axios from "axios";
import * as Haptics from "expo-haptics";
import Toast from "react-native-fast-toast";
import Icon from "react-native-vector-icons/FontAwesome5";
import FoodItemCardComponent from "../components/FoodItemCardComponent";
import Sheet from "../components/Sheet";
import LogMealSheetContent from "../components/LogMealSheetContent";

const LogMealsScreen = ({ navigation }) => {
  const [query, setQuery] = useState("");
  const [foodItems, setFoodItems] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSheetVisible, setIsSheetVisible] = useState(false);

  const toastRef = useRef(null);

  const searchFoodItem = async () => {
    if (!query.trim().match(/^[a-z0-9 ]+$/i)) {
      return;
    }

    setIsLoading(true);

    let url = `https://api.edamam.com/api/food-database/parser?app_id=${
      getFoodDBAPIInfo().FOOD_DB_APP_ID
    }&app_key=${getFoodDBAPIInfo().FOOD_DB_APP_KEY}&ingr=${query}`;

    try {
      const response = await axios.get(url);

      setFoodItems(response.data.hints);
      setIsLoading(false);
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setIsLoading(false);
    }

    setIsLoading(false);
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    searchFoodItem();
    setIsRefreshing(false);
  };

  const toggleSheet = () => {
    setIsSheetVisible(!isSheetVisible);
  };

  const handleOnAdd = () => {
    toastRef.current.show("Meal added successfully", {
      type: "success",
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.searchContainer}>
          <TouchableOpacity style={styles.logIcon} onPress={toggleSheet}>
            <Icon name="plus" size={22} color={colors.darkBlue} />
          </TouchableOpacity>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search for a food item"
            style={styles.searchBar}
            returnKeyType="search"
            onSubmitEditing={searchFoodItem}
            clearButtonMode="always"
          />
          <TouchableOpacity style={styles.searchIcon} onPress={searchFoodItem}>
            <Icon name="search" size={22} color={colors.darkBlue} />
          </TouchableOpacity>
        </View>

        <View style={styles.clearContainer}>
          {foodItems != "" ? (
            <TouchableOpacity
              style={styles.clearText}
              onPress={() => {
                setQuery("");
                setFoodItems([]);
              }}
            >
              <Text style={styles.clearText}>Clear</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.clearText}></View>
          )}

          <TouchableOpacity
            style={styles.loggedMeals}
            onPress={() => navigation.navigate("LoggedMealsScreen")}
          >
            <Text style={styles.loggedMealsText}>View Logged Meals</Text>
          </TouchableOpacity>
        </View>

        {foodItems === "" && !query.trim().match(/^[a-z0-9 ]+$/i) ? (
          <Text style={styles.invalidSearchText}>
            Please search for a food item
          </Text>
        ) : isLoading && isRefreshing ? (
          <ActivityIndicator
            size="large"
            style={styles.activityIndicator}
            color={colors.primary}
          />
        ) : (
          <View>
            {foodItems?.map((item, index) => (
              <FoodItemCardComponent
                key={index}
                item={item}
                onAdd={handleOnAdd}
              />
            ))}
          </View>
        )}

        {isSheetVisible && (
          <Sheet
            visible={isSheetVisible}
            onRequestClose={toggleSheet}
            height="85%"
            backgroundColor={colors.active}
            children={
              <LogMealSheetContent
                toggleSheet={toggleSheet}
                onAdd={handleOnAdd}
              />
            }
          />
        )}
      </ScrollView>

      <Toast
        ref={toastRef}
        placement="top"
        style={{ backgroundColor: colors.darkBlue }}
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
    backgroundColor: colors.background,
  },
  loggedMeals: {},
  loggedMealsText: {
    fontFamily: "MontserratRegular",
    fontSize: 16,
    color: colors.darkBlue,
  },
  clearContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: 10,
    paddingHorizontal: 20,
  },
  clearText: {
    fontFamily: "MontserratRegular",
    fontSize: 16,
    color: colors.danger,
  },
  searchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 30,
  },
  logIcon: {
    backgroundColor: colors.white,
    alignItems: "center",
    marginBottom: 10,
    width: "12%",
    padding: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 5,
  },
  searchBar: {
    fontFamily: "MontserratRegular",
    width: "68%",
    height: 40,
    borderColor: colors.gray,
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    backgroundColor: colors.white,
    borderRadius: 5,
  },
  searchIcon: {
    alignContent: "center",
    justifyContent: "center",
    padding: 10,
    marginBottom: 10,
    paddingLeft: 25,
    width: "20%",
  },
  activityIndicator: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    marginTop: 150,
  },
  invalidSearchText: {
    fontFamily: "MontserratRegular",
    fontSize: 20,
    textAlign: "center",
    marginTop: 150,
  },
});

export default LogMealsScreen;
