import React from 'react'

import {
  StyleSheet,
  Text,
  View,
  Alert,
  Dimensions,
} from 'react-native'

import { NavigationEvents } from 'react-navigation'

import { Ionicons } from '@expo/vector-icons';

import SettingsList from 'react-native-settings-list';

import Constants from 'expo-constants';

import COLORS from '../../assets/Colors.js';

import Footer from '../main/Footer.js';

import Auth from '@aws-amplify/auth';

export default class SettingsListScreen extends React.Component {
  state = {
    name: '',
    email: '',
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
                  <View style={{ borderBottomWidth: 1, backgroundColor: COLORS.lightgrey, borderColor: COLORS.lightgrey }}>
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