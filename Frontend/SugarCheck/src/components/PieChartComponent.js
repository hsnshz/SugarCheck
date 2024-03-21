import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import colors from "../../config/colors";
import * as Haptics from "expo-haptics";
import axios from "axios";
import { getNgrokUrl } from "../../config/constants";
import { useSelector } from "react-redux";

const PieChartComponent = () => {
  const user = useSelector((state) => state.user.user) || {};
  const token = useSelector((state) => state.auth.token) || null;

  const [latestActivities, setlatestActivities] = useState([]);
  const [chartData, setChartData] = useState([]);

  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchExerciseActivities();
  }, []);

  useEffect(() => {
    const colors = ["#72C3DC", "#A463F2", "#ED8B00"];

    const data = latestActivities
      .slice(Math.max(latestActivities.length - 3, 0))
      .map((activity, index) => {
        let color = colors[index % colors.length];

        return {
          value: activity.caloriesBurned,
          text: activity.activityType,
          color: color,
          intensity: activity.intensity,
          caloriesBurned: activity.caloriesBurned,
        };
      });

    setChartData(data);
  }, [latestActivities]);

  const fetchExerciseActivities = async () => {
    if (latestActivities.length > 0) {
      return;
    }

    setIsLoading(true);

    const date = new Date();
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

      setIsLoading(false);
      console.log(response.data);

      if (response.status === 200) {
        setlatestActivities(response.data.activities);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color={colors.darkBlue}
          style={{ alignSelf: "center", marginTop: 60 }}
        />
      ) : (
        <>
          <PieChart
            donut
            focusOnPress
            data={chartData.map((item) => ({
              ...item,
              onPress: () => {
                if (selectedActivity === item.text) {
                  setSelectedActivity(null);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                } else {
                  setSelectedActivity(item.text);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
              },
            }))}
            radius={75}
            innerRadius={50}
            innerCircleColor={colors.darkBlue}
            textSize={12}
            textColor={colors.white}
            centerLabelComponent={() =>
              !selectedActivity ? (
                <Text
                  style={{
                    fontFamily: "MontserratRegular",
                    fontSize: 16,
                    color: colors.white,
                    textAlign: "center",
                  }}
                >
                  Latest Activities
                </Text>
              ) : (
                <Text
                  style={{
                    fontFamily: "MontserratRegular",
                    fontSize: 14,
                    color: colors.white,
                    textAlign: "center",
                  }}
                >
                  {selectedActivity}
                </Text>
              )
            }
          />

          <View style={styles.legendContainer}>
            {chartData.map((item, index) => (
              <View key={index} style={styles.legendItem}>
                <View
                  style={[styles.legendColor, { backgroundColor: item.color }]}
                />
                <Text style={styles.legendText}>
                  {item.caloriesBurned} kcal
                </Text>
              </View>
            ))}
          </View>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    flex: 1,
  },
  legendItem: {
    alignItems: "center",
    margin: 5,
  },
  legendColor: {
    width: 20,
    height: 20,
    marginBottom: 5,
    borderRadius: 10,
  },
  legendText: {
    fontSize: 12,
    color: colors.white,
    fontFamily: "MontserratRegular",
  },
});

export default PieChartComponent;
