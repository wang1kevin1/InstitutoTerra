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
  checkAuth = async () => {
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
      <SafeAreaView style={styles.splash}>
        <ImageBackground source={this.background} style={{ width: '100%', height: '100%' }}>
          <KeyboardAvoidingView style={styles.container} behavior='padding' enabled>
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
                          Dashboard
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
                          Dashboard
                        </Text>
                      </View>
                    }
                  <Container style={styles.infoContainer}>
                    <Item style={styles.itemStyle}>
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
                      <Ionicons style={styles.iconStyle1} name="md-arrow-forward" />
                    </Item>
                  </Container>
                </View>
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
          </KeyboardAvoidingView>
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
    backgroundColor: 'transparent'
  },
  buttonView: {
    position: 'absolute',
    paddingHorizontal: 30,
    backgroundColor: 'transparent',
    top: 40,
    alignSelf: 'flex-end',
    backgroundColor: Colors.black,
    justifyContent: 'center',
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
    width: 300,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: Colors.green,
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
    backgroundColor: Colors.darkgrey,
    height: 60,
    width: 60,
    borderRadius: 120,
    borderColor: Colors.lightgreen,
    borderWidth: 2,
    alignSelf: 'center'
  },
  buttonText1: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.white,
    alignSelf: 'center'
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