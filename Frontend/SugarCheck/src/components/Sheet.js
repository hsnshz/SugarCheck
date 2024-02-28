import React from "react";
import {
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
} from "react-native";
import colors from "../../config/colors";
import Icon from "react-native-vector-icons/AntDesign";
import { PanGestureHandler, State } from "react-native-gesture-handler";

const Sheet = ({ visible, children, onRequestClose }) => {
  const translateY = new Animated.Value(0);

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: translateY } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = ({ nativeEvent }) => {
    if (nativeEvent.oldState === State.ACTIVE) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }).start();

      if (nativeEvent.translationY > 50) {
        onRequestClose();
      }
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onRequestClose}
    >
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
      >
        <Animated.View style={{ flex: 1, transform: [{ translateY }] }}>
          <TouchableWithoutFeedback onPress={onRequestClose}>
            <View style={styles.container}>
              <TouchableWithoutFeedback>
                <View style={styles.modalContent}>
                  <TouchableOpacity
                    style={styles.closeIcon}
                    onPress={onRequestClose}
                  >
                    <Icon name="close" size={24} color={colors.primary} />
                  </TouchableOpacity>
                  {children}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </PanGestureHandler>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    width: "100%",
    height: "40%",
    backgroundColor: colors.disabled,
    padding: 20,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderRadius: 15,
  },
  closeIcon: { position: "absolute", top: 20, left: 20 },
});

export default Sheet;
