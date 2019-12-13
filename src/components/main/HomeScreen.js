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
  ImageBackground
} from 'react-native'

import {
  Container,
  Item,
  Input
} from 'native-base'

import { NavigationEvents } from 'react-navigation';

import { Ionicons } from '@expo/vector-icons';

import Colors from '../../utilities/Colors'

import Auth from '@aws-amplify/auth'

const terra = require('../../assets/terra/terra-white.png')

export default class SettingsScreen extends React.Component {
  state = {
    isAuthenticated: false,
    flight: '',
  }

  componentWillMount() {
    this.background = require('../../assets/home.png')
  }

  onChangeText(key, value) {
    this.setState({
      [key]: value
    })
  }

  // Checks if a user is logged in
  async checkAuth() {
    await Auth.currentAuthenticatedUser({ bypassCache: true })
      .then(() => {
        console.log('A user is logged in')
        this.setState({ isAuthenticated: true })
      })
      .catch(err => {
        console.log('Nobody is logged in')
        this.setState({ isAuthenticated: false })
      })
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ImageBackground source={this.background} style={{ width: '100%', height: '100%' }}>
          <TouchableWithoutFeedback style={styles.container} onPress={Keyboard.dismiss}>
            <View style={styles.container}>
              {/* Update isAuthenticated on navigation refresh */}
              <NavigationEvents onWillFocus={() => this.checkAuth()} />
              <View style={styles.container}>
                {/* isAuthenticated: false */}
                {!this.state.isAuthenticated &&
                  <View style={styles.buttonView}>
                    <TouchableOpacity activeOpacity={0.9}
                      onPress={() => this.props.navigation.navigate('SignIn')}
                      style={styles.buttonStyle1}>
                    </TouchableOpacity>
                    <Text style={styles.buttonText1}>
                      SIGN IN
                        </Text>
                  </View>
                }
                {/* isAuthenticated: true */}
                {this.state.isAuthenticated &&
                  <View style={styles.buttonView}>
                    <TouchableOpacity activeOpacity={0.9}
                      onPress={() => this.props.navigation.navigate('UserDashboard')}
                      style={styles.buttonStyle1}>
                    </TouchableOpacity>
                    <Text style={styles.buttonText1}>
                      PROFILE
                        </Text>
                  </View>
                }
              </View>
              <View style={styles.infoContainer}>
                {/* Enter flight number */}
                <View style={styles.itemStyle}>
                  <Input
                    style={styles.input}
                    placeholder='Flight Number'
                    placeholderTextColor={Colors.white}
                    returnKeyType='go'
                    autoCapitalize='none'
                    autoCorrect={false}
                    secureTextEntry={true}
                    onChangeText={value => this.onChangeText('flight', value)}
                  />
                  <Ionicons style={styles.iconStyle1} name="md-arrow-forward" onPress={() => Alert.alert('Send this.flight as prop to Calculate Carbon')}/>
                </View>
              </View>
              <TouchableOpacity activeOpacity={0.9}
                  onPress={() => Alert.alert('Checkout Screen')}
                  style={styles.buttonStyle2}>
                  <Text style={styles.buttonText2}>
                    PROCEED WITH NO FLIGHT NUMBER
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.9}
                  onPress={() => Alert.alert('About trees page')}
                  style={styles.buttonStyle2}>
                  <Text style={styles.buttonText2}>
                    WHERE ARE MY TREES?
                  </Text>
                </TouchableOpacity>

              <View style={styles.footer}>
                <Text style={styles.footerTxt}>made possible with</Text>
                <TouchableOpacity onPress={() => Alert.alert('About Section')}>
                  <Image
                    source={terra}
                    style={{ width: 151, height: 13, marginTop: 9, resizeMode: 'contain' }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </ImageBackground>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
    backgroundColor: Colors.green,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
  },
  input: {
    fontSize: 17,
    fontWeight: 'bold',
    color: Colors.white,
  },
  infoContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonView: {
    position: 'absolute',
    paddingHorizontal: 30,
    backgroundColor: 'transparent',
    top: 40,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  footer: {
    alignItems: 'center',
    backgroundColor: Colors.green,
    padding: 30,
    alignContent: 'flex-end',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderWidth: 1,
    borderColor: Colors.green
  },
  footerTxt: {
    fontSize: 10,
    fontWeight: 'normal',
    color: Colors.white,
  },
  itemStyle: {
    height: 60,
    width: 300,
    padding: 15,
    borderColor: 'blue',
    borderWidth: 2,
    backgroundColor: Colors.grey,
    borderRadius: 10,
    borderColor: Colors.lightblue,
    borderWidth: 2,
    flexDirection: 'row'
  },
  iconStyle1: {
    color: Colors.white,
    fontSize: 30,
    marginRight: 15,
    marginLeft: 15,
  },
  buttonStyle1: {
    backgroundColor: Colors.darkgrey,
    height: 60,
    width: 60,
    borderRadius: 120,
    borderColor: Colors.lightgreen,
    borderWidth: 2,
  },
  buttonText1: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.lightgreen,
  },
  buttonStyle2: {
    alignItems: 'center',
    backgroundColor: Colors.lightgreen,
    padding: 5,
    marginBottom: 10,
    marginHorizontal: 25,
    borderRadius: 10,
  },
  buttonText2: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.grey,
  },
})