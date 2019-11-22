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

import CodeInput from 'react-native-confirmation-code-input';

export default class ForgetPasswordScreen extends React.Component {
  state = {
    email: '',
    stage: '2',
  }

  onChangeText(key, value) {
    this.setState({
      [key]: value
    })
  }
  // Request verification code for new password
  async forgotPassword() {
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

  // Upon confirmation redirect the user to the Sign In page
  async forgotPasswordSubmit() {
    const { username, authCode, newPassword } = this.state
    await Auth.forgotPasswordSubmit(username, authCode, newPassword)
      .then(() => {
        this.props.navigation.navigate('SignIn')
        console.log('the New password submitted successfully')
      })
      .catch(err => {
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
                {/* Email for password reset */}
                {this.state.stage == '1' &&
                  <View style={styles.container}>
                    {/* Email */}
                    <Item style={styles.itemStyle1}>
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
                {/* Verification code for password reset */}
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
                      onFulfill={(code) => this._onFulfill(code)}
                    />
                    {/* Didn't receive code link */}
                    <TouchableOpacity
                      onPress={() => this.forgotPassword()}
                      style={styles.buttonStyle2}>
                      <Text style={styles.buttonText2}>
                        Resend validation code
                      </Text>
                    </TouchableOpacity>
                    {/* Confirm code input */}
                    <TouchableOpacity
                      onPress={() => this.forgotPassword()}
                      style={styles.buttonStyle1}>
                      <Text style={styles.buttonText1}>
                        Reset Password
                      </Text>
                    </TouchableOpacity>
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
  itemStyle1: {
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
    marginTop: 100,
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.darkgrey,
    alignContent: 'center'
  },
})