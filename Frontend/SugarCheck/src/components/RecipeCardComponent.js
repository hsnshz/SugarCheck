import React from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";
import { Card, Button } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import colors from "../../config/colors";
import Icon from "react-native-vector-icons/AntDesign";

const RecipeCardComponent = ({ title, text, image, btnText, navigateTo }) => {
  const navigation = useNavigation();

  return (
    <Card containerStyle={styles.container}>
      {image && (
        <Card.Image source={image} style={styles.image} resizeMode="cover" />
      )}
      <Card.Title style={styles.titleText}>{title}</Card.Title>
      <Card.Divider width={0} />
      <Text style={styles.textContainer}>{text}</Text>
      <TouchableOpacity
        style={styles.btn}
        onPress={() =>
          navigation.navigate(navigateTo.routeName, navigateTo.params)
        }
      >
        <Text style={styles.btnText}>{btnText}</Text>
        <Icon name="right" style={styles.btnIcon} />
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 10,
    marginHorizontal: 15,
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: { width: 3, height: 5 },
    elevation: 5,
    padding: 0,
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: 170,
    alignSelf: "center",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  titleText: {
    fontFamily: "MontserratBold",
    fontSize: 20,
    marginTop: 10,
  },
  textContainer: {
    fontFamily: "MontserratRegular",
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  btn: {
    backgroundColor: colors.darkBlue,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    padding: 12,
    width: "100%",
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  btnText: {
    color: colors.white,
    textAlign: "center",
    fontFamily: "MontserratRegular",
    fontSize: 18,
  },
  btnIcon: {
    color: colors.white,
    textAlign: "center",
    fontFamily: "MontserratRegular",
    fontSize: 20,
    marginLeft: 10,
  },
});

export default RecipeCardComponent;
