import React from 'react'

import {
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  Keyboard,
  View,
  Alert,
  Image,
  ImageBackground
} from 'react-native'

import {
  Container,
  Item,
  Input
} from 'native-base'

import { NavigationEvents } from 'react-navigation';

import { FontAwesome, Ionicons } from '@expo/vector-icons';

import Colors from '../../assets/Colors';

import Footer from '../utilities/Footer.js';

import Auth from '@aws-amplify/auth';

export default class SettingsScreen extends React.Component {
  state = {
    isAuthenticated: false,
    flight: '',
  }

  // load background
  componentWillMount() {
    this.background = require('../../assets/background/home.png')
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

  // Check if the inputed flight number is valid
  checkNum() {
    let chars = this.state.flight.slice(0, 2).toUpperCase();
    console.log(chars);
    let nums = this.state.flight.slice(2);
    console.log(nums);
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
          this.setState({
            validNum: false,
          })
        }
        return this.state.validNum;
      }).then((validNum) => {
        if (validNum) {
          this.refs.flightSearch._root.clear();
          this.props.navigation.navigate('FlightInfo', { flightNum: this.state.flight })
        } else {
          Alert.alert('Please enter a valid flight number with no spaces')
          this.refs.flightSearch._root.clear();
        }
      }).catch((error) => {
        console.error(error);
      });
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ImageBackground source={this.background} style={styles.imageBackground}>
          <TouchableWithoutFeedback style={styles.container} onPress={Keyboard.dismiss}>
            <View style={styles.container}>
              <View style={styles.containerTop}>
                {/* Update isAuthenticated on navigation refresh */}
                <NavigationEvents onWillFocus={() => this.checkAuth()} />
                <View style={styles.buttonBarNav}>
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
                      secureTextEntry={false}
                      ref='flightSearch'
                      onChangeText={value => this.onChangeText('flight', value)}
                    />
                    {/* Pass flight prop to CalculateEmissions */}
                    <Ionicons style={styles.iconStyle1}
                      name="md-arrow-forward"
                      onPress={() => this.checkNum()} />
                  </View>
                </View>
                {/* Redirect to donation checkout */}
                {/* NAVIGATION FOR TESTING ONLY */}
                <TouchableOpacity activeOpacity={0.9}
                  onPress={() => this.props.navigation.navigate('CheckoutWithoutFlight')}
                  style={styles.buttonStyle2}>
                  <Text style={styles.buttonText2}>
                    PROCEED WITH NO FLIGHT NUMBER
                </Text>
                </TouchableOpacity>
              </View>
              <Footer color='green' />
            </View>
          </TouchableWithoutFeedback>
        </ImageBackground>
      </SafeAreaView>
    );
  }
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  imageBackground: {
    height: height,
    width: width
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    height: height,
    width: width,
    backgroundColor: 'transparent',
  },
  containerTop: {
    paddingLeft: '5%',
    paddingRight: '5%',
    paddingTop: '15%',
    backgroundColor: 'transparent',
  },
  buttonBarNav: {
    flexDirection: 'row',
    height: '15%',
    justifyContent: 'flex-end',
    marginBottom: '5%',
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
    fontFamily: 'Montserrat-bold',
    fontSize: 12,
    color: Colors.lightgreen,
  },


  input: {
    fontSize: 17,
    fontWeight: 'bold',
    color: Colors.white,
  },
  buttonView: {
    position: 'absolute',
    paddingHorizontal: 30,
    backgroundColor: 'transparent',
    top: 40,
    alignSelf: 'flex-end',
    alignItems: 'center',
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
  buttonText1: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.lightgreen,
  },
  buttonStyle2: {
    alignItems: 'center',
    backgroundColor: Colors.lightgreen,
    padding: 5,
    marginBottom: 200,
    marginHorizontal: 25,
    borderRadius: 10,
  },
  buttonText2: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.grey,
  },
})