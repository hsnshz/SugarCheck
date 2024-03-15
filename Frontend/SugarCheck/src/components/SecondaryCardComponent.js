import React, { useState } from "react";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  View,
} from "react-native";
import { Card, Button } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import colors from "../../config/colors";

const screenWidth = Dimensions.get("window").width;

const SecondaryCardComponent = ({ title, text, image, navigateTo }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate(navigateTo)}
      activeOpacity={0.8}
    >
      <Card containerStyle={styles.container}>
        {image && <Card.Image source={image} style={styles.image} />}
        <View style={styles.titleView}>
          <Card.Title style={styles.titleText}>{title}</Card.Title>
        </View>
        <Card.Divider width={1} />
        <Text style={styles.textContainer}>{text}</Text>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 250,
    width: screenWidth / 2 - 20,
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 15,
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: { width: 3, height: 5 },
    elevation: 5,
    justifyContent: "space-between",
  },
  image: {
    width: "100%",
    height: 100,
    alignSelf: "center",
  },
  titleView: {
    height: 65,
    justifyContent: "center",
  },
  titleText: {
    fontFamily: "MontserratBold",
    fontSize: 18,
  },
  textContainer: {
    fontFamily: "MontserratRegular",
    fontSize: 16,
    marginTop: 5,
    textAlign: "center",
  },
});

export default SecondaryCardComponent;
