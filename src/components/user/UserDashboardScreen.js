import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Dimensions
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
          <View style={styles.slideContainer}>
            <ImageBackground source={backgrounds[0]} style={styles.ImageBackground}>
              <Text>Slide 1</Text>
            </ImageBackground>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('Home')}
          style={styles.buttonStyle2}>
          <Text style={styles.buttonText2}>
            Test
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection:"column",
    backgroundColor: COLORS.lightgreen,
    height: height,
    width: width
  },
  topBar: {
    marginTop: "10%",
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height:'8%',
    marginHorizontal: "2%",
  },
  slideContainer: {
    justifyContent: "center",
    alignItems: "stretch",
    width: '90%',
    height: '39%',
    backgroundColor: COLORS.white,
  },
  ImageBackground: {
    alignItems: 'center',
    justifyContent:'center',
    resizeMode: "cover",
    height: '100%'
  },
  textStyle: {
    fontWeight: 'bold',
    fontSize: 18,
    padding: 0,
    color: '#fff'
  },
  test:{
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    
  },
  buttonStyle1: {
    alignItems: 'center',
    backgroundColor: COLORS.green,
    padding: 0,
    borderRadius: 10,
    alignSelf:'center',
  },
  buttonStyle2: {
    alignItems: 'center',
    backgroundColor: COLORS.green,
    borderRadius: 10,
    marginBottom:'20%',
  },
  buttonText1: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  buttonText2: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
    padding: 18
  },
})
