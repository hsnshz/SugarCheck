import React from "react";
import { Button, Platform, StyleSheet, View, Image, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";

const HeaderBackButton = () => {
  const navigation = useNavigation();

  const handlePress = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.backButton}>
      <Button title="Back" onPress={handlePress} />
    </View>
  );
};

const styles = StyleSheet.create({
  backButton: {
    padding: 5,
    paddingLeft: Platform.OS === "android" ? 15 : 10,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
});

export default HeaderBackButton;
