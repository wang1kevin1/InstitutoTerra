import React from 'react'

import {
  StyleSheet,
  Text,
  View,
  Alert,
  Dimensions,
  AsyncStorage
} from 'react-native'

import { NavigationEvents } from 'react-navigation'

import { Ionicons } from '@expo/vector-icons';

import SettingsList from 'react-native-settings-list';

import Constants from 'expo-constants';

import Colors from '../../assets/Colors';

import Footer from '../main/Footer.js';

import Auth from '@aws-amplify/auth';

export default class SettingsListScreen extends React.Component {
  state = {
    name: '',
    email: '',
    language: 'English',
  }

  componentDidMount() {
    this.getUserInfo()
    this.getLanguage()
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

// Retrieve language settings
getLanguage = async () => {
  try {
    const value = await AsyncStorage.getItem('@language')
    if (value !== null) {
      this.setState({ language: value })
      console.log('Retrieved language', this.state.language)
    }
  } catch (e) {
    console.log('Error retrieving language')
  }
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
      return (
              <View style={styles.container}>
                {/* Update isAuthenticated on navigation refresh */}
                <NavigationEvents onWillFocus={() => {this.getUserInfo(); this.getLanguage();}} />
                <View style={{ backgroundColor: '#EFEFF4', flex: 1 }}>
                  <View style={{ borderBottomWidth: 1, backgroundColor: Colors.lightgrey, borderColor: Colors.lightgrey }}>
                    <Text style={{ alignSelf: 'center', marginTop: Constants.statusBarHeight + 10, marginBottom: 10, fontWeight: 'bold', fontSize: 20 }}>Settings</Text>
                  </View>
                  <View style={{ backgroundColor: '#F2F2F5', flex: 1 }}>
                    <SettingsList borderColor='#c8c7cc' defaultItemSize={50}>
                      <SettingsList.Item
                        icon={<Ionicons style={styles.iconStyle3} name="ios-person" />}
                        title='Name'
                        titleInfo={this.state.name}
                        onPress={() => this.props.navigation.navigate("SettingsName")}
                      />
                      <SettingsList.Item
                        icon={<Ionicons style={styles.iconStyle3} name="ios-mail" />}
                        title='Email'
                        titleInfo={this.state.email}
                        onPress={() => this.props.navigation.navigate("SettingsEmail")}
                      />
                      <SettingsList.Item
                        icon={<Ionicons style={styles.iconStyle3} name="ios-lock" />}
                        title=' Password'
                        onPress={() => this.props.navigation.navigate("SettingsPassword")}
                      />
                      <SettingsList.Header headerStyle={{ marginTop: 15 }} />
                      <SettingsList.Item
                        icon={<Ionicons style={styles.iconStyle3} name="md-globe" />}
                        title='Language'
                        titleInfo={this.state.language}
                        onPress={() => this.props.navigation.navigate("SettingsLanguage")}
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