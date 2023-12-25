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
import FormItem from "../components/FormItem";
import colors from "../../config/colors";
import { ButtonSecondary, Heading, Subheading } from "../../config/styledText";

const DiabetesForm = () => {
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    polyuria: "",
    polydipsia: "",
    suddenWeightLoss: "",
    weakness: "",
    polyphagia: "",
    genitalThrush: "",
    visualBlurring: "",
    itching: "",
    irritability: "",
    delayedHealing: "",
    partialParesis: "",
    muscleStiffness: "",
    alopecia: "",
    obesity: "",
  });

  const handleRadioChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    console.log(formData);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <View style={styles.header}>
          <Heading style={styles.headerText}>Diabetes Prediction</Heading>
          <Subheading style={styles.subheaderText}>
            Please Enter To Your Best Of Knowledge To Receive A Prediction
          </Subheading>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={formData.age}
            onChangeText={(text) => setFormData({ ...formData, age: text })}
            placeholder="Enter Age"
            keyboardType="numeric"
          />
        </View>

        <FormItem
          label="Gender"
          selectedValue={formData.gender}
          onValueChange={(value) => handleRadioChange("gender", value)}
          options={[
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
          ]}
        />

        <FormItem
          label="Polyuria"
          selectedValue={formData.polyuria}
          onValueChange={(value) => handleRadioChange("polyuria", value)}
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
        />

        <FormItem
          label="Polydipsia"
          selectedValue={formData.polydipsia}
          onValueChange={(value) => handleRadioChange("polydipsia", value)}
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
        />

        <FormItem
          label="Sudden Weight Loss"
          selectedValue={formData.suddenWeightLoss}
          onValueChange={(value) =>
            handleRadioChange("suddenWeightLoss", value)
          }
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
        />

        <FormItem
          label="Weakness"
          selectedValue={formData.weakness}
          onValueChange={(value) => handleRadioChange("weakness", value)}
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
        />

        <FormItem
          label="Polyphagia"
          selectedValue={formData.polyphagia}
          onValueChange={(value) => handleRadioChange("polyphagia", value)}
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
        />

        <FormItem
          label="Genital Thrush"
          selectedValue={formData.genitalThrush}
          onValueChange={(value) => handleRadioChange("genitalThrush", value)}
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
        />

        <FormItem
          label="Visual Blurring"
          selectedValue={formData.visualBlurring}
          onValueChange={(value) => handleRadioChange("visualBlurring", value)}
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
        />

        <FormItem
          label="Itching"
          selectedValue={formData.itching}
          onValueChange={(value) => handleRadioChange("itching", value)}
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
        />

        <FormItem
          label="Irritability"
          selectedValue={formData.irritability}
          onValueChange={(value) => handleRadioChange("irritability", value)}
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
        />

        <FormItem
          label="Delayed Healing"
          selectedValue={formData.delayedHealing}
          onValueChange={(value) => handleRadioChange("delayedHealing", value)}
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
        />

        <FormItem
          label="Partial Paresis"
          selectedValue={formData.partialParesis}
          onValueChange={(value) => handleRadioChange("partialParesis", value)}
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
        />

        <FormItem
          label="Muscle Stiffness"
          selectedValue={formData.muscleStiffness}
          onValueChange={(value) => handleRadioChange("muscleStiffness", value)}
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
        />

        <FormItem
          label="Alopecia"
          selectedValue={formData.alopecia}
          onValueChange={(value) => handleRadioChange("alopecia", value)}
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
        />

        <FormItem
          label="Obesity"
          selectedValue={formData.obesity}
          onValueChange={(value) => handleRadioChange("obesity", value)}
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
        />
        <View style={styles.centerButtonView}>
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <ButtonSecondary>Submit</ButtonSecondary>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
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
  input: {
    fontFamily: "MontserratRegular",
    width: "85%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    alignSelf: "center",
  },
  button: {
    backgroundColor: colors.complementary,
    padding: 10,
    borderRadius: 5,
    width: "40%",
    alignItems: "center",
    margin: 20,
  },
  centerButtonView: {
    alignItems: "center",
  },
});

export default DiabetesForm;
