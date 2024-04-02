import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Button,
  Platform,
  KeyboardAvoidingView,
  Image,
  SafeAreaView,
} from "react-native";
import { ButtonSecondary } from "../../../config/styledText";
import colors from "../../../config/colors";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ScrollView } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { getNgrokUrl } from "../../../config/constants";
import { updateUser } from "../../store/slices/userSlice";
import Toast from "react-native-fast-toast";
import * as Haptics from "expo-haptics";
import Icon from "react-native-vector-icons/AntDesign";
import * as ImagePicker from "expo-image-picker";
import { useActionSheet } from "@expo/react-native-action-sheet";

const PersonalInformation = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user) || {};
  const token = useSelector((state) => state.auth.token) || "";

  const [profilePicture, setProfilePicture] = useState(
    user ? user.profilePicture : ""
  );
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const [firstName, setFirstName] = useState(user ? user.firstName : "");
  const [lastName, setLastName] = useState(user ? user.lastName : "");
  const [email, setEmail] = useState(user ? user.email : "");
  const [dob, setDob] = useState(
    user && user.dob ? new Date(user.dob) : new Date()
  );
  const [gender, setGender] = useState(
    user ? user.gender?.charAt(0).toUpperCase() + user.gender?.slice(1) : ""
  );
  const [phoneNumber, setPhoneNumber] = useState(user ? user.phoneNumber : "");
  const [username, setUsername] = useState(user ? user.username : "");
  const [show, setShow] = useState(false);

  const firstTextInputRef = useRef(null);
  const toastRef = useRef(null);

  const { showActionSheetWithOptions } = useActionSheet();

  const validateInput = () => {
    if (!username) {
      alert("Username is required");
      return;
    }

    if (!email) {
      alert("Email is required");
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      alert("Email is not valid");
      return;
    }

    if (!phoneNumber) {
      alert("Phone number is required");
      return;
    } else if (!/^\d+$/.test(phoneNumber)) {
      alert("Phone number is not valid");
      return;
    }

    return true;
  };

  const onChange = (event, selectedDob) => {
    const currentDob = selectedDob || dob;
    setShow(Platform.OS === "ios");
    setDob(currentDob);
  };

  const handleDatePress = () => {
    setShow(true);
  };

  const handleUpdate = () => {
    if (!validateInput()) {
      return;
    }

    axios
      .put(
        `${getNgrokUrl()}/api/profile/update/${user._id}`,
        {
          email,
          phoneNumber,
          username,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          // Update the user data in the Redux store
          dispatch(
            updateUser({
              email,
              phoneNumber,
              username,
            })
          );

          toastRef.current.show("Profile updated successfully", {
            type: "success",
          });
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      })
      .catch((error) => {
        console.log(error);
        toastRef.current.show("An error occurred while updating the profile", {
          type: "danger",
        });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      });
  };

  useEffect(() => {
    if (Platform.OS !== "android") {
      setShow(true);
    }
  }, []);

  useEffect(() => {
    if (user.profilePicture) {
      axios
        .get(`${getNgrokUrl()}/${user.profilePicture}`, {
          responseType: "blob",
        })
        .then((response) => {
          const url = URL.createObjectURL(response.data);

          setProfilePicture(url);
          setIsImageLoaded(true);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [user.profilePicture]);

  const handleSelectProfilePicture = async () => {
    const options = [
      "Take Photo",
      "Choose from Photos",
      "Remove Photo",
      "Cancel",
    ];
    const cancelButtonIndex = 3;
    const destructiveButtonIndex = 2;

    try {
      showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex,
          destructiveButtonIndex,
        },
        async (buttonIndex) => {
          switch (buttonIndex) {
            case 0:
              // Take Photo
              const cameraPermission =
                await ImagePicker.requestCameraPermissionsAsync();

              if (cameraPermission.status !== "granted") {
                alert("Sorry, we need camera permissions to make this work!");
                return;
              }

              let cameraResult = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 4],
                quality: 1,
              });

              if (!cameraResult.canceled) {
                if (cameraResult.assets[0].uri) {
                  setProfilePicture(cameraResult.assets[0].uri);

                  try {
                    await handleUpdateProfilePicture(
                      cameraResult.assets[0].uri
                    );
                  } catch (error) {
                    console.error(error);
                    toastRef.current.show(
                      "An error occurred while updating the profile picture",
                      {
                        type: "danger",
                      }
                    );
                  }
                }
              }
              break;

            case 1:
              // Choose from Photos
              const libraryPermission =
                await ImagePicker.requestMediaLibraryPermissionsAsync();

              if (libraryPermission.status !== "granted") {
                alert(
                  "Sorry, we need media library permissions to make this work!"
                );
                return;
              }

              let libraryResult = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 4],
                quality: 1,
              });

              if (!libraryResult.canceled) {
                if (libraryResult.assets[0].uri) {
                  setProfilePicture(libraryResult.assets[0].uri);

                  try {
                    await handleUpdateProfilePicture(
                      libraryResult.assets[0].uri
                    );
                  } catch (error) {
                    console.error(error);
                    toastRef.current.show(
                      "An error occurred while updating the profile picture",
                      {
                        type: "danger",
                      }
                    );
                  }
                }
              }

              break;

            case 2:
              // Remove Photo
              try {
                await handleRemoveProfilePicture();
              } catch (error) {
                console.error(error);
                toastRef.current.show(
                  "An error occurred while removing the profile picture",
                  {
                    type: "danger",
                  }
                );
              }
              break;
          }
        }
      );
    } catch (error) {
      console.error(error);
      toastRef.current.show(
        "An error occurred while updating the profile picture",
        {
          type: "danger",
        }
      );
    }
  };

  const handleUpdateProfilePicture = async (uri) => {
    let formData = new FormData();
    let localUri = Platform.OS === "ios" ? `file://${uri}` : uri;
    let filename = localUri.split("/").pop();

    // Infer the type of the image
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;

    formData.append("photo", { uri: localUri, name: filename, type });

    try {
      const response = await axios.put(
        `${getNgrokUrl()}/api/profile/update/${user._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch(
        updateUser({ profilePicture: response.data.user.profilePicture })
      );

      toastRef.current.show("Profile picture updated successfully", {
        type: "success",
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error(error);
      toastRef.current.show(
        "An error occurred while updating the profile picture",
        { type: "danger" }
      );
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const handleRemoveProfilePicture = async () => {
    try {
      const response = await axios.delete(
        `${getNgrokUrl()}/api/profile/delete-profile-picture/${user._id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the Redux store
      dispatch(updateUser({ profilePicture: null }));
      setProfilePicture(null);
      setIsImageLoaded(false);

      toastRef.current.show("Profile picture removed successfully", {
        type: "success",
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error(error);
      toastRef.current.show(
        "An error occurred while removing the profile picture",
        { type: "danger" }
      );
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="left" size={30} color={colors.darkBlue} />
        </TouchableOpacity>
        <Image
          source={require("../../../assets/icons/DarkAppIcon.png")}
          style={styles.logo}
        />
        <View style={{ width: 35 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 250, padding: 20 }}
      >
        <TouchableOpacity
          style={styles.btnProfilePicture}
          onPress={handleSelectProfilePicture}
        >
          {profilePicture && isImageLoaded ? (
            <Image
              style={styles.profilePicture}
              source={{ uri: profilePicture }}
            />
          ) : (
            <View style={styles.avatarPicture}>
              <Text style={styles.avatarText}>
                {(user.firstName || "A")[0] + (user.lastName || "A")[0]}
              </Text>
            </View>
          )}
        </TouchableOpacity>
        <Text style={styles.label}>First Name:</Text>
        <TextInput
          style={[styles.input, styles.disabledInput]}
          value={firstName}
          onChangeText={setFirstName}
          editable={false}
        />
        <Text style={styles.label}>Last Name:</Text>
        <TextInput
          style={[styles.input, styles.disabledInput]}
          value={lastName}
          onChangeText={setLastName}
          editable={false}
        />
        <Text style={styles.label}>Gender:</Text>
        <TextInput
          style={[styles.input, styles.disabledInput]}
          value={gender}
          onChangeText={setGender}
          editable={false}
        />
        <View style={styles.dobContainer}>
          <Text style={styles.label}>Date of Birth:</Text>
          {Platform.OS === "android" ? (
            <View style={styles.btnAndroid}>
              <Button
                title="Choose Date"
                onPress={handleDatePress}
                disabled={true}
              />
            </View>
          ) : null}
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={dob}
              mode={"date"}
              is24Hour={true}
              display="default"
              onChange={onChange}
              style={styles.dob}
              disabled={true}
            />
          )}
        </View>
        <Text style={styles.label}>Email:</Text>
        <TextInput
          ref={firstTextInputRef}
          style={[styles.input, styles.disabledInput]}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          editable={false}
        />
        <Text style={styles.label}>Username:</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          returnKeyType="next"
          onSubmitEditing={() => {
            firstTextInputRef.current.focus();
          }}
        />
        <Text style={styles.label}>Phone Number:</Text>
        <TextInput
          ref={firstTextInputRef}
          style={styles.input}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="numeric"
          returnKeyType="go"
          onSubmitEditing={handleUpdate}
        />
        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          <ButtonSecondary>Update</ButtonSecondary>
        </TouchableOpacity>
      </ScrollView>

      <Toast
        ref={toastRef}
        placement="top"
        style={{ backgroundColor: colors.darkBlue, marginTop: 50 }}
        fadeInDuration={750}
        fadeOutDuration={1000}
        opacity={1}
        textStyle={{ color: colors.white, fontFamily: "MontserratRegular" }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.background,
    padding: 20,
  },
  logo: {
    width: 50,
    height: 50,
  },
  btnProfilePicture: {
    backgroundColor: colors.disabled,
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  label: {
    fontFamily: "MontserratRegular",
    fontSize: 18,
    marginVertical: 10,
  },
  input: {
    fontFamily: "MontserratRegular",
    fontSize: 16,
    width: "100%",
    height: 40,
    borderColor: colors.gray,
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    backgroundColor: colors.white,
  },
  disabledInput: {
    backgroundColor: colors.disabled,
  },
  button: {
    backgroundColor: colors.complementary,
    padding: 15,
    margin: 10,
    marginTop: 40,
    width: "60%",
    alignSelf: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  dobContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 15,
    marginBottom: 5,
    width: "100%",
  },
  dob: {
    flex: 0.6,
    marginLeft: 10,
  },
  btnAndroid: {
    flex: 0.9,
    marginLeft: 60,
  },
  avatarPicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.disabled,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: colors.white,
    fontSize: 40,
    fontFamily: "MontserratBold",
  },
});

export default PersonalInformation;
