import {StyleSheet,Dimensions, Image,Text, View, TouchableOpacity, Platform, TextInput,ScrollView } from 'react-native';
import React from 'react'
import { AntDesign, MaterialIcons } from 'react-native-vector-icons'
import { Avatar, Card } from '@rneui/themed';

const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height

const PlaceCard = ( {place} ) => {

  
  return (

    <View style={styles.card}>
      
      <View style={styles.placeName}>
        <Text>{courseCode}</Text>
        <Text>{y.credit}</Text>
        <Text>{y.target_grade}</Text>
      </View>

    </View>

  )
}

export default PlaceCard

const styles = StyleSheet.create({
  card:{
    backgroundColor: 'white',
    width: screenWidth * 0.25,
    height: screenHeight * 0.17,
    borderRadius: 4,
    margin: 10,
  },
  imageContainer:{
    // backgroundColor: 'pink',
    width: '90%',
    height: '65%',
    borderRadius: 4,
    marginLeft: 5,
    marginTop: 3,
    overflow: 'hidden'
  },
  image:{
    width: 100,
    height: 110,
  },
  placeName:{
    marginTop: 4,
    // backgroundColor: 'pink',
    height: '20%'
  },
  title:{
    paddingLeft: 6,
    fontSize: 13,
    fontWeight: 'bold',
    color: '#5A5A5A',
    // backgroundColor: 'tomato'
  },
  iconContainer:{
    // backgroundColor: 'red',
    alignItems: 'flex-end',
    marginRight: 4,
  },
})