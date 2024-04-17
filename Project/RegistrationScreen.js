import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput, Text, Modal, SafeAreaView, Image,Button,Alert } from 'react-native';
import MainScreen from './MainScreen';
import Icon from "react-native-vector-icons/FontAwesome5";


import * as DocumentPicker from 'expo-document-picker';

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
  } from "firebase/auth";
  import { auth } from "../Config";
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


const RegistrationScreen = ({navigation}) => {


    const set = async() => {
        const docRef = doc(db, "myudst", email)
        await setDoc(docRef, data)
        .then(() => { console.log('data submitted') })
        .catch((error) => { console.log(error.message) })
        }



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
          const response = await fetch('http://192.168.1.45:5000/upload', {
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
          

    
          console.log('Upload successful', responseJson["Processed Data"]["personal_details"]["Student ID"]);
    
    

          setEmail(responseJson["Processed Data"]["personal_details"]["Student ID"])
          setModalVisible(true)
          setData(responseJson["Processed Data"])


        } catch (error) {
          console.error('Error uploading document:', error);
          Alert.alert('Upload Error', 'An error occurred while uploading the document.');
        }
      };




//here






  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [email,setEmail] = useState('')

  const [data,setData] = useState(null)

  const handleRegistration = () => {
    if (password === confirmPassword & password != '' & confirmPassword != "") {
      // Proceed with registration
      console.log('Register with password:', password);
   
      setConfirmPassword('')
      setPassword('')

      let studentEmail = email + "@udst.edu.qa"

      createUserWithEmailAndPassword(auth, studentEmail, password)
      .then(() => {
        console.log("registered");
        setModalVisible(false);
        set()
        alert("Account Registered. You will be redirected to the login page.")
        navigation.navigate("LoginScreen")
      })
      .catch((error) =>
        error.message.includes("invalid-email")
          ? alert("Invalid Email")
          : alert(error.message),
          setConfirmPassword(''),
      setPassword(''),
      setModalVisible(false)
      );
    } else {
      // Handle error
      alert('Passwords do not match and cannot be empty string');
      setConfirmPassword('')
      setPassword('')
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Image source={require('../Images/logo.png')} style={styles.logo} />
        <Text style={[styles.welcomeText,{marginTop:40,marginBottom:60}]}>Upload Unofficial Transcript</Text>

        <TouchableOpacity style={styles.fileButton} onPress={pickDocument} >
          <Icon
            name="file-alt"
            size={35}
            color="#004aad"
            style={styles.fileIcon}
          />
          <View>
          <Text style={styles.fileButtonText}>Select file</Text>
          <Text style={{marginTop:20,color:"#007aff",fontSize:15}}>Format Allowed - *.pdf</Text>
          </View>
          
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("MainScreen")} style={[styles.loginButton,{backgroundColor:"#D1E8FF",marginTop:80}]}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(!modalVisible)}
        >
          <View style={styles.centeredView}>
            
            <View style={styles.modalView}>
            <Text style = {{marginBottom:40,textAlign:"center",fontWeight:"bold"}}>Student Email: {email}@udst.edu.qa</Text>
                <Text style = {{textAlign:"center"}}>Enter Password:</Text>
              <TextInput
                secureTextEntry
                placeholder="Enter Password"
                style={styles.input}
                value={password}
                onChangeText={setPassword}
              />
              <Text style = {{textAlign:"center"}}>Re-enter Password:</Text>
              <TextInput
                secureTextEntry
                placeholder="Confirm Password"
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity
                style={[styles.button, styles.modalButton]}
                onPress={handleRegistration}
              >
                <Text style={styles.buttonText}>Register Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#007aff', // The background color for the safe area
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 30,
    marginTop: 10,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
  },
  buttonText: {
    color: '#007aff',
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Dark overlay for modal background
  },
  modalView: {
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
    shadowRadius: 3.84,
    elevation: 5,
    width: '80%',
  },
  modalButton: {
    marginTop: 20,
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  fileButton: {
    flexDirection: "row",
    borderRadius: 8,
    padding: 25,
    width:'80%',
    backgroundColor:'white',
  },
  fileIcon: {
    marginRight: 40,
    marginTop:16,
    color:"#007aff"
  },
  fileButtonText: {
    color: "#007aff",
    fontSize: 20,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 40,
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
    width:"80%"
  },
  buttonText: {
    color: '#007aff', // Blue text color
    fontSize: 18,
    fontWeight: 'bold',
  }
});

export default RegistrationScreen;
