import React, { useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  Image,
  Animated,
} from "react-native";
import colors from "../../config/colors";
import Icon from "@expo/vector-icons/AntDesign";
import { useSelector, useDispatch } from "react-redux";
import Svg, { Rect } from "react-native-svg";

const A1cResultComponent = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user) || {};
  const token = useSelector((state) => state.auth.token) || "";

  const { A1cReading } = route.params;

  const animation = useRef(new Animated.Value(0)).current;
  const sliderWidth = 350;
  const normalMax = 5.6;
  const preDiabetesMax = 6.4;
  const diabetesMin = 6.5;

  const readingToPosition = (reading) => {
    const totalMax = 14;

    if (reading <= normalMax) {
      return (reading / totalMax) * sliderWidth;
    } else if (reading <= preDiabetesMax) {
      return (
        ((reading - normalMax) / totalMax) * sliderWidth +
        (normalMax / totalMax) * sliderWidth
      );
    } else {
      const position =
        ((reading - preDiabetesMax) / totalMax) * sliderWidth +
        ((normalMax + preDiabetesMax) / totalMax) * sliderWidth;
      return Math.min(position, sliderWidth);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      Animated.timing(animation, {
        toValue: readingToPosition(A1cReading),
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }, 600);

    return () => clearTimeout(timeoutId);
  }, [A1cReading]);

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
          <View style={styles.resultContainer}>
            <Text style={styles.resultText}>Your Estimated HbA1c Result</Text>
            <Text style={styles.resultValue}>{A1cReading} %</Text>
          </View>

          <View style={styles.resultDescriptionContainer}>
            <View style={styles.riskScoreTextContainer}>
              <Text style={styles.riskScoreText}>Risk Score: </Text>
              <Text style={styles.riskScoreText}>
                {A1cReading < 5.7
                  ? "Low Risk"
                  : A1cReading >= 5.7 && A1cReading <= 6.4
                  ? "Moderate Risk"
                  : "High Risk"}
              </Text>
            </View>

            {(A1cReading < 5.7 && (
              <Text style={styles.resultDescription}>
                Your A1c result is within the normal range. Please consult your
                doctor for further evaluation if you have any concerns for a
                proper diagnosis.
              </Text>
            )) ||
              (A1cReading >= 5.7 && A1cReading <= 6.4 && (
                <Text style={styles.resultDescription}>
                  Your A1c result is within the prediabetes range. Please
                  consult your doctor for further evaluation and treatment.
                </Text>
              )) ||
              (A1cReading > 6.4 && (
                <Text style={styles.resultDescription}>
                  Your A1c result is high. Please consult your doctor for
                  further evaluation and treatment.
                </Text>
              ))}
          </View>

          <View style={styles.riskScoreContainer}>
            <View style={styles.labels}>
              <Text style={styles.label}>Normal</Text>
              <Text style={styles.label}>Prediabetes</Text>
              <Text style={styles.label}>Diabetes</Text>
            </View>

            <Svg height="30" width={sliderWidth.toString()}>
              <Rect
                x="0"
                y="0"
                width={sliderWidth / 3}
                height="30"
                fill="green"
              />
              <Rect
                x={sliderWidth / 3}
                y="0"
                width={sliderWidth / 3}
                height="30"
                fill="orange"
              />
              <Rect
                x={(2 * sliderWidth) / 3}
                y="0"
                width={sliderWidth / 3}
                height="30"
                fill="red"
              />
              <Animated.View
                style={[
                  styles.indicator,
                  {
                    transform: [{ translateX: animation }],
                  },
                ]}
              />
            </Svg>

            <View style={styles.labels}>
              <Text style={styles.label}>0</Text>
              <Text style={styles.label}>5.7</Text>
              <Text style={styles.label}>6.4</Text>
              <Text style={styles.label}>14</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoView}>
          <Icon
            name="infocirlceo"
            size={26}
            color={colors.darkBlue}
            style={{ alignSelf: "center", marginBottom: 10 }}
          />
          <Text style={styles.infoText}>
            Your HbA1c result is a measure of your average blood sugar levels
            over the past 2-3 months. It is an important test that can help
            diagnose diabetes and prediabetes. A normal HbA1c result is less
            than 5.7%. A result between 5.7% and 6.4% indicates prediabetes,
            while a result of 6.5% or higher indicates diabetes. Please consult
            your doctor for further evaluation and treatment.
          </Text>
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
    flex: 1,
    marginTop: 20,
    alignItems: "center",
  },
  resultContainer: {
    backgroundColor: colors.white,
    width: "80%",
    padding: 20,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  resultText: {
    fontSize: 22,
    color: colors.darkBlue,
    fontFamily: "MontserratRegular",
    textAlign: "center",
    marginBottom: 10,
  },
  resultValue: {
    fontSize: 60,
    color: colors.darkBlue,
    fontFamily: "MontserratBold",
    textAlign: "center",
  },
  riskScoreTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  riskScoreText: {
    fontSize: 18,
    color: colors.darkBlue,
    fontFamily: "MontserratRegular",
    textAlign: "center",
    marginHorizontal: 10,
  },
  resultDescriptionContainer: {
    width: "80%",
    marginTop: 30,
    padding: 20,
    borderRadius: 20,
    backgroundColor: colors.white,
  },
  resultDescription: {
    fontSize: 18,
    color: colors.darkBlue,
    textAlign: "center",
    fontFamily: "MontserratRegular",
    marginTop: 15,
  },
  riskScoreContainer: {
    marginTop: 30,
    width: "80%",
  },
  indicator: {
    position: "absolute",
    height: 20,
    width: 8,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: colors.darkBlue,
  },
  labels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  label: {
    textAlign: "center",
    fontSize: 16,
    color: colors.darkBlue,
    fontFamily: "MontserratRegular",
  },
  infoView: {
    backgroundColor: colors.white,
    padding: 20,
    margin: 20,
    marginTop: 40,
    borderRadius: 20,
    width: "80%",
    alignSelf: "center",
  },
  infoText: {
    fontSize: 16,
    color: colors.darkBlue,
    fontFamily: "MontserratRegular",
    textAlign: "center",
  },
});

export default A1cResultComponent;
