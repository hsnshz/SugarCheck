import React, { useState } from "react";
import {
  ScrollView,
  View,
  TextInput,
  Text,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { getNutritionAPIInfo } from "../../config/constants";
import colors from "../../config/colors";
import axios from "axios";
import Icon from "react-native-vector-icons/FontAwesome5";
import RecipeAnalysisInformation from "../components/RecipeAnalysisInformation";
import * as Haptics from "expo-haptics";

const NutritionalAnalysisScreen = () => {
  const [query, setQuery] = useState("");
  const [nutritionInfo, setNutritionInfo] = useState(null);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState(null);

  const validateInput = () => {
    if (!query) {
      setErrorMessage("Please enter the ingredients you want to analyze.");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return false;
    }

    // Check if query contains only letters, numbers, spaces, and common ingredient separators
    const isValid = /^[a-zA-Z0-9 ,.\n-]*$/.test(query);

    // Check if query is a valid number
    const isNumber = !isNaN(query);

    // Check if query is a valid name or recipe (contains at least one letter)
    const isNameOrRecipe = /[a-zA-Z]/.test(query);

    if (!isValid || (!isNumber && !isNameOrRecipe)) {
      setErrorMessage(
        "Please enter valid ingredients. Only letters, numbers, spaces, commas, periods, and hyphens are allowed."
      );
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return false;
    }

    return true;
  };

  const fetchNutritionInfo = async () => {
    setErrorMessage(null);
    setIsLoading(true);

    if (!validateInput()) {
      setIsLoading(false);
      return;
    }

    let url = `https://api.edamam.com/api/nutrition-details?app_id=${
      getNutritionAPIInfo().NUTRITION_APP_ID
    }&app_key=${getNutritionAPIInfo().NUTRITION_APP_KEY}`;

    try {
      const response = await axios.post(url, {
        ingr: query.split("\n"),
      });

      setNutritionInfo(response.data);
      setIsLoading(false);
    } catch (error) {
      setErrorMessage(
        "An error occurred while fetching nutrition information. Please try again."
      );

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await fetchNutritionInfo();
    setIsRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.searchText}>
          Enter an ingredient list for what you are cooking, like "1 cup rice,
          10 oz chickpeas". {"\n"}
        </Text>
        <Text style={styles.boldSearchText}>
          Enter each ingredient on a new line.
        </Text>

        <View style={styles.searchContainer}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Enter your ingredients list here"
            style={styles.searchBar}
            returnKeyType="default"
            multiline={true}
            clearButtonMode="always"
          />
          <TouchableOpacity
            style={styles.searchIcon}
            onPress={fetchNutritionInfo}
          >
            <Icon name="search" size={22} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {isLoading && !isRefreshing ? (
          <ActivityIndicator size="large" color={colors.primary} animating />
        ) : (
          nutritionInfo && (
            <RecipeAnalysisInformation nutritionInfo={nutritionInfo} />
          )
        )}

        {errorMessage && (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    marginBottom: 50,
  },
  searchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 30,
  },
  searchText: {
    fontFamily: "MontserratRegular",
    fontSize: 16,
    marginHorizontal: 20,
    marginTop: 20,
    color: colors.darkBlue,
    textAlign: "center",
  },
  boldSearchText: {
    fontFamily: "MontserratBold",
    fontSize: 16,
    marginHorizontal: 20,
    color: colors.darkBlue,
    textAlign: "center",
  },
  searchBar: {
    fontFamily: "MontserratRegular",
    width: "80%",
    height: 100,
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
    padding: 20,
    marginBottom: 10,
    marginRight: 5,
  },
  errorMessage: {
    fontFamily: "MontserratRegular",
    fontSize: 16,
    color: colors.danger,
    textAlign: "center",
    marginHorizontal: 20,
    marginTop: 20,
  },
});

export default NutritionalAnalysisScreen;
