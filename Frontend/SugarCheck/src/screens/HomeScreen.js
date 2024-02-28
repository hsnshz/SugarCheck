import React, { useLayoutEffect } from "react";
import { Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { setHeaderOptions } from "../components/HeaderOptions";
import colors from "../../config/colors";
import { useSelector } from "react-redux";

const Home = ({ navigation }) => {
  useLayoutEffect(() => {
    setHeaderOptions(navigation);
  }, [navigation]);

  const user = useSelector((state) => state.user);

  // If user is undefined, render a loading message
  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  // If user is defined, render the welcome message
  return (
    <SafeAreaView style={styles.container}>
      <Text>Welcome {user.firstName}</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
});

export default Home;
