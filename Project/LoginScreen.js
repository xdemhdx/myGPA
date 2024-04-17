/*import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Divider } from "react-native-elements";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../Config";
import HomePage from "./HomePage";
import RegisterScreen from "./RegisterScreen";
import { useState } from "react";
import { useEffect } from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { KeyboardAvoidingView } from "react-native";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [signedIn, setSignedIn] = useState(false);
  useEffect(() => setSignedIn(false), []);

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        atIndex = email.indexOf("@");
        result = email.substring(0, atIndex);
        navigation.replace("Tabs", { id: result });
        setSignedIn(true);
        setEmail("");
        setPassword("");
      })
      .catch((error) => {
        alert("Invalid Login Credentials");
        setSignedIn(false);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require("../Images/logo.png")} style={styles.logo} />
        <View>
          <Text style={[styles.title, { textAlign: "center" }]}>UDST</Text>
          <Text style={[styles.title, { textAlign: "center" }]}></Text>
          <Text style={styles.title}>GPA Calculator and Estimator</Text>
        </View>
      </View>
      <View style={styles.form}>
        <View>
          <Text style={styles.signInText}>Sign in</Text>
        </View>
        <View>
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            placeholderTextColor="#666"
            autoComplete="false"
            autoCorrect={false}
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            placeholderTextColor="#666"
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
        </View>

        <View style={styles.options}>
          <TouchableOpacity>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
            <Text style={styles.buttonText}>SIGN IN</Text>
          </TouchableOpacity>
        </View>
        <Divider />
        <View>
          <TouchableOpacity
            onPress={() => navigation.navigate("RegisterScreen")}
            style={styles.loginButton}
          >
            <Text style={styles.buttonText}>REGISTER</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#007bff",
  },
  header: {
    backgroundColor: "#007bff",
    paddingVertical: 50,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  logo: {
    width: 80,
    height: 110,
    paddingTop: 20,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  form: {
    flex: 1,
    padding: 30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: "white",
    justifyContent: "space-around",
  },
  signInText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "black",
    padding: 15,
    marginBottom: 10,
    fontSize: 16,
    color: "#333",
  },
  options: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxLabel: {
    color: "#333",
    marginLeft: 5,
  },
  forgotPassword: {
    color: "#007bff",
  },
  loginButton: {
    backgroundColor: "#007bff",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  orText: {
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  guestButton: {
    backgroundColor: "#007bff",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
  },
});
*/


import React, { useState } from 'react';
import { StyleSheet, Button,Modal, View, Image, TextInput, Text, TouchableOpacity, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';

import MainScreen from './MainScreen';


import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../Config";
import { sendPasswordResetEmail } from 'firebase/auth';





const LoginScreen = ({ navigation,route }) => {
  const [emailOrId, setEmailOrId] = useState('');
  const [password, setPassword] = useState('');
  const [signedIn, setSignedIn] = useState(false);
  const [resetEmail,setresetEmail] = useState()
  const [modalVisible, setModalVisible] = useState(false);

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, emailOrId, password)
      .then(() => {

        setSignedIn(true);
        setEmailOrId("");
        setPassword("");
        console.log("Loginn Successful")
        let studentID = emailOrId.slice(0, 8)
        navigation.replace("Tabs", { id: studentID });
      })
      .catch((error) => {
        alert("Invalid Login Credentials");
        setSignedIn(false);
        setEmailOrId("");
        setPassword("");
      });
  };

  const handleForgotPassword = async () => {
    try {
      await sendPasswordResetEmail(auth,resetEmail);
      setresetEmail()
    } catch (error) {
      alert(error.message); // Display error message to the user
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >


<View styke = {styles.centeredViewA}>

<Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredViewA}>
          <View style={styles.modalViewA}>
            <Text style={styles.modalTextA}>Enter your email address:</Text>
            <TextInput
              style={styles.inputA}
              onChangeText={setresetEmail}
              value={resetEmail}
              placeholder="Email Address"
              keyboardType="email-address"
            />
            <Button
              title="Send Reset Email"
              onPress={() => {
                // Here you can add the function to handle the password reset email sending
                alert('If you are registered with us, you will receive an reset email ');
                setModalVisible(!modalVisible);
                setresetEmail("")
                handleForgotPassword()
              }}
            />
          </View>
        </View>
      </Modal>

</View>
      


    
        <View style={styles.logoContainer}>
          <Image source={require('../Images/logo.png')} style={styles.logo} />
        </View>
        <Text style={styles.welcomeText}>Student Credentials</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Student Email"
            value={emailOrId}
            onChangeText={setEmailOrId}
            style={styles.input}
            autoCapitalize="none"
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry
          />
          <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.forgotPasswordButton}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("MainScreen")} style={[styles.loginButton,{backgroundColor:"#D1E8FF",marginTop:80}]}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
          
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#007aff', // Blue background color
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 40,
  },
  inputContainer: {
    width: '80%',
  },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 30,
    marginTop: 10,
    fontSize: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
  },
  loginButton: {
    backgroundColor: '#fff',
    borderRadius: 30,
    marginTop: 45,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
  },
  buttonText: {
    color: '#007aff', // Blue text color
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotPasswordButton: {
    marginTop: 15,
  },
  forgotPasswordText: {
    color: '#fff', // White text color
    textAlign: 'center',
    fontSize: 16,
  },
  centeredViewA: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalViewA: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonOpenA: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyleA: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalTextA: {
    marginBottom: 15,
    textAlign: 'center',
  },
  inputA: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: 200,
    borderRadius: 10,
  }
});

export default LoginScreen;
