import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";

const FormItem = ({ label, onValueChange, selectedValue, options }) => {
  return (
    <SafeAreaView style={styles.formItem}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.radioGroup}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={styles.radio}
            onPress={() => onValueChange(option.value)}
          >
            <View style={styles.outerCircle}>
              {selectedValue === option.value && (
                <View style={styles.innerCircle} />
              )}
            </View>
            <Text style={styles.radioText}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const DiabetesForm = () => {
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    polyuria: "",
    // ...other fields
  });

  const handleRadioChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Diabetes Prediction</Text>
        <Text style={styles.subheaderText}>
          Please Enter To Your Best Of Knowledge To Receive A Prediction
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Age</Text>
        <TextInput
          style={styles.input}
          value={formData.age}
          onChangeText={(text) => setFormData({ ...formData, age: text })}
          placeholder="Enter Age"
          keyboardType="numeric"
        />
      </View>

      {/* Use FormItem for Yes/No questions */}
      <FormItem
        label="Polyuria"
        selectedValue={formData.polyuria}
        onValueChange={(value) => handleRadioChange("polyuria", value)}
        options={[
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
        ]}
      />

      {/* Repeat FormItem for each yes/no question */}

      {/* Submit Button */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  header: {
    padding: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "600",
  },
  subheaderText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 8,
  },
  inputContainer: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    color: "#000",
    marginBottom: 10,
  },
  input: {
    fontSize: 16,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 4,
    marginBottom: 20,
  },
  formItem: {
    padding: 20,
  },
  radioGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  radio: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  outerCircle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  innerCircle: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: "#000",
  },
  radioText: {
    fontSize: 16,
    marginLeft: 8,
  },
  button: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 4,
    alignItems: "center",
    margin: 20,
  },
  buttonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
});

export default DiabetesForm;
