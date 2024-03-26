import React, { useEffect } from "react";
import {
  FlatList,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LineChart } from "react-native-chart-kit";
import colors from "../../config/colors";

const screenWidth = Dimensions.get("window").width;
const ITEM_HEIGHT = 200;

const ListItem = React.memo(
  ({ item, onSwipeRight, onSwipeLeft, isToday, glucoseValues, timestamps }) => {
    return (
      <View>
        <View style={styles.dateContainer}>
          <TouchableOpacity onPress={onSwipeRight}>
            <Ionicons name="ios-arrow-back" size={20} color={colors.primary} />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={styles.date}>
              {item.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </Text>
          </View>
          <TouchableOpacity onPress={onSwipeLeft}>
            {!isToday(item) ? (
              <Ionicons
                name="ios-arrow-forward"
                size={20}
                color={colors.primary}
              />
            ) : (
              <View style={{ width: 20 }}></View>
            )}
          </TouchableOpacity>
        </View>
        <View>
          {glucoseValues.length > 0 ? (
            <ScrollView horizontal={true}>
              <LineChart
                data={{
                  labels: timestamps,
                  datasets: [
                    {
                      data: glucoseValues,
                    },
                  ],
                }}
                width={Dimensions.get("window").width}
                height={300}
                yAxisLabel=""
                yAxisSuffix="mg/dL"
                yAxisInterval={1}
                yLabelsOffset={1}
                chartConfig={{
                  backgroundColor: colors.detail,
                  backgroundGradientFrom: colors.complementary,
                  backgroundGradientTo: colors.complementary,
                  decimalPlaces: 1,
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  labelColor: (opacity = 1) =>
                    `rgba(255, 255, 255, ${opacity})`,
                  propsForDots: {
                    r: "6",
                    strokeWidth: "2",
                    stroke: "#ffa726",
                  },
                }}
                style={styles.chart}
                withHorizontalLabels={true}
                withHorizontalLines={true}
              />
            </ScrollView>
          ) : (
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderText}>
                No glucose values to display
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  }
);

const DateFlatList = ({
  dates,
  selectedDate,
  setSelectedDate,
  onSwipeRight,
  onSwipeLeft,
  isToday,
  glucoseValues,
  timestamps,
}) => {
  const renderItem = ({ item }) => (
    <ListItem
      item={item}
      onSwipeRight={onSwipeRight}
      onSwipeLeft={onSwipeLeft}
      isToday={isToday}
      glucoseValues={glucoseValues}
      timestamps={timestamps}
    />
  );

  const handleSwipeRight = () => {
    const currentIndex = dates.indexOf(selectedDate);
    if (currentIndex > 0) {
      setSelectedDate(dates[currentIndex - 1]);
    }
  };

  const handleSwipeLeft = () => {
    const currentIndex = dates.indexOf(selectedDate);
    if (currentIndex < dates.length - 1) {
      setSelectedDate(dates[currentIndex + 1]);
    }
  };

  return dates.length > 0 ? (
    <FlatList
      data={dates}
      keyExtractor={(item, index) => index.toString()}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={true}
      initialScrollIndex={dates.length - 1}
      getItemLayout={(data, index) => ({
        length: ITEM_HEIGHT,
        width: screenWidth,
        offset: ITEM_HEIGHT * index,
        index,
      })}
      maxToRenderPerBatch={10}
      windowSize={7}
      onSwipeLeft={handleSwipeLeft}
      onSwipeRight={handleSwipeRight}
      renderItem={renderItem}
    />
  ) : (
    <ActivityIndicator size="large" color={colors.primary} />
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
    alignSelf: "center",
    paddingBottom: 15,
  },
  placeholderContainer: {
    height: 300,
    backgroundColor: colors.detail,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    marginVertical: 8,
  },
  placeholderText: {
    color: "#aaa",
  },
});

export default DateFlatList;
