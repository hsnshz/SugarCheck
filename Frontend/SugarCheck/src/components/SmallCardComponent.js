import React from "react";
import { Text, StyleSheet, TouchableOpacity, View } from "react-native";
import { Card } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import colors from "../../config/colors";

const SmallCardComponent = ({ title, text, navigateTo }) => {
  const navigation = useNavigation();

  return (
    <Card containerStyle={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate(navigateTo)}
        activeOpacity={0.8}
      >
        <Text style={styles.titleText}>{title}</Text>
        <Text style={styles.textContainer}>{text}</Text>
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 15,
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: { width: 3, height: 5 },
    elevation: 5,
  },
  titleText: {
    fontFamily: "MontserratBold",
    fontSize: 20,
    marginBottom: 5,
  },
  textContainer: {
    fontFamily: "MontserratRegular",
    fontSize: 18,
    marginTop: 10,
  },
});

export default SmallCardComponent;
