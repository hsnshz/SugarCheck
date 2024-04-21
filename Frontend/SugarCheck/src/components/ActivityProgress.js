import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  RefreshControl,
  ActivityIndicator,
  Button,
  Platform,
  Dimensions,
} from "react-native";
import colors from "../../config/colors";
import Icon from "@expo/vector-icons/AntDesign";
import { BarChart } from "react-native-gifted-charts";
import axios from "axios";
import { useSelector } from "react-redux";
import { getNgrokUrl } from "../../config/constants";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Haptics from "expo-haptics";

const ActivityProgress = ({ navigation }) => {
  const user = useSelector((state) => state.user.user) || {};
  const token = useSelector((state) => state.auth.token) || "";

  const [activities, setActivities] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [chartData, setChartData] = useState([]);
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const screenWidth = Dimensions.get("window").width;

  const fetchExerciseActivities = async (date) => {
    setIsLoading(true);

    const formattedDate = date.toISOString().slice(0, 10);

    try {
      const response = await axios.get(
        `${getNgrokUrl()}/api/exercise/fetch-activities/${
          user._id
        }/${formattedDate}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;

      if (response.status === 200) {
        setActivities(data.activities);
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExerciseActivities(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    const data = activities.map((activity) => {
      let color;

      switch (activity.intensity.toLowerCase()) {
        case "low":
          color = "#4F7942";
          break;
        case "moderate":
          color = "#FDDA0D";
          break;
        case "high":
          color = "#FF0000";
          break;
        default:
          color = "blue";
          break;
      }

      const date = new Date(activity.date);
      const day = daysOfWeek[date.getDay()];

      return {
        value: activity.caloriesBurned,
        label: day,
        frontColor: color,
        duration: activity.duration,
        intensity: activity.intensity,
      };
    });

    setChartData(data);
  }, [activities]);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchExerciseActivities(selectedDate);
    setIsRefreshing(false);
  };

  return (
    <SafeAreaView>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="left" size={30} color={colors.darkBlue} />
          </TouchableOpacity>
          <Image
            source={require("../../assets/icons/DarkAppIcon.png")}
            style={styles.logo}
          />
          <View style={{ width: 35 }} />
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
                const currentDate = selectedDate || selectedDate;
                setSelectedDate(currentDate);
                fetchExerciseActivities(currentDate);
                setShowDatePicker(false);
                Haptics.notificationAsync(
                  Haptics.NotificationFeedbackType.Success
                );
              }}
              mode="date"
              maximumDate={new Date()}
            />
          )}
        </View>

        {isLoading && !isRefreshing ? (
          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={styles.activityIndicator}
          />
        ) : (
          <View>
            <View style={styles.titleView}>
              <Text style={styles.titleText}>Your activities from</Text>
              <Text style={styles.titleText}>
                {new Date(
                  selectedDate.getFullYear(),
                  selectedDate.getMonth(),
                  selectedDate.getDate() - 7
                ).toDateString()}{" "}
                to {selectedDate.toDateString()}
              </Text>
            </View>
            <View style={styles.chartView}>
              <BarChart
                data={chartData}
                height={200}
                width={screenWidth - 170}
                barWidth={20}
                spacing={25}
                yAxisThickness={1}
                xAxisThickness={1}
                noOfSections={6}
                barBorderRadius={10}
                yAxisLabelSuffix={" kcal"}
                yAxisLabelWidth={80}
                yAxisExtraHeight={50}
                yAxisTextStyle={styles.yAxisLabelText}
                xAxisLabelTextStyle={styles.yAxisLabelText}
                hideRules={false}
                isAnimated
                scrollAnimation
                renderTooltip={(value) => {
                  return (
                    <View
                      style={{
                        backgroundColor: colors.white,
                        padding: 5,
                        borderRadius: 5,
                        marginLeft: -15,
                        marginBottom: 5,
                      }}
                    >
                      <Text style={styles.toolTipText}>
                        {value.duration} mins
                      </Text>
                      <Text style={styles.toolTipText}>{value.intensity}</Text>
                    </View>
                  );
                }}
              />
            </View>

            <View style={styles.activityListView}>
              <Text style={styles.activityListTitle}>
                Your activities in the past week
              </Text>
              {activities
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((activity, index) => {
                  const date = new Date(activity.date);

                  return (
                    <View key={index} style={styles.activityList}>
                      <Text
                        style={[
                          styles.activityListText,
                          { fontFamily: "MontserratBold", marginBottom: 10 },
                        ]}
                      >
                        {date.toDateString()}
                      </Text>
                      <Text style={styles.activityListText}>
                        {activity.activityType}
                      </Text>
                      <Text style={styles.activityListText}>
                        {activity.duration} mins
                      </Text>
                      <Text style={styles.activityListText}>
                        Intensity: {activity.intensity}
                      </Text>
                      <Text style={styles.activityListText}>
                        Calories burned: {activity.caloriesBurned}
                      </Text>
                      <Text style={styles.activityListText}>
                        Notes: {activity.notes}
                      </Text>
                    </View>
                  );
                })}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
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
  activityIndicator: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    marginTop: 150,
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
  androidBtn: {
    marginLeft: 10,
  },
  titleView: {
    flex: 1,
    alignItems: "center",
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  titleText: {
    fontFamily: "MontserratBold",
    fontSize: 20,
    color: colors.darkBlue,
    textAlign: "center",
  },
  chartView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginHorizontal: 20,
    backgroundColor: colors.active,
    borderRadius: 10,
    padding: 10,
  },
  yAxisLabelText: {
    fontFamily: "MontserratRegular",
    fontSize: 14,
    color: colors.darkBlue,
  },
  toolTipText: {
    fontFamily: "MontserratRegular",
    fontSize: 12,
    color: colors.darkBlue,
  },
  activityListView: {
    flex: 1,
    marginTop: 40,
    backgroundColor: colors.active,
    padding: 20,
    paddingVertical: 30,
    marginHorizontal: 20,
    borderRadius: 10,
  },
  activityListTitle: {
    fontFamily: "MontserratBold",
    fontSize: 20,
    color: colors.darkBlue,
    textAlign: "center",
    marginBottom: 15,
  },
  activityList: {
    marginVertical: 10,
    padding: 20,
    backgroundColor: colors.white,
    borderRadius: 10,
  },
  activityListText: {
    fontFamily: "MontserratRegular",
    fontSize: 16,
    color: colors.darkBlue,
  },
});

export default ActivityProgress;
