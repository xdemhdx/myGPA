import React from 'react';
import { 
  StyleSheet, 
  View, 
  Image, 
  TextInput, 
  Text, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  StatusBar
} from 'react-native';
import LoginScreen from './LoginScreen';
import RegistrationScreen from './RegistrationScreen';


// Adjusting the primary color to a lighter shade of blue
const primaryColor = '#007bff'; 
const secondaryColor = '#FFFFFF'; // White color for text and other elements

const App = ({ navigation }) => {
  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor={primaryColor} />
      
      <Image source={require('../Images/logo.png')} style={styles.logo} />
      <Text style={styles.welcomeText}>Welcome to Our App</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.loginButton]} onPress={() => navigation.navigate("LoginScreen")}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.registerButton]} onPress={() => navigation.navigate("RegistrationScreen")}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: primaryColor, // lighter blue background
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: secondaryColor,
    marginBottom: 30,
  },
  logo: {
    height: 120,
    width: 120,
    resizeMode: 'contain',
    marginBottom: 50,
  },
  buttonContainer: {
    width: '80%',
  },
  button: {
    width: '100%',
    padding: 20,
    borderRadius: 30,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButton: {
    backgroundColor: secondaryColor, // white color for the login button
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  registerButton: {
    backgroundColor: '#D1E8FF', // a much lighter blue for a subtle look
  },
  buttonText: {
    color: primaryColor, // dark blue text to stand out on the light buttons
    fontWeight: 'bold',
    fontSize: 18,
  },
  input: {
    // Input styles will go here
  },
});

export default App;
