import React from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";
import { Card, Button } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import colors from "../../config/colors";

const CardComponent = ({ title, text, image, btnText, navigateTo }) => {
  const navigation = useNavigation();

  return (
    <Card containerStyle={styles.container}>
      {image && <Card.Image source={image} style={styles.image} />}
      <Card.Title style={styles.titleText}>{title}</Card.Title>
      <Card.Divider width={1} />
      <Text style={styles.textContainer}>{text}</Text>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate(navigateTo)}
      >
        <Text style={styles.btnText}>{btnText}</Text>
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 25,
    marginHorizontal: 15,
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: { width: 3, height: 5 },
    elevation: 5,
  },
  image: {
    width: "100%",
    height: 100,
    alignSelf: "center",
  },
  titleText: {
    fontFamily: "MontserratBold",
    fontSize: 20,
  },
  textContainer: {
    fontFamily: "MontserratRegular",
    fontSize: 18,
    marginBottom: 30,
    marginTop: 10,
    textAlign: "center",
  },
  btn: {
    backgroundColor: colors.complementary,
    borderRadius: 5,
    padding: 12,
  },
  btnText: {
    color: colors.white,
    textAlign: "center",
    fontFamily: "MontserratRegular",
    fontSize: 18,
  },
});

export default CardComponent;
