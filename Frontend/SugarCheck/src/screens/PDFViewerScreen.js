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
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";

const PdfViewerScreen = ({ navigation, route }) => {
  const { file } = route.params;

  const sharePdf = async () => {
    try {
      if (!(await Sharing.isAvailableAsync())) {
        alert("Sharing is not available on your platform");
        return;
      }

      const currentDate = new Date()
        .toLocaleDateString("en-GB")
        .replace(/\//g, "-");

      // Download the file to a temporary directory
      const { uri: localUri } = await FileSystem.downloadAsync(
        file,
        FileSystem.documentDirectory + `SugarCheck-Report-${currentDate}.pdf`
      );

      await Sharing.shareAsync(localUri);
    } catch (error) {
      console.log("Error sharing file: ", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="left" size={35} color={colors.darkBlue} />
        </TouchableOpacity>
        <Image
          source={require("../../assets/icons/DarkAppIcon.png")}
          style={styles.logo}
        />
        <View style={{ width: 35 }} />
      </View>

      <WebView
        originWhitelist={["*"]}
        source={{ uri: file }}
        style={{ flex: 1 }}
      />

      <TouchableOpacity style={styles.shareButton} onPress={sharePdf}>
        <Icon name="sharealt" size={30} color={colors.white} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: colors.background,
  },
  logo: {
    width: 50,
    height: 50,
  },
  shareButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: colors.complementary,
    padding: 10,
    borderRadius: 10,
  },
});

export default PdfViewerScreen;
