import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
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
  set,
} from "firebase/firestore";
import { db } from "../Config";
import Tabs from "./Tabs";
import Drawers from "./Drawers";
import AntDesign from "react-native-vector-icons/AntDesign";
import { auth } from "../Config";

import Icon from "react-native-vector-icons/FontAwesome5";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { AirbnbRating } from "react-native-ratings";
import { Alert } from 'react-native';

const Feedback = ({ navigation, route }) => {
  const [rating, setRating] = useState(0);

  const ratingCompleted = (newRating) => {
    console.log("Rating is: " + newRating);
    setRating(newRating);
  };

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

  const item = (doc) => {
    {
      console.log("The Data is : ", doc.item.semesters[0].courses);
    }
    let semesters = doc.item.semesters;
    return (
      <View>
        {semesters.map((x) => (
          <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
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

  const [feedback, setfeedBack] = useState();
  const [alist, setList] = useState([]);

  const handleFeedbackSubmit = async () => {
    const docRef = doc(db, "feedback", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      let feedbackList = docSnap.data()["feedbacks"];
      console.log("Feedback List : ", feedbackList);
      let temp = [];

      if (typeof feedbackList != "undefined") {
        for (pack of feedbackList) {
          console.log("The pack is : ", pack);
          temp.push(pack);
        }
      }

      temp.push(feedback);
      console.log("The feedback is ", feedback);
      console.log("The temp is : ", temp);
      setList(temp);
      alert("Thank You for your Feedback");
      await updateFeedback(temp);
    } else {
      await setDoc(docRef, { feedbacks: [feedback] })
.then(() => { console.log('data submitted') 
alert("Thank You for your Feedback");
setfeedBack("");
        setList([])})
.catch((error) => { console.log(error.message) })
    }
  };
  const updateFeedback = async (temp) => {
    const docRef = doc(db, "feedback", id);
    console.log("A List : ", temp);
    await setDoc(docRef, { feedbacks: temp })
      .then(() => {
        console.log("data submitted");
        setfeedBack("");
        setList([]);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

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
            Feedback Form
          </Text>
        </View>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={feedback}
            onChangeText={(text) => setfeedBack(text)}
            placeholder="Share your thoughts with us..."
            placeholderTextColor="#A1A1A1"
            returnKeyType="done"
          />

          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              padding: 10,
            }}
          >
            <Text style={styles.orText}>How do you rate our app?</Text>
            <AirbnbRating
              count={5}
              reviews={["Terrible", "Bad", "Okay", "Good", "Great"]}
              defaultRating={3}
              size={30}
              onFinishRating={ratingCompleted}
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={() => handleFeedbackSubmit()}
          style={styles.continueButton}
        >
          <Text style={styles.continueButtonText}>Submit Feedback</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Feedback;

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
    justifyContent: "space-around",
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
    fontSize: 16,
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
    fontSize: 18,
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
    color: "black",
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
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 2,
    borderColor: "#CDCDCD",
    borderRadius: 25,
    padding: 10,
    minHeight: 100,
    backgroundColor: "#FFF",
    color: "#333",
    fontSize: 18,
    elevation: 2,
    paddingBottom: 200,
  },
  submitButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },
  submitButtonText: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "600",
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
});
