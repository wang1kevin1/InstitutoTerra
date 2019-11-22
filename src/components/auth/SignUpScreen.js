import React from 'react'

import {
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  Keyboard,
  View,
  Alert,
  ActivityIndicator,
} from 'react-native'

import {
  Container,
  Item,
  Input} from 'native-base'

import { Ionicons } from '@expo/vector-icons';

import Colors from '../../utilities/Colors'

import Auth from '@aws-amplify/auth'

export default class SignUpScreen extends React.Component {
  state = {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    isLoading: false,
    hidePassword1: true,
    hidePassword2: true
  }
  
  onChangeText(key, value) {
    this.setState({
      [key]: value
    })
  }

  // toggles secure text password 
  handleHidePassword1 = () => {
    if (this.state.hidePassword1) {
      this.setState({hidePassword1: false})
    } else {
      this.setState({hidePassword1: true})
    }
  }

  // toggles secure text password confirmation
  handleHidePassword2 = () => {
    if (this.state.hidePassword2) {
      this.setState({hidePassword2: false})
    } else {
      this.setState({hidePassword2: true})
    }
  }

  // checks for password match
  handleSignUp = () => {
    if (this.state.password !== this.state.password_confirmation) {
      Alert.alert('Passwords do not match')
    } else {
      this.signUp()
    }
  }

  // Sign up user with AWS Amplify Auth
  async signUp() {
    Keyboard.dismiss()
    this.setState({ isLoading: true })
    await Auth.signUp({
      username: this.state.email,
      password: this.state.password,
      attributes: { 
        email: this.state.email,
        name: this.state.name,
      }
    })
    .then(() => {
      this.setState({ isLoading: false })
      console.log('sign up successful!')
      Alert.alert('An email has been sent to confirm your sign up')
      this.props.navigation.navigate('SignIn')
    })
    .catch(err => {
      this.setState({ isLoading: false })
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
        <KeyboardAvoidingView style={styles.container} behavior='padding' enabled>
          <TouchableWithoutFeedback
            style={styles.container}
            onPress={Keyboard.dismiss}>
            <View style={styles.container}>
              <Container style={styles.infoContainer}>
                <View style={styles.container}>
                  {/* Name */}
                  <Item style={styles.itemStyle}>
                    <Ionicons style={styles.iconStyle1} name="ios-person" />
                    <Input
                      style={styles.input}
                      placeholder='Name'
                      placeholderTextColor={Colors.lightblue}
                      returnKeyType='next'
                      autoCapitalize='none'
                      autoCorrect={false}
                      onSubmitEditing={(event) => { this.refs.SecondInput._root.focus() }}
                      onChangeText={value => this.onChangeText('name', value)}
                    />
                  </Item>
                  {/* Email */}
                  <Item style={styles.itemStyle}>
                    <Ionicons style={styles.iconStyle1} name="ios-mail" />
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
                  {/* Password */}
                  <Item style={styles.itemStyle}>
                    <Ionicons style={styles.iconStyle1} name="ios-lock" />
                    <Input
                      style={styles.input}
                      placeholder='Password'
                      placeholderTextColor={Colors.lightblue}
                      returnKeyType='go'
                      autoCapitalize='none'
                      autoCorrect={false}
                      secureTextEntry={this.state.hidePassword1}
                      ref='ThirdInput'
                      onSubmitEditing={(event) => { this.refs.FourthInput._root.focus() }}
                      onChangeText={value => this.onChangeText('password', value)}
                    />
                    <Ionicons style={styles.iconStyle2} name="ios-eye" onPress={() => this.handleHidePassword1()}/>
                  </Item>
                  {/* Confirm Password */}
                  <Item style={styles.itemStyle}>
                    <Ionicons style={styles.iconStyle1} name="ios-lock" />
                    <Input
                      style={styles.input}
                      placeholder='Confirm Password'
                      placeholderTextColor={Colors.lightblue}
                      returnKeyType='go'
                      autoCapitalize='none'
                      autoCorrect={false}
                      secureTextEntry={this.state.hidePassword2}
                      ref='FourthInput'
                      onChangeText={value => this.onChangeText('password_confirmation', value)}
                    />
                    <Ionicons style={styles.iconStyle2} name="ios-eye" onPress={() => this.handleHidePassword2()}/>
                  </Item>
                  {/* SignUp Button */}
                  <TouchableOpacity
                    onPress={() => this.handleSignUp()}
                    disabled={this.state.isLoading}
                    style={styles.buttonStyle1}>
                    <Text style={styles.buttonText1}>
                      Sign Up
                    </Text>
                  </TouchableOpacity>
                  {/* Loading ActivityIndicator */}
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
  iconStyle1: {
    color: Colors.lightblue,
    fontSize: 30,
    marginRight: 15,
    marginLeft: 15,
    flex: 0.1
  },
  iconStyle2: {
    color: Colors.grey,
    fontSize: 20,
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