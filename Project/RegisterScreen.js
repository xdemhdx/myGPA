import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Button,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Divider } from "react-native-elements";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../Config";
import HomePage from "./HomePage";
import { useState } from "react";
import { useEffect } from "react";
import { Overlay } from "@rneui/themed";
import {
  doc,
  setDoc,
  getDocs,
  collection,
  deleteDoc,
  addDoc,
  query,
  getDoc,
} from "firebase/firestore";
import { db } from "../Config";

const RegisterScreen = ({ navigation, route }) => {
  const [email, setEmail] = useState();
  const [studentID, setStudentID] = useState();
  const [studentName, registerstudentName] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [signedIn, setSignedIn] = useState(false);
  useEffect(() => setSignedIn(false), []);

  const handleRegister = () => {
    if (password != confirmPassword) {
      alert("Password Do Not Match");
      return;
    }
    if (
      studentID.length != 8 ||
      email[8] != "@" ||
      email.slice(0, 8) != studentID
    ) {
      console.log(studentID.length);
      console.log(email[8]);
      console.log(email.slice(0, 7));
      alert(
        "Student ID should be 8 digits and should be same as first 8 characters of the email"
      );
      return;
    }
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        console.log("registered");
        toggleOverlay();
      })
      .catch((error) =>
        error.message.includes("invalid-email")
          ? alert("Invalid Email")
          : console.log(error.message)
      );
  };

  const createStudent = async () => {
    let temp = [
      {
        college: collegeName,
        major: major,
        mobile: number,
        email: email,
        name: studentName,
        semesters: [],
      },
    ];

    const docRef = doc(db, "students", studentID);
    await setDoc(docRef, temp[0])
      .then(() => {
        console.log("data submitted");
      })
      .catch((error) => {
        console.log(error.message);
      });

    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setStudentID("");
    registercollegeName("");
    registerMajor("");
    registerNumber("");
    alert("Registration Successfull");
    navigation.navigate("LoginScreen");
  };

  const [visible, setVisible] = useState(false);

  const [collegeName, registercollegeName] = useState();
  const [major, registerMajor] = useState();
  const [number, registerNumber] = useState();

  const toggleOverlay = () => {
    setVisible(!visible);
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
          <Text style={styles.signInText}>Register Account</Text>
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
            placeholder="Student ID"
            placeholderTextColor="#666"
            value={studentID}
            onChangeText={(text) => setStudentID(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            placeholderTextColor="#666"
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry
            placeholderTextColor="#666"
            value={confirmPassword}
            onChangeText={(text) => setConfirmPassword(text)}
          />
        </View>

        <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
          <View
            style={{
              width: 300,
              padding: 50,
            }}
          >
            <Text
              style={{ textAlign: "center", padding: 10, fontWeight: "bold" }}
            >
              Additional Details
            </Text>
            <TextInput
              placeholder="College Name"
              value={collegeName}
              onChangeText={(text) => registercollegeName(text)}
              style={{
                width: "100%",
                height: 40,
                marginVertical: 10,
                borderWidth: 1,
                padding: 10,
              }}
              placeholderTextColor="grey"
            />
            <TextInput
              placeholder="Major"
              value={major}
              onChangeText={(text) => registerMajor(text)}
              style={{
                width: "100%",
                height: 40,
                marginVertical: 10,
                borderWidth: 1,
                padding: 10,
              }}
              placeholderTextColor="grey"
            />

            <TextInput
              placeholder="Mobile Number"
              value={number}
              onChangeText={(text) => registerNumber(text)}
              keyboardType="phone-pad"
              style={{
                width: "100%",
                height: 40,
                marginVertical: 10,
                borderWidth: 1,
                padding: 10,
              }}
              placeholderTextColor="grey"
            />
            <TextInput
              placeholder="Full Name"
              value={studentName}
              onChangeText={(text) => registerstudentName(text)}
              style={{
                width: "100%",
                height: 40,
                marginVertical: 10,
                borderWidth: 1,
                padding: 10,
              }}
              placeholderTextColor="grey"
            />
            <Button
              style={{ margin: 100 }}
              title="Submit"
              onPress={() => createStudent()}
            />
          </View>
        </Overlay>

        <View>
          <TouchableOpacity
            onPress={() => handleRegister()}
            style={styles.loginButton}
          >
            <Text style={styles.buttonText}>REGISTER</Text>
          </TouchableOpacity>
        </View>
        <Divider />
        <View>
          <TouchableOpacity
            onPress={() => navigation.navigate("LoginScreen")}
            style={styles.loginButton}
          >
            <Text style={styles.buttonText}>BACK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default RegisterScreen;

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
