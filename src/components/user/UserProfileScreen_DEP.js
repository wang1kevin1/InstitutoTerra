import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  ActivityIndicator,
  Share
} from 'react-native'

import COLORS from '../../assets/Colors.js'

import MenuBar from '../main/MenuBar.js';

import Carousel, { Pagination } from 'react-native-snap-carousel';

import { Ionicons } from '@expo/vector-icons';

import Auth from '@aws-amplify/auth';

import { API } from 'aws-amplify'

import i18n from 'i18n-js'

import * as CONSTANTS from '../utilities/Constants.js'

export default class UserProfileScreen extends React.Component {
  state = {
    name: '',
    email: '',
    activeSlide: 0,
    loading: true,
    CarbonCompensated: 0 //temp for now
  }

  constructor(props) {
    super(props)

    this.slides = [
      { image: require('../../assets/background/profile/profile-trees.png'), title: i18n.t('TOTAL TREES PLANTED') },
      { image: require('../../assets/background/profile/profile-carbon.png'), title: i18n.t('CARBON COMPENSATED') }
    ]
  }

  componentDidMount() {
    this.getUserInfo()
  }

  // gets user's name and email
  getUserInfo = async () => {
    
    await Auth.currentAuthenticatedUser({ bypassCache: true })
      .then(user => {
        console.log(user)
        this.setState({ user })
        this.setState({ name: user.attributes.name.split(' ')[0] })
        this.setState({ UserId: user.attributes.sub })
        this.getUserTrees()
      })
      .catch(err => {
        if (!err.message) {
          console.log('Error getting user info: ', err)
        } else {
          console.log('Error getting user info: ', err.message)
        }
      })
  }

  // gets a user's tree count
  async getUserTrees() {
    const path = "/Users/object/" + this.state.UserId;

    await API.get("ZeroCarbonREST", path)
      .then(apiResponse => {
        this.setState({ apiResponse })
        console.log("response from getting user: " + apiResponse);
        this.setState({ TreesPlanted: apiResponse.TreesPlanted })
        console.log(this.state.TreesPlanted)
        this.setState({loading: false})
      })
      .catch(e => {
        console.log(e);
      })
    }

  //gets index of currently shown carousel screen
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

  // Opens apps for users to share
  onShare = async () => {
    if (this.state.activeSlide == 0) {
      this.message = 'I\'ve donated ' + this.state.TreesPlanted + ' tree(s)! You can help at ' + CONSTANTS.WEBSITE + '!'
    } else {
      this.message = 'I\'ve helped compensate for ' + this.state.CarbonCompensated + ' metric tons of CO2! You can help at ' + CONSTANTS.WEBSITE + '!'
    }
    try {
      const result = await Share.share({
        title: '#Refloresta',
        dialogTitle: '#Refloresta',
        subject: '#Refloresta',
        message: this.message
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Console.log(error.message);
    }
  }

  // renders carousel
  _renderItem = ({ item, index }) => {
    return (
      <ImageBackground style={styles.ImageBackground} source={this.slides[index].image} imageStyle={{ borderRadius: 25 }}>
        <Text style={styles.smallWhiteText}> {this.slides[index].title}</Text>
        {this.state.loading &&
          <View style={styles.dataContainer}>
            <ActivityIndicator color={COLORS.white} size='large' />
          </View>
        }
        {!this.state.loading &&
          <View style={styles.dataContainer}>
            <Text style={styles.largeWhiteText}>{(this.state.activeSlide == 0) ? this.state.TreesPlanted : 0}</Text>
          </View>
        }
        <TouchableOpacity style={styles.shareButton}
          onPress={() => this.onShare()}>
          <Text style={styles.shareText}>{i18n.t('SHARE')}</Text>
        </TouchableOpacity>
      </ImageBackground>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.containerTop}>
          <View style={styles.buttonBarNav}>
            <Text style={styles.medBlueText}> {i18n.t('Hi')} {this.state.name}! </Text>
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
              {i18n.t('PLANT TREES')}
          </Text>
          </TouchableOpacity>
        </View>
        <MenuBar navigation={this.props.navigation}/>
      </View>
    )
  }
}
const { width, height } = Dimensions.get('screen');

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
  dataContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: height * .2,
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
