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

import Carousel from 'react-native-snap-carousel';

import { Ionicons } from '@expo/vector-icons';

const slides = [
  {image:require('../../assets/background/profile/profile-trees.png'),title: 'Total trees planted'},
  {image:require('../../assets/background/profile/profile-carbon.png'),title: 'Carbon neutralised'}
]


export default class UserDashboardScreen extends React.Component {
  state = {
    name: '',
    email: '',
  }

  _renderItem = ({item, index}) => {
    return (
        <ImageBackground style={styles.ImageBackground} source={slides[index].image} imageStyle={{ borderRadius: 25 }}>
            <Text style={styles.smallWhiteText}> {slides[index].title}</Text>
            <Text style={styles.largeWhiteText}>##</Text>
            <TouchableOpacity style={styles.shareButton}>
              <Text style={styles.shareText}>SHARE</Text>
            </TouchableOpacity>
        </ImageBackground>
    );
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
        <View style={styles.containerTop}>
        <View style={styles.topBar}>
        <Text style={styles.medBlueText}> Hi {this.state.name}! </Text>
        <Ionicons style={styles.navigationIcon}
          name="md-settings"
          onPress={() => this.props.navigation.navigate("Settings")}
          color={COLORS.lightblue}
          bo
          size={30}
          />
        </View>
        <Carousel
              ref={(c) => { this._carousel = c; }}
              data={slides}
              renderItem={this._renderItem}
              sliderWidth={sliderWidth}
              itemWidth={itemWidth}
              removeClippedSubviews={false}
            />
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('Home')}
          style={styles.buttonStyle2}>
          <Text style={styles.buttonText2}>
            Plant Trees
          </Text>
        </TouchableOpacity>
        </View>
        <Footer color="green"/>
      </View>
    )
  }
}
const { width, height } = Dimensions.get('window');
const sliderWidth = width;
const itemWidth = width *.92;
const sliderHeight = height *.4;
const itemHeight = height *.4


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection:"column",
    backgroundColor: COLORS.lightgreen,
    height: height,
    width: width
  },
  topBar: {
//   marginTop: height * .05,
    marginBottom: height * .07,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height:'8%',
    marginHorizontal: width * .04,
  },
  containerTop: {
    paddingTop: height * 0.1,

  },
  ImageBackground: {
    alignItems: 'center',
    justifyContent: 'space-around',
    resizeMode: "cover",
    height: height*.45,
    borderRadius: 10,
    marginBottom: height * .05,
    marginHorizontal: width *.03,
  },
  medBlueText: {
    fontWeight: 'bold',
    fontSize: 30,
    padding: 0,
    color: COLORS.lightblue
  },
  test:{
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
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
    alignSelf: 'center',
    backgroundColor: COLORS.green,
    borderRadius: 10,
    height: height * .07,
    width: width * .85,

  },
  bottomGreenButton: {
    borderRadius: 10,
    backgroundColor: COLORS.lightgreen,
    height: height * 0.08,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText1: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  smallWhiteText:{
    fontFamily: 'Montserrat-bold',
    fontSize: 22,
    color: COLORS.white,
  },
  largeWhiteText:{
    fontWeight: 'bold',
    fontSize: 110,
    color: COLORS.white,
  },
  buttonText2: {
    fontSize: 14,
    fontWeight: 'normal',
    color: COLORS.white,
    fontFamily: 'Montserrat',
    padding: 16
  },
  shareButton:{
    justifyContent: 'center',
    alignItems: 'center',
    height: height *.03,
    width: width *.19,
    backgroundColor: COLORS.lightgrey,
    borderRadius: 5,

  },
  shareText: {
    color: COLORS.darkgrey,
    fontFamily: 'Montserrat',
    fontSize: 12
  }
})
