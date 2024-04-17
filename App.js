import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./Project/LoginScreen";
import RegisterScreen from "./Project/RegisterScreen";
import HomePage from "./Project/HomePage";
import Tabs from "./Project/Tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Test from "./Project/Test";
import Drawers from "./Project/Drawers";
import Predict from "./Project/Predict";
import ChatbotScreen from "./Project/ChatbotScreen";
import Profile from "./Project/Profile";
import Addsemester from "./Project/Addsemester";
import MainScreen from "./Project/MainScreen";
import RegistrationScreen from "./Project/RegistrationScreen";
import Update from "./Project/Update";
import Recommendation from "./Project/Recommendation";

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{}} initialRouteName="MainScreen">

      <Stack.Screen
          name="MainScreen"
          component={MainScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{ headerShown: false }}
        />

        

        <Stack.Screen
          name="RegisterScreen"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RegistrationScreen"
          component={RegistrationScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="HomePage"
          component={HomePage}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Tabs"
          component={Tabs}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Drawers"
          component={Drawers}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Predict"
          component={Predict}
          options={{ headerShown: false }}
        />

        { <Stack.Screen
          name="ChatbotScreen"
          component={ChatbotScreen}
          options={{ headerShown: false }}
        /> }
        
        {/* <Stack.Screen
          name="Recommendation"
          component={Recommendation}
          options={{ headerShown: false }}   
        /> */}

        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Addsemester"
          component={Addsemester}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Update"
          component={Update}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

/*
import React from 'react';
import { StyleSheet, Button, View, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

export default function App() {
  const pickDocument = async () => {
    try {
      let result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true
      });

      if (result.canceled) {
        Alert.alert('Picker Cancelled', 'No file was selected.');
      } else {
        const pickedDocument = result.assets[0];
        console.log('Document picked:', pickedDocument.uri);

        // Call the upload function with the picked document
        uploadPDF(pickedDocument);
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'An error occurred while picking the document.');
    }
  };

  const uploadPDF = async (pickedDocument) => {
    const formData = new FormData();
    formData.append('pdf', {
      uri: pickedDocument.uri,
      name: pickedDocument.name,
      type: pickedDocument.mimeType
    });

    try {
      const response = await fetch('http://192.168.100.26:5000/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const responseJson = await response.json();
      const jsonString = JSON.stringify(responseJson);

      const parsedObject = JSON.parse(jsonString);
      

      console.log('Upload successful', jsonString);


      Alert.alert('Upload Successful', 'The PDF has been uploaded successfully.');
    } catch (error) {
      console.error('Error uploading document:', error);
      Alert.alert('Upload Error', 'An error occurred while uploading the document.');
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Pick and Upload PDF Document" onPress={pickDocument} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});



*/
