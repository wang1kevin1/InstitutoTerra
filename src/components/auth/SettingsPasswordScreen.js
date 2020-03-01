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

import COLORS from '../../assets/Colors';

import Auth from '@aws-amplify/auth';

export default class SettingsPasswordScreen extends React.Component {
  state = {
    isLoading: false,
    password: '',
    newpassword: '',
    newpassword_confirmation: '',
    hidePassword1: true,
    hidePassword2: true,
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
        this.props.navigation.goBack()
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

  render() {
      return (
        <SafeAreaView style={styles.containerSetting}>
          <KeyboardAvoidingView style={styles.containerSetting} behavior='padding' enabled>
            <TouchableWithoutFeedback style={styles.containerSetting} onPress={Keyboard.dismiss}>
              <View style={styles.containerSetting}>
                <Container style={styles.infoContainer}>
                    <View style={styles.containerSetting}>
                      {/* Current Password */}
                      <Item style={styles.itemStyle}>
                        <Ionicons style={styles.iconStyle1} name="ios-lock" />
                        <Input
                          style={styles.input}
                          placeholder='Current Password'
                          placeholderTextColor={COLORS.lightblue}
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
                          placeholderTextColor={COLORS.lightblue}
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
                          placeholderTextColor={COLORS.lightblue}
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
                          <ActivityIndicator color={COLORS.lightblue} size='large' animating={this.state.isLoading} />
                        </View>
                      }
                    </View>
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