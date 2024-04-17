import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import LoginScreen from "./LoginScreen";
import RegisterScreen from "./RegisterScreen";
import HomePage from "./HomePage";
import Drawers from "./Drawers";
import Predict from "./Predict";
import ChatbotScreen from "./ChatbotScreen";
import Icon from "react-native-vector-icons/FontAwesome";
import { TouchableOpacity } from "react-native-gesture-handler";
import Recommendation from "./Recommendation";

const Tab = createBottomTabNavigator();

const Tabs = ({ navigation, route, onPress }) => {
  const handleChatGPTTabPress = () => {
    console.log("Bruh");
    alert("This page is not available yet.");
  };

  const { id } = route.params;
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={Drawers}
        options={{
          headerShown: false,
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={23} />
          ),
        }}
        initialParams={{ id: id }}
      />
      <Tab.Screen
        name="Calculate GPA"
        component={Predict}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="calculator" color={color} size={17} />
          ),
        }}
        initialParams={{ id: id }}
      />

      <Tab.Screen
        name="Recommendations"
        component={ChatbotScreen}
        options={{
          headerShown: false,
          tabBarOnPress: () => {
            console.log("Bruh");
          },
          tabBarIcon: ({ color, size }) => (
            <Icon name="star" color={color} size={23} />
          ),
        }}
        initialParams={{ id: id }}
      />
    </Tab.Navigator>
  );
};

export default Tabs;

const styles = StyleSheet.create({});
