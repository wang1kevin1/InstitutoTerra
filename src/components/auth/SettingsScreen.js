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
  Image,
  ActivityIndicator,
} from 'react-native'

import {
  Container,
  Item,
  Input
} from 'native-base'

import { Ionicons } from '@expo/vector-icons';

import SettingsList from 'react-native-settings-list';

import CodeInput from 'react-native-confirmation-code-input';

import Colors from '../../assets/Colors';

import Footer from '../utilities/Footer.js';

import Auth from '@aws-amplify/auth';

export default class SettingsScreen extends React.Component {
  state = {
    setting: 'list',
    isLoading: false,
    authcode: '',
    name: '',
    email: '',
    password: '',
    newpassword: '',
    newpassword_confirmation: '',
    hidePassword1: true,
    hidePassword2: true
    //language: 'English',
  }

  componentDidMount() {
    this.getUserInfo()
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
    if (this.state.newpassword !== this.state.newpassword_confirmation) {
      Alert.alert('Passwords do not match')
    } else {
      this.changePassword()
    }
  }

  // Gets current authenticated user's info
  getUserInfo = async () => {
    await Auth.currentAuthenticatedUser({ bypassCache: true })
      .then(user => {
        console.log(user)
        this.setState({ user })
        this.setState({ name: user.attributes.name })
        this.setState({ email: user.attributes.email })
      })
      .catch(err => {
        if (!err.message) {
          console.log('Error getting user info: ', err)
          Alert.alert('Error getting user info: ', err)
        } else {
          console.log('Error getting user info: ', err.message)
          Alert.alert('Error getting user info: ', err.message)
        }
      })
  }

  // Change user name
  changeName = async () => {
    const { name } = this.state
    Keyboard.dismiss()
    this.setState({ isLoading: true })
    await Auth.currentAuthenticatedUser()
      .then(user => {
        return Auth.updateUserAttributes(user, { 'name': name });
      })
      .then(data => {
        this.setState({ isLoading: false })
        console.log('Name changed successfully', data)
        this.setState({ setting: 'list' })
      })
      .catch(err => {
        this.setState({ isLoading: false })
        if (!err.message) {
          console.log('Error changing name: ', err)
          Alert.alert('Error changing name: ', err)
        } else {
          console.log('Error changing name: ', err.message)
          Alert.alert('Error changing name: ', err.message)
        }
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
        this.setState({ setting: 'list' })
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

  // Change user password for the app
  changePassword = async () => {
    Keyboard.dismiss()
    this.setState({ isLoading: true })
    const { password, newpassword } = this.state
    await Auth.currentAuthenticatedUser()
      .then(user => {
        return Auth.changePassword(user, password, newpassword)
      })
      .then(data => {
        console.log('Password changed successfully', data)
        Alert.alert('Password changed successfully')
        this.setState({ isLoading: false })
        this.setState({ setting: 'list' })
      })
      .catch(err => {
        this.setState({ isLoading: false })
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
        this.props.navigation.navigate('Home')
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
                <View style={{ backgroundColor: '#EFEFF4', flex: 1 }}>
                  <View style={{ borderBottomWidth: 1, backgroundColor: Colors.green, borderColor: '#c8c7cc' }}>
                    <Text style={{ alignSelf: 'center', marginTop: 40, marginBottom: 15, fontWeight: 'bold', fontSize: 20 }}>Settings</Text>
                  </View>
                  <View style={{ backgroundColor: '#EFEFF4', flex: 1 }}>
                    <SettingsList borderColor='#c8c7cc' defaultItemSize={50}>
                      <SettingsList.Header headerStyle={{ marginTop: 15 }} />
                      <SettingsList.Item
                        icon={<Ionicons style={styles.iconStyle3} name="ios-person" />}
                        title='Name'
                        titleInfo={this.state.name}
                        onPress={() => this.setState({ setting: 'setName' })}
                      />
                      <SettingsList.Item
                        icon={<Ionicons style={styles.iconStyle3} name="ios-mail" />}
                        title='Email'
                        titleInfo={this.state.email}
                        onPress={() => this.setState({ setting: 'setEmail' })}
                      />
                      <SettingsList.Item
                        icon={<Ionicons style={styles.iconStyle3} name="ios-lock" />}
                        title=' Password'
                        onPress={() => this.setState({ setting: 'setPassword' })}
                      />
                      <SettingsList.Header headerStyle={{ marginTop: 15 }} />
                      <SettingsList.Item
                        icon={<Ionicons style={styles.iconStyle3} name="md-globe" />}
                        title='Language'
                        titleInfo='English'
                        onPress={() => Alert.alert('Currently only English is available. We will work on adding accessibility in the near future.')}
                      />
                      <SettingsList.Item
                        icon={<Ionicons style={styles.iconStyle3} name="md-exit" />}
                        title='Sign Out'
                        onPress={() => this.signOutAlert()}
                      />
                    </SettingsList>
                  </View>
                </View>
                <Footer color='white' />
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </SafeAreaView>
      );
    } else {
      return (
        <SafeAreaView style={styles.container}>
          <KeyboardAvoidingView style={styles.container} behavior='padding' enabled>
            <TouchableWithoutFeedback style={styles.container} onPress={Keyboard.dismiss}>
              <View style={styles.container}>
                <Container style={styles.infoContainer}>
                  {/* setName: set account name */}
                  {this.state.setting == 'setName' &&
                    <View style={styles.container}>
                      {/* Name */}
                      <Item style={styles.itemStyle}>
                        <Ionicons style={styles.iconStyle1} name="ios-person" />
                        <Input
                          style={styles.input}
                          placeholder='Name'
                          placeholderTextColor={Colors.lightblue}
                          returnKeyType='go'
                          autoCapitalize='none'
                          autoCorrect={false}
                          onChangeText={value => this.onChangeText('name', value)}
                        />
                      </Item>
                      {/* Confirm Button */}
                      <TouchableOpacity
                        onPress={() => this.changeName()}
                        disabled={this.state.isLoading}
                        style={styles.buttonStyle1}>
                        <Text style={styles.buttonText1}>
                          Save Changes
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
                  {/* setEmail: set account email */}
                  {this.state.setting == 'setEmail' &&
                    <View style={styles.container}>
                      {/* Email */}
                      <Item style={styles.itemStyle}>
                        <Ionicons style={styles.iconStyle1} name="ios-mail" />
                        <Input
                          style={styles.input}
                          placeholder='Email'
                          placeholderTextColor={Colors.lightblue}
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
                          <ActivityIndicator color={Colors.lightblue} size='large' animating={this.state.isLoading} />
                        </View>
                      }
                    </View>
                  }
                  {this.state.setting == 'emailCode' &&
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
                  {/* setPassword: set account password */}
                  {this.state.setting == 'setPassword' &&
                    <View style={styles.container}>
                      {/* Current Password */}
                      <Item style={styles.itemStyle}>
                        <Ionicons style={styles.iconStyle1} name="ios-lock" />
                        <Input
                          style={styles.input}
                          placeholder='Current Password'
                          placeholderTextColor={Colors.lightblue}
                          returnKeyType='next'
                          autoCapitalize='none'
                          autoCorrect={false}
                          secureTextEntry={true}
                          onSubmitEditing={(event) => { this.refs.SecondInput._root.focus() }}
                          onChangeText={value => this.onChangeText('password', value)}
                        />
                      </Item>
                      {/* New Password */}
                      <Item style={styles.itemStyle}>
                        <Ionicons style={styles.iconStyle1} name="ios-lock" />
                        <Input
                          style={styles.input}
                          placeholder='New Password'
                          placeholderTextColor={Colors.lightblue}
                          returnKeyType='next'
                          autoCapitalize='none'
                          autoCorrect={false}
                          secureTextEntry={this.state.hidePassword1}
                          ref='SecondInput'
                          onSubmitEditing={(event) => { this.refs.ThirdInput._root.focus() }}
                          onChangeText={value => this.onChangeText('newpassword', value)}
                        />
                        <Ionicons style={styles.iconStyle2} name="ios-eye" onPress={() => this.handleHidePassword1()} />
                      </Item>
                      {/* Confirm New Password */}
                      <Item style={styles.itemStyle}>
                        <Ionicons style={styles.iconStyle1} name="ios-lock" />
                        <Input
                          style={styles.input}
                          placeholder='Confirm New Password'
                          placeholderTextColor={Colors.lightblue}
                          returnKeyType='go'
                          autoCapitalize='none'
                          autoCorrect={false}
                          secureTextEntry={this.state.hidePassword2}
                          ref='ThirdInput'
                          onChangeText={value => this.onChangeText('newpassword_confirmation', value)}
                        />
                        <Ionicons style={styles.iconStyle2} name="ios-eye" onPress={() => this.handleHidePassword2()} />
                      </Item>
                      {/* Confirm Password Reset Button */}
                      <TouchableOpacity
                        onPress={() => this.handleReset()}
                        disabled={this.state.isLoading}
                        style={styles.buttonStyle1}>
                        <Text style={styles.buttonText1}>
                          Confirm Password Change
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightgreen,
    justifyContent: 'center',
    flexDirection: 'column'
  },
  container2: {
    flex: 1,
    backgroundColor: '#EFEFF4',
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
  iconStyle3: {
    color: Colors.lightblue,
    fontSize: 30,
    marginRight: 15,
    marginLeft: 15,
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