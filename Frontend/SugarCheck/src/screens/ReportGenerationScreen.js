import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  Image,
  Platform,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { getNgrokUrl } from "../../config/constants";
import colors from "../../config/colors";
import { Ionicons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/AntDesign";
import { useSelector } from "react-redux";
import RNPickerSelect from "react-native-picker-select";
import DateTimePicker from "@react-native-community/datetimepicker";

const ReportGenerationScreen = ({ navigation }) => {
  const user = useSelector((state) => state.user.user) || {};
  const token = useSelector((state) => state.auth.token) || "";

  const [reportType, setReportType] = useState("weekly");
  const [startDate, setStartDate] = useState(new Date());

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const generateReport = async () => {
    try {
      setIsLoading(true);

      const response = await axios.post(
        `${getNgrokUrl()}/api/report/generate/${user._id}`,
        {
          reportType,
          startDate,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const firebaseUrl = response.data.url;

      navigation.navigate("PdfViewerScreen", { file: firebaseUrl });
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 150 }}>
        {isLoading ? (
          <View style={styles.activityIndicator}>
            <ActivityIndicator size="large" color={colors.darkBlue} />
          </View>
        ) : (
          <>
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

            <View>
              <Text style={styles.titleText}>Generate Report</Text>
              <View style={styles.reportTextView}>
                <Icon
                  name="infocirlceo"
                  size={30}
                  color={colors.darkBlue}
                  style={{ marginBottom: 10 }}
                />
                <Text style={styles.reportText}>
                  Generate a report of your glucose levels, HbA1c, and other
                  diabetes related risk factors and data for a specific time
                  period.
                </Text>
                <Text style={styles.reportText}>
                  The report will be generated in PDF format and can be shared
                  with your healthcare provider for further analysis and
                  recommendations.
                </Text>
              </View>

              <View style={styles.rowView}>
                <Text style={styles.infoText}>Start Date</Text>
                {Platform.OS === "android" && (
                  <TouchableOpacity
                    style={styles.androidBtn}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Text style={styles.androidBtnText}>Date</Text>
                  </TouchableOpacity>
                )}
                {(showDatePicker || Platform.OS === "ios") && (
                  <DateTimePicker
                    style={styles.datePicker}
                    value={startDate}
                    onChange={(event, startDate) => {
                      const currentDate = startDate || startDate;
                      setStartDate(currentDate);
                      setShowDatePicker(false);
                    }}
                    mode="date"
                  />
                )}
              </View>

              <View style={styles.rowView}>
                <Text style={styles.infoText}>Report Type</Text>
                <RNPickerSelect
                  placeholder={{
                    label: "Select report type",
                    value: null,
                  }}
                  onValueChange={(value) => setReportType(value)}
                  items={[
                    { label: "Weekly", value: "weekly" },
                    { label: "Monthly", value: "monthly" },
                  ]}
                  style={{
                    inputIOS: styles.inputIOS,
                    inputAndroid: styles.inputAndroid,
                    placeholder: {
                      color: colors.darkBlue,
                    },
                  }}
                />
              </View>

              <TouchableOpacity
                style={styles.btnGenerate}
                onPress={generateReport}
              >
                <Text style={styles.btnGenerateText}>Generate Report</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
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
  titleText: {
    fontFamily: "MontserratBold",
    fontSize: 24,
    color: colors.darkBlue,
    textAlign: "center",
    marginVertical: 20,
    marginBottom: 30,
  },
  reportTextView: {
    alignItems: "center",
    marginHorizontal: 20,
    backgroundColor: colors.white,
    padding: 20,
    paddingBottom: 30,
    borderRadius: 10,
    marginBottom: 20,
  },
  reportText: {
    fontFamily: "MontserratRegular",
    fontSize: 18,
    color: colors.darkBlue,
    textAlign: "center",
    marginVertical: 5,
  },
  rowView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
    padding: 10,
  },
  infoText: {
    fontFamily: "MontserratRegular",
    fontSize: 16,
    color: colors.darkBlue,
    textAlign: "center",
    marginVertical: 20,
  },
  datePicker: {
    alignSelf: "center",
  },
  androidBtn: {
    width: "50%",
    padding: 10,
    borderRadius: 5,
    backgroundColor: colors.complementary,
    alignItems: "center",
    alignSelf: "center",
  },
  androidBtnText: {
    fontFamily: "MontserratRegular",
    fontSize: 16,
    color: colors.white,
  },
  inputIOS: {
    width: "100%",
    alignSelf: "center",
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
    alignSelf: "center",
    marginVertical: 10,
    fontSize: 16,
    fontFamily: "MontserratRegular",
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: colors.gray,
    color: colors.darkBlue,
  },
  btnGenerate: {
    width: "50%",
    padding: 15,
    borderRadius: 5,
    backgroundColor: colors.complementary,
    alignItems: "center",
    alignSelf: "center",
    marginVertical: 30,
  },
  btnGenerateText: {
    fontFamily: "MontserratRegular",
    fontSize: 16,
    color: colors.white,
  },
  activityIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ReportGenerationScreen;
