import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Image,
  ScrollView,
} from "react-native";
import colors from "../../config/colors";
import Icon from "@expo/vector-icons/AntDesign";
import Collapsible from "react-native-collapsible";

import DiabetesPrediction from "../../assets/images/DiabetesScreen/DiabetesPrediction.jpg";
import DiabetesSymptom from "../../assets/images/DiabetesScreen/DiabetesSymptom.jpg";
import DiabetesUI from "../../assets/images/DiabetesScreen/DiabetesUI.jpg";
import ExerciseActivities from "../../assets/images/ExerciseScreen/ExerciseActivities.jpg";
import ExerciseLog from "../../assets/images/ExerciseScreen/ExerciseLog.jpg";
import ExerciseUI from "../../assets/images/ExerciseScreen/ExerciseUI.jpg";
import GlucoseUI from "../../assets/images/GlucoseScreen/GlucoseUI.jpg";
import GlucoseValuesList from "../../assets/images/GlucoseScreen/GlucoseValuesList.jpg";
import GlucoseFunctionalities from "../../assets/images/GlucoseScreen/GlucoseFunctionalities.jpg";
import A1cUI from "../../assets/images/HbA1cScreen/A1cUI.jpg";
import A1cPrediction from "../../assets/images/HbA1cScreen/A1cPrediction.jpg";
import A1cResults from "../../assets/images/HbA1cScreen/A1cResults.jpg";
import FavoritesUI from "../../assets/images/FavoritesScreen/FavoritesUI.jpg";
import FavoritesInfo from "../../assets/images/FavoritesScreen/FavoritesInfo.jpg";
import MealLog from "../../assets/images/MealScreen/MealLog.jpg";
import MealLogSearch from "../../assets/images/MealScreen/MealLogSearch.jpg";
import MealNutrition from "../../assets/images/MealScreen/MealNutrition.jpg";
import MealRecipeSearch from "../../assets/images/MealScreen/MealRecipeSearch.jpg";
import MealRecipeSearchFilters from "../../assets/images/MealScreen/MealRecipeSearchFilters.jpg";
import MealRecipeSearchGrid from "../../assets/images/MealScreen/MealRecipeSearchGrid.jpg";
import MealsLogged from "../../assets/images/MealScreen/MealsLogged.jpg";
import ReportsUI from "../../assets/images/ReportScreen/ReportUI.jpg";
import ReportPreview from "../../assets/images/ReportScreen/ReportPreview.jpg";
import ResourcesUI1 from "../../assets/images/ResourcesScreen/ResourcesUI1.jpg";
import ResourcesUI2 from "../../assets/images/ResourcesScreen/ResourcesUI2.jpg";
import SettingsNotifs from "../../assets/images/SettingsScreen/SettingsNotifs.jpg";
import SettingsUI from "../../assets/images/SettingsScreen/SettingsUI.jpg";
import SettingsPassword from "../../assets/images/SettingsScreen/SettingsPassword.jpg";

const GetStartedScreen = ({ navigation }) => {
  const features = [
    {
      title: "Predicting diabetes using AI",
      icon: "brain",
      images: [DiabetesUI, DiabetesPrediction, DiabetesSymptom],
      info: "Get started by predicting your diabetes risk using AI. You can also view the symptoms of diabetes by clicking on the individual symptoms. The prediction is based on the symptoms you select. At the end, you can view the prediction result and the probability of having diabetes.\n\nCaution: This is not a medical diagnosis. Please consult a healthcare professional for a medical diagnosis.",
    },
    {
      title: "Logging glucose levels",
      icon: "tint",
      images: [GlucoseUI, GlucoseValuesList, GlucoseFunctionalities],
      info: "Log your glucose levels using the plus icon. You can only log 3 values per day. You can also view the list of glucose values you have logged and edit or delete them by swiping left on any value.\nEnjoy the visual representation of your glucose levels using the graph for an in-depth analysis.",
    },
    {
      title: "Estimating HbA1c using AI",
      icon: "flask",
      images: [A1cUI, A1cPrediction, A1cResults],
      info: "Get started by estimating your HbA1c levels using our AI model. You can view the prediction result and risk score based on the logged glucose values.\n\nCaution: This is not a medical diagnosis. Please consult a healthcare professional for a medical diagnosis.",
    },
    {
      title: "Logging meals",
      icon: "utensils",
      images: [
        MealLogSearch,
        MealLog,
        MealsLogged,
        MealNutrition,
        MealRecipeSearch,
        MealRecipeSearchGrid,
        MealRecipeSearchFilters,
      ],
      info: "Log your meals using the plus icon or search for it. You can search for meals using the search icon and view the nutritional information of the meal and log it.\n\nYou can also search for recipes using the recipe search icon or filter your search according to your needs and view the recipe details under the recipe search tab. You can view the meals you have logged and edit or delete them. Another great feature is the nutritional analysis tab where you can view nutritional information of ingredients using AI.",
    },
    {
      title: "Logging exercise",
      icon: "running",
      images: [ExerciseUI, ExerciseLog, ExerciseActivities],
      info: "Log your exercises using the plus icon or search for an activity. You can view the list of activities and the relevant information you have logged.\nYou can also visualize your exercise data using the graph and pie chart for an in-depth analysis.",
    },
    {
      title: "Generating PDF reports for analysis",
      icon: "file-pdf",
      images: [ReportsUI, ReportPreview],
      info: "Generate a PDF report of your possible diabetes symptoms, risk assessment, glucose values, and estimated HbA1c for analysis. You can view the report and download the report or share it with anyone. The report is generated based on the data you have logged.",
    },
    {
      title:
        "Resources on diabetes, nutrition, and exercise related to type 2 diabetes",
      icon: "book",
      images: [ResourcesUI1, ResourcesUI2],
      info: "View resources on diabetes, nutrition, and exercise related to diabetes. You can view the resources and click on the individual resources to view the details and the source of the information. This is a good way to educate yourself on diabetes and related topics.",
    },
    {
      title: "Favorite recipes page",
      icon: "heart",
      images: [FavoritesUI, FavoritesInfo],
      info: "View your favorite recipes by clicking on the heart icon. You can view the list of recipes you have favorited and view the recipe details. You can also unfavorite the recipe by clicking on the heart icon again.",
    },
    {
      title: "Account Settings and Profile Management",
      icon: "cog",
      images: [SettingsUI, SettingsPassword, SettingsNotifs],
      info: "View and edit your account settings and profile information. You can view and edit your profile information, health profile information, your profile picture, and change your password as well. You can also view and manage your notification settings for personalized reminders. Our terms of service are also available for you to read.",
    },
  ];

  const [collapsed, setCollapsed] = useState(features.map(() => true));
  const [arrow, setArrow] = useState("chevron-down");

  const toggleItem = (index) => {
    setCollapsed(collapsed.map((item, i) => (i === index ? !item : item)));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="left" size={35} color={colors.darkBlue} />
          </TouchableOpacity>
          <Image
            source={require("../../assets/icons/DarkAppIcon.png")}
            style={styles.logo}
          />
          <View style={{ width: 35 }} />
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.title}>SugarCheck</Text>
          <Text style={styles.subtitle}>A diabetes management app</Text>
          <Text style={styles.subText}>
            Get started by exploring the app features below
          </Text>

          <View style={{ marginTop: 20 }}>
            <Text style={[styles.subtitle, { marginBottom: 10 }]}>
              Features
            </Text>

            {features.map((feature, index) => (
              <View key={index}>
                <TouchableOpacity
                  onPress={() => {
                    toggleItem(index);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.rowContainer}>
                    <Text style={styles.label}>{feature.title}</Text>
                    <Icon
                      name={collapsed[index] ? "down" : "up"}
                      size={20}
                      color={colors.darkBlue}
                    />
                  </View>
                </TouchableOpacity>

                <Collapsible collapsed={collapsed[index]}>
                  <Text
                    style={[styles.subText, { flex: 1, marginHorizontal: 10 }]}
                  >
                    {feature.info}
                  </Text>
                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                  >
                    {feature.images.map((image, imageIndex) => (
                      <Image
                        key={imageIndex}
                        source={image}
                        style={{ width: 250, height: 550, marginRight: 10 }}
                        resizeMode="contain"
                      />
                    ))}
                  </ScrollView>
                </Collapsible>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
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
  contentContainer: {
    backgroundColor: colors.white,
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 26,
    fontFamily: "MontserratBold",
    color: colors.darkBlue,
  },
  subtitle: {
    fontSize: 20,
    fontFamily: "MontserratRegular",
    color: colors.darkBlue,
  },
  subText: {
    fontSize: 16,
    fontFamily: "MontserratRegular",
    color: colors.darkBlue,
    marginVertical: 10,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
  },
  label: {
    flex: 1,
    fontSize: 16,
    fontFamily: "MontserratRegular",
    color: colors.darkBlue,
  },
});

export default GetStartedScreen;
