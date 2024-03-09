import React, { useRef, useEffect } from "react";
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

const Home = ({ navigation }) => {
  // useLayoutEffect(() => {
  //   setHeaderOptions(navigation);
  // }, [navigation]);

  const user = useSelector((state) => state.user) || {};
  const animatedValue = useRef(new Animated.Value(0)).current;

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

  useEffect(() => {
    hasLoggedThreeGlucoseValuesToday(user);

    return () => {
      animatedValue.removeAllListeners();
    };
  }, []);

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
        <View style={{ width: 35 }} />
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
          {!isProfileComplete(user) ? (
            <CardComponent
              title="Get the full experience!"
              text="It looks like your profile is incomplete. To get the most out of the
                app, please complete your health profile."
              btnText="Complete Profile"
              navigateTo="HealthProfile"
            />
          ) : null}

          {!hasLoggedThreeGlucoseValuesToday(user) && (
            <CardComponent
              title="Log your glucose!"
              text="You have not logged at least 3 glucose values today. Please log more values for better tracking."
              btnText="Log Glucose"
              navigateTo="Glucose Monitor"
            />
          )}
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
  contentContainer: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 15,
    paddingBottom: 30,
    minHeight: "100%",
  },
});

export default Home;
