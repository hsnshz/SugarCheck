import React, { useEffect, useRef } from "react";
import { View, Animated, TouchableOpacity, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import DietScreen from "../screens/DietScreen";
import ExerciseScreen from "../screens/ExerciseScreen";
import colors from "../../config/colors";
import * as Haptics from "expo-haptics";

const Tab = createBottomTabNavigator();

function MyTabBar({ state, descriptors, navigation }) {
  const dotOpacity = state.routes.map(
    (_, index) =>
      useRef(new Animated.Value(state.index === index ? 1 : 0)).current
  );
  const dotScale = state.routes.map(
    (_, index) =>
      useRef(new Animated.Value(state.index === index ? 1.2 : 1)).current
  );

  useEffect(() => {
    Animated.parallel(
      dotOpacity
        .map((opacity, index) =>
          Animated.timing(opacity, {
            toValue: state.index === index ? 1 : 0,
            duration: 200,
            useNativeDriver: true,
          })
        )
        .concat(
          dotScale.map((scale, index) =>
            Animated.sequence([
              Animated.spring(scale, {
                toValue: state.index === index ? 1.4 : 1,
                speed: 20,
                bounciness: 15,
                useNativeDriver: true,
              }),
              Animated.spring(scale, {
                toValue: 1,
                speed: 20,
                bounciness: 20,
                useNativeDriver: true,
              }),
            ])
          )
        )
    ).start();
  }, [state.index]);

  return (
    <View style={styles.tabBarView}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }

          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        };

        return (
          <View key={index}>
            <TouchableOpacity onPress={onPress} style={styles.icons}>
              <MaterialCommunityIcons
                name={options.tabBarIcon}
                size={32}
                color={isFocused ? colors.darkBlue : colors.gray}
              />
            </TouchableOpacity>
            <Animated.View
              style={[
                styles.dot,
                {
                  opacity: dotOpacity[index],
                  transform: [{ scale: dotScale[index] }],
                },
              ]}
            />
          </View>
        );
      })}
    </View>
  );
}

function Navbar() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBar={(props) => <MyTabBar {...props} />}
    >
      <Tab.Screen
        name="Diet"
        component={DietScreen}
        options={{
          headerShown: false,
          tabBarIcon: "food-apple",
        }}
      />
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: "home",
        }}
      />
      <Tab.Screen
        name="Exercise"
        component={ExerciseScreen}
        options={{
          headerShown: false,
          tabBarIcon: "weight-lifter",
          tabBarLabel: "Exercise",
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarView: {
    flexDirection: "row",
    justifyContent: "space-around",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 15,
    marginHorizontal: 20,
    marginBottom: 15,
    marginTop: 20,
    width: "90%",
    height: 65,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.8,
    elevation: 5,
  },
  icons: {
    marginBottom: 10,
  },
  dot: {
    position: "absolute",
    bottom: 0,
    left: "50%",
    marginLeft: -5,
    width: 10,
    height: 10,
    backgroundColor: colors.darkBlue,
    borderRadius: 5,
  },
});

export default Navbar;
