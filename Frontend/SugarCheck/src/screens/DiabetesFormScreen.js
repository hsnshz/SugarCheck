import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
  ScrollView,
  Animated,
  RefreshControl,
} from "react-native";
import FormItem from "../components/FormItem";
import colors from "../../config/colors";
import { ButtonSecondary, Heading, Subheading } from "../../config/styledText";
import Carousel from "react-native-reanimated-carousel";
import axios from "axios";
import { getConstants, getNgrokUrl } from "../../config/constants";
import { setHeaderOptions } from "../components/HeaderOptions";
import { useSelector } from "react-redux";
import { updateHealthProfile } from "../store/slices/userSlice";
import { useDispatch } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/AntDesign";
import * as Haptics from "expo-haptics";
import CardComponent from "../components/CardComponent";

const { width: viewportWidth } = Dimensions.get("window");

const DiabetesForm = ({ navigation }) => {
  useLayoutEffect(() => {
    setHeaderOptions(navigation);
  }, [navigation]);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user) || {};
  const token = useSelector((state) => state.auth.token) || "";

  const [predictionResult, setPredictionResult] = useState("");
  const recommendations = [
    "Schedule an appointment with your healthcare provider for a professional evaluation and diagnosis",
    "Maintain a healthy diet and exercise regularly",
    "Monitor your blood sugar levels regularly",
    "Stay informed about diabetes and its management",
  ];
  const [showInformation, setShowInformation] = useState(false);
  const [selectedInfoLabel, setSelectedInfoLabel] = useState("");

  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);
  const scrollViewRef = useRef(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const onRefresh = () => {
    setPredictionResult("");
    setFormData({
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

    carouselRef.current?.scrollTo({
      index: 0,
      animated: true,
    });
  };

  const isProfileComplete = (user) => {
    return (
      user &&
      user.firstName &&
      user.lastName &&
      user.email &&
      user.healthProfile &&
      user.healthProfile.height &&
      user.healthProfile.weight
    );
  };

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

  const formQuestions = [
    {
      field: "polyuria",
      label: "Polyuria",
      type: "radio",
      options: ["Yes", "No"],
      information:
        "Polyuria is excessive urination. It is a common symptom of diabetes and can be caused by high blood sugar levels.",
    },
    {
      field: "polydipsia",
      label: "Polydipsia",
      type: "radio",
      options: ["Yes", "No"],
      information:
        "Polydipsia is excessive thirst. It is caused by dehydration from frequent urination and is a common symptom of diabetes.",
    },
    {
      field: "sudden weight loss",
      label: "Sudden Weight Loss",
      type: "radio",
      options: ["Yes", "No"],
      information:
        "Sudden weight loss can be a sign of diabetes. It results from the body's inability to use glucose for energy and starts burning fat and muscle for fuel.",
    },
    {
      field: "weakness",
      label: "Weakness",
      type: "radio",
      options: ["Yes", "No"],
      information:
        "Weakness means lack of physical or muscle strength. It can be a symptom of diabetes.",
    },
    {
      field: "polyphagia",
      label: "Polyphagia",
      type: "radio",
      options: ["Yes", "No"],
      information:
        "Polyphagia is excessive hunger. It is a common symptom of diabetes and is caused by the body's inability to use glucose for energy.",
    },
    {
      field: "genital thrush",
      label: "Genital Thrush",
      type: "radio",
      options: ["Yes", "No"],
      information:
        "Genital thrush is a yeast infection that can cause itching and discomfort. It is a common symptom of diabetes.",
    },
    {
      field: "visual blurring",
      label: "Visual Blurring",
      type: "radio",
      options: ["Yes", "No"],
      information:
        "Visual blurring is a common symptom of diabetes. It can be caused by high blood sugar levels that affect the eye's lens.",
    },
    {
      field: "itching",
      label: "Itching",
      type: "radio",
      options: ["Yes", "No"],
      information:
        "Itching can be a symptom of diabetes. It can be caused by high blood sugar levels that affect the skin and nerves.",
    },
    {
      field: "irritability",
      label: "Irritability",
      type: "radio",
      options: ["Yes", "No"],
      information:
        "Irritability means being easily annoyed or agitated. It can be caused by high blood sugar levels that affect the brain and mood.",
    },
    {
      field: "delayed healing",
      label: "Delayed Healing",
      type: "radio",
      options: ["Yes", "No"],
      information:
        "Delayed healing can be a sign of diabetes. High blood sugar levels can affect the body's ability to repair and heal wounds.",
    },
    {
      field: "partial paresis",
      label: "Partial Paresis",
      type: "radio",
      options: ["Yes", "No"],
      information:
        "Partial paresis is a weakness or partial loss of movement in the body. It can be caused by nerve damage from high blood sugar levels and can be a sign of diabetes.",
    },
    {
      field: "muscle stiffness",
      label: "Muscle Stiffness",
      type: "radio",
      options: ["Yes", "No"],
      information:
        "Muscle stiffness can be a symptom of diabetes. High blood sugar levels can affect the muscles and nerves, causing stiffness and pain.",
    },
    {
      field: "alopecia",
      label: "Alopecia",
      type: "radio",
      options: ["Yes", "No"],
      information:
        "Alopecia is hair loss or baldness. It can be a sign of diabetes and can be caused by high blood sugar levels that affect the hair follicles.",
    },
    {
      field: "obesity",
      label: "Obesity",
      type: "radio",
      options: ["Yes", "No"],
      information:
        "Obesity is a risk factor for diabetes. Excess body weight can increase the risk of developing diabetes and other health conditions.",
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

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      setShowInformation(false);
    }, 300);
  };

  const renderQuestion = (question) => {
    return (
      <FormItem
        label={question.label}
        selectedValue={formData[question.field]}
        onValueChange={(value) => handleRadioChange(question.field, value)}
        options={question.options.map((option) => ({
          label: option,
          value: option.toLowerCase(),
        }))}
        displayInformation={() => {
          setShowInformation(true);
          fadeIn();
        }}
        setSelectedInfoLabel={setSelectedInfoLabel}
      />
    );
  };

  const renderItem = ({ item, index }) => {
    const stepComplete = isStepComplete(index);

    return (
      <View style={styles.slide} key={`step-${item.key}`}>
        <View style={styles.card}>
          <Text style={styles.infoCardText}>
            Please press the symptom for more information
          </Text>

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

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        setPredictionResult(response.data.predictionResult);
        setFormData({
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
        setIsSubmitted(true);
        scrollViewRef.current?.scrollToEnd({ animated: true });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 150 }}
        refreshControl={<RefreshControl onRefresh={onRefresh} />}
        ref={scrollViewRef}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Ionicons name="ios-menu" size={35} color={colors.darkBlue} />
          </TouchableOpacity>
          <Image
            source={require("../../assets/icons/DarkAppIcon.png")}
            style={styles.logo}
          />
          <View style={{ width: 35 }} />
        </View>

        <View style={styles.heading}>
          <Heading>Diabetes Prediction</Heading>
          <Subheading style={styles.subheaderText}>
            Please enter to the best of your knowledge to receive a prediction
            from our AI model
          </Subheading>
        </View>

        {!isProfileComplete(user) ? (
          <View style={styles.profileCardContainer}>
            <CardComponent
              title="Get the full experience!"
              text="It looks like your profile is incomplete. To use the diabetes prediction feature, please complete your health profile first."
              btnText="Complete Profile"
              navigateTo="HealthProfileScreen"
            />
          </View>
        ) : (
          <>
            {isSubmitted ? null : (
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
                    Haptics.notificationAsync(
                      Haptics.NotificationFeedbackType.Error
                    );
                  }
                }}
              />
            )}

            {showInformation &&
              formQuestions.map((question) =>
                question.label === selectedInfoLabel ? (
                  <TouchableWithoutFeedback
                    key={question.label}
                    onPress={() => {
                      fadeOut();
                    }}
                  >
                    <Animated.View
                      pointerEvents={showInformation ? "auto" : "none"}
                      style={[styles.overlay, { opacity: fadeAnim }]}
                    >
                      <View style={styles.informationBox}>
                        <Icon
                          name="close"
                          size={22}
                          color={colors.complementary}
                          style={{ alignSelf: "flex-end", marginBottom: 10 }}
                        />
                        <Text style={styles.informationText}>
                          {question.information}
                        </Text>
                      </View>
                    </Animated.View>
                  </TouchableWithoutFeedback>
                ) : null
              )}

            {predictionResult && (
              <>
                {predictionResult === "likely" ? (
                  <View style={styles.predictionView}>
                    <Icon
                      name="exclamationcircleo"
                      size={35}
                      color={colors.danger}
                      style={styles.icon}
                    />
                    <Heading>Prediction Result</Heading>
                    <Text style={styles.detailText}>
                      Based on the information provided, you are{" "}
                      <Text style={{ fontWeight: "bold" }}>likely</Text> to have
                      diabetes
                    </Text>
                    <Text style={styles.detailText}>
                      Disclaimer: This prediction is not a substitute for a
                      professional medical diagnosis. Please consult with your
                      healthcare provider for further evaluation.
                    </Text>
                  </View>
                ) : (
                  <View style={styles.predictionView}>
                    <Icon
                      name="checkcircleo"
                      size={35}
                      color={colors.green}
                      style={styles.icon}
                    />
                    <Heading>Prediction Result</Heading>
                    <Text style={styles.detailText}>
                      Based on the information provided, you are{" "}
                      <Text style={{ fontWeight: "bold" }}>unlikely</Text> to
                      have diabetes
                    </Text>
                    <Text style={styles.detailText}>
                      Disclaimer: This prediction is not a substitute for a
                      professional medical diagnosis. Please consult with your
                      healthcare provider for further evaluation.
                    </Text>
                  </View>
                )}

                <View style={[styles.predictionView, { marginTop: 30 }]}>
                  <Heading>Next Steps</Heading>
                  <View style={styles.listView}>
                    {recommendations.map((recommendation, index) => (
                      <View
                        style={styles.listContainer}
                        key={`recommendation-${index}`}
                      >
                        <Text style={[styles.listText, { paddingRight: 15 }]}>
                          {index + 1}.
                        </Text>
                        <Text style={styles.listText}>{recommendation}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  heading: {
    padding: 30,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
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
    borderRadius: 15,
    marginRight: 10,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    width: "85%",
    height: "65%",
    alignSelf: "center",
  },
  infoCardText: {
    fontFamily: "MontserratRegular",
    textAlign: "center",
    fontSize: 16,
    marginVertical: 10,
    padding: 10,
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
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    backgroundColor: colors.inactive,
  },
  predictionView: {
    marginTop: 10,
    padding: 20,
    paddingVertical: 40,
    marginHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: colors.white,
  },
  icon: {
    marginBottom: 20,
  },
  detailText: {
    textAlign: "center",
    marginTop: 10,
    fontFamily: "MontserratRegular",
    fontSize: 18,
  },
  listView: {
    marginTop: 20,
    width: "95%",
    paddingRight: 20,
  },
  listContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 10,
  },
  listText: {
    fontFamily: "MontserratRegular",
    fontSize: 18,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingTop: 300,
    alignItems: "center",
    zIndex: 10,
  },
  informationBox: {
    backgroundColor: colors.white,
    padding: 20,
    paddingBottom: 40,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  informationText: {
    fontFamily: "MontserratRegular",
    fontSize: 18,
  },
});

export default DiabetesForm;
