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
  Dimensions,
  ActivityIndicator,
} from 'react-native'

import {
  Container,
  Item,
  Input
} from 'native-base'

import { Ionicons } from '@expo/vector-icons';

import CodeInput from 'react-native-confirmation-code-input';

import COLORS from '../../assets/Colors';

import Auth from '@aws-amplify/auth';

export default class SettingsEmailScreen extends React.Component {
  state = {
    setting: 'setEmail',
    isLoading: false,
    authcode: '',
    email: '',
  }

  onChangeText(key, value) {
    this.setState({
      [key]: value
    })
  }

  // Change user email
  changeEmail = async () => {
    const { email } = this.state
    Keyboard.dismiss()
    this.setState({ isLoading: true })
    await Auth.currentAuthenticatedUser()
      .then(user => {
        return Auth.updateUserAttributes(user, { 'email': email });
      })
      .then(data => {
        this.setState({ isLoading: false })
        console.log('Email change process started', data)
        Alert.alert('A verification code has been sent to your new email')
        this.setState({ setting: 'emailCode' })
      })
      .catch(err => {
        this.setState({ isLoading: false })
        if (!err.message) {
          console.log('Error changing email: ', err)
          Alert.alert('Error changing email: ', err)
        } else {
          console.log('Error changing email: ', err.message)
          Alert.alert('Error changing email: ', err.message)
        }
      })
  }

  // Verifies new email
  verifyEmail = async () => {
    Keyboard.dismiss()
    await Auth.verifyCurrentUserAttributeSubmit("email", this.state.authcode)
      .then(data => {
        console.log('Email change confirmed', data)
        Alert.alert('Email changed successfully')
        this.props.navigation.goBack()
      })
      .catch(err => {
        if (!err.message) {
          console.log('Error verifying email: ', err)
          Alert.alert('Error verifying email: ', err)
        } else {
          console.log('Error verifying email: ', err.message)
          Alert.alert('Error verifying email: ', err.message)
        }
      })
  }

  render() {
      return (
        <SafeAreaView style={styles.containerSetting}>
          <KeyboardAvoidingView style={styles.containerSetting} behavior='padding' enabled>
            <TouchableWithoutFeedback style={styles.containerSetting} onPress={Keyboard.dismiss}>
              <View style={styles.containerSetting}>
                <Container style={styles.infoContainer}>
                  {/* setEmail: set account email */}
                  {this.state.setting == 'setEmail' &&
                    <View style={styles.containerSetting}>
                      {/* Email */}
                      <Item style={styles.itemStyle}>
                        <Ionicons style={styles.iconStyle1} name="ios-mail" />
                        <Input
                          style={styles.input}
                          placeholder='Email'
                          placeholderTextColor={COLORS.lightblue}
                          returnKeyType='go'
                          autoCapitalize='none'
                          autoCorrect={false}
                          onChangeText={value => this.onChangeText('email', value)}
                        />
                      </Item>
                      {/* Confirm Button */}
                      <TouchableOpacity
                        onPress={() => this.changeEmail()}
                        disabled={this.state.isLoading}
                        style={styles.buttonStyle1}>
                        <Text style={styles.buttonText1}>
                          Confirm Email
                        </Text>
                      </TouchableOpacity>
                      {/* Loading ActivityIndicator */}
                      {this.state.isLoading &&
                        <View>
                          <ActivityIndicator color={COLORS.lightblue} size='large' animating={this.state.isLoading} />
                        </View>
                      }
                    </View>
                  }
                  {this.state.setting == 'emailCode' &&
                    <View style={styles.containerSetting}>
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
                        inactiveColor={COLORS.green}
                        activeColor={COLORS.lightblue}
                        cellBorderWidth={2.0}
                        size={50}
                        space={4}
                        autoFocus={false}
                        codeInputStyle={{ fontWeight: '800' }}
                        onFulfill={(code) => this.setState({ authcode: code })}
                      />
                      {/* Confirm code input */}
                      <TouchableOpacity
                        onPress={() => this.verifyEmail()}
                        style={styles.buttonStyle1}>
                        <Text style={styles.buttonText1}>
                          Verify New Email
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


const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFEFF4',
    flexDirection: 'column',
    height: height,
    width: width
  },
  containerSetting: {
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
  iconStyle3: {
    color: COLORS.lightblue,
    fontSize: 30,
    marginRight: 15,
    marginLeft: 15,
    alignSelf: 'center'
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
  buttonStyle2: {
    alignItems: 'center',
    backgroundColor: COLORS.lightgreen,
    padding: 5,
    marginBottom: 10,
    borderRadius: 10,
  },
  buttonText2: {
    fontSize: 14,
    fontWeight: 'normal',
    color: COLORS.lightblue,
  },
  messageText1: {
    marginTop: 200,
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.darkgrey,
    alignContent: 'center'
  },
})