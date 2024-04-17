import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    FlatList,
    Modal,
    TextInput,
    KeyboardAvoidingView, 
    Alert,
  } from "react-native";
  import React, { useEffect, useState } from "react";
  
  import { Ionicons } from "@expo/vector-icons";
  import { SafeAreaView } from "react-native-safe-area-context";
  import { MaterialCommunityIcons } from "@expo/vector-icons";
  import { Button, Divider } from "react-native-elements";
  
  
  
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
import { CurrentRenderContext } from "@react-navigation/native";

const Recommendation = ( { navigation, route }) => {
    const { id } = route.params;
    console.log("The ID is : ", id);
    const [data, setData] = useState({})
    const [currentCourses, setCurrentCourses] = useState({})
    const [processedData, setProcessedData] = useState()
    const [firstPart, setfirstPart] = useState()

    const readCurrentCourses = async () => {
      console.log("The second function")
      console.log("The data is read?")
      const q = query(collection(db, "prediction"));
      const docs = await getDocs(q);
  
      let temp = [];
      docs.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
  
        temp.push(doc.data());
      });
      temp.forEach((item) => {
        
        if (item["Student ID"] === id) {
          
          setCurrentCourses(item)
          setProcessedData({"Processed Data": {...data,...currentCourses}})
        }
        console.log("The teim is "+JSON.stringify(processedData))
      });
      
    };

    
    const read = async (id) => {
      console.log("The first function")
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
          
        }
      },
      );
       
      
        //await getRecommendedList();
    };
    
    // const readCurrentCourses = async () => {
    //   const docRef = doc(db, "prediction", id);
    //   const docSnap = await getDoc(docRef);
    //   if (docSnap.exists()) {
    //     setCurrentCourses(docSnap.data())
    //     setProcessedData({"Processed Data": {...data,...currentCourses}})
    //   } 
    //   else {
    //   // doc.data() will be undefined in this case
    //       console.log("No such document!");
    //   }
    // }

    



    
    const getRecommendedList = async () => {
      try {
        const response = await fetch('http://192.168.100.26:5000/recommendedlist', {
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
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to send data to server');
        }
    }

    useEffect(() => {
      read();
    }, []);

    
    
    console.log(processedData)
    // console.log(firstPart)

    // const [targetCgpa, setTargetCgpa] = useState(firstPart.current_cgpa)
    
    // const decCgpa = () => {
    //   let temp = targetCgpa - 0.01
    //   temp = temp.toFixed(2)
    //   temp = parseFloat(temp)
    //   setTargetCgpa(temp)
    // }

    // const incCgpa = () => {
    //   let temp = targetCgpa + 0.01
    //   temp = temp.toFixed(2)
    //   temp = parseFloat(temp)
    //   setTargetCgpa(temp)
    // }

    // const getPossibleCombinations = async () => {
    //   try {
    //     const response = await fetch('http://192.168.100.26:5000/possiblecombinations', {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify({firstPart,"target_cgpa":targetCgpa}),
    //     });
  
    //     if (!response.ok) {
    //       throw new Error('Network response was not ok');
    //     }
    //     const responseData = await response.json();
    //     console.log(responseData)
    //   } catch (error) {
    //     console.error(error);
    //     Alert.alert('Error', 'Failed to send data to server');
    //     }
    // }

        
  return (
    <View>
      <Text>Recommendation</Text>
      {/* {console.log(firstPart)} */}
      {/* <View style={{flexDirection:"row"}}>
        <AntDesign name="leftcircle" size={30} onPress={targetCgpa>firstPart.current_cgpa?decCgpa:null}/>
        <Text>{targetCgpa}</Text>
        <AntDesign name="rightcircle" size={30} onPress={targetCgpa<firstPart.max_cgpa?incCgpa:null}/>
      </View> */}

      {/* <Button title={"click me"} onPress={() => getPossibleCombinations} /> */}

    {/* {firstPart?
      <View style={{flexDirection:"row", justifyContent:"space-around", marginTop:40}}>
        <Text>Course</Text>
        <Text>Credit</Text>
        <Text>Grade</Text>
      </View>
      :<Text>Nothing</Text>
    }

    {firstPart?firstPart.map((x,index)=>
        <View key={index}>
        {x.map((y,i)=>{
            const parts = y.course.split(' ');
            const courseCode = parts.slice(0, 2).join(' ');
            return (
            <View style={{flexDirection:"row", justifyContent:"space-around"}} key={i}>
                <Text>{courseCode}</Text>
                <Text>{y.credit}</Text>
                <Text>{y.target_grade}</Text>
            </View>
            )
        }
        )}
        <Text>{""}</Text>
        </View>
    ):null} */}
    </View>
  )
}

export default Recommendation

const styles = StyleSheet.create({})