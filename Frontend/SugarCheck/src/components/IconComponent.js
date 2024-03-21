import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import colors from "../../config/colors";

const IconComponent = ({ iconName, color, navigateTo }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.btnIcon}>
        <TouchableOpacity
          onPress={() => navigation.navigate(navigateTo)}
          activeOpacity={0.8}
        >
          <Icon name={iconName} size={26} color={color} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  btnIcon: {
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
    borderColor: colors.complementary,
    borderWidth: 1,
    backgroundColor: colors.complementary,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default IconComponent;
