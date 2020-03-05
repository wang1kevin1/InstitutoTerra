import React from 'react'

import {
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions,
  Text,
  Keyboard,
  View,
  ImageBackground
} from 'react-native'

import { Linking } from 'expo';

import { Input } from 'react-native-elements'

import { NavigationEvents } from 'react-navigation'

import { FontAwesome, Ionicons } from '@expo/vector-icons'

import COLORS from '../../assets/Colors.js'

import Footer from './Footer.js'

import Auth from '@aws-amplify/auth'

import i18n from 'i18n-js'

import * as CONSTANTS from '../utilities/Constants.js'

const images = [
  require('../../assets/background/home/home-1.png'),
  require('../../assets/background/home/home-2.png'),
  require('../../assets/background/home/home-3.png'),
  require('../../assets/background/home/home-4.png'),
  require('../../assets/background/home/home-5.png')
]

export default class HomeScreen extends React.Component {
  state = {
    isAuthenticated: false,
    flight: '',
    error: false,
  }

  // load background
  constructor(props) {
    super(props)

    const randomNumber = Math.floor(Math.random() * 5);
    this.background = images[randomNumber]

    this.selectBackground(images)
  }

  onChangeText(key, value) {
    this.setState({
      [key]: value
    })
  }

  // selects a random background to be loaded
  selectBackground() {
    const randomNumber = Math.floor(Math.random() * 5);
    this.background = images[randomNumber]
  }

  // Opens up email to bug-report
  handleBugReports = () => {
    Linking.openURL('mailto:bug-report@refloresta.app?body=' + CONSTANTS.BUG_REPORT);
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

  // Check if the inputed flight number is valid
  checkNum() {
    let spaceBuffer = this.state.flight.replace(/\s+/g, '');
    this.setState({
      flight: spaceBuffer
    })
    let charsIata = spaceBuffer.slice(0, 2).toUpperCase();
    let charsIcao = spaceBuffer.slice(0, 3).toUpperCase();
    console.log(charsIata);
    console.log(charsIcao);
    let numsIata = spaceBuffer.slice(2);
    let numsIcao = spaceBuffer.slice(3);
    console.log(numsIata);
    console.log(numsIcao);
    //process input as Iata or Icao depending on format
    if (isNaN(spaceBuffer.charAt(2))) {
      return this.icaoCall(charsIcao, numsIcao);
    } else {
      return this.iataCall(charsIata, numsIata);
    }
  }

  // checks for valid Iata
  iataCall(chars, nums) {
    fetch(`http://aviation-edge.com/v2/public/routes?key=760fd0-cefe7a&airlineIata=${chars}&flightnumber=${nums}`, {
      method: 'GET'
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          validNum: true,
          data: responseJson[0],
        })
        console.log(this.state.data);
        if (!this.state.data) {
          this.setState({ validNum: false })
        }
        return this.state.validNum;
      }).then((validNum) => {
        if (validNum) {
          flightSearch.current.clear();
          this.setState({ error: false })
          this.props.navigation.navigate('FlightInfo', { flightNum: this.state.flight })
        } else {
          this.setState({ error: true })
          flightSearch.current.shake();
          flightSearch.current.clear();
        }
      }).catch((error) => {
        console.error(error);
      });
  }

  // checks for valid Icao
  icaoCall(chars, nums) {
    fetch(`http://aviation-edge.com/v2/public/routes?key=760fd0-cefe7a&airlineIcao=${chars}&flightnumber=${nums}`, {
      method: 'GET'
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          validNum: true,
          data: responseJson[0],
        })
        console.log(this.state.data);
        if (!this.state.data) {
          this.setState({ validNum: false })
        }
        return this.state.validNum;
      }).then((validNum) => {
        if (validNum) {
          flightSearch.current.clear();
          this.setState({ error: false })
          this.props.navigation.navigate('FlightInfo', { flightNum: this.state.flight })
        } else {
          this.setState({ error: true })
          flightSearch.current.shake();
          flightSearch.current.clear();
        }
      }).catch((error) => {
        console.error(error);
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground source={this.background} style={styles.imageBackground}>
          <TouchableWithoutFeedback style={styles.container} onPress={Keyboard.dismiss}>
            <View style={styles.container}>
              <View style={styles.containerTop}>
                {/* Update isAuthenticated on navigation refresh */}
                <NavigationEvents onWillFocus={() => { this.checkAuth(); this.selectBackground(); }} />
                <View style={styles.buttonBarNav}>
                  {/* <Text style={styles.bigGreenText}>&#x2013; &#x2013;</Text> //To be used after beta */}
                  {/* Bug Reports to be used only for beta */}
                  <TouchableOpacity activeOpacity={0.9}
                    onPress={() => this.handleBugReports()}
                    style={styles.navStyle}>
                    <Ionicons style={styles.navigationIcon} name="ios-bug" />
                  </TouchableOpacity>
                  {/* isAuthenticated: false */}
                  {!this.state.isAuthenticated &&
                    <TouchableOpacity activeOpacity={0.9}
                      onPress={() => this.props.navigation.navigate('SignIn')}
                      style={styles.navStyle}>
                      <FontAwesome style={styles.navigationIcon} name="user-circle-o" />
                      <Text style={styles.navText}>
                        {i18n.t('SIGN IN')}
                      </Text>
                    </TouchableOpacity>
                  }
                  {/* isAuthenticated: true */}
                  {this.state.isAuthenticated &&
                    <TouchableOpacity activeOpacity={0.9}
                      onPress={() => this.props.navigation.navigate('UserDashboard')}
                      style={styles.navStyle}>
                      <FontAwesome style={styles.navigationIcon} name="user-circle-o" />
                      <Text style={styles.navText}>
                        {i18n.t('PROFILE')}
                      </Text>
                    </TouchableOpacity>
                  }
                </View>
                <View style={styles.appName}>
                  <Text style={styles.bigWhiteText}>refloresta</Text>
                </View>
                <View style={styles.searchContainer}>
                  {/* Enter flight number */}
                  <Input
                    containerStyle={styles.containerStyle}
                    inputContainerStyle={styles.inputContainerStyle}
                    inputStyle={styles.inputStyle}
                    label={i18n.t('FLIGHT NUMBER')}
                    labelStyle={styles.labelStyle}
                    rightIcon={
                      <Ionicons style={styles.searchIcon}
                        name="md-arrow-forward"
                        onPress={() => this.checkNum()} />
                    }
                    rightIconContainerStyle={styles.rightIconContainerStyle}
                    errorMessage={i18n.t('Please enter a valid flight number')}
                    errorStyle={[{ fontSize: (this.state.error == false) ? 3 : 10 }, { color: (this.state.error == false) ? 'transparent' : 'red' }]}
                    autoCapitalize='characters'
                    autoCorrect={false}
                    ref={flightSearch}
                    onChangeText={value => this.onChangeText('flight', value)}
                  />
                </View>
                {/* Redirect to donation checkout */}
                {/* NAVIGATION FOR TESTING ONLY */}
                <TouchableOpacity activeOpacity={0.9}
                  style={styles.bottomGreenButton}
                  onPress={() => this.props.navigation.navigate('CheckoutWithoutFlight')}>
                  <Text style={styles.buttonText}>
                    {i18n.t('DONATE WITH NO FLIGHT NUMBER')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </ImageBackground>
        <Footer color='green' />
      </View>
    );
  }
}

const flightSearch = React.createRef();

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  imageBackground: {
    height: height,
    width: width,
    backgroundColor: COLORS.black
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    height: height,
    width: width,
    backgroundColor: 'transparent',
  },
  containerTop: {
    paddingLeft: width * 0.05,
    paddingRight: width * 0.05,
    paddingTop: height * 0.06,
    marginBottom: height * 0.10,
    backgroundColor: 'transparent',
  },
  buttonBarNav: {
    flexDirection: 'row',
    height: height * 0.05,
    justifyContent: 'space-between',
  },
  navStyle: {
    flexDirection: 'column',
    alignItems: 'center'
  },
  navigationIcon: {
    color: COLORS.lightgreen,
    fontSize: 30,
  },
  navText: {
    fontWeight: 'bold',
    fontSize: 12,
    color: COLORS.lightgreen,
  },
  bigGreenText: {
    fontWeight: 'bold',
    fontSize: 40,
    lineHeight: 45,
    color: COLORS.lightgreen,
  },
  appName: {
    paddingTop: height * 0.2,
  },
  bigWhiteText: {
    fontSize: 50,
    fontFamily: 'Gilroy-bold',
    color: COLORS.white,
    textAlign: 'center'
  },
  searchContainer: {
    paddingTop: height * 0.02,
    paddingBottom: height * 0.03,
  },
  containerStyle: {
    backgroundColor: COLORS.mutedgreen,
    borderRadius: 15,
    borderColor: COLORS.lightgreen,
    borderWidth: 2,
    paddingTop: 6,
    opacity: 0.95
  },
  inputContainerStyle: {
    borderColor: COLORS.white,
    borderBottomWidth: 2
  },
  inputStyle: {
    fontSize: 27,
    color: COLORS.white,
  },
  labelStyle: {
    fontSize: 10,
    color: COLORS.white,
  },
  searchIcon: {
    color: COLORS.white,
    fontSize: 40,
  },
  rightIconContainerStyle: {
    paddingBottom: 3
  },
  bottomGreenButton: {
    borderRadius: 10,
    backgroundColor: COLORS.lightgreen,
    height: height * 0.04,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.darkgrey,
    fontSize: 12
  }
})