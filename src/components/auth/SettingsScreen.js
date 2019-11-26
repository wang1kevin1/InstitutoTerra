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
} from 'react-native'

import {
  Container,
  Item,
  Input
} from 'native-base'

import { Ionicons } from '@expo/vector-icons';

import SettingsList from 'react-native-settings-list';

import Colors from '../../utilities/Colors'

import Auth from '@aws-amplify/auth'

const logo = require('../../assets/logo.png')

const terra = require('../../assets/terra.png')

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
                        titleInfo='Kevin Wang'
                        onPress={() => this.setState({ setting: 'setName' })}
                      />
                      <SettingsList.Item
                        icon={<Ionicons style={styles.iconStyle3} name="ios-mail" />}
                        title='Email'
                        titleInfo='wang1kevin1@gmail.com'
                        onPress={() => this.setState({ setting: 'setEmail' })}
                      />
                      <SettingsList.Item
                        icon={<Ionicons style={styles.iconStyle3} name="ios-lock" />}
                        title='Password'
                        onPress={() => this.setState({ setting: 'setPassword' })}
                      />
                      <SettingsList.Header headerStyle={{ marginTop: 15 }} />
                      <SettingsList.Item
                        icon={<Ionicons style={styles.iconStyle3} name="md-globe" />}
                        title='Language'
                        titleInfo='English'
                        onPress={() => this.setState({ setting: 'setLanguage' })}
                      />
                      <SettingsList.Item
                        icon={<Ionicons style={styles.iconStyle3} name="md-exit" />}
                        title='Sign Out'
                        onPress={() => Alert.alert('Signing out')}
                      />
                    </SettingsList>
                  </View>
                </View>
                <View style={styles.footer}>
                  <Text style={styles.footerTxt}>made possible with</Text>
                  <TouchableOpacity onPress={() => Alert.alert('About Section')}>
                  <Image 
                    source={terra}
                    style={{ width: 151, height: 13, marginTop: 9, resizeMode: 'contain'}}
                  />
                  </TouchableOpacity>
                </View>
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
  footer: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 30,
    alignContent: 'flex-end',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  footerTxt: {
    fontSize: 10,
    fontWeight: 'normal',
    color: Colors.black,
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
})