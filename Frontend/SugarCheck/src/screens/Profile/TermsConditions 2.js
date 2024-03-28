import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
} from "react-native";
import colors from "../../../config/colors";
import Toast from "react-native-fast-toast";
import * as Haptics from "expo-haptics";
import Icon from "react-native-vector-icons/AntDesign";
import { TermsAndConditions } from "../../components/TermsAndConditions";

const TermsConditions = ({ navigation }) => {
  const toastRef = useRef();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="left" size={30} color={colors.darkBlue} />
          </TouchableOpacity>
          <Image
            source={require("../../../assets/icons/DarkAppIcon.png")}
            style={styles.logo}
          />
          <View style={{ width: 35 }} />
        </View>

        <View style={styles.contentContainer}>
          <TermsAndConditions />
        </View>

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
    backgroundColor: colors.background,
    padding: 20,
  },
  logo: {
    width: 50,
    height: 50,
  },
  contentContainer: {
    backgroundColor: colors.white,
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
  },
});

export default TermsConditions;
