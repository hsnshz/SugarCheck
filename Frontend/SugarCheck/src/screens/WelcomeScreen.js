import React from "react";
import { useState, useRef, useCallback } from "react";
import {
  View,
  Button,
  Image,
  StyleSheet,
  Animated,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import colors from "../../config/colors";
import {
  ButtonPrimary,
  ButtonSecondary,
  Heading,
} from "../../config/styledText";
import { useFocusEffect } from "@react-navigation/native";

const WelcomeScreen = ({ navigation }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  fadeAnim.addListener(() => {
    return;
  });

  const toggleModal = () => {
    if (isModalVisible) {
      setTimeout(() => setModalVisible(false), 100);
      fadeOut();
    } else {
      setModalVisible(true);
      fadeIn();
    }
  };

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 0.5,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  useFocusEffect(
    useCallback(() => {
      fadeAnim.setValue(0);
      return () => fadeAnim.stopAnimation();
    }, [])
  );

  return (
    <>
      <View style={styles.container}>
        <Image
          source={require("../../assets/icons/AppIcon.png")}
          resizeMode="contain"
          style={styles.logo}
        />
        <Heading style={styles.title}>Welcome to SugarCheck</Heading>

        <Button title="Get Started" onPress={toggleModal} />
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={toggleModal}
        >
          <TouchableWithoutFeedback onPress={toggleModal}>
            <View style={styles.centeredView}>
              <View style={styles.modalContent}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    setModalVisible(false);
                    navigation.navigate("SignIn");
                  }}
                >
                  <ButtonPrimary>Sign In</ButtonPrimary>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.createAccountButton}
                  onPress={() => {
                    setModalVisible(false);
                    navigation.navigate("SignUp");
                  }}
                >
                  <ButtonSecondary style={styles.signupTxt}>
                    Create an account
                  </ButtonSecondary>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
      <Animated.View
        pointerEvents={isModalVisible ? "auto" : "none"}
        style={[
          styles.overlay,
          { opacity: fadeAnim }, // Bind opacity to animated value
        ]}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    marginBottom: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalContent: {
    width: "100%",
    height: "25%",
    backgroundColor: colors.detail,
    padding: 35,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    backgroundColor: colors.active,
    padding: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    margin: 5,
  },
  createAccountButton: {
    backgroundColor: colors.complementary,
    padding: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    margin: 5,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 10,
  },
});

export default WelcomeScreen;
