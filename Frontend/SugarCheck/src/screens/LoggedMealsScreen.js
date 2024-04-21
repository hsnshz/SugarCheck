import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
  Keyboard,
  Platform,
  Button,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import colors from "../../config/colors";
import axios from "axios";
import Icon from "@expo/vector-icons/AntDesign";
import { getNgrokUrl } from "../../config/constants";
import { useFocusEffect } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import LoggedMealComponent from "../components/LoggedMealComponent";
import Collapsible from "react-native-collapsible";
import SwitchToggle from "react-native-switch-toggle";
import * as Haptics from "expo-haptics";
import Toast from "react-native-fast-toast";
import { setMealLogs } from "../store/slices/mealSlice";

const LoggedMealsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user) || {};
  const token = useSelector((state) => state.auth.token) || null;

  const [meals, setMeals] = useState([]);
  const [expandedDate, setExpandedDate] = useState([]);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("date");

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toastRef = useRef(null);

  const fetchMeals = async (viewMode) => {
    setIsLoading(true);

    try {
      const response = await axios.get(
        `${getNgrokUrl()}/api/meals/fetch-meal/${
          user._id
        }/${selectedDate.toISOString()}/${viewMode}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Create an array of objects where each object contains the date and the corresponding meals
      const mealLogs = response.data.mealLogs.map((log) => ({
        id: log._id,
        date: new Date(log.date).toLocaleDateString("en-GB", {
          weekday: "long",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
        meals: log.meals,
      }));

      dispatch(setMealLogs(mealLogs));

      setMeals(mealLogs);
      setExpandedDate(mealLogs.map(() => true));
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    fetchMeals(viewMode);
    setIsRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchMeals(viewMode);
      return () => {};
    }, [selectedDate, viewMode])
  );

  const handleOnUpdated = () => {
    fetchMeals(viewMode);
    toastRef.current.show("Meal Updated Successfully", {
      type: "success",
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleOnDeleted = () => {
    fetchMeals(viewMode);
    toastRef.current.show("Meal Deleted Successfully", {
      type: "success",
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 200 }}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <View style={styles.iconView}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="left" size={25} color={colors.darkBlue} />
          </TouchableOpacity>
        </View>
        <View style={styles.titleView}>
          <Text style={styles.title}>Logged Meals</Text>
        </View>
      </View>

      <View style={styles.dateContainer}>
        <Text style={styles.dateContainerText}>Select a date</Text>

        {Platform.OS === "android" && (
          <View style={styles.androidBtn}>
            <Button title="Date" onPress={() => setShowDatePicker(true)} />
          </View>
        )}
        {(showDatePicker || Platform.OS === "ios") && (
          <DateTimePicker
            style={styles.datePicker}
            value={selectedDate}
            onChange={(event, selectedDate) => {
              setSelectedDate(selectedDate || selectedDate);
              fetchMeals(viewMode);
              setShowDatePicker(false);
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success
              );
            }}
            mode="date"
            maximumDate={new Date()}
          />
        )}
        <SwitchToggle
          switchOn={viewMode === "week"}
          onPress={() => {
            const newViewMode = viewMode === "date" ? "week" : "date";
            setViewMode(newViewMode);
            fetchMeals(newViewMode);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }}
          buttonText={viewMode === "date" ? "Week" : "Date"}
          buttonTextStyle={{ color: colors.white }}
          containerStyle={{
            marginLeft: 20,
            width: 80,
            height: 30,
            borderRadius: 40,
          }}
          backgroundColorOn={colors.active}
          backgroundColorOff={colors.active}
          circleColorOn={colors.complementary}
          circleColorOff={colors.complementary}
          circleStyle={{
            width: 50,
            height: 30,
            padding: 7,
            borderRadius: 15,
          }}
        />
      </View>

      {isLoading && isRefreshing ? (
        <ActivityIndicator
          size="large"
          color={colors.darkBlue}
          style={styles.activityIndicator}
        />
      ) : meals && meals.length > 0 ? (
        meals.map((mealsForDate, index) => (
          <View key={index}>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => {
                setIsCollapsed(!isCollapsed);
                setExpandedDate(
                  expandedDate.map((expanded, i) =>
                    i === index ? !expanded : expanded
                  )
                );
              }}
              activeOpacity={0.8}
            >
              <View style={styles.dateLabel}>
                <Text style={styles.dateText}>{mealsForDate.date}</Text>
                {isCollapsed ? (
                  <Icon name="down" size={20} color={colors.white} />
                ) : (
                  <Icon name="up" size={20} color={colors.white} />
                )}
              </View>
            </TouchableOpacity>
            <Collapsible collapsed={!expandedDate[index]}>
              {mealsForDate.meals.map((meal, mealIndex) => (
                <LoggedMealComponent
                  key={mealIndex}
                  meal={meal}
                  onUpdated={handleOnUpdated}
                  onDeleted={handleOnDeleted}
                />
              ))}
            </Collapsible>
          </View>
        ))
      ) : (
        <View style={styles.noMealsView}>
          <Text style={styles.noMealsText}>No meals logged</Text>
        </View>
      )}

      <Toast
        ref={toastRef}
        placement="top"
        style={{ backgroundColor: colors.darkBlue, marginTop: 50 }}
        fadeInDuration={750}
        fadeOutDuration={1000}
        opacity={1}
        textStyle={{ color: colors.white, fontFamily: "MontserratRegular" }}
      />
    </ScrollView>
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
    padding: 20,
    backgroundColor: colors.background,
  },
  iconView: {
    flex: 0.5,
  },
  titleView: {
    flex: 1,
    alignItems: "center",
    paddingRight: "22%",
  },
  title: {
    fontFamily: "MontserratBold",
    fontSize: 22,
    color: colors.darkBlue,
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  dateContainerText: {
    fontFamily: "MontserratRegular",
    fontSize: 18,
    color: colors.darkBlue,
  },
  datePicker: {
    marginLeft: 10,
  },
  viewModeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 20,
    marginVertical: 5,
    marginBottom: 20,
  },
  viewModeButton: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.complementary,
  },
  viewModeText: {
    fontFamily: "MontserratRegular",
    fontSize: 18,
    color: colors.complementary,
  },
  noMealsView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noMealsText: {
    fontFamily: "MontserratRegular",
    fontSize: 20,
    color: colors.darkBlue,
  },
  dateButton: {
    padding: 10,
  },
  dateLabel: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: colors.complementary,
    padding: 10,
    borderRadius: 5,
  },
  dateText: {
    fontFamily: "MontserratRegular",
    fontSize: 18,
    color: colors.white,
  },
  activityIndicator: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    marginTop: 150,
  },
  androidBtn: {
    width: 100,
    marginLeft: 20,
    marginTop: 10,
    alignSelf: "center",
  },
});

export default LoggedMealsScreen;
