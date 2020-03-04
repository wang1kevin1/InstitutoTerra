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

import COLORS from '../../assets/Colors.js'

import Auth from '@aws-amplify/auth'

import { API } from 'aws-amplify'

import i18n from 'i18n-js'

export default class SignUpScreen extends React.Component {
  state = {
    userSub: '',
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    isLoading: false,
    hidePassword1: true,
    hidePassword2: true,
    apiResponse: null,
    UserId: ''
  }
 
  handleChangeUserId = (event) => {
      this.setState({UserId: event});
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
      Alert.alert(i18n.t('Passwords do not match'))
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
    .then(data => {
      // grab user unique sub
      console.log('sign up successful with result: ', data)
      this.setState({data})
      this.setState({userSub: data.userSub})
      console.log(this.state.userSub)
      Alert.alert(i18n.t('An email has been sent to confirm your sign up'))
      this.saveUser()
    })
    .catch(err => {
      this.setState({ isLoading: false })
      if (! err.message) {
        console.log('Error when signing up: ', err)
        Alert.alert(i18n.t('Error when signing up: '), err)
      } else {
        console.log('Error when signing up: ', err.message)
        Alert.alert(i18n.t('Error when signing up: '), err.message)
      }
    })
  }

  // adds user to Amplify database
  async saveUser() {
    let newUser = {
      body: {
        "UserId": this.state.userSub,
        "TreesPlanted": 0,
      }
    }
    const path = "/Users";

    // Use the API module to save the note to the database
    await API.put("ZeroCarbonREST", path, newUser)
      .then(apiResponse => {
        this.setState({apiResponse});
        console.log("Response from saving user: " + apiResponse);
        this.setState({ isLoading: false })
        this.props.navigation.navigate('SignIn')
      })
      .catch(e => {
      console.log(e);
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
                      placeholder={i18n.t('Name')}
                      placeholderTextColor={COLORS.lightblue}
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
                      placeholder={i18n.t('Email')}
                      placeholderTextColor={COLORS.lightblue}
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
                      placeholder={i18n.t('Password')}
                      placeholderTextColor={COLORS.lightblue}
                      returnKeyType='next'
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
                      placeholder={i18n.t('Confirm Password')}
                      placeholderTextColor={COLORS.lightblue}
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
                      {i18n.t('Sign Up')}
                    </Text>
                  </TouchableOpacity>
                  {/* Loading ActivityIndicator */}
                  {this.state.isLoading &&
                    <View>
                      <ActivityIndicator color={COLORS.lightblue} size='large' animating={this.state.isLoading} />
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
    backgroundColor: COLORS.lightgreen,
    justifyContent: 'center',
    flexDirection: 'column'
  },
  input: {
    flex: 1,
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.lightblue,
  },
  infoContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    backgroundColor: COLORS.lightgreen,
  },
  itemStyle: {
    marginBottom: 20,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    borderColor: 'transparent'
  },
  iconStyle1: {
    color: COLORS.lightblue,
    fontSize: 30,
    marginRight: 15,
    marginLeft: 15,
    flex: 0.1
  },
  iconStyle2: {
    color: COLORS.grey,
    fontSize: 20,
    marginRight: 15,
    marginLeft: 15,
    flex: 0.1
  },
  buttonStyle1: {
    alignItems: 'center',
    backgroundColor: COLORS.lightblue,
    padding: 14,
    marginBottom: 20,
    borderRadius: 10,
  },
  buttonText1: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
  },
})