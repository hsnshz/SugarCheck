import React from "react";
import { Text } from "react-native";
import colors from "../config/colors";

export function Heading({ style, ...props }) {
  return <Text style={[styles.heading, style]} {...props} />;
}

export function Subheading({ style, ...props }) {
  return <Text style={[styles.subheading, style]} {...props} />;
}

export function Paragraph({ style, ...props }) {
  return <Text style={[styles.paragraph, style]} {...props} />;
}

export function ButtonPrimary({ style, ...props }) {
  return <Text style={[styles.buttonPrimary, style]} {...props} />;
}

export function ButtonSecondary({ style, ...props }) {
  return <Text style={[styles.buttonSecondary, style]} {...props} />;
}

const styles = {
  heading: {
    fontFamily: "MontserratBold",
    fontSize: 22,
    color: colors.primary,
  },
  subheading: {
    fontFamily: "MontserratRegular",
    fontSize: 18,
    color: colors.primary,
  },
  paragraph: {
    fontFamily: "MontserratRegular",
    fontSize: 14,
    color: colors.secondary,
  },
  buttonPrimary: {
    fontFamily: "MontserratRegular",
    fontSize: 18,
    color: colors.complementary,
  },
  buttonSecondary: {
    fontFamily: "MontserratRegular",
    fontSize: 18,
    color: colors.white,
  },
};
