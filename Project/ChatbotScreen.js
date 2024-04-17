import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,Button,
  KeyboardAvoidingView,
  Dimensions,
  Alert
} from "react-native";
import React, { useEffect, useState } from "react";

import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Divider } from "react-native-elements";



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
import Tabs from "./Tabs";
import Chatbot from "./ChatbotScreen";
import Drawers from "./Drawers";
import AntDesign from "react-native-vector-icons/AntDesign";
import { auth } from "../Config";

import Icon from "react-native-vector-icons/FontAwesome5";

import { Dialog } from "@rneui/themed";
import { color } from "@rneui/base";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const Predict = ({ navigation, route }) => {

  const [name, setName] = useState();
  const [data,setData] = useState({})
  const [currentCourses, setCurrentCourses] = useState({})
  const [processedData, setProcessedData] = useState()
  const [firstPart, setfirstPart] = useState()
  const [secondPart, setSecondPart] = useState()
  const [targetCgpa, setTargetCgpa] = useState()

  const showDialog = () => {
    Alert.alert(
      "Confirm", // Dialog Title
      "Are you sure you want to logout?", // Dialog Message
      [
        {
          text: "No",
          onPress: () => console.log("No Pressed"),
          style: "cancel"
        },
        { 
          text: "Yes", 
          onPress: () => handleSignOut()
        }
      ],
      { cancelable: true }
    );
  };


  const { id } = route.params;
  console.log("The ID is : ", id);
 
  useEffect(() => {
    read(id);
  }, []);

  useEffect(() => {
    if (processedData) { // Only call getRecommendedList if processedData is not empty
      getRecommendedList();
    }
  }, [processedData]); // Dependency array, re-run the effect when processedData changes
  

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


  const read = async () => {
    const q = query(collection(db, "myudst"));
    const docs = await getDocs(q);

    let temp = [];
    docs.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots

      temp.push(doc.data());
    });
    temp.forEach((item) => {
      if (item["personal_details"]["Student ID"] === id) {
        
        setData(item);
        setName(item["personal_details"]["Name"]);
      }
    });
  };


  const readCurrentCourses = async () => {
    const q = query(collection(db, "prediction"));
    const docs = await getDocs(q);

    let temp = [];
    docs.forEach((doc) => {

      temp.push(doc.data());
    });
    temp.forEach((item) => {
      
      if (item["Student ID"] === id) {
        
        setCurrentCourses(item)
        setProcessedData({"Processed Data": {...data,...item}})

      }

    });
    
  };


  const getRecommendedList = async () => {
    
    try {
      console.log("Recommended Function : "+processedData)
      const response = await fetch('http://192.168.1.45:5000/recommendedlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(processedData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const responseData = await response.json();
      // console.log(responseData)
      setfirstPart(responseData)
      setTargetCgpa(responseData["current_cgpa"])
      // console.log(firstPart)

    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to send data to server');
      }
  }


  const decCgpa = () => {
      let temp = targetCgpa - 0.01
      temp = temp.toFixed(2)
      temp = parseFloat(temp)
      setTargetCgpa(temp)
    }

    const incCgpa = () => {
      let temp = targetCgpa + 0.01
      temp = temp.toFixed(2)
      temp = parseFloat(temp)
      setTargetCgpa(temp)
    }

    const getPossibleCombinations = async () => {
      try {
        const response = await fetch('http://192.168.1.45:5000/possiblecombinations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({firstPart,"target_cgpa":targetCgpa}),
        });
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const responseData = await response.json();
        setSecondPart(responseData)
        // secondPart?console.log(secondPart):null
  
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to send data to server');
        }
    }
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View>
            <TouchableOpacity style={styles.menuButton}>
            
              <MaterialCommunityIcons
                name="microsoft-xbox-controller-menu"
                size={34}
                color="#007bff"
              />
            </TouchableOpacity>
          </View>
          <View style={{ paddingBottom: 20 }}>
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                fontSize: 16,
                textAlign: "center",
              }}
            >
              {name}
            </Text>
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                fontSize: 16,
                textAlign: "center",
              }}
            >
              {id}
            </Text>
          </View>
          <View style={{ paddingTop: 8 }}>
            <TouchableOpacity
              style={{ alignItems: "center" }}
              onPress={() => showDialog()}
            >
              <AntDesign name="logout" size={23} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ paddingBottom: 20 }}>
          <Divider />
        </View>

        <View style={styles.circuleBorder}>
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
            Recommendations and Predictions
          </Text>
        </View>
      </View>

      <View style={styles.form}>
        <TouchableOpacity
          onPress={() => readCurrentCourses()}
          style={[styles.continueButton, {marginTop:15}]}
        >
          <Text style={styles.continueButtonText}>Get Recommended Courses</Text>
        </TouchableOpacity>

        {firstPart?
          <View style={{marginTop:20}}>
            <View style={{flexDirection: "row", alignSelf:'center'}}>
              <AntDesign name="leftcircle" size={30} onPress={targetCgpa > firstPart.current_cgpa ? decCgpa : null} />
              <Text style={{margin:2, marginLeft:10, marginRight:10, fontSize:18, fontWeight:'bold'}}>{targetCgpa}</Text>
              <AntDesign name="rightcircle" size={30} onPress={targetCgpa < firstPart.max_cgpa ? incCgpa : null} />
            </View>
            

            <View style={{marginTop:20}}>
              <TouchableOpacity
                onPress={() => getPossibleCombinations()}
                style={[styles.continueButton, {marginBottom:40}]}
              >
                <Text style={styles.continueButtonText}>Set Target CGPA</Text>
              </TouchableOpacity>
            </View>
          </View>
        :null}
      

      <ScrollView horizontal={true} style={{height:screenHeight/100, marginBottom:80, width:screenWidth*0.99}}>
      {secondPart?secondPart.map((x,index)=>
        <View key={index} style={[styles.card, {paddingTop:40}]}>
          <View style={{flexDirection:"row", justifyContent:"space-around", width:screenWidth*0.9, marginBottom: 15}}>
          <Text style={{fontWeight:'bold', marginRight:5}}>Course</Text>
          <Text style={{fontWeight:'bold'}}>Credit</Text>
          <Text style={{fontWeight:'bold'}}>Required grade</Text>
          </View>
        {x.map((y,i)=>{
          const parts = y.course.split(' ');
          const courseCode = parts.slice(0, 2).join(' ');
          return (
          <View style={{flexDirection:"row"}} key={i}>
              <Text style={{marginLeft:20, marginRight:62, marginBottom: 15}}>{courseCode}</Text>
              <Text style={{marginRight:115}}>{y.credit}</Text>
              <Text>{y.target_grade}</Text>
          </View>
          )
        }
        )}
        </View>
      ):null}
      </ScrollView>
      </View>
      </View>
    </SafeAreaView>
  );
};

export default Predict;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#007bff",
  },

  card: {
    width: screenWidth*0.9,
    height: '20%',
  },
  circuleBorder: {
    padding: 10,
    borderColor: "white",
    borderWidth: 2,
    borderStyle: "dashed",
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    alignItems: "center",
  },
  header: {
    backgroundColor: "#007bff",
    padding: 20,
    paddingVertical: 20,
  },
  nameText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  gpaContainer: {
    borderColor: "black",
    backgroundColor: "#fff",
    borderRadius: 20,
    marginTop: 10,
    paddingVertical: 5,
    paddingHorizontal: 25,
  },
  gpaText: {
    color: "yellow",
    fontSize: 98,
    fontWeight: "bold",
  },
  idText: {
    fontSize: 16,
    color: "#fff",
  },
  cumulativeGpa: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
    marginTop: 5,
  },

  semesterText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  gpaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  form: {
    flex: 1,
    padding: 15,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: "white",
    justifyContent: "space-evenly",
    marginBottom: "-10%",
  },
  gpaText: {
    fontSize: 16,
    color: "#000",
  },
  gpaValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  unitsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  unitsText: {
    fontSize: 16,
    color: "#000",
  },
  unitsValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  dropdownIcon: {
    position: "absolute",
    right: 10,
    top: 10,
  },

  card: {
    backgroundColor: "#E8EFF9",
    borderRadius: 10,
    padding: 15,
    margin: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
  },
  headerText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "black",
  },
  body: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "black",
  },
  section: {
    alignItems: "center",
    padding: 10,
    flex: 1,
  },
  titleText: {
    fontSize: 12,
    color: "black",
  },
  valueText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "black",
    marginTop:10,
  },
  divider: {
    height: "100%",
    width: 1,
    backgroundColor: "black",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold",
    color: "#007bff",
  },
  input: {
    width: 200,
    height: 40,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#007bff",
    borderRadius: 10,
    padding: 10,
  },

  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e6e6e6",
    padding: 10,
    marginVertical: 10,
  },
  buttonText: {
    marginLeft: 10,
  },

  continueButton: {
    backgroundColor: "#007bff",
    padding: 10,
    marginVertical: 10,
  },
  fileButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#004aad",
    borderRadius: 8,
    padding: 55,
    marginBottom: 10,
  },
  fileIcon: {
    marginRight: 10,
  },
  fileButtonText: {
    color: "#004aad",
    fontSize: 18,
  },
  orText: {
    color: "grey",
    marginVertical: 10,
    textAlign: "center",
    fontSize: 25,
  },
  photoButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e6e6e6",
    borderRadius: 8,
    padding: 55,
    marginBottom: 20,
  },
  photoIcon: {
    marginRight: 10,
    justifyContent: "center",
  },
  photoButtonText: {
    color: "#004aad",
    fontSize: 18,
    textAlign: "center",
  },
  continueButton: {
    backgroundColor: "#007bff",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  continueButtonText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  modalButton: {
    color: "#007bff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  continueButtonA: {
    backgroundColor: "#E8EFF9",
    borderRadius: 20,
    marginTop:8,
    borderWidth:1,
    width:"30%",
    alignSelf:"center"
  },
  continueButtonTextA: {
    color: "black",
    fontSize: 12,
    textAlign: "center",
    margin:5
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#eee'
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    height: 40
  },
  headerText: {
    margin: 6,
    fontWeight: 'bold'
  },
  rowText: {
    margin: 6
  },
  buttonB: {
    // Styles for the button
    alignItems: 'center',
    backgroundColor: '#DDDDDD',  // This is the default light gray color, change as needed
    padding: 10,
  },
  textB: {
    color: 'blue',  // Text color set to blue
    textAlign: 'center',  // Text aligned to center
    // Add additional text styling as required
  },
  centeredViewN: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalViewN: {
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
  tableContainerN: {
    marginBottom: 20,
  },
  tableHeaderN: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#dddddd',
  },
  tableRowN: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  headerTextN: {
    fontWeight: 'bold',
    color: '#333333',
    textTransform: 'uppercase',
    fontSize: 16,
    width: '33%',
    textAlign: 'center',
  },
  cellTextN: {
    color: 'black',
    fontSize: 14,
    width: '33%',
    textAlign: 'center',
    marginVertical: 5,
  },
  openButtonN: {
    backgroundColor: 'green',
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    marginTop: 20,
  },
  textStyleN: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },

});
