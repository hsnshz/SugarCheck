import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LineChart } from "react-native-chart-kit";
import GestureRecognizer from "react-native-swipe-gestures";
import colors from "../../config/colors.js";

const ChartComponent = ({
  selectedDate,
  onSwipeLeft,
  onSwipeRight,
  isToday,
  glucoseValues,
  timestamps,
  times,
  animation,
}) => {
  return (
    <Animated.View style={{ transform: [{ translateX: animation }] }}>
      <GestureRecognizer onSwipeLeft={onSwipeLeft} onSwipeRight={onSwipeRight}>
        <View>
          <View style={styles.dateContainer}>
            <TouchableOpacity onPress={onSwipeRight}>
              <Ionicons
                name="ios-arrow-back"
                size={20}
                color={colors.primary}
                style={{ marginLeft: 20 }}
              />
            </TouchableOpacity>
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text style={styles.date}>
                {selectedDate.toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </Text>
            </View>
            <TouchableOpacity onPress={onSwipeLeft}>
              {!isToday(selectedDate) ? (
                <Ionicons
                  name="ios-arrow-forward"
                  size={20}
                  color={colors.primary}
                  style={{ marginRight: 20 }}
                />
              ) : (
                <View style={{ width: 20 }}></View>
              )}
            </TouchableOpacity>
          </View>
          <View>
            {glucoseValues.length > 0 ? (
              <ScrollView
                horizontal={true}
                contentContainerStyle={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <LineChart
                  data={{
                    labels: times,
                    datasets: [
                      {
                        data:
                          glucoseValues === "undefined" ? [0] : glucoseValues,
                      },
                    ],
                  }}
                  width={Dimensions.get("window").width - 20}
                  height={260}
                  yAxisLabel=""
                  yAxisSuffix="mg/dL"
                  yAxisInterval={1}
                  yLabelsOffset={1}
                  chartConfig={{
                    backgroundColor: colors.detail,
                    backgroundGradientFrom: colors.primary,
                    backgroundGradientTo: colors.complementary,
                    decimalPlaces: 1,
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) =>
                      `rgba(255, 255, 255, ${opacity})`,
                    propsForDots: {
                      r: "6",
                      strokeWidth: "2",
                      stroke: colors.orange,
                    },
                  }}
                  style={styles.chart}
                  withHorizontalLabels={true}
                  withHorizontalLines={true}
                />
              </ScrollView>
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View style={styles.placeholderContainer}>
                  <Text style={styles.placeholderText}>
                    No glucose values to display
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </GestureRecognizer>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    marginBottom: 15,
  },
  date: {
    fontFamily: "MontserratBold",
    fontSize: 20,
    color: colors.primary,
  },
  chart: {
    marginBottom: 10,
    paddingBottom: 10,
    borderRadius: 12,
  },
  placeholderContainer: {
    height: 260,
    marginBottom: 22,
    backgroundColor: colors.detail,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.primary,
    marginVertical: 8,
    width: Dimensions.get("window").width - 20,
    borderRadius: 12,
  },
  placeholderText: {
    color: colors.inactive,
    fontFamily: "MontserratRegular",
    fontSize: 16,
  },
});

export default ChartComponent;
