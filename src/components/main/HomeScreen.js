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

import { Ionicons } from '@expo/vector-icons';

import SettingsList from 'react-native-settings-list';

import CodeInput from 'react-native-confirmation-code-input';

import Colors from '../../utilities/Colors'

import Auth from '@aws-amplify/auth'

const terra = require('../../assets/terra/terra-white.png')

const background = require('../../assets/home.png')

export default class SettingsScreen extends React.Component {
  state = {
    isAuthenticated: false,
    flight: '',
  }

  onChangeText(key, value) {
    this.setState({
      [key]: value
    })
  }

  render() {
    return (
      <ImageBackground source={background} style={{width: '100%', height: '100%'}}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView style={styles.container} behavior='padding' enabled>
          <TouchableWithoutFeedback style={styles.container} onPress={Keyboard.dismiss}>
            <View style={styles.container}>
              <View style={styles.container}>
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('SignIn')}
                  style={styles.buttonStyle1}>
                  <Text style={styles.buttonText1}>
                    SignIn
                </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('UserDashboard')}
                  style={styles.buttonStyle1}>
                  <Text style={styles.buttonText1}>
                    UserDashboard
                </Text>
                </TouchableOpacity>
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
      </SafeAreaView>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    //backgroundColor: Colors.lightgreen,
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