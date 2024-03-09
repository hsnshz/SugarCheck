import React from "react";
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
import Icon from "react-native-vector-icons/AntDesign";

const RecipeGridComponent = ({ title, image, navigateTo }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate(navigateTo.routeName, navigateTo.params)
      }
      activeOpacity={0.8}
    >
      <Card containerStyle={styles.container}>
        <Card.Image source={image} style={styles.image} resizeMode="cover" />
        <Card.Title style={styles.titleText}>{title}</Card.Title>

        <View style={styles.btn}>
          <Icon name="right" style={styles.btnIcon} />
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 10,
    marginLeft: 10,
    marginRight: 10,
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: { width: 3, height: 5 },
    elevation: 5,
    padding: 0,
    marginBottom: 20,
    width: Dimensions.get("window").width / 2 - 20,
  },
  image: {
    height: 120,
    width: "100%",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  titleText: {
    fontFamily: "MontserratBold",
    fontSize: 16,
    margin: 10,
    marginTop: 15,
    height: 60,
  },
  btn: {
    backgroundColor: colors.darkBlue,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    padding: 10,
  },
  btnIcon: {
    color: colors.white,
    textAlign: "center",
    fontSize: 20,
  },
});

export default RecipeGridComponent;
