import React, { useLayoutEffect } from "react";
import { View, StyleSheet } from "react-native";
import { setHeaderOptions } from "../components/HeaderOptions";

const Diet = ({ navigation }) => {
  useLayoutEffect(() => {
    setHeaderOptions(navigation);
  }, [navigation]);

  return <View style={styles.container}>{/* Your code here */}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
});

export default Diet;
