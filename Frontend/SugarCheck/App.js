import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useFonts } from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import colors from "./config/colors";
import fonts from "./config/fonts";
import SplashScreen from "./src/screens/SplashScreen";
import { RootStackNavigator } from "./src/navigation/AppNavigator";
import { Provider } from "react-redux";
import { store, persistor } from "./src/store/store";
import { PersistGate } from "redux-persist/integration/react";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { LogBox } from "react-native";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    LogBox.ignoreLogs([
      "Sending `onAnimatedValueUpdate` with no listeners registered.",
    ]);
  }, []);

  let [fontsLoaded] = useFonts(fonts);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ActionSheetProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <NavigationContainer>
            {isLoading ? (
              <SplashScreen onDone={() => setIsLoading(false)} />
            ) : (
              <RootStackNavigator />
            )}
          </NavigationContainer>
        </PersistGate>
      </Provider>
    </ActionSheetProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  navbar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
});
