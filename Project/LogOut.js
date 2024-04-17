import React from "react";
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { Button, View, StyleSheet } from "react-native";
import LoginScreen from "./LoginScreen";
import { auth } from "../Config";

function CustomDrawerContent({ navigation }, props) {
  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigation.reset({
        routes: [{ name: "LoginScreen" }],
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <View style={styles.buttonContainer}>
        <Button
          title="Logout"
          onPress={() => {
            handleSignOut;
          }}
        />
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    margin: 10,
    borderRadius: 5,
    overflow: "hidden",
  },
});

export default CustomDrawerContent;
