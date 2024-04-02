import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import colors from "../../config/colors";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native";
import axios from "axios";
import { getNgrokUrl } from "../../config/constants";
import { useSelector } from "react-redux";

const SettingsItem = ({ title, iconName, textStyle, onPress }) => (
  <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
    <View style={styles.iconContainer}>
      <Icon name={iconName} size={24} color={colors.black} />
    </View>
    <Text style={[styles.itemText, textStyle]}>{title}</Text>
    <Icon name="angle-right" size={24} color={colors.black} />
  </TouchableOpacity>
);

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const user = useSelector((state) => state.user.user) || {};

  const [profilePicture, setProfilePicture] = useState(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

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
    } else {
      setProfilePicture(null);
    }
  }, [user.profilePicture]);

  return (
    <ScrollView>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.section}
          onPress={() =>
            navigation.navigate("Profile", {
              screen: "PersonalInformation",
            })
          }
          activeOpacity={0.7}
        >
          <View style={styles.profileSection}>
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

            <View style={styles.personalInfo}>
              <Text style={styles.personalInfoNameText}>
                {user.firstName} {user.lastName}
              </Text>
              <Text style={styles.personalInfoText}>{user.email}</Text>
            </View>

            <Icon name="angle-right" size={24} color={colors.black} />
          </View>
        </TouchableOpacity>

        <View style={styles.section}>
          <SettingsItem
            title="Health Profile"
            iconName="stethoscope"
            onPress={() =>
              navigation.navigate("Profile", { screen: "HealthProfile" })
            }
          />
          <SettingsItem
            title="Notification Settings"
            iconName="bell"
            onPress={() =>
              navigation.navigate("Profile", {
                screen: "NotificationsSettings",
              })
            }
          />
          <SettingsItem
            title="Terms & Conditions"
            iconName="file-text"
            onPress={() => {
              navigation.navigate("Profile", { screen: "TermsConditions" });
            }}
          />
          <SettingsItem
            title="Change Password"
            iconName="lock"
            onPress={() =>
              navigation.navigate("Profile", { screen: "ChangePassword" })
            }
          />
        </View>

        <View style={styles.section}>
          <SettingsItem
            textStyle={styles.delete}
            title="Delete Account"
            iconName="trash"
            onPress={() =>
              navigation.navigate("Profile", { screen: "DeleteAccount" })
            }
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginTop: 20,
    backgroundColor: colors.white,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eaeaea",
  },
  iconContainer: {
    width: 30,
    alignItems: "center",
  },
  itemText: {
    flex: 1,
    marginLeft: 25,
    fontSize: 14,
    fontFamily: "MontserratRegular",
  },
  delete: {
    color: colors.danger,
    fontFamily: "MontserratBold",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  profilePicture: {
    width: 75,
    height: 75,
    borderRadius: 75 / 2,
    marginRight: 20,
  },
  personalInfo: {
    flex: 1,
    marginLeft: 15,
  },
  personalInfoNameText: {
    fontSize: 20,
    fontFamily: "MontserratBold",
  },
  personalInfoText: {
    marginTop: 5,
    fontSize: 16,
    fontFamily: "MontserratRegular",
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

export default ProfileScreen;
