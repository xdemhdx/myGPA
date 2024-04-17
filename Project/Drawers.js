import React from "react";
import { View, Text, Button, StyleSheet, Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Test from "./Test";
import Tabs from "./Tabs";
import HomePage from "./HomePage";
import LoginScreen from "./LoginScreen";
import LogOut from "./LogOut";
import Icon from "react-native-vector-icons/FontAwesome";
import Profile from "./Profile";
import Feedback from "./Feedback";
import Update from "./Update";

const Drawer = createDrawerNavigator();
import CustomDrawerContent from "./LogOut";

const Drawers = ({ navigation, route }) => {
  const CustomDrawerHeader = () => {
    return (
      <View style={{ flexDirection: "row", alignItems: "center", padding: 56 }}>
        <Image
          source={require("../Images/logo.jpg")}
          style={{ width: 100, height: 100, borderRadius: 20 }}
        />
      </View>
    );
  };

  const { id } = route.params;
  return (
    <Drawer.Navigator
      initialRouteName="Login"
      screenOptions={{
        drawerItemStyle: {
          marginVertical: 15,
          marginHorizontal: 15,
          paddingHorizontal: 5,
        },
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomePage}
        initialParams={{ id: id }}
        options={{
          headerShown: false,
          drawerLabel: "Home",
          
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={Profile}
        initialParams={{ id: id }}
        options={{
          headerShown: false,
          drawerLabel: "Profile",
          
        }}
      />
      <Drawer.Screen
        name="Feedback"
        component={Feedback}
        initialParams={{ id: id }}
        options={{
          headerShown: false,
          drawerLabel: "Provide Feedback",
          
        }}
      />
      <Drawer.Screen
        name="Update"
        component={Update}
        initialParams={{ id: id }}
        options={{
          headerShown: false,
          drawerLabel: "Update Transcript",
          
        }}
      />
    </Drawer.Navigator>
  );
};

export default Drawers;

const styles = StyleSheet.create({});
