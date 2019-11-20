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
  Modal,
  FlatList,
  Animated,
} from 'react-native'

import {
  Container,
  Item,
  Input} from 'native-base'

import { Ionicons } from '@expo/vector-icons';

import Colors from '../../utilities/Colors'

import Auth from '@aws-amplify/auth'

// Import data for countries
import data from '../../utilities/CountryCode'

export default class SignUpScreen extends React.Component {
  state = {
    username: '',
    email: '',
    password: '',
    password_confirmation: '',
  }
  // Get user input
  onChangeText(key, value) {
    this.setState({
      [key]: value
    })
  }

  // Sign up user with AWS Amplify Auth
  async signUp() {
    const { username, password, email } = this.state
    // rename variable to conform with Amplify Auth field phone attribute
    await Auth.signUp({
      email,
      password,
      attributes: { username }
    })
    .then(() => {
      console.log('sign up successful!')
      Alert.alert('An email has been sent to confirm your sign up.')
    })
    .catch(err => {
      if (! err.message) {
        console.log('Error when signing up: ', err)
        Alert.alert('Error when signing up: ', err)
      } else {
        console.log('Error when signing up: ', err.message)
        Alert.alert('Error when signing up: ', err.message)
      }
    })
  }
  
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar />
        <KeyboardAvoidingView style={styles.container} behavior='padding' enabled>
          <TouchableWithoutFeedback
            style={styles.container}
            onPress={Keyboard.dismiss}>
            <View style={styles.container}>
              <Container style={styles.infoContainer}>
                <View style={styles.container}>
                  {/* Text Entry for User Info */}
                  <Item style={styles.itemStyle}>
                    <Ionicons style={styles.iconStyle} name="ios-person" />
                    <Input
                      style={styles.input}
                      placeholder='Name'
                      placeholderTextColor={Colors.lightblue}
                      returnKeyType='next'
                      autoCapitalize='none'
                      autoCorrect={false}
                      onSubmitEditing={(event) => { this.refs.SecondInput._root.focus() }}
                      onChangeText={value => this.onChangeText('username', value)}
                    />
                  </Item>
                  <Item style={styles.itemStyle}>
                    <Ionicons style={styles.iconStyle} name="ios-mail" />
                    <Input
                      style={styles.input}
                      placeholder='Email'
                      placeholderTextColor={Colors.lightblue}
                      returnKeyType='next'
                      autoCapitalize='none'
                      autoCorrect={false}
                      keyboardType={'email-address'}
                      ref='SecondInput'
                      onSubmitEditing={(event) => { this.refs.ThirdInput._root.focus() }}
                      onChangeText={value => this.onChangeText('email', value)}
                    />
                  </Item>
                  <Item style={styles.itemStyle}>
                    <Ionicons style={styles.iconStyle} name="ios-lock" />
                    <Input
                      style={styles.input}
                      placeholder='Password'
                      placeholderTextColor={Colors.lightblue}
                      returnKeyType='go'
                      autoCapitalize='none'
                      autoCorrect={false}
                      secureTextEntry={true}
                      ref='ThirdInput'
                      onSubmitEditing={(event) => { this.refs.FourthInput._root.focus() }}
                      onChangeText={value => this.onChangeText('password', value)}
                    />
                  </Item>
                  <Item style={styles.itemStyle}>
                    <Ionicons style={styles.iconStyle} name="ios-lock" />
                    <Input
                      style={styles.input}
                      placeholder='Confirm Password'
                      placeholderTextColor={Colors.lightblue}
                      returnKeyType='go'
                      autoCapitalize='none'
                      autoCorrect={false}
                      secureTextEntry={true}
                      ref='FourthInput'
                      onChangeText={value => this.onChangeText('password_confirmation', value)}
                    />
                  </Item>
                  {/* SignUp Button */}
                  <TouchableOpacity
                    onPress={() => this.signUp()}
                    disabled={this.state.isLoading}
                    style={styles.buttonStyle1}>
                    <Text style={styles.buttonText1}>
                      Sign Up
                    </Text>
                  </TouchableOpacity>
                  {this.state.isLoading &&
                    <View>
                      <ActivityIndicator color={Colors.lightblue} size='large' animating={this.state.isLoading} />
                    </View>
                  }
                </View>
              </Container>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    )
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
  iconStyle: {
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