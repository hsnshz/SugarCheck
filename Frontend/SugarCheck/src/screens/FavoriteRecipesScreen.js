import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Text,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { getNgrokUrl } from "../../config/constants";
import { useSelector, useDispatch } from "react-redux";
import RecipeCardComponent from "../components/RecipeCardComponent";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../config/colors";

const FavoriteRecipesScreen = ({ navigation }) => {
  const user = useSelector((state) => state.user.user) || {};
  const token = useSelector((state) => state.auth.token) || {};

  const [recipes, setRecipes] = useState([]);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFavorites = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get(
        `${getNgrokUrl()}/api/diet/all-favorite-recipes/${user._id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const recipePromises = response.data.favorites.map((favorite) => {
        return getFromAPI(favorite.recipeURL);
      });

      const recipeData = await Promise.all(recipePromises);

      setRecipes(recipeData);
      setIsLoading(false);
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const getFromAPI = async (url) => {
    try {
      const response = await axios.get(url);

      return response.data;
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const onRefresh = async () => {
    setIsRefreshing(true);
    await fetchFavorites();
    setIsRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="ios-menu" size={35} color={colors.darkBlue} />
        </TouchableOpacity>
        <Image
          source={require("../../assets/icons/DarkAppIcon.png")}
          style={styles.logo}
        />
        <View style={{ width: 35 }} />
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.title}>Favorite Recipes</Text>

        {isLoading && !isRefreshing ? (
          <ActivityIndicator
            style={{
              flex: 1,
              justifyContent: "center",
              alignContent: "center",
              marginTop: 150,
            }}
            size="large"
            color={colors.darkBlue}
          />
        ) : (
          recipes.map((hit, index) => (
            <RecipeCardComponent
              key={index}
              title={hit.recipe.label}
              text={`${hit.recipe.dietLabels.join(
                ", "
              )}\nCalories: ${hit.recipe.calories.toFixed(
                2
              )} kCal \nCuisine Type: ${hit.recipe.cuisineType.join(", ")}`}
              image={{ uri: hit.recipe.image }}
              btnText="More Info"
              navigateTo={{
                routeName: "RecipeInfo",
                params: { hit: hit, recipeUrl: hit._links.self.href },
              }}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
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
  title: {
    fontFamily: "MontserratBold",
    fontSize: 24,
    color: colors.darkBlue,
    textAlign: "center",
    marginVertical: 10,
  },
});

export default FavoriteRecipesScreen;
