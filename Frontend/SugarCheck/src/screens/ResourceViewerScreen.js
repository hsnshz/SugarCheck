import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Image,
  View,
  TouchableOpacity,
} from "react-native";
import { WebView } from "react-native-webview";
import colors from "../../config/colors";
import Icon from "react-native-vector-icons/AntDesign";

const ResourceViewerScreen = ({ navigation, route }) => {
  const { url } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="left" size={35} color={colors.white} />
        </TouchableOpacity>
        <Image
          source={require("../../assets/icons/AppIcon.png")}
          style={styles.logo}
        />
        <View style={{ width: 35 }} />
      </View>

      <WebView
        originWhitelist={["*"]}
        source={{ uri: url }}
        style={{ flex: 1 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkBlue,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: colors.darkBlue,
  },
  logo: {
    width: 70,
    height: 70,
  },
});

export default ResourceViewerScreen;
