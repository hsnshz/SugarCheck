import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Text,
  TextInput,
  RefreshControl,
  Dimensions,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Icon from "react-native-vector-icons/FontAwesome5";
import colors from "../../config/colors";
import axios from "axios";
import { getExerciseAPI, getNgrokUrl } from "../../config/constants";
import ActivityComponent from "../components/ActivityComponent";
import Toast from "react-native-fast-toast";
import * as Haptics from "expo-haptics";
import SecondaryCardComponent from "../components/SecondaryCardComponent";
import PieChartComponent from "../components/PieChartComponent";
import Sheet from "../components/Sheet";
import LogExerciseSheetContent from "../components/LogExerciseSheetContent";

const screenWidth = Dimensions.get("window").width;

const Exercise = ({ navigation }) => {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [query, setQuery] = useState("");

  const [activityType, setActivityType] = useState("");
  const [duration, setDuration] = useState(0);
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [intensity, setIntensity] = useState("");
  const [notes, setNotes] = useState("");

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSheetVisible, setIsSheetVisible] = useState(false);

  const [collapsedStates, setCollapsedStates] = useState({});
  const [loadingStates, setLoadingStates] = useState({});

  const [isActivitiesUpdated, setIsActivitiesUpdated] = useState(false);

  const toastRef = useRef(null);

  const onRefresh = async () => {
    setIsRefreshing(true);
    setIsActivitiesUpdated(false);
    fetchActivities();
    setIsActivitiesUpdated(true);
    setIsRefreshing(false);
  };

  const toggleSheet = () => {
    setIsSheetVisible(!isSheetVisible);
  };

  const fetchActivities = async () => {
    if (activities.length > 0) {
      return;
    }

    let url = "https://api.api-ninjas.com/v1/caloriesburnedactivities";

    try {
      const response = await axios.get(url, {
        headers: {
          "X-Api-Key": `${getExerciseAPI()}`,
        },
      });

      const data = response.data;
      setActivities(data.activities);
    } catch (error) {
      console.error(error);
    }
  };

  const getCaloriesBurned = async (activity) => {
    setLoadingStates((prevState) => ({
      ...prevState,
      [activity]: true,
    }));

    let url =
      "https://api.api-ninjas.com/v1/caloriesburned?activity=" + activity;

    try {
      const response = await axios.get(url, {
        headers: {
          "X-Api-Key": `${getExerciseAPI()}`,
        },
      });

      const data = response.data[0];

      setActivityType(data.name);
      setCaloriesBurned(data.total_calories);
      setDuration(data.duration_minutes);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingStates((prevState) => ({
        ...prevState,
        [activity]: false,
      }));
    }
  };

  const handleSearch = () => {
    if (query.trim() === "") {
      setFilteredActivities([]);
    } else {
      const result = activities.filter((activity) =>
        activity.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredActivities(result);
    }
  };

  useEffect(() => {
    fetchActivities();
    setIsActivitiesUpdated(true);
  }, []);

  const handleAdd = () => {
    if (isSheetVisible) {
      toggleSheet();
    }

    setIsActivitiesUpdated(false);
    setActivityType("");
    setCaloriesBurned(0);
    setDuration(0);
    setIntensity("");
    setNotes("");
    setIsActivitiesUpdated(true);

    toastRef.current.show("Activity logged successfully", {
      type: "success",
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
      >
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

        <View style={styles.progressContainer}>
          <View style={styles.chartContainer}>
            {isActivitiesUpdated && <PieChartComponent />}
          </View>

          <SecondaryCardComponent
            title="View Activity"
            text="Check out your progress and activity logs"
            navigateTo={() => navigation.navigate("ActivityProgress")}
            height={260}
          />
        </View>

        <View style={styles.searchContainer}>
          <TouchableOpacity style={styles.logIcon} onPress={toggleSheet}>
            <Icon name="plus" size={22} color={colors.darkBlue} />
          </TouchableOpacity>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search for an activity"
            style={styles.searchBar}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
            clearButtonMode="always"
          />
          <TouchableOpacity style={styles.searchIcon} onPress={handleSearch}>
            <Icon name="search" size={22} color={colors.darkBlue} />
          </TouchableOpacity>
        </View>

        <View style={styles.clearContainer}>
          {filteredActivities != "" ? (
            <TouchableOpacity
              style={styles.clearText}
              onPress={() => {
                setQuery("");
                setFilteredActivities([]);
              }}
            >
              <Text style={styles.clearText}>Clear</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.clearText}></View>
          )}
        </View>

        {query != "" && filteredActivities.length > 0 ? (
          filteredActivities.map((activity, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.7}
              onPress={() => {
                setCollapsedStates((prevState) => ({
                  ...prevState,
                  [activity]: !prevState[activity],
                }));

                if (collapsedStates[activity] === true) {
                  setActivityType("");
                  setCaloriesBurned(0);
                  setDuration(0);
                  setIntensity("");
                  setNotes("");
                } else {
                  getCaloriesBurned(activity);
                }
              }}
            >
              <ActivityComponent
                activity={activity}
                collapsedStates={collapsedStates}
                setCollapsedStates={setCollapsedStates}
                loadingStates={loadingStates}
                activityType={activityType}
                setActivityType={setActivityType}
                duration={duration}
                setDuration={setDuration}
                caloriesBurned={caloriesBurned}
                setCaloriesBurned={setCaloriesBurned}
                intensity={intensity}
                setIntensity={setIntensity}
                notes={notes}
                setNotes={setNotes}
                onAdd={handleAdd}
              />
            </TouchableOpacity>
          ))
        ) : query != "" && filteredActivities.length == 0 ? (
          <View style={styles.noActivityView}>
            <Text style={styles.activityText}>No results found</Text>
          </View>
        ) : null}

        {isSheetVisible && (
          <Sheet
            visible={isSheetVisible}
            onRequestClose={toggleSheet}
            height="85%"
            backgroundColor={colors.active}
            children={
              <LogExerciseSheetContent
                toggleSheet={toggleSheet}
                onAdd={handleAdd}
              />
            }
          />
        )}
      </ScrollView>

      <Toast
        ref={toastRef}
        placement="top"
        style={{ backgroundColor: colors.darkBlue, marginTop: 50 }}
        fadeInDuration={750}
        fadeOutDuration={1000}
        opacity={1}
        textStyle={{ color: colors.white, fontFamily: "MontserratRegular" }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  progressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
  },
  chartContainer: {
    backgroundColor: colors.darkBlue,
    height: 260,
    width: "45%",
    marginTop: 20,
    marginLeft: 10,
    padding: 20,
    borderRadius: 10,
    shadowRadius: 5,
    shadowOffset: { width: 3, height: 5 },
    elevation: 5,
    shadowOpacity: 0.1,
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 40,
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
  clearContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  clearText: {
    fontFamily: "MontserratRegular",
    fontSize: 16,
    color: colors.danger,
  },
  activityView: {
    backgroundColor: colors.white,
    padding: 20,
    borderColor: colors.complementary,
    borderWidth: 1,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 10,
    paddingHorizontal: 20,
  },
  activityTextView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  activityText: {
    fontFamily: "MontserratRegular",
    fontSize: 16,
    color: colors.darkBlue,
  },
  noActivityView: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    marginTop: 200,
  },
  collapsedView: {
    marginTop: 30,
    height: 320,
  },
  collapsedText: {
    fontFamily: "MontserratRegular",
    fontSize: 16,
    color: colors.darkBlue,
    marginBottom: 5,
  },
  inputIOS: {
    width: "100%",
    marginVertical: 10,
    fontSize: 16,
    fontFamily: "MontserratRegular",
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: colors.gray,
    color: colors.darkBlue,
  },
  inputAndroid: {
    width: "100%",
    marginVertical: 10,
    fontSize: 16,
    fontFamily: "MontserratRegular",
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: colors.gray,
    color: colors.darkBlue,
    backgroundColor: colors.background,
  },
  notesInput: {
    width: "100%",
    height: 80,
    marginVertical: 10,
    fontSize: 16,
    fontFamily: "MontserratRegular",
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: colors.gray,
    color: colors.darkBlue,
  },
  btnLogActivity: {
    width: "60%",
    alignSelf: "center",
    backgroundColor: colors.complementary,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  btnLogActivityText: {
    fontFamily: "MontserratRegular",
    fontSize: 16,
    color: colors.white,
  },
});

export default Exercise;
