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
  ActivityIndicator
} from 'react-native'

import {
  Container,
  Item,
  Input
} from 'native-base'

import { Ionicons } from '@expo/vector-icons';

import Colors from '../../utilities/Colors'

import Auth from '@aws-amplify/auth'

import CodeInput from 'react-native-confirmation-code-input';

export default class ForgetPasswordScreen extends React.Component {
  state = {
    stage: '1',
    email: '',
    authcode: '',
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
      this.setState({ hidePassword1: false })
    } else {
      this.setState({ hidePassword1: true })
    }
  }

  // toggles secure text password confirmation
  handleHidePassword2 = () => {
    if (this.state.hidePassword2) {
      this.setState({ hidePassword2: false })
    } else {
      this.setState({ hidePassword2: true })
    }
  }

  // checks for password match
  handleReset = () => {
    if (this.state.password !== this.state.password_confirmation) {
      Alert.alert('Passwords do not match')
    } else {
      this.forgotPasswordSubmit()
    }
  }

  // Request verification code for new password
  async forgotPassword() {
    Keyboard.dismiss()
    await Auth.forgotPassword(this.state.email)
      .then(data => {
        console.log('New code sent', data)
        Alert.alert('A verification code has been sent to your email')
        this.setState({ stage: '2' })
      })
      .catch(err => {
        if (!err.message) {
          console.log('Error while sending verification code: ', err)
          Alert.alert('Error while sending verification code: ', err)
        } else {
          console.log('Error while sending verification code: ', err.message)
          Alert.alert('Error while sending verification code: ', err.message)
        }
      })
  }

  // calls AWS Cognito to reset password if authcode is correct
  async forgotPasswordSubmit() {
    Keyboard.dismiss()
    this.setState({ isLoading: true })
    const { email, authcode, password } = this.state
    await Auth.forgotPasswordSubmit(email, authcode, password)
      .then(() => {
        this.setState({ isLoading: false })
        console.log('Your password has been reset')
        Alert.alert('Your password has been reset')
        this.setState({ stage: '1' })
        this.props.navigation.navigate('SignIn')
      })
      .catch(err => {
        this.setState({ isLoading: false })
        if (!err.message) {
          console.log('Error while confirming the new password: ', err)
          Alert.alert('Error while confirming the new password: ', err)
        } else {
          console.log('Error while confirming the new password: ', err.message)
          Alert.alert('Error while confirming the new password: ', err.message)
        }
      })
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior='padding'
          enabled
          keyboardVerticalOffset={23}>
          <TouchableWithoutFeedback style={styles.container} onPress={Keyboard.dismiss}>
            <View style={styles.container}>
              <Container style={styles.infoContainer}>
                {/* Stage 1: Email for password reset */}
                {this.state.stage == '1' &&
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
                    {/* Send code button */}
                    <TouchableOpacity
                      onPress={() => this.forgotPassword()}
                      style={styles.buttonStyle1}>
                      <Text style={styles.buttonText1}>
                        Send Code
                      </Text>
                    </TouchableOpacity>
                  </View>
                }
                {/* Stage 2: Verification code for password reset */}
                {this.state.stage == '2' &&
                  <View style={styles.container}>
                    {/* Verification Code message*/}
                    <Text style={styles.messageText1}>
                      Please enter your verification code:
                    </Text>
                    {/* Verification Code input*/}
                    <CodeInput
                      ref="CodeInput"
                      keyboardType="numeric"
                      codeLength={6}
                      className='border-circle'
                      inactiveColor={Colors.green}
                      activeColor={Colors.lightblue}
                      cellBorderWidth={2.0}
                      size={50}
                      space={4}
                      autoFocus={false}
                      codeInputStyle={{ fontWeight: '800' }}
                      onFulfill={(code) => this.setState({ authcode: code })}
                    />
                    {/* Didn't receive code link */}
                    <TouchableOpacity
                      onPress={() => this.forgotPassword()}
                      style={styles.buttonStyle2}>
                      <Text style={styles.buttonText2}>
                        Resend verification code
                      </Text>
                    </TouchableOpacity>
                    {/* Confirm code input */}
                    <TouchableOpacity
                      onPress={() => this.setState({ stage: '3' })}
                      style={styles.buttonStyle1}>
                      <Text style={styles.buttonText1}>
                        Reset Password
                      </Text>
                    </TouchableOpacity>
                  </View>
                }
                {/* Stage 3: Password reset */}
                {this.state.stage == '3' &&
                  <View style={styles.container}>
                    {/* Password */}
                    <Item style={styles.itemStyle}>
                      <Ionicons style={styles.iconStyle1} name="ios-lock" />
                      <Input
                        style={styles.input}
                        placeholder='Password'
                        placeholderTextColor={Colors.lightblue}
                        returnKeyType='next'
                        autoCapitalize='none'
                        autoCorrect={false}
                        secureTextEntry={this.state.hidePassword1}
                        onSubmitEditing={(event) => { this.refs.SecondInput._root.focus() }}
                        onChangeText={value => this.onChangeText('password', value)}
                      />
                      <Ionicons style={styles.iconStyle2} name="ios-eye" onPress={() => this.handleHidePassword1()} />
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
                        ref='SecondInput'
                        onChangeText={value => this.onChangeText('password_confirmation', value)}
                      />
                      <Ionicons style={styles.iconStyle2} name="ios-eye" onPress={() => this.handleHidePassword2()} />
                    </Item>
                    {/* Confirm Password Reset Button */}
                    <TouchableOpacity
                      onPress={() => this.handleReset()}
                      disabled={this.state.isLoading}
                      style={styles.buttonStyle1}>
                      <Text style={styles.buttonText1}>
                        Confirm Password Reset
                      </Text>
                    </TouchableOpacity>
                    {/* Loading ActivityIndicator */}
                    {this.state.isLoading &&
                      <View>
                        <ActivityIndicator color={Colors.lightblue} size='large' animating={this.state.isLoading} />
                      </View>
                    }
                  </View>
                }
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
  messageText1: {
    marginTop: 200,
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.darkgrey,
    alignContent: 'center'
  },
})