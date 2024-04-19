import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet, Dimensions } from "react-native";
import colors from "../../config/colors";

const SplashScreen = ({ onDone }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const text = "SugarCheck".split("");

  const animation = text.map(() => useRef(new Animated.Value(0)).current);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      {
        iterations: 3,
      }
    ).start();

    Animated.sequence([
      Animated.delay(800),
      Animated.stagger(
        100,
        animation.map((anim) =>
          Animated.timing(anim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          })
        )
      ),
    ]).start(() => {
      onDone && onDone();
    });
  }, [scaleAnim, animation]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require("../../assets/icons/AppIcon.png")}
        style={{
          ...styles.image,
          transform: [
            {
              scale: scaleAnim,
            },
          ],
        }}
      />
      <View style={styles.textContainer}>
        {text.map((letter, index) => (
          <Animated.Text
            key={index}
            style={{
              ...styles.text,
              opacity: animation[index],
            }}
          >
            {letter}
          </Animated.Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.darkBlue,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
  },
  textContainer: {
    flexDirection: "row",
  },
  text: {
    fontSize: 30,
    fontFamily: "MontserratBold",
    color: colors.background,
  },
});

export default SplashScreen;
