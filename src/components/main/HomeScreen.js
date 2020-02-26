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

import { Input } from 'react-native-elements'

import { NavigationEvents } from 'react-navigation'

import { FontAwesome, Ionicons } from '@expo/vector-icons'

import Colors from '../../assets/Colors'

import Footer from '../utilities/Footer.js'

import Auth from '@aws-amplify/auth'

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

  selectBackground() {
    const randomNumber = Math.floor(Math.random() * 5);
    this.background = images[randomNumber]
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

  // Check length of flight number and split input into easily manageable chunks
  checkNum() {
    let charsIata = this.state.flight.slice(0, 2).toUpperCase();
    let charsIcao = this.state.flight.slice(0, 3).toUpperCase();
    console.log(charsIata);
    console.log(charsIcao);
    let numsIata = this.state.flight.slice(2);
    let numsIcao = this.state.flight.slice(3);
    console.log(numsIata);
    console.log(numsIcao);
    //process input as Iata or Icao depending on format
    if(isNaN(this.state.flight.charAt(2))){
      return this.icaoCall(charsIcao, numsIcao);
    } else {
      return this.iataCall(charsIata, numsIata);
    }
  }

  //Process Iata flight number
  iataCall(chars, nums){
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

  //Process Icao flight number
  icaoCall(chars, nums){
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
        <ImageBackground source={this.background} style={styles.imageBackground}>
          <TouchableWithoutFeedback style={styles.container} onPress={Keyboard.dismiss}>
            <View style={styles.container}>
              <View style={styles.containerTop}>
                {/* Update isAuthenticated on navigation refresh */}
                <NavigationEvents onWillFocus={() => {this.checkAuth(); this.selectBackground();}} />
                <View style={styles.buttonBarNav}>
                  <Text style={styles.bigGreenText}>&#x2013; &#x2013;</Text>
                  {/* isAuthenticated: false */}
                  {!this.state.isAuthenticated &&
                    <TouchableOpacity activeOpacity={0.9}
                      onPress={() => this.props.navigation.navigate('SignIn')}
                      style={styles.navStyle}>
                      <FontAwesome style={styles.navigationIcon} name="user-circle-o" />
                      <Text style={styles.navText}>
                        SIGN IN
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
                        PROFILE
                        </Text>
                    </TouchableOpacity>
                  }
                </View>
                <Text style={styles.bigWhiteText}>ZERO</Text>
                <Text style={styles.bigWhiteText}>CARBON</Text>
                <View style={styles.searchContainer}>
                  {/* Enter flight number */}
                    <Input
                      containerStyle={styles.containerStyle}
                      inputContainerStyle={styles.inputContainerStyle}
                      inputStyle={styles.inputStyle}
                      label='FLIGHT NUMBER'
                      labelStyle={styles.labelStyle}
                      rightIcon={
                        <Ionicons style={styles.searchIcon}
                          name="md-arrow-forward"
                          onPress={() => this.checkNum()} />
                        }
                      rightIconContainerStyle={styles.rightIconContainerStyle}
                      errorMessage='Please enter a valid flight number'
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
                    PROCEED WITH NO FLIGHT NUMBER
                  </Text>
                </TouchableOpacity>
              </View>
              <Footer color='green' />
            </View>
          </TouchableWithoutFeedback>
        </ImageBackground>
    );
  }
}

const flightSearch = React.createRef();

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  imageBackground: {
    height: height,
    width: width,
    backgroundColor: Colors.black
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
    color: Colors.lightgreen,
    fontSize: 30,
  },
  navText: {
    fontWeight: 'bold',
    fontSize: 12,
    color: Colors.lightgreen,
  },
  bigGreenText: {
    fontWeight: 'bold',
    fontSize: 40,
    lineHeight: 45,
    color: Colors.lightgreen,
  },
  bigWhiteText: {
    fontSize: 45,
    color: Colors.white
  },
  searchContainer: {
    paddingTop: height * 0.10,
    paddingBottom: height * 0.05,
  },
  containerStyle: {
    backgroundColor: Colors.mutedgreen,
    borderRadius: 15,
    borderColor: Colors.lightgreen,
    borderWidth: 2,
    paddingTop: 6,
    opacity: 0.95
  },
  inputContainerStyle: {
    borderColor: Colors.white,
    borderBottomWidth: 2
  },
  inputStyle: {
    fontSize: 27,
    color: Colors.white,
  },
  labelStyle: {
    fontSize: 10,
    color: Colors.white,
  },
  searchIcon: {
    color: Colors.white,
    fontSize: 40,
  },
  rightIconContainerStyle: {
    paddingBottom: 3
  },
  bottomGreenButton: {
    borderRadius: 10,
    backgroundColor: Colors.lightgreen,
    height: height * 0.04,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.darkgrey,
    fontSize: 12
  }
})