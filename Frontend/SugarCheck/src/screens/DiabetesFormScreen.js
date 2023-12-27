import React, { useState, useRef } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import FormItem from "../components/FormItem";
import colors from "../../config/colors";
import { ButtonSecondary, Heading, Subheading } from "../../config/styledText";
import Carousel from "react-native-reanimated-carousel";

const { width: viewportWidth } = Dimensions.get("window");

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);

  const formQuestions = [
    { field: "age", label: "Age", type: "input", keyboardType: "numeric" },
    {
      field: "gender",
      label: "Gender",
      type: "radio",
      options: ["Male", "Female"],
    },
    {
      field: "polyuria",
      label: "Polyuria",
      type: "radio",
      options: ["Yes", "No"],
    },
    {
      field: "polydipsia",
      label: "Polydipsia",
      type: "radio",
      options: ["Yes", "No"],
    },
    {
      field: "suddenWeightLoss",
      label: "Sudden Weight Loss",
      type: "radio",
      options: ["Yes", "No"],
    },
    {
      field: "weakness",
      label: "Weakness",
      type: "radio",
      options: ["Yes", "No"],
    },
    {
      field: "polyphagia",
      label: "Polyphagia",
      type: "radio",
      options: ["Yes", "No"],
    },
    {
      field: "genitalThrush",
      label: "Genital Thrush",
      type: "radio",
      options: ["Yes", "No"],
    },
    {
      field: "visualBlurring",
      label: "Visual Blurring",
      type: "radio",
      options: ["Yes", "No"],
    },
    {
      field: "itching",
      label: "Itching",
      type: "radio",
      options: ["Yes", "No"],
    },
    {
      field: "irritability",
      label: "Irritability",
      type: "radio",
      options: ["Yes", "No"],
    },
    {
      field: "delayedHealing",
      label: "Delayed Healing",
      type: "radio",
      options: ["Yes", "No"],
    },
    {
      field: "partialParesis",
      label: "Partial Paresis",
      type: "radio",
      options: ["Yes", "No"],
    },
    {
      field: "muscleStiffness",
      label: "Muscle Stiffness",
      type: "radio",
      options: ["Yes", "No"],
    },
    {
      field: "alopecia",
      label: "Alopecia",
      type: "radio",
      options: ["Yes", "No"],
    },
    {
      field: "obesity",
      label: "Obesity",
      type: "radio",
      options: ["Yes", "No"],
    },
  ];

  const formSteps = [
    {
      key: "step1",
      questions: formQuestions.slice(0, 3),
    },
    {
      key: "step2",
      questions: formQuestions.slice(3, 6),
    },
    {
      key: "step3",
      questions: formQuestions.slice(6, 9),
    },
    {
      key: "step4",
      questions: formQuestions.slice(9, 12),
    },
    {
      key: "step5",
      questions: formQuestions.slice(12, 16),
    },
  ];

  const isStepComplete = (stepIndex) => {
    const stepQuestions = formSteps[stepIndex].questions;

    return stepQuestions.every((question) => {
      const value = formData[question.field];
      return value !== null && value !== "";
    });
  };

  const handleRadioChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    console.log(formData);
  };

  const renderQuestion = (question) => {
    switch (question.type) {
      case "input":
        return (
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>{question.label}</Text>
            <TextInput
              style={styles.input}
              value={formData[question.field]}
              onChangeText={(text) =>
                setFormData({ ...formData, [question.field]: text })
              }
              placeholder={question.label}
              keyboardType={question.keyboardType}
            />
          </View>
        );
      case "radio":
        return (
          <FormItem
            label={question.label}
            selectedValue={formData[question.field]}
            onValueChange={(value) => handleRadioChange(question.field, value)}
            options={question.options.map((option) => ({
              label: option,
              value: option.toLowerCase(),
            }))}
          />
        );
      default:
        return null;
    }
  };

  const renderItem = ({ item, index }) => {
    const stepComplete = isStepComplete(index);
    return (
      <View style={styles.slide} key={`step-${item.key}`}>
        <View style={styles.card}>
          {item.questions.map((question, qIndex) => (
            <React.Fragment key={`question-${qIndex}`}>
              {renderQuestion(question)}
            </React.Fragment>
          ))}
        </View>
        <View style={styles.centerButtonView}>
          <TouchableOpacity
            style={[styles.button, !stepComplete && styles.buttonDisabled]}
            onPress={() => {
              if (index === formSteps.length - 1) {
                handleSubmit();
              } else {
                carouselRef.current?.scrollTo({
                  index: index + 1,
                  animated: true,
                });
              }
            }}
            disabled={!stepComplete}
          >
            <ButtonSecondary>
              {index === formSteps.length - 1 ? "Submit" : "Continue"}
            </ButtonSecondary>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Heading>Diabetes Prediction</Heading>
          <Subheading style={styles.subheaderText}>
            Please enter to the best of your knowledge to receive a prediction
          </Subheading>
        </View>

        <Carousel
          mode="horizontal-stack"
          modeConfig={{ snapDirection: "left" }}
          ref={carouselRef}
          data={formSteps}
          renderItem={renderItem}
          width={viewportWidth}
          height={400}
          loop={false}
          lockScrollWhileSnapping
          onSnapToItem={(index) => {
            if (isStepComplete(currentIndex)) {
              setCurrentIndex(index);
            } else if (index > currentIndex) {
              carouselRef.current?.scrollTo({
                index: currentIndex,
                animated: true,
              });
              Alert.alert("Please fill out all fields to continue");
            }
          }}
        />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 0.9,
    backgroundColor: colors.background,
    justifyContent: "center",
  },
  header: {
    padding: 30,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  subheaderText: {
    textAlign: "center",
    marginTop: 10,
  },
  inputContainer: {
    padding: 20,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    marginBottom: 25,
  },
  inputLabel: {
    // flex: 1,
    width: 110,
    fontFamily: "MontserratRegular",
    fontSize: 18,
    marginLeft: 10,
    marginRight: 10,
  },
  input: {
    fontFamily: "MontserratRegular",
    height: 35,
    borderColor: "gray",
    borderWidth: 1,
    padding: 10,
    flex: 1,
    // minWidth: 175,
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
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: colors.active,
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    width: "85%",
    height: "65%",
    alignSelf: "center",
  },
  questionContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
    marginTop: 5,
  },
  centerButtonView: {
    marginTop: 20,
    width: "85%",
  },
  button: {
    backgroundColor: colors.complementary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    backgroundColor: colors.inactive,
  },
});

export default DiabetesForm;
