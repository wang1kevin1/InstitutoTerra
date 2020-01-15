import React from 'react'

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  SafeAreaView,
  KeyboardAvoidingView,
  Keyboard,
  Alert,
  ActivityIndicator,
} from 'react-native'

import {
  Container,
  Item,
  Input
} from 'native-base'

import { Ionicons } from '@expo/vector-icons';

import Colors from '../../assets/Colors'

import Auth from '@aws-amplify/auth'

export default class SignInScreen extends React.Component {
  state = {
    email: '',
    password: '',
    isLoading: false,
  }

  onChangeText(key, value) {
    this.setState({
      [key]: value
    })
  }

  // Sign in users with Auth
  async signIn() {
    const { email, password } = this.state
    Keyboard.dismiss()
    this.setState({ isLoading: true })
    await Auth.signIn(email, password)
      .then(user => {
        this.setState({ user })
        this.setState({ isLoading: false })
        this.props.navigation.navigate('Home')
      })
      .catch(err => {
        this.setState({ isLoading: false })
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
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView style={styles.container} behavior='padding' enabled>
          <TouchableWithoutFeedback
            style={styles.container}
            onPress={Keyboard.dismiss}>
            <View style={styles.container}>
              <Container style={styles.infoContainer}>
                <View style={styles.container}>
                  {/* Email */}
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
                      onSubmitEditing={(event) => { this.refs.SecondInput._root.focus() }}
                      onChangeText={value => this.onChangeText('email', value)}
                    />
                  </Item>
                  {/* Password */}
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
                    />
                  </Item>
                  {/* Sign In Button */}
                  <TouchableOpacity
                    onPress={() => this.signIn()}
                    disabled={this.state.isLoading}
                    style={styles.buttonStyle1}>
                    <Text style={styles.buttonText1}>
                      Sign In
                    </Text>
                  </TouchableOpacity>
                  {/* Sign Up Text */}
                  <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('SignUp')}
                    style={styles.buttonStyle2}>
                    <Text style={styles.buttonText2}>
                      New User? Create an Account!
                    </Text>
                  </TouchableOpacity>
                  {/* Forgot Password Text */}
                  <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('ForgotPassword')}
                    style={styles.buttonStyle2}>
                    <Text style={styles.buttonText2}>
                      Forgot Password?
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
    borderColor: 'transparent'
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
  buttonStyle2: {
    alignItems: 'center',
    backgroundColor: Colors.lightgreen,
    padding: 5,
    marginBottom: 10,
    borderRadius: 10,
  },
  buttonText2: {
    fontSize: 14,
    fontWeight: 'normal',
    color: Colors.lightblue,
  },
})