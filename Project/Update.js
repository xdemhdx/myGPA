import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    FlatList,
    Modal,
    TextInput,
  } from "react-native";
  import React, { useEffect, useState } from "react";

  import * as DocumentPicker from 'expo-document-picker';
  
  import { Ionicons } from "@expo/vector-icons";
  import { SafeAreaView } from "react-native-safe-area-context";
  import { MaterialCommunityIcons } from "@expo/vector-icons";
  import { Divider } from "react-native-elements";
  
  import RNPickerSelect from "react-native-picker-select";
  import { Alert } from 'react-native';

  import Icon from "react-native-vector-icons/FontAwesome5";
  
  
  import { Dropdown } from "react-native-element-dropdown";
  
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
  import Drawers from "./Drawers";
  import AntDesign from "react-native-vector-icons/AntDesign";
  import { auth } from "../Config";
  import Addsemester from "./Addsemester";
  
  const Update = ({ navigation, route }) => {
    const { id } = route.params;
  
    const [modalVisible, setModalVisible] = useState(false);
  
    const [name, setName] = useState();
  
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
  
  
  
    const [value, setValue] = useState("1");
  
    const gradingScheme = {
      A: 4,
      "B+": 3.5,
      B: 3,
      "C+": 2.5,
      C: 2,
      D: 1,
      "D+": 1.5,
      F: 0,
    };
  
    useEffect(() => {
      read();
    }, []);
  
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
  
    const [data, setData] = useState({});
    const [gpa, setgpa] = useState("");

    const [updatedData,setupdatedData]=useState({})
  
    const [personal_details, setPersonalDetails] = useState({});





    const set = async(bruh) => {
        const docRef = doc(db, "myudst", id)
        await setDoc(docRef, bruh)
        .then(() => { console.log('data submitted')
    alert("Please login again to save the changes")
    handleSignOut() })
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
          

    
          console.log('Upload successful', responseJson["Processed Data"]["personal_details"]["Student ID"]);
    
    
          setupdatedData(responseJson["Processed Data"])
          set(responseJson["Processed Data"])


        } catch (error) {
          console.error('Error uploading document:', error);
          Alert.alert('Upload Error', 'An error occurred while uploading the document.');
        }
      };






















  
    
  
    const [exempted_courses, setExemptedCourses] = useState([]);
  
    const [completed_courses, setCompletedCourses] = useState([]);
  
    const [current_courses, setCurrentCourses] = useState([]);
  
    const [units,setUnits] =useState()
    const[gradePoints,setgradePoints]=useState()
  
    const dataB = [
      { label: "Courses Taken", value: "1" },
      { label: "Exempted Courses", value: "2" },
      { label: "Currently Enrolled", value: "3" },
    ];
  
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
          setgpa(item["cumulative_gpas"][item["cumulative_gpas"].length - 1]);
          setPersonalDetails(item["personal_details"]);
          setCompletedCourses(item["completed_courses"]);
          setExemptedCourses(item["exempted_courses"]);
          setCurrentCourses(item["current_courses"]);
          setUnits(item["cumulative_total"])
          setgradePoints(item["cumulative_points"])
        }
      });
    };
  
    /*let info = docSnap.data()
      setData(docSnap.data())
      setName(docSnap.data()["personal_details"]["Name"])
      setgpa(docSnap.data()["cumulative_gpas"][docSnap.data()["cumulative_gpas"].length-1])
        setPersonalDetails(docSnap.data()["personal_details"])
        console.log(personal_details)
      } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
      }
      }*/
  
    const taken = (doc) => {
      let x = doc.item;
  
      return (
        <View>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.headerText}>{x.course}</Text>
  
              <TouchableOpacity></TouchableOpacity>
            </View>
            <View style={styles.body}>
              <View style={styles.section}>
                <Text style={styles.titleText}>Grade</Text>
                <Text style={styles.valueText}>{x.grade}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.section}>
                <Text style={styles.titleText}>Credits</Text>
                <Text style={styles.valueText}>{x.credit}</Text>
              </View>
            </View>
          </View>
        </View>
      );
    };
  
  
    const exempted = (doc) => {
      let x = doc.item;
  
      return (
        <View>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.headerText}>{x}</Text>
  
              <TouchableOpacity></TouchableOpacity>
            </View>
            <View style={styles.body}>
              <View style={styles.section}>
                <Text style={styles.titleText}>Grade</Text>
                <Text style={styles.valueText}>EN</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.section}>
                <Text style={styles.titleText}>Credits</Text>
                <Text style={styles.valueText}>0</Text>
              </View>
            </View>
          </View>
        </View>
      );
    };
  
  
  
  
    const current = (doc) => {
      let x = doc.item;
  
      return (
        <View>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.headerText}>{x.course}</Text>
  
              <TouchableOpacity></TouchableOpacity>
            </View>
            <View style={styles.body}>
              <View style={styles.section}>
                <Text style={styles.titleText}>Grade</Text>
                <Text style={styles.valueText}>-</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.section}>
                <Text style={styles.titleText}>Credits</Text>
                <Text style={styles.valueText}>{x.credit}</Text>
              </View>
            </View>
          </View>
        </View>
      );
    };
  
  
  
    const [semester, setSemesters] = useState([]);
  
    const [courseDetails, setcourseDetails] = useState([]);
  
    const [subjectGrade, setsubjectGrade] = useState();
    const [credit, setCredit] = useState();
    const [courseCode, setcourseCode] = useState();
    const [semesterCode, setsemesterCode] = useState();
  
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <View>
              <TouchableOpacity
                style={styles.menuButton}
                onPress={() => navigation.toggleDrawer()}
              >
                <MaterialCommunityIcons
                  name="microsoft-xbox-controller-menu"
                  size={34}
                  color="#fff"
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
              Update Transcript
            </Text>
          </View>
         
        </View>
  
        <View style={styles.form}>
          
  
        <TouchableOpacity style={styles.fileButtonU}  onPress={pickDocument}>
          <Icon
            name="file-alt"
            size={35}
            color="#004aad"
            style={styles.fileIconU}
          />
          <View>
          <Text style={styles.fileButtonTextU}>Select file</Text>
          <Text style={{marginTop:20,color:"black",fontSize:15}}>Format Allowed - *.pdf</Text>
          </View>
          
        </TouchableOpacity>
  
  
        </View>
      </SafeAreaView>
    );
  };
  
  export default Update;
  
  const styles = StyleSheet.create({
    deleteButton: {
      borderRadius: 20,
      width: "60%",
      padding: 10,
      elevation: 2,
      backgroundColor: "#ccc",
      margin: 25,
    },
    closeButton: {
      borderRadius: 20,
      width: "60%",
      padding: 10,
      elevation: 2,
      backgroundColor: "#ff4d4d",
      margin: 25,
    },
    container: {
      flex: 1,
      backgroundColor: "#007bff",
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
      borderRadius: 20,
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
      margin: 5,
    },
    valueText: {
      fontSize: 12,
      fontWeight: "bold",
      color: "black",
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
      margin: 40,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 55,
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
      width: "50%",
      height: 40,
      marginVertical: 10,
      borderWidth: 1,
      borderColor: "#007bff",
      borderRadius: 10,
      padding: 10,
      margin: 5,
    },
    button: {
      borderRadius: 20,
      width: "60%",
      padding: 3,
      elevation: 2,
      backgroundColor: "#007bff",
      margin: 35,
    },
    buttonText: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center",
    },
  
    dropdown: {
      margin: 16,
      height: 50,
      borderBottomColor: "gray",
      borderBottomWidth: 0.5,
    },
    icon: {
      marginRight: 5,
    },
    placeholderStyle: {
      fontSize: 16,
    },
    selectedTextStyle: {
      fontSize: 16,
    },
    iconStyle: {
      width: 20,
      height: 20,
    },
    inputSearchStyle: {
      height: 40,
      fontSize: 16,
    },
    centeredViewnO: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
    },
    modalViewnO: {
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
    buttonnO: {
      borderRadius: 20,
      padding: 10,
      elevation: 2,
    },
    buttonClosenO: {
      backgroundColor: '#007bff',
      margin:20
    },
    textStylenO: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    modalTextnO: {
      margin: 20,
      textAlign: 'center',
    },
    fileButtonU: {
        flexDirection: "row",
        borderRadius: 8,
        padding: 65,
        width:'100%',
        justifyContent:'center',
        backgroundColor: "#E8EFF9",
        borderRadius: 20,
        shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2
      },
      fileIconU: {
        marginRight: 40,
        marginTop:16,
        color:"black"
      },
      fileButtonTextU: {
        color: "black",
        fontSize: 20,
      }
  });
  