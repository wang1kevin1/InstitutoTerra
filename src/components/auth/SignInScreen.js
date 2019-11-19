import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Keyboard,
  Alert,
  Animated,
  Button,
} from 'react-native'

import {
  Container,
  Item,
  Input
} from 'native-base'

import { Ionicons } from '@expo/vector-icons';



import Colors from '../../utilities/Colors'


// AWS Amplify modular import
import Auth from '@aws-amplify/auth'

export default class SignInScreen extends React.Component {
  state = {
    email: '',
    password: '',
    fadeIn: new Animated.Value(0),
    fadeOut: new Animated.Value(0),
    isHidden: false
  }
  componentDidMount() {
    this.fadeIn()
  }
  fadeIn() {
    Animated.timing(
      this.state.fadeIn,
      {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true
      }
    ).start()
    this.setState({ isHidden: true })
  }
  fadeOut() {
    Animated.timing(
      this.state.fadeOut,
      {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true
      }
    ).start()
    this.setState({ isHidden: false })
  }
  onChangeText(key, value) {
    this.setState({
      [key]: value
    })
  }
  handleRoute = async (destination) => {
    await this.props.navigation.navigate(destination)
  }
  // Sign in users with Auth
  async signIn() {
    const { email, password } = this.state
    await Auth.signIn(email, password)
      .then(user => {
        this.setState({ user })
        this.props.navigation.navigate('Authloading')
      })
      .catch(err => {
        if (!err.message) {
          console.log('Error when signing in: ', err)
          Alert.alert('Error when signing in: ', err)
        } else {
          console.log('Error when signing in: ', err.message)
          Alert.alert('Error when signing in: ', err.message)
        }
      })
  }
  

  render() {
    let { fadeOut, fadeIn, isHidden } = this.state
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
                  {/* Text Entry for Email/Password */}
                  <Item style={styles.itemStyle}>
                    <Ionicons name="ios-mail" style={styles.iconStyle} />
                    <Input
                      style={styles.input}
                      placeholder='Email'
                      placeholderTextColor={Colors.lightblue}
                      keyboardType={'email-address'}
                      returnKeyType='next'
                      autoCapitalize='none'
                      autoCorrect={false}
                      onSubmitEditing={(event) => { this.refs.SecondInput._root.focus() }}
                      onChangeText={value => this.onChangeText('email', value)}
                      onFocus={() => this.fadeOut()}
                      onEndEditing={() => this.fadeIn()}
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
                      ref='SecondInput'
                      onChangeText={value => this.onChangeText('password', value)}
                      onFocus={() => this.fadeOut()}
                      onEndEditing={() => this.fadeIn()}
                    />
                  </Item>
                  {/* SignIn Button */}
                  <TouchableOpacity
                    onPress={() => this.signIn()}
                    style={styles.buttonStyle1}>
                    <Text style={styles.buttonText1}>
                      Sign In
                    </Text>
                  </TouchableOpacity>
                  {/* Create Account Button */}
                  <TouchableOpacity
                    onPress={() => this.handleRoute('SignUp')}
                    style={styles.buttonStyle2}>
                    <Text style={styles.buttonText2}>
                      New User? Create an Account!
                    </Text>
                  </TouchableOpacity>
                  {/* Forgot Password Button */}
                  <TouchableOpacity
                    onPress={() => this.handleRoute('ForgotPassword')}
                    style={styles.buttonStyle2}>
                    <Text style={styles.buttonText2}>
                      Forgot Password?
                    </Text>
                  </TouchableOpacity>
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
    height: 200,
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
    flex: 0.1,
    justifyContent: 'center',
    alignSelf: 'center'
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
  buttonStyle2: {
    alignItems: 'center',
    backgroundColor: Colors.lightgreen,
    padding: 5,
    marginBottom: 10,
    borderRadius: 10,
  },
  buttonText2: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.lightblue,
  },
  
})