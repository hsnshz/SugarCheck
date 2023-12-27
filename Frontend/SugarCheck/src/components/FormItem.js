import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const FormItem = ({ label, onValueChange, selectedValue, options }) => {
  return (
    <View style={styles.formItem}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.radioGroup}>
        {options.map((option) => (
          <View key={option.value} style={styles.radioOptionContainer}>
            <TouchableOpacity
              style={styles.radio}
              onPress={() => onValueChange(option.value)}
            >
              <View style={styles.outerCircle}>
                {selectedValue === option.value && (
                  <View style={styles.innerCircle} />
                )}
              </View>
            </TouchableOpacity>
            <Text style={styles.radioText}>{option.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  formItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 20,
    width: "100%",
  },
  label: {
    width: 110,
    fontFamily: "MontserratRegular",
    fontSize: 18,
    marginRight: 10,
    marginLeft: 10,
  },
  radioGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioOptionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
    minWidth: 75,
  },
  outerCircle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "black",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 5,
  },
  innerCircle: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: "black",
  },
  radioText: {
    fontFamily: "MontserratRegular",
    fontSize: 16,
  },
});

export default FormItem;
