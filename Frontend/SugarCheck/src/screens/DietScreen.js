import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../config/colors";
import DietTabNavigator from "../navigation/DietTabNavigator";

const Diet = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeAreaView}>
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

      <DietTabNavigator />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
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
});

export default Diet;
