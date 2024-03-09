import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
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
import axios from "axios";
import { getConstants, getNgrokUrl } from "../../config/constants";
import { setHeaderOptions } from "../components/HeaderOptions";
import { useSelector } from "react-redux";
import { updateHealthProfile } from "../store/store";
import { useDispatch } from "react-redux";

const { width: viewportWidth } = Dimensions.get("window");

const DiabetesForm = ({ navigation }) => {
  useLayoutEffect(() => {
    setHeaderOptions(navigation);
  }, [navigation]);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);

  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    polyuria: "",
    polydipsia: "",
    "sudden weight loss": "",
    weakness: "",
    polyphagia: "",
    "genital thrush": "",
    "visual blurring": "",
    itching: "",
    irritability: "",
    "delayed healing": "",
    "partial paresis": "",
    "muscle stiffness": "",
    alopecia: "",
    obesity: "",
  });

  useEffect(() => {
    if (user) {
      const dob = new Date(user.dob);
      const currentYear = new Date().getFullYear();
      const birthYear = dob.getFullYear();
      let age = currentYear - birthYear;
      const gender = user.gender;

      if (
        new Date().getMonth() < dob.getMonth() ||
        (new Date().getMonth() === dob.getMonth() &&
          new Date().getDate() < dob.getDate())
      ) {
        age--;
      }

      const updatedFormData = {
        ...formData,
        age,
        gender,
      };

      setFormData(updatedFormData);
    }
  }, [user]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);

  const formQuestions = [
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
      field: "sudden weight loss",
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
      field: "genital thrush",
      label: "Genital Thrush",
      type: "radio",
      options: ["Yes", "No"],
    },
    {
      field: "visual blurring",
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
      field: "delayed healing",
      label: "Delayed Healing",
      type: "radio",
      options: ["Yes", "No"],
    },
    {
      field: "partial paresis",
      label: "Partial Paresis",
      type: "radio",
      options: ["Yes", "No"],
    },
    {
      field: "muscle stiffness",
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
      questions: formQuestions.slice(12, 14),
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
    axios
      .post(`${getNgrokUrl()}/api/pred/diabetes/${user._id}`, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          // Update the user data in the Redux store
          dispatch(
            updateHealthProfile({
              riskFactors: response.data.formattedFormData,
              riskAssessment: {
                predictionResult:
                  response.data[0] === 1 ? "likely" : "unlikely",
                date: new Date(),
              },
            })
          );
        }
        Alert.alert(
          "Prediction",
          `You are ${response.data.predictionResult} to have diabetes.`
        );
      })
      .catch((error) => {
        console.error("Error:", error);
      });
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
        // onSnapToItem={(index) => {
        //   if (isStepComplete(currentIndex)) {
        //     setCurrentIndex(index);
        //   } else if (index > currentIndex) {
        //     carouselRef.current?.scrollTo({
        //       index: currentIndex,
        //       animated: true,
        //     });
        //     Alert.alert("Please fill out all fields to continue");
        //   }
        // }}
      />
    </SafeAreaView>
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
