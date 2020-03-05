import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
} from 'react-native'

import COLORS from '../../assets/Colors.js'

import Auth from '@aws-amplify/auth';

import Footer from '../main/Footer.js';

import Swiper from "react-native-web-swiper";

const backgrounds = [
  require('../../assets/background/profile/profile-carbon.png'),
  require('../../assets/background/profile/profile-trees.png')
]


export default class UserDashboardScreen extends React.Component {
  state = {
    name: '',
    email: '',
  }

  componentDidMount() {
    this.getUserInfo()
  }

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

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.topBar}>
        <Text style={styles.textStyle}> Hi, {this.state.name} </Text>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('Settings')}
          style={styles.buttonStyle1}>
          <Text style={styles.buttonText1}>
            Settings
          </Text>
        </TouchableOpacity>
        </View>
        <View style={styles.test}>
        <Swiper>
          <View style={styles.slideContainer}>
            <ImageBackground source={backgrounds[0]} style={styles.ImageBackground}>
              <Text>Slide 1</Text>
            </ImageBackground>
          </View>
          <View style={styles.slideContainer}>
            <ImageBackground source={backgrounds[1]} style={styles.ImageBackground}>
              <Text>Slide 2</Text>
            </ImageBackground>
          </View>
        </Swiper>
        </View>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('fInfo')}
          style={styles.buttonStyle1}>
          <Text style={styles.buttonText1}>
            Flight Info
          </Text>
        </TouchableOpacity>
        <Footer color='green' />
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightgreen,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  slideContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: '90%',
    height: '39%',
    backgroundColor: COLORS.white,
  },
  ImageBackground: {
    flex:1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent:'center',

  },
  textStyle: {
    fontWeight: 'bold',
    fontSize: 18,
    padding: 10,
    color: '#fff'
  },
  test:{
    flex: 1,
    justifyContent: "center",
  },
  buttonStyle1: {
    alignItems: 'center',
    backgroundColor: COLORS.green,
    padding: 14,
    marginBottom: 60,
    borderRadius: 10,
  },
  buttonText1: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
  },
})
