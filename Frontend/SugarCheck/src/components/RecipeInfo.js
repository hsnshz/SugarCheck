import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import colors from "../../config/colors";
import Icon from "react-native-vector-icons/AntDesign";
import axios from "axios";
import { getNgrokUrl } from "../../config/constants";
import { useSelector, useDispatch } from "react-redux";

const RecipeInfo = ({ route, navigation }) => {
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const dispatch = useDispatch();

  const { hit } = route.params;
  const { recipeUrl } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavorite = async () => {
    const createUrl = `${getNgrokUrl()}/api/diet/favorite-recipe/${user._id}`;
    const deleteUrl = `${getNgrokUrl()}/api/diet/delete-favorite-recipe/${
      user._id
    }`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      if (isFavorite) {
        await axios.delete(deleteUrl, {
          data: { url: recipeUrl },
          headers: headers,
        });
      } else {
        await axios.post(createUrl, { url: recipeUrl }, { headers: headers });
      }

      setIsFavorite(!isFavorite);
      console.log("Favorite Toggled");
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const checkFavorite = async () => {
    try {
      const response = await axios.get(
        `${getNgrokUrl()}/api/diet/check-favorite-recipe/${
          user._id
        }?url=${encodeURIComponent(recipeUrl)}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsFavorite(response.data.isFavorite);
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  useEffect(() => {
    checkFavorite();
  }, [isFavorite]);

  return (
    <ScrollView>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="left" size={25} color={colors.darkBlue} />
        </TouchableOpacity>

        {isFavorite ? (
          <TouchableOpacity
            style={styles.btnFavorited}
            onPress={handleFavorite}
          >
            <Text style={styles.btnFavoritedText}>Favorited</Text>
            <Icon name="heart" size={18} color={colors.white} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.btnFavorite} onPress={handleFavorite}>
            <Text style={styles.btnFavoriteText}>Favorite</Text>
            <Icon name="hearto" size={18} color={colors.darkBlue} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.container}>
        <Image source={{ uri: hit.recipe.image }} style={styles.image} />
        <Text style={styles.headingText}>{hit.recipe.label}</Text>

        {hit.recipe.cuisineType != "" && (
          <View>
            <Text style={styles.labelText}>Cuisine Type</Text>
            <Text style={styles.infoText}>{hit.recipe.cuisineType}</Text>
          </View>
        )}

        {hit.recipe.mealType != "" && (
          <View>
            <Text style={styles.labelText}>Meal Type</Text>
            <Text style={styles.infoText}>{hit.recipe.mealType}</Text>
          </View>
        )}

        {hit.recipe.calories > 0 && (
          <View>
            <Text style={styles.labelText}>Calories</Text>
            <Text style={styles.infoText}>
              {Math.floor(hit.recipe.calories)} kcal
            </Text>
          </View>
        )}

        {hit.recipe.dietLabels != "" && (
          <View>
            <Text style={styles.labelText}>Diet Labels</Text>
            {hit.recipe.dietLabels.map((label, index) => (
              <Text key={index} style={styles.infoText}>
                {label}
              </Text>
            ))}
          </View>
        )}

        {hit.recipe.healthLabels != "" && (
          <View>
            <Text style={styles.labelText}>Health Labels</Text>
            {hit.recipe.healthLabels.map((label, index) => (
              <Text key={index} style={styles.infoText}>
                {label}
              </Text>
            ))}
          </View>
        )}

        {hit.recipe.ingredientLines != "" && (
          <View>
            <Text style={styles.labelText}>Ingredients</Text>
            {hit.recipe.ingredientLines.map((ingredient, index) => (
              <Text key={index} style={styles.infoText}>
                {ingredient}
              </Text>
            ))}
          </View>
        )}

        {hit.recipe.ingredients != "" && (
          <View>
            <Text style={styles.labelText}>Ingredients Information</Text>
            {hit.recipe.ingredients.map((ingredient, index) => (
              <View key={index} style={styles.ingredientInfo}>
                {ingredient.image && (
                  <Image
                    source={{ uri: ingredient.image }}
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 10,
                      marginRight: 10,
                    }}
                  />
                )}
                <View style={styles.innerIngredientContainer}>
                  <Text
                    style={[styles.infoText, { fontFamily: "MontserratBold" }]}
                  >
                    Category:
                    {ingredient.foodCategory && ` ${ingredient.foodCategory}`}
                  </Text>
                  <Text style={styles.infoText}>
                    {ingredient.text}: {Math.floor(ingredient.weight)} g
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
  btnFavorite: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.darkBlue,
    borderWidth: 2,
    padding: 10,
    borderRadius: 5,
  },
  btnFavoriteText: {
    fontFamily: "MontserratRegular",
    fontSize: 18,
    color: colors.darkBlue,
    marginRight: 10,
  },
  btnFavorited: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.darkBlue,
    padding: 10,
    borderRadius: 5,
  },
  btnFavoritedText: {
    fontFamily: "MontserratRegular",
    fontSize: 18,
    color: colors.white,
    marginRight: 10,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    marginTop: 10,
    margin: 20,
  },
  image: {
    width: Dimensions.get("window").width - 40,
    height: 220,
    marginBottom: 20,
    borderRadius: 10,
  },
  headingText: {
    fontSize: 22,
    fontFamily: "MontserratBold",
    color: colors.black,
    textAlign: "center",
  },
  labelText: {
    fontSize: 18,
    fontFamily: "MontserratBold",
    color: colors.black,
    marginTop: 20,
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    fontFamily: "MontserratRegular",
    color: colors.black,
    marginBottom: 10,
  },
  ingredientInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  innerIngredientContainer: {
    flex: 1,
    marginLeft: 10,
  },
});

export default RecipeInfo;
