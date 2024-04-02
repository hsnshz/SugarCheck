import React, { useEffect, useState, useRef } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  SectionList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import axios from "axios";
import { getSearchAPIInfo } from "../../config/constants";
import { Ionicons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/AntDesign";
import FilterIcon from "react-native-vector-icons/FontAwesome";
import FilterIcon2 from "react-native-vector-icons/Feather";
import colors from "../../config/colors";
import Sheet from "../components/Sheet";
import RecipeCardComponent from "../components/RecipeCardComponent";
import RecipeGridComponent from "../components/RecipeGridComponent";
import * as Haptics from "expo-haptics";
import Toast from "react-native-fast-toast";

const RecipeSearchScreen = () => {
  const items = [
    {
      name: "Diet",
      id: 0,
      children: [
        { name: "Balanced", id: "balanced" },
        { name: "High-Fiber", id: "high-fiber" },
        { name: "High-Protein", id: "high-protein" },
        { name: "Low-Carb", id: "low-carb" },
        { name: "Low-Fat", id: "low-fat" },
        { name: "Low-Sodium", id: "low-sodium" },
      ],
    },
    {
      name: "Health",
      id: "health",
      children: [
        { name: "Alcohol-Cocktail", id: "alcohol-cocktail" },
        { name: "Alcohol-Free", id: "alcohol-free" },
        { name: "Celery-Free", id: "celery-free" },
        { name: "Crustacean-Free", id: "crustacean-free" },
        { name: "Dairy-Free", id: "dairy-free" },
        { name: "DASH", id: "DASH" },
        { name: "Egg-Free", id: "egg-free" },
        { name: "Fish-Free", id: "fish-free" },
        { name: "FODMAP-Free", id: "fodmap-free" },
        { name: "Gluten-Free", id: "gluten-free" },
        { name: "Immuno-Supportive", id: "immuno-supportive" },
        { name: "Keto-Friendly", id: "keto-friendly" },
        { name: "Kidney-Friendly", id: "kidney-friendly" },
        { name: "Kosher", id: "kosher" },
        { name: "Low Potassium", id: "low-potassium" },
        { name: "Low Sugar", id: "low-sugar" },
        { name: "Lupine-Free", id: "lupine-free" },
        { name: "Mediterranean", id: "Mediterranean" },
        { name: "Mollusk-Free", id: "mollusk-free" },
        { name: "Mustard-Free", id: "mustard-free" },
        { name: "No oil added", id: "No-oil-added" },
        { name: "Paleo", id: "paleo" },
        { name: "Peanut-Free", id: "peanut-free" },
        { name: "Pescatarian", id: "pecatarian" },
        { name: "Pork-Free", id: "pork-free" },
        { name: "Red-Meat-Free", id: "red-meat-free" },
        { name: "Sesame-Free", id: "sesame-free" },
        { name: "Shellfish-Free", id: "shellfish-free" },
        { name: "Soy-Free", id: "soy-free" },
        { name: "Sugar-Conscious", id: "sugar-conscious" },
        { name: "Sulfite-Free", id: "sulfite-free" },
        { name: "Tree-Nut-Free", id: "tree-nut-free" },
        { name: "Vegan", id: "vegan" },
        { name: "Vegetarian", id: "vegetarian" },
        { name: "Wheat-Free", id: "wheat-free" },
      ],
    },
    {
      name: "Meal Type",
      id: "mealType",
      children: [
        { name: "Breakfast", id: "breakfast" },
        { name: "Brunch", id: "brunch" },
        { name: "Lunch", id: "lunch" },
        { name: "Dinner", id: "dinner" },
        { name: "Snack", id: "snack" },
        { name: "Teatime", id: "teatime" },
      ],
    },
    {
      name: "Dish Type",
      id: "dishType",
      children: [
        { name: "Alcohol Cocktail", id: "alcohol-cocktail" },
        { name: "Biscuits and Cookies", id: "biscuits-and-cookies" },
        { name: "Bread", id: "bread" },
        { name: "Cereals", id: "cereals" },
        { name: "Condiments and Sauces", id: "condiments-and-sauces" },
        { name: "Desserts", id: "desserts" },
        { name: "Drinks", id: "drinks" },
        { name: "Egg", id: "egg" },
        { name: "Ice Cream and Custard", id: "ice-cream-and-custard" },
        { name: "Main Course", id: "main-course" },
        { name: "Pancake", id: "pancake" },
        { name: "Pasta", id: "pasta" },
        { name: "Pastry", id: "pastry" },
        { name: "Pies and Tarts", id: "pies-and-tarts" },
        { name: "Pizza", id: "pizza" },
        { name: "Preps", id: "preps" },
        { name: "Preserve", id: "preserve" },
        { name: "Salad", id: "salad" },
        { name: "Sandwiches", id: "sandwiches" },
        { name: "Seafood", id: "seafood" },
        { name: "Side Dish", id: "side-dish" },
        { name: "Soup", id: "soup" },
        { name: "Special Occasions", id: "special-occasions" },
        { name: "Starter", id: "starter" },
        { name: "Sweets", id: "sweets" },
      ],
    },
    {
      name: "Cuisine Type",
      id: "cuisineType",
      children: [
        { name: "American", id: "american" },
        { name: "Asian", id: "asian" },
        { name: "British", id: "british" },
        { name: "Caribbean", id: "caribbean" },
        { name: "Central Europe", id: "central-europe" },
        { name: "Chinese", id: "chinese" },
        { name: "Eastern Europe", id: "eastern-europe" },
        { name: "French", id: "french" },
        { name: "Greek", id: "greek" },
        { name: "Indian", id: "indian" },
        { name: "Italian", id: "italian" },
        { name: "Japanese", id: "japanese" },
        { name: "Korean", id: "korean" },
        { name: "Kosher", id: "kosher" },
        { name: "Mediterranean", id: "mediterranean" },
        { name: "Mexican", id: "mexican" },
        { name: "Middle Eastern", id: "middle-eastern" },
        { name: "Nordic", id: "nordic" },
        { name: "South American", id: "south-american" },
        { name: "South East Asian", id: "south-east-asian" },
        { name: "World", id: "world" },
      ],
    },
  ];

  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [prevPageUrls, setPrevPageUrls] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState("list");

  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const [expanded, setExpanded] = useState(false);
  const [arrow, setArrow] = useState("down");

  const toastRef = useRef(null);

  function toCamelCase(str) {
    return str
      .split(" ")
      .map((word, index) => {
        if (index === 0) {
          return word.toLowerCase();
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join("");
  }

  const sections = items
    .filter((item) => item !== undefined)
    .map((item) => ({
      title: item.name,
      data: item.children.filter((child) => child !== undefined),
    }));

  const searchRecipes = async (isNextPage = true, newQuery = false) => {
    setIsLoading(true);
    console.log(currentPage);

    let url = newQuery
      ? `https://api.edamam.com/api/recipes/v2?type=public&q=${query}&app_id=${
          getSearchAPIInfo().RECIPE_SEARCH_APP_ID
        }&app_key=${getSearchAPIInfo().RECIPE_SEARCH_APP_KEY}`
      : isNextPage
      ? nextPageUrl
      : prevPageUrls[prevPageUrls.length - 2];

    if (!nextPageUrl) {
      selectedItems.forEach(({ type, value }) => {
        let camelCaseType = toCamelCase(type);
        url += `&${camelCaseType}=${encodeURIComponent(value.id)}`;
      });
    }

    try {
      const response = await axios.get(url);
      setRecipes(response.data.hits);
      setIsLoading(false);

      if (isNextPage) {
        setPrevPageUrls((prevPageUrls) => [...prevPageUrls, url]);
        setNextPageUrl(
          response.data._links.next ? response.data._links.next.href : null
        );
        setCurrentPage((prevPage) => prevPage + 1);
      } else {
        setNextPageUrl(prevPageUrls[prevPageUrls.length - 1]);
        setCurrentPage((prevPage) => prevPage - 1);
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
      toastRef.current.show("Error fetching recipes", {
        type: "danger",
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const handlePrevPage = () => {
    if (prevPageUrls.length > 1) {
      const newPrevPageUrls = [...prevPageUrls];
      newPrevPageUrls.pop();
      setPrevPageUrls(newPrevPageUrls);
      searchRecipes(false);
    }
  };

  const handleNewSearch = () => {
    setNextPageUrl(null);
    setPrevPageUrls([]);
    setCurrentPage(0);
    searchRecipes(true, true);
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    setNextPageUrl(null);
    setPrevPageUrls([]);
    setCurrentPage(0);
    await searchRecipes(true, true);
    setIsRefreshing(false);
  };

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
    if (isSheetVisible) {
      setIsSheetVisible(false);
      fadeOut();
    } else {
      setIsSheetVisible(true);
      fadeIn();
    }
  };

  const toggleSection = (title) => {
    setExpandedSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));

    setExpanded(!expanded);

    if (expanded) {
      setArrow("down");
    } else {
      setArrow("up");
    }
  };

  const renderSectionHeader = ({ section: { title } }) => (
    <TouchableOpacity activeOpacity={0.8} onPress={() => toggleSection(title)}>
      <View style={styles.labelBar}>
        <Text style={styles.sectionHeader}>{title}</Text>
        <Icon
          name={arrow}
          size={18}
          color={colors.white}
          style={{ marginRight: 20 }}
        />
      </View>
    </TouchableOpacity>
  );

  const renderItem = ({ item, section }) => {
    if (!expandedSections[section.title]) {
      return null;
    }

    const isSelected = selectedItems.some(
      (selected) =>
        selected.type === section.title && selected.value.id === item.id
    );

    return (
      <TouchableOpacity
        style={[styles.item, isSelected ? styles.selectedItem : null]}
        onPress={() => handleSelectItem({ type: section.title, value: item })}
      >
        <Text style={styles.itemText}>{item.name}</Text>
        {isSelected && (
          <Icon
            name="check"
            size={24}
            style={{ marginRight: 10 }}
            color={colors.green}
          />
        )}
      </TouchableOpacity>
    );
  };

  const handleSelectItem = (item) => {
    setSelectedItems((prevSelectedItems) => {
      const exists = prevSelectedItems.some(
        (selected) =>
          selected.type === item.type && selected.value.id === item.value.id
      );

      if (exists) {
        return prevSelectedItems.filter(
          (selected) =>
            selected.type !== item.type || selected.value.id !== item.value.id
        );
      } else {
        return [...prevSelectedItems, item];
      }
    });
  };

  const renderSheetContent = () => {
    return (
      <View style={styles.sheetContent}>
        <SectionList
          sections={sections}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
        />

        <View style={styles.selectedFiltersContainer}>
          {selectedItems.map((selectedItem) => {
            return (
              <View
                key={`${selectedItem.type}-${selectedItem.value.id}`}
                style={styles.selectedFilter}
              >
                <Text style={styles.selectedFilterText}>
                  {selectedItem.value.name}
                </Text>
                <TouchableOpacity
                  style={styles.selectedFilterIcon}
                  onPress={() => handleSelectItem(selectedItem)}
                >
                  <Icon name="close" size={24} color={colors.danger} />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        <TouchableOpacity
          style={styles.confirmBtn}
          onPress={() => {
            toggleSheet();
            searchRecipes();
          }}
        >
          <Text style={styles.confirmText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Animated.View
        pointerEvents={isSheetVisible ? "auto" : "none"}
        style={[styles.overlay, { opacity: fadeAnim }]}
      />

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.searchContainer}>
          <View style={styles.viewMode}>
            <TouchableOpacity
              style={styles.viewModeBtn1}
              onPress={() => {
                setViewMode("grid");
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Ionicons
                name="grid"
                size={22}
                color={colors.darkBlue}
                style={styles.viewModeIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.viewModeBtn2}
              onPress={() => {
                setViewMode("list");
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Ionicons
                name="list"
                size={22}
                color={colors.darkBlue}
                style={styles.viewModeIcon}
              />
            </TouchableOpacity>
          </View>

          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search for a recipe"
            style={styles.searchBar}
            returnKeyType="search"
            onSubmitEditing={handleNewSearch}
            clearButtonMode="always"
          />

          <TouchableOpacity style={styles.filterButton} onPress={toggleSheet}>
            {selectedItems.length > 0 ? (
              <FilterIcon name="filter" size={24} color={colors.darkBlue} />
            ) : (
              <FilterIcon2 name="filter" size={22} color={colors.darkBlue} />
            )}
          </TouchableOpacity>
        </View>

        {recipes != "" && query != "" ? (
          <View style={styles.clearContainer}>
            <TouchableOpacity
              style={styles.clearText}
              onPress={() => {
                setQuery("");
                setRecipes([]);
              }}
            >
              <Text style={styles.clearText}>Clear</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <Sheet
          visible={isSheetVisible}
          onRequestClose={toggleSheet}
          height="70%"
          backgroundColor={colors.active}
        >
          {renderSheetContent()}
        </Sheet>

        {!query.trim().match(/^[a-z0-9 ]+$/i) ? (
          <Text style={styles.textValidQuery}>Please search for a recipe</Text>
        ) : isLoading && !isRefreshing ? (
          <ActivityIndicator
            style={styles.activityIndicator}
            size="large"
            color={colors.darkBlue}
          />
        ) : viewMode === "list" ? (
          recipes.map((hit, index) => (
            <View key={index}>
              <RecipeCardComponent
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
            </View>
          ))
        ) : (
          recipes
            .filter((_, index) => index % 2 === 0)
            .map((hit, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <RecipeGridComponent
                  title={hit.recipe.label}
                  image={{ uri: hit.recipe.image }}
                  navigateTo={{
                    routeName: "RecipeInfo",
                    params: { hit: hit, recipeUrl: hit._links.self.href },
                  }}
                />
                {recipes[index * 2 + 1] && (
                  <RecipeGridComponent
                    title={recipes[index * 2 + 1].recipe.label}
                    image={{ uri: recipes[index * 2 + 1].recipe.image }}
                    navigateTo={{
                      routeName: "RecipeInfo",
                      params: { hit: hit, recipeUrl: hit._links.self.href },
                    }}
                  />
                )}
              </View>
            ))
        )}

        {!isLoading &&
        !isRefreshing &&
        currentPage != 0 &&
        query.trim().match(/^[a-z0-9 ]+$/i) ? (
          <View style={styles.pageContainer}>
            {prevPageUrls.length > 1 && (
              <TouchableOpacity onPress={handlePrevPage}>
                <Icon name="left" size={26} color={colors.darkBlue} />
              </TouchableOpacity>
            )}
            <Text style={styles.pageText}>Page {currentPage}</Text>
            {nextPageUrl && (
              <TouchableOpacity onPress={() => searchRecipes(true)}>
                <Icon name="right" size={26} color={colors.darkBlue} />
              </TouchableOpacity>
            )}
          </View>
        ) : null}

        <Toast
          ref={toastRef}
          placement="top"
          style={{ backgroundColor: colors.darkBlue }}
          fadeInDuration={750}
          fadeOutDuration={1000}
          opacity={1}
          textStyle={{ color: colors.white, fontFamily: "MontserratRegular" }}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  clearContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginHorizontal: 20,
    marginTop: 10,
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
  searchBar: {
    fontFamily: "MontserratRegular",
    width: "60%",
    height: 40,
    borderColor: colors.gray,
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    backgroundColor: colors.white,
    borderRadius: 5,
  },
  filterButton: {
    marginBottom: 10,
    width: "15%",
    marginLeft: 20,
  },
  viewMode: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 10,
    marginRight: 10,
    borderWidth: 1,
    borderRadius: 5,
    overflow: "hidden",
    width: "25%",
    borderColor: colors.gray,
  },
  viewModeBtn1: {
    flex: 1,
    borderRightWidth: 1,
    backgroundColor: colors.white,
    padding: 5,
  },
  viewModeBtn2: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 5,
  },
  viewModeIcon: {
    marginHorizontal: 5,
    textAlign: "center",
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
  labelBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.detail,
    borderRadius: 15,
    marginHorizontal: 5,
    marginBottom: 5,
  },
  sectionHeader: {
    fontFamily: "MontserratRegular",
    fontSize: 22,
    color: colors.white,
    backgroundColor: colors.detail,
    padding: 10,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 20,
    height: 40,
    borderWidth: 1,
    borderColor: colors.active,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    padding: 10,
    marginHorizontal: 5,
    marginVertical: 1,
    backgroundColor: colors.white,
  },
  itemText: {
    color: colors.darkBlue,
    fontFamily: "MontserratRegular",
  },
  sheetContent: {
    flex: 1,
    margin: 10,
    marginTop: 40,
    width: "100%",
    backgroundColor: colors.active,
  },
  selectedFiltersContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedItem: {
    backgroundColor: colors.disabled,
  },
  selectedFilter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    margin: 5,
    marginVertical: 20,
    backgroundColor: colors.white,
    borderRadius: 5,
  },
  selectedFilterText: {
    fontSize: 18,
  },
  selectedFilterIcon: {
    marginLeft: 10,
  },
  confirmBtn: {
    backgroundColor: colors.complementary,
    padding: 15,
    borderRadius: 5,
    width: "40%",
    alignItems: "center",
    alignSelf: "center",
    margin: 20,
  },
  confirmText: {
    color: colors.white,
    fontSize: 18,
    fontFamily: "MontserratRegular",
  },
  pageContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 80,
  },
  pageText: {
    fontFamily: "MontserratRegular",
    fontSize: 20,
    marginHorizontal: "30%",
  },
  textValidQuery: {
    fontFamily: "MontserratRegular",
    fontSize: 20,
    textAlign: "center",
    marginTop: 150,
  },
  activityIndicator: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    marginTop: 150,
  },
});

export default RecipeSearchScreen;
