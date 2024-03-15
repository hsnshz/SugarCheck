import React from "react";
import {
  HeaderButton,
  HeaderButtons,
  Item,
} from "react-navigation-header-buttons";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../config/colors";
import { TouchableOpacity } from "react-native-gesture-handler";

const CustomHeaderButton = (props) => {
  return (
    <HeaderButton
      {...props}
      IconComponent={Ionicons}
      iconSize={35}
      color={colors.primary}
      style={{ padding: 20 }}
    />
  );
};

export const setHeaderOptions = (navigation) => {
  const routeName =
    navigation.getState().routes[navigation.getState().index].name;

  navigation.setOptions({
    headerStyle: {
      height: 130,
      backgroundColor: colors.background,
      borderBottomWidth: 0,
      shadowOpacity: 0,
    },
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        {/* {routeName === "ProfileScreen" ? (
          <Item
            title="Back"
            iconName="ios-arrow-back"
            onPress={() => {
              navigation.goBack();
            }}
          />
        ) : ( */}
        <Item
          title="Menu"
          iconName="ios-menu"
          onPress={() => {
            navigation.openDrawer();
          }}
        />
      </HeaderButtons>
    ),
    // headerRight: () =>
    //   routeName === "ProfileScreen" ? null : (
    //     <TouchableOpacity
    //       onPress={() => {
    //         navigation.navigate("Profile");
    //       }}
    //     >
    //       <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
    //         <Item title="Profile" iconName="ios-person" />
    //       </HeaderButtons>
    //     </TouchableOpacity>
    //   ),
  });
};
