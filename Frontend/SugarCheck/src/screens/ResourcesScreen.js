import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/AntDesign";
import colors from "../../config/colors";

const ResourcesScreen = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState("Diabetes");

  const diabetesResources = [
    {
      name: "American Diabetes Association",
      url: "https://www.diabetes.org/resources",
    },
    {
      name: "Type 2 Diabetes by NHS",
      url: "https://www.nhs.uk/conditions/type-2-diabetes/",
    },
    {
      name: "American Association of Diabetes Educators",
      url: "https://www.diabeteseducator.org/living-with-diabetes",
    },
    {
      name: "Glucose Monitoring by NHS",
      url: "https://www.nhs.uk/conditions/blood-tests/blood-glucose-test/",
    },
    {
      name: "Diabetes Resources by American Diabetes Association",
      url: "https://www.diabetes.org/resources",
    },
    {
      name: "Centers for Disease Control and Prevention",
      url: "https://www.cdc.gov/diabetes/index.html",
    },
    {
      name: "Diabetes Symptoms and Causes by National Institute of Diabetes and Digestive and Kidney Diseases",
      url: "https://www.niddk.nih.gov/health-information/diabetes/overview/symptoms-causes",
    },
    {
      name: "NHS Diabetes",
      url: "https://www.nhs.uk/conditions/diabetes/",
    },
    {
      name: "A1C Test by National Institute of Diabetes and Digestive and Kidney Diseases",
      url: "https://www.niddk.nih.gov/health-information/diagnostic-tests/a1c-test",
    },
    {
      name: "World Health Organization",
      url: "https://www.who.int/health-topics/diabetes",
    },
    {
      name: "Glucose Levels by National Institute of Diabetes and Digestive and Kidney Diseases",
      url: "https://www.niddk.nih.gov/health-information/diabetes/overview/tests-diagnosis",
    },
    {
      name: "Diabetes UK",
      url: "https://www.diabetes.org.uk/",
    },
    {
      name: "National Institute of Diabetes and Digestive and Kidney Diseases",
      url: "https://www.niddk.nih.gov/health-information/diabetes",
    },
    {
      name: "HbA1c Test by NHS",
      url: "https://www.nhs.uk/conditions/blood-tests/hba1c-test/",
    },
  ];

  const nutritionResources = [
    {
      name: "Diabetes and Nutrition by the American Diabetes Association",
      url: "https://www.niddk.nih.gov/health-information/diabetes/overview/diet-eating-physical-activity",
    },
    {
      name: "Diabetes Diet: Create Your Healthy-Eating Plan by Mayo Clinic",
      url: "https://www.mayoclinic.org/diseases-conditions/diabetes/in-depth/diabetes-diet/art-20044295",
    },
    {
      name: "Diabetes Diet, Eating, & Physical Activity by National Institute of Diabetes and Digestive and Kidney Diseases",
      url: "https://www.niddk.nih.gov/health-information/diabetes/overview/diet-eating-physical-activity",
    },
    {
      name: "Academy of Nutrition and Dietetics (EatRight)",
      url: "https://www.eatright.org/",
    },
    {
      name: "Nutrition.gov",
      url: "https://www.nutrition.gov/",
    },
    {
      name: "Choose My Plate",
      url: "https://www.choosemyplate.gov/",
    },
    {
      name: "World Health Organization",
      url: "https://www.who.int/news-room/fact-sheets/detail/physical-activity",
    },
    {
      name: "American Heart Association by Healthy Living",
      url: "https://www.heart.org/en/healthy-living/fitness",
    },
    {
      name: "National Institute of Diabetes and Digestive and Kidney Diseases",
      url: "https://www.niddk.nih.gov/health-information/weight-management",
    },
    {
      name: "National Institute of Health",
      url: "https://www.nih.gov/health-information",
    },
  ];

  const exerciseResources = [
    {
      name: "Physical Activity/Exercise and Diabete by Diabetes Care",
      url: "https://care.diabetesjournals.org/content/27/suppl_1/s58",
    },
    {
      name: "Exercise and Type 2 Diabetes by American Diabetes Association",
      url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2992225/",
    },
    {
      name: "Physical Activity and Diabetes by Diabetes.co.uk",
      url: "https://www.diabetes.co.uk/diet/physical-activity-and-diabetes.html",
    },
    {
      name: "Centers for Disease Control and Prevention (CDC)",
      url: "https://www.cdc.gov/physicalactivity/index.html",
    },
    {
      name: "American Heart Association by Healthy Living",
      url: "https://www.heart.org/en/healthy-living/fitness",
    },
    {
      name: "World Health Organization",
      url: "https://www.who.int/news-room/fact-sheets/detail/physical-activity",
    },
    {
      name: "National Institute of Diabetes and Digestive and Kidney Diseases",
      url: "https://www.niddk.nih.gov/health-information/weight-management",
    },
    {
      name: "National Institute of Health",
      url: "https://www.nih.gov/health-information",
    },
    {
      name: "American Diabetes Association",
      url: "https://www.diabetes.org/resources",
    },
    {
      name: "American Association of Diabetes Educators",
      url: "https://www.diabeteseducator.org/living-with-diabetes",
    },
  ];

  const openURL = (url) => {
    navigation.navigate("ResourceViewerScreen", { url });
  };

  const renderResources = (resources) => {
    return resources.map((resource, index) => (
      <TouchableOpacity
        key={index}
        style={styles.resource}
        onPress={() => openURL(resource.url)}
      >
        <View style={styles.rowView}>
          <Text style={styles.resourceText}>{resource.name}</Text>
          <Icon name="right" size={20} color={colors.darkBlue} />
        </View>
      </TouchableOpacity>
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 150 }}>
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

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              selectedTab === "Diabetes" && styles.selectedTab,
            ]}
            onPress={() => setSelectedTab("Diabetes")}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "Diabetes" && styles.selectedTabText,
              ]}
            >
              Diabetes
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tab,
              selectedTab === "Nutrition" && styles.selectedTab,
            ]}
            onPress={() => setSelectedTab("Nutrition")}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "Nutrition" && styles.selectedTabText,
              ]}
            >
              Nutrition
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tab,
              selectedTab === "Exercise" && styles.selectedTab,
            ]}
            onPress={() => setSelectedTab("Exercise")}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "Exercise" && styles.selectedTabText,
              ]}
            >
              Exercise
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.resourcesContainer}>
          {selectedTab === "Diabetes" && renderResources(diabetesResources)}
          {selectedTab === "Nutrition" && renderResources(nutritionResources)}
          {selectedTab === "Exercise" && renderResources(exerciseResources)}
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
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  tab: {
    padding: 10,
    borderRadius: 10,
  },
  selectedTab: {
    backgroundColor: colors.complementary,
  },
  tabText: {
    fontFamily: "MontserratRegular",
    fontSize: 18,
    color: colors.darkBlue,
    padding: 5,
    paddingHorizontal: 10,
  },
  selectedTabText: {
    fontFamily: "MontserratRegular",
    fontSize: 18,
    color: colors.white,
    padding: 5,
    paddingHorizontal: 10,
    textDecorationLine: "underline",
    textDecorationStyle: "solid",
    textDecorationColor: colors.white,
  },
  resource: {
    backgroundColor: colors.white,
    padding: 20,
    marginHorizontal: 20,
    marginVertical: 5,
    borderRadius: 5,
  },
  resourceText: {
    fontFamily: "MontserratRegular",
    fontSize: 16,
    color: colors.darkBlue,
    textAlign: "center",
    width: "90%",
  },
  rowView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default ResourcesScreen;
