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
  Image
} from 'react-native'

import {
  Container,
  Item,
  Input
} from 'native-base'

import { Ionicons } from '@expo/vector-icons';

import Colors from '../../utilities/Colors'

import Auth from '@aws-amplify/auth'

const logo = require('../../assets/logo.png')

export default class SettingsScreen extends React.Component {
  state = {
    setting: 'list',
    name: '',
    email: '',
    password: '',
    newpassword: '',
    newpassword_confirmation: '',
    //language: 'English',
  }

  onChangeText(key, value) {
    this.setState({
      [key]: value
    })
  }

  // Change user password for the app
  changePassword = async () => {
    const { password1, password2 } = this.state
    await Auth.currentAuthenticatedUser()
      .then(user => {
        return Auth.changePassword(user, password1, password2)
      })
      .then(data => console.log('Password changed successfully', data))
      .catch(err => {
        if (!err.message) {
          console.log('Error changing password: ', err)
          Alert.alert('Error changing password: ', err)
        } else {
          console.log('Error changing password: ', err.message)
          Alert.alert('Error changing password: ', err.message)
        }
      })
  }

  // Sign out from the app
  signOutAlert = async () => {
    await Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out from the app?',
      [
        { text: 'Cancel', onPress: () => console.log('Canceled'), style: 'cancel' },
        { text: 'OK', onPress: () => this.signOut() },
      ],
      { cancelable: false }
    )
  }

  signOut = async () => {
    await Auth.signOut()
      .then(() => {
        console.log('Sign out complete')
        this.props.navigation.navigate('AuthLoading')
      })
      .catch(err => console.log('Error while signing out!', err))
  }

  render() {
    {/* list: Settings list */ }
    if (this.state.setting == 'list') {
      return (
        <SafeAreaView style={styles.container2}>
          <KeyboardAvoidingView style={styles.container2} behavior='padding' enabled>
            <TouchableWithoutFeedback style={styles.container2} onPress={Keyboard.dismiss}>
              <View style={styles.container2}>
                <Container style={styles.infoContainer2}>
                  <View style={styles.container2}>
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
                      onPress={() => this.setState({ setting: 'setName' })}
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
    } else {
      return (
        <SafeAreaView style={styles.container1}>
          <KeyboardAvoidingView style={styles.container1} behavior='padding' enabled>
            <TouchableWithoutFeedback style={styles.container1} onPress={Keyboard.dismiss}>
              <View style={styles.container1}>
                <Container style={styles.infoContainer1}>
                  {/* setName: set account name */}
                  {this.state.setting == 'setName' &&
                    <View style={styles.container1}>
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
                </Container>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </SafeAreaView>
      );
    }
  }
}

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    backgroundColor: Colors.lightgreen,
    justifyContent: 'center',
    flexDirection: 'column'
  },
  container2: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    flexDirection: 'column'
  },
  input: {
    flex: 1,
    fontSize: 17,
    fontWeight: 'bold',
    color: Colors.lightblue,
  },
  infoContainer1: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    backgroundColor: Colors.lightgreen,
  },
  infoContainer2: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    backgroundColor: Colors.white,
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