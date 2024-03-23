import React, { useRef, useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  Animated,
  TouchableOpacity,
  Image,
  StatusBar,
} from "react-native";
import { useSelector } from "react-redux";
import CardComponent from "../components/CardComponent";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../config/colors";
import axios from "axios";
import { getNgrokUrl } from "../../config/constants";
import SecondaryCardComponent from "../components/SecondaryCardComponent";
import SmallCardComponent from "../components/SmallCardComponent";
import IconComponent from "../components/IconComponent";

const Home = ({ navigation }) => {
  // useLayoutEffect(() => {
  //   setHeaderOptions(navigation);
  // }, [navigation]);

  const user = useSelector((state) => state.user.user) || {};
  const token = useSelector((state) => state.auth.token) || "";

  const mealLogs = useSelector((state) => state.meal.mealLogs) || [];

  const animatedValue = useRef(new Animated.Value(0)).current;

  const [profilePicture, setProfilePicture] = useState("");

  const isProfileComplete = (user) => {
    return (
      user &&
      user.firstName &&
      user.lastName &&
      user.email &&
      user.healthProfile &&
      user.healthProfile.height &&
      user.healthProfile.weight &&
      user.healthProfile.dietaryRestrictions &&
      user.healthProfile.allergies &&
      user.healthProfile.medications
    );
  };

  const hasLoggedThreeGlucoseValuesToday = (user) => {
    if (!user.healthProfile) {
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const glucoseReadingsToday = user.healthProfile.glucoseReadings.filter(
      (reading) => {
        const readingDate = new Date(reading.timestamp);
        return readingDate >= today;
      }
    );

    return glucoseReadingsToday.length >= 3;
  };

  const hasLoggedMealToday = (mealLogs) => {
    if (mealLogs?.length === 0) {
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const mealsToday = mealLogs.filter((meal) => {
      if (meal && meal.date) {
        const [dayName, date] = meal.date.split(", ");
        const [day, month, year] = date.split("/");
        const mealDate = new Date(`${year}-${month}-${day}`);
        return mealDate >= today;
      }
      return false;
    });

    return mealsToday.length > 0;
  };

  const hasTakenDiabetesTest = (user) => {
    if (!user.healthProfile) {
      return false;
    }

    if (user?.healthProfile?.riskAssessment.length > 0) {
      return true;
    }

    return false;
  };

  useEffect(() => {
    hasLoggedThreeGlucoseValuesToday(user);
    hasLoggedMealToday(mealLogs);
    hasTakenDiabetesTest(user);

    return () => {
      animatedValue.removeAllListeners();
    };
  }, []);

  useEffect(() => {
    if (user.profilePicture) {
      axios
        .get(`${getNgrokUrl()}/${user.profilePicture}`, {
          responseType: "blob",
        })
        .then((response) => {
          const url = URL.createObjectURL(response.data);

          setProfilePicture(url);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setProfilePicture("");
    }
  }, [user.profilePicture]);

  const scrollY = useRef(new Animated.Value(0)).current;

  const bannerHeight = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [150, 100],
    extrapolate: "clamp",
  });

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <StatusBar barStyle="light-content" backgroundColor={colors.darkBlue} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="ios-menu" size={35} color={colors.white} />
        </TouchableOpacity>
        <Image
          source={require("../../assets/icons/AppIcon.png")}
          style={styles.logo}
        />
        <TouchableOpacity
          style={styles.btnProfilePicture}
          onPress={() => navigation.navigate("Profile")}
        >
          <View>
            {profilePicture === "" ? (
              <View style={styles.avatarPicture}>
                <Text style={styles.avatarText}>
                  {(user.firstName || "A")[0] + (user.lastName || "A")[0]}
                </Text>
              </View>
            ) : (
              <Image
                source={{ uri: profilePicture }}
                style={styles.profilePicture}
              />
            )}
          </View>
        </TouchableOpacity>
      </View>

      <Animated.ScrollView
        contentContainerStyle={styles.scrollViewContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <Animated.View style={[styles.banner, { height: bannerHeight }]}>
          <Text style={styles.welcomeText}>
            Welcome Back, {user.firstName}!
          </Text>
          <Text
            style={[
              styles.welcomeText,
              { marginTop: 10, fontSize: 20, fontFamily: "MontserratRegular" },
            ]}
          >
            How are you feeling today?
          </Text>
        </Animated.View>

        <View style={styles.contentContainer}>
          <SmallCardComponent
            title="Get Started"
            text="Discover the app's features and how to use them."
          />

          {!isProfileComplete(user) ? (
            <View style={styles.profileCardContainer}>
              <CardComponent
                title="Get the full experience!"
                text="It looks like your profile is incomplete. To get the most out of the
                app, please complete your health profile."
                btnText="Complete Profile"
                navigateTo="HealthProfile"
              />
            </View>
          ) : null}

          {!hasTakenDiabetesTest(user) && (
            <CardComponent
              title="Take the Diabetes Test"
              text="Take the diabetes risk assessment test to know your risk level."
              btnText="Continue"
              navigateTo="DiabetesForm"
            />
          )}

          {!hasLoggedThreeGlucoseValuesToday(user) &&
          !hasLoggedMealToday(mealLogs) ? (
            <View style={styles.mainCardContainer}>
              <View style={styles.cardContainer}>
                <SecondaryCardComponent
                  title="Log your glucose!"
                  text="You have not logged at least 3 glucose readings today. Tap here to log now."
                  navigateTo={() => navigation.navigate("Glucose Monitor")}
                />
              </View>

              <View style={styles.cardContainer}>
                <SecondaryCardComponent
                  title="Log your meals!"
                  text="Tap here to log a meal for today to keep track of your nutrition."
                  navigationTo={{
                    name: "Diet",
                    screen: "DietTabNavigator",
                    params: { screen: "Log Meals" },
                  }}
                />
              </View>
            </View>
          ) : !hasLoggedThreeGlucoseValuesToday(user) ? (
            <CardComponent
              title="Log your glucose!"
              text="You have not logged at least 3 glucose readings today. Tap here to log now."
              btnText="Log Glucose"
              navigateTo="Glucose Monitor"
            />
          ) : !hasLoggedMealToday(mealLogs) ? (
            <CardComponent
              title="Log your meals!"
              text="Tap here to log a meal for today to keep track of your nutrition."
              btnText="Log Meals"
              navigateTo={"Log Meals"}
            />
          ) : null}

          <SmallCardComponent
            title="Generate Report"
            text="Generate a report of your health data to monitor your health data and share with your healthcare provider."
            navigateTo="ReportGeneration"
          />

          <View style={styles.iconsView}>
            <IconComponent
              iconName="heart"
              color={colors.white}
              navigateTo="Favorite Recipes"
            />
            <IconComponent
              iconName="search"
              color={colors.white}
              navigateTo="Recipe Search"
            />
            <IconComponent
              iconName="nutrition"
              color={colors.white}
              navigateTo="Nutritional Analysis"
            />
            <IconComponent
              iconName="fast-food"
              color={colors.white}
              navigateTo="LoggedMealsScreen"
            />
          </View>

          <SmallCardComponent
            title="Access Resources"
            text="Access educational resources and articles to learn more about diabetes, nutrition, and exercise."
            navigateTo="Resources"
          />
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: colors.darkBlue,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: colors.darkBlue,
  },
  logo: {
    width: 70,
    height: 70,
  },
  profilePicture: {
    width: 35,
    height: 35,
    borderRadius: 35 / 2,
  },
  btnProfilePicture: {
    width: 35,
    height: 35,
    borderRadius: 35 / 2,
    overflow: "hidden",
  },
  avatarPicture: {
    width: 35,
    height: 35,
    borderRadius: 35 / 2,
    backgroundColor: colors.disabled,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: "MontserratBold",
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  banner: {
    backgroundColor: colors.darkBlue,
    paddingLeft: 20,
    width: "100%",
  },
  welcomeText: {
    fontSize: 30,
    fontFamily: "MontserratBold",
    color: colors.white,
  },
  profileCardContainer: {
    marginBottom: 20,
  },
  contentContainer: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 15,
    paddingBottom: 30,
    minHeight: "100%",
  },
  mainCardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 20,
  },
  cardContainer: {
    width: "50%",
  },
  iconsView: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 30,
    marginBottom: 20,
    marginHorizontal: 20,
  },
});

export default Home;
