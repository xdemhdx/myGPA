import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import React, { useEffect, useState } from "react";

import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Divider } from "react-native-elements";

import { Picker } from '@react-native-picker/picker';



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

const Predict = ({ navigation, route }) => {
  const toggleDialog1 = () => {
    setVisible1(!visible1);
  };
  const [visible1, setVisible1] = useState(false);


  const tableHead = ['Grade', 'Range', 'Points'];
  const tableData = [
    ['A', '90-100', '4'],
    ['B+', '85-89', '3.5'],
    ['B', '80-84', '3'],
    ['C+', '75-79', '2.5'],
    ['C', '70-74', '2'],
    ['D+', '65-69', '1.5'],
    ['D', '60-64', '1'],
    ['F', '0-59', '0'],

    // Add more rows as needed
  ];

  const [selectedGrade, setSelectedGrade] = useState('A');
 

  const { id } = route.params;
  console.log("The ID is : ", id);
  const [modalVisible, setModalVisible] = useState(false);

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
    read(id);
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

  const calculatetermGPA = (courseList) => {
    let totalUnits = calculateUnits(courseList);
    let totalPoints = 0;

    for (courses of courseList) {
      console.log(courses.letterGrade);
      let points = courses.credit * gradingScheme[courses.letterGrade];
      totalPoints += points;
    }

    console.log(totalPoints);
    gpa = totalPoints / totalUnits;
    return Math.floor(gpa * 100) / 100;
  };

  

  const calculateUnits = (courseList) => {
    let totalUnits = 0;
    for (courses of courseList) {
      totalUnits += courses.credit;
    }
    return totalUnits;
  };

const [color,setColor] = useState(false)
const [predictionList,setPredictionList] = useState([])
const [grade,setGrade] = useState()

  const predictGPA = (x) => {

    if (grade == "") {
      return
    }

    if (!(grade in gradingScheme)) {
      alert("Invalid Grade Entered")
      setGrade("")
      return
    }

    for(pack of predictionList){
      if (pack["course"]== x["course"]) {
        let index = predictionList.indexOf(pack)
        predictionList.splice(index, 1);
      }
    }
    x["grade"]=grade
        alert("Course : "+x["course"]+"\nExpected Grade : "+grade)
    setGrade("")

    predictionList.push(x)
    setPredictionList(predictionList)

    console.log(predictionList)
  }


  const calculateGPA = async () => {

    let totalUnits = 0
    let totalPoints = 0

    for(pack of predictionList){
        totalUnits += Number(pack["credit"])
        console.log("The credits are"+pack["credit"])
        totalPoints += gradingScheme[pack["grade"]] * Number(pack["credit"])
        console.log("The points are"+gradingScheme[pack["grade"]])
    }

    console.log("The total points are "+totalPoints)
    console.log("The total units "+totalUnits)

    let previous_totals = totals + totalPoints
    console.log("The totals :::"+totals)

    alert("Expected Term GPA : "+totalPoints/totalUnits + "\nExpected CGPA : "+(totalPoints+points)/(totalUnits+totals))

    let obj = {"data":predictionList,"predicted_termgpa":totalPoints/totalUnits,"Student ID":id,"predicted_cgpa":(totalPoints+Number(points))/(totalUnits+Number(totals))}
      const docRef = doc(db, "prediction", id)
      await setDoc(docRef, obj)
      .then(() => { console.log('data submitted') })
      .catch((error) => { console.log(error.message) })


     

      setGrade("")
      setPredictionList([])

      
      

  }

  const item = (doc) => {
    {
      console.log("The Data is : ", doc.item.semesters[0].courses);
    }
    let semesters = doc.item.semesters;
    return (
      <View>
        {semesters.map((x) => (
          <TouchableOpacity>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.headerText}>{x.semesterName}</Text>
                <TouchableOpacity></TouchableOpacity>
              </View>
              <View style={styles.body}>
                <View style={styles.section}>
                  <Text style={styles.titleText}>Term GPA</Text>
                  <Text style={styles.valueText}>
                    {calculatetermGPA(x.courses)}
                  </Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.section}>
                  <Text style={styles.titleText}>Total Units</Text>
                  <Text style={styles.valueText}>
                    {calculateUnits(x.courses)}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const [name, setName] = useState();
  const [semester, setSemesters] = useState([]);

  const [current_courses, setCurrentCourses] = useState([]);

  const [totals,setTotals] = useState()
  const [points,setPoints] = useState()

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
        
        setName(item["personal_details"]["Name"]);
        setCurrentCourses(item["current_courses"]);
        setTotals(item["cumulative_total"])
        setPoints(item["cumulative_points"])
      }
    });
  };

  const cumulativeGPA = () => {
    let totalGradePoints = 0;
    let totalCredits = 0;

    semester.forEach((pack) => {
      console.log("The pack", pack);
      pack.semesters.forEach((pack2) => {
        pack2.courses.forEach((pack3) => {
          const gradePoint = gradingScheme[pack3.letterGrade];
          const credit = pack3.credit;
          totalGradePoints += gradePoint * credit;
          totalCredits += credit;
        });
      });
    });
    console.log("Total grade points ", totalGradePoints);
    gpa = totalGradePoints / totalCredits;
    return Math.floor(gpa * 1000) / 1000;



  };


  const current = (doc) => {
    let x = doc.item;
    console.log(doc.index)

    return (
      <KeyboardAvoidingView>
        <View>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.headerText}>{x.course}</Text>

          
        </View>
        <View style={styles.body}>
          <View style={styles.section}>
            <Text style={styles.titleText}>Grade</Text>
            <TextInput placeholder = "Enter Letter Grade..."  autoCapitalize="characters" style = {styles.valueText} onChangeText={setGrade}
            />
          </View>

          <View style={styles.divider} />
          <View style={styles.section}>
            <Text style={styles.titleText}>Credits</Text>
            <Text style={styles.valueText}>{x.credit}</Text>
          </View>
          
        </View>

        <View>
          
        </View>
        
        <TouchableOpacity style={styles.continueButtonA} onPress={()=>predictGPA(x)} >
          <Text style={styles.continueButtonTextA}>Set Grade</Text>
        </TouchableOpacity>
        
        
      </View>
      
    </View>
      </KeyboardAvoidingView>
      
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
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
            Calculate GPA and CGPA
          </Text>
        </View>
      </View>

      <View style={styles.form}>
<TouchableOpacity style = {{margin:20}} onPress={() => setModalVisible(true)}>
<Text style={styles.textB}>Click here for Grading Scheme</Text>
</TouchableOpacity>



<Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredViewN}>
          <View style={styles.modalViewN}>
            {/* Inline Table starts here */}
            <View style={styles.tableContainerN}>
              <View style={styles.tableHeaderN}>
                {tableHead.map((header, index) => (
                  <Text key={index} style={styles.headerTextN}>{header}</Text>
                ))}
              </View>
              {tableData.map((rowData, index) => (
                <View key={index} style={styles.tableRowN}>
                  {rowData.map((cellData, cellIndex) => (
                    <Text key={cellIndex} style={styles.cellTextN}>{cellData}</Text>
                  ))}
                </View>
              ))}
            </View>
            {/* Inline Table ends here */}
            <TouchableOpacity
              style={{ ...styles.openButtonN, backgroundColor: "#007bff" }}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <Text style={styles.textStyleN}>Exit               </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
        

      
        

      
        <FlatList data={current_courses} renderItem={current}/>
      
        

        

        <TouchableOpacity style={styles.continueButton} onPress={calculateGPA}>
          <Text style={styles.continueButtonText}>Calculate</Text>
        </TouchableOpacity>

        

       
      </View>
      <View>
        
      </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Predict;

const styles = StyleSheet.create({
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
