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

import Carousel, { Pagination } from 'react-native-snap-carousel';

import { Ionicons } from '@expo/vector-icons';

export default class UserProfileScreen extends React.Component {
  state = {
    name: '',
    email: '',
    activeSlide: 0,
  }

  constructor(props) {
    super(props)

    this.slides = [
      { image: require('../../assets/background/profile/profile-trees.png'), title: 'Total trees planted' },
      { image: require('../../assets/background/profile/profile-carbon.png'), title: 'Carbon neutralised' }
    ]

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

  get pagination () {
    const { activeSlide } = this.state;
    return (
        <Pagination
          dotsLength={this.slides.length}
          activeDotIndex={activeSlide}
          containerStyle={styles.paginationContainer}
          dotStyle={{
              width: 50,
              height: 5,
              borderRadius: 5,
              marginHorizontal: 8,
              backgroundColor: COLORS.lightblue
          }}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.9}
        />
    );
  }

  _renderItem = ({ item, index }) => {
    return (
      <ImageBackground style={styles.ImageBackground} source={this.slides[index].image} imageStyle={{ borderRadius: 25 }}>
        <Text style={styles.smallWhiteText}> {this.slides[index].title}</Text>
        <Text style={styles.largeWhiteText}>##</Text>
        <TouchableOpacity style={styles.shareButton}>
          <Text style={styles.shareText}>SHARE</Text>
        </TouchableOpacity>
      </ImageBackground>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.containerTop}>
          <View style={styles.buttonBarNav}>
            <Text style={styles.medBlueText}> Hi {this.state.name}! </Text>
            <Ionicons style={styles.navigationIcon}
              name="md-settings"
              onPress={() => this.props.navigation.navigate("Settings")}
              color={COLORS.lightblue}
              size={30}
            />
          </View>
          <Carousel
            ref={(c) => { this._carousel = c; }}
            data={this.slides}
            renderItem={this._renderItem}
            sliderWidth={sliderWidth}
            itemWidth={itemWidth}
            removeClippedSubviews={false}
            onSnapToItem={(index) => this.setState({ activeSlide: index }) }
          />
          { this.pagination }
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Home')}
            style={styles.bottomGreenButton}>
            <Text style={styles.buttonText}>
              Plant Trees
          </Text>
          </TouchableOpacity>
        </View>
        <Footer color="white" />
      </View>
    )
  }
}
const { width, height } = Dimensions.get('window');

const sliderWidth = width
const itemWidth = width

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: COLORS.darkgrey,
    height: height,
    width: width
  },
  containerTop: {
    paddingLeft: width * 0.05,
    paddingRight: width * 0.05,
    paddingTop: height * 0.06,
    marginBottom: height * 0.10,
    backgroundColor: COLORS.darkgrey,
  },
  buttonBarNav: {
    flexDirection: 'row',
    height: height * 0.07,
    justifyContent: 'space-between',
    marginBottom: height * 0.05,
  },
  medBlueText: {
    fontWeight: 'bold',
    fontSize: 30,
    padding: 0,
    color: COLORS.lightblue
  },
  ImageBackground: {
    alignItems: 'center',
    justifyContent: 'space-around',
    resizeMode: "cover",
    height: height * .45,
    borderRadius: 10,
    marginRight: width * .1,
  },
  paginationContainer: {
    backgroundColor: COLORS.darkgrey,
    marginBottom: height*0.04
  },
  bottomGreenButton: {
    borderRadius: 10,
    backgroundColor: COLORS.lightgreen,
    height: height * 0.08,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Montserrat-bold',
    color: COLORS.darkgrey,
    fontSize: 12
  },
  smallWhiteText: {
    fontFamily: 'Montserrat-bold',
    fontSize: 22,
    color: COLORS.white,
  },
  largeWhiteText: {
    fontWeight: 'bold',
    fontSize: 110,
    color: COLORS.white,
  },
  navigationIcon: {
    color: COLORS.lightblue,
    fontSize: 40,
  },
  shareButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: height * .04,
    width: width * .2,
    backgroundColor: COLORS.white,
    borderRadius: 10,
  },
  shareText: {
    color: COLORS.darkgrey,
    fontFamily: 'Montserrat',
    fontSize: 12
  }
})
