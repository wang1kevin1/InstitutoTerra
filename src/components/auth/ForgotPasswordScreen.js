import React from 'react'

import {
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Text,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Keyboard,
  View,
  Alert,
} from 'react-native'

import {
  Container,
  Item,
  Input
} from 'native-base'

import { Ionicons } from '@expo/vector-icons';

import Colors from '../../utilities/Colors'

import Auth from '@aws-amplify/auth'

export default class ForgetPasswordScreen extends React.Component {
  state = {
    email: '',
  }
  
  onChangeText(key, value) {
    this.setState({
      [key]: value
    })
  }
  // Request a new password
  async forgotPassword() {
    this.setState({ username: this.state.email })
    await Auth.forgotPassword(this.state.email)
    .then(data => {
      console.log('New code sent', data)
      Alert.alert('A validation code has been sent to your email')
    })
    .catch(err => {
      if (! err.message) {
        console.log('Error while sending validation code: ', err)
        Alert.alert('Error while sending validation code: ', err)
      } else {
        console.log('Error while sending validation code: ', err.message)
        Alert.alert('Error while sending validation code: ', err.message)
      }
    })
  }
  
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar/>
        <KeyboardAvoidingView 
          style={styles.container} 
          behavior='padding' 
          enabled 
          keyboardVerticalOffset={23}>
          <TouchableWithoutFeedback style={styles.container} onPress={Keyboard.dismiss}>
            <View style={styles.container}>
              <Container style={styles.infoContainer}>
                <View style={styles.container}>
                  {/* Email */}
                  <Item style={styles.itemStyle}>
                    <Ionicons name="ios-mail" style={styles.iconStyle1} />
                    <Input
                      style={styles.input}
                      placeholder='Email'
                      placeholderTextColor={Colors.lightblue}
                      keyboardType={'email-address'}
                      returnKeyType='go'
                      autoCapitalize='none'
                      autoCorrect={false}
                      onChangeText={value => this.onChangeText('email', value)}
                    />
                  </Item>
                  <TouchableOpacity
                    onPress={() => this.forgotPassword()}
                    style={styles.buttonStyle1}>
                    <Text style={styles.buttonText1}>
                      Send Code
                    </Text>
                  </TouchableOpacity>
                </View>
              </Container>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightgreen,
    justifyContent: 'center',
    flexDirection: 'column'
  },
  input: {
    flex: 1,
    fontSize: 17,
    fontWeight: 'bold',
    color: Colors.lightblue,
  },
  infoContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    backgroundColor: Colors.lightgreen,
  },
  itemStyle: {
    marginBottom: 20,
    backgroundColor: Colors.white,
    borderRadius: 10,
  },
  iconStyle1: {
    color: Colors.lightblue,
    fontSize: 30,
    marginRight: 15,
    marginLeft: 15,
    flex: 0.1
  },
  buttonStyle1: {
    alignItems: 'center',
    backgroundColor: Colors.lightblue,
    padding: 14,
    marginBottom: 20,
    borderRadius: 10,
  },
  buttonText1: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.white,
  },
})