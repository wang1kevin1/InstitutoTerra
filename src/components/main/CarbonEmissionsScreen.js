import React from 'react'

import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert
} from 'react-native'

import { Ionicons, FontAwesome, Feather } from '@expo/vector-icons';

import Colors from '../../assets/Colors.js';

import Footer from '../utilities/Footer.js';

import Auth from '@aws-amplify/auth';

// cost per tree
const cost = 6;

export default class CarbonEmissionsScreen extends React.Component {
  state = {
    isAuthenticated: 'false',
    data: [],
  }

  componentDidMount = () => {
    //set state parameters
    this.setState({
      distance: this.props.navigation.getParam('distance', 'distanceTraveled'),
      planeMake: this.props.navigation.getParam('planeMake', 'Make'),
      planeModel: this.props.navigation.getParam('planeModel', 'Model'),
      seatState: this.props.navigation.getParam('seatState', 'state'),
      flightChars: this.props.navigation.getParam('flightChars', 'chars'),
      flightNums: this.props.navigation.getParam('flightNums', 'nums'),
    })
    this.checkAuth()
    this.calcEmissions()
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

  // Sends user to sign up or dashboard depending on Auth state
  handleUserRedirect() {
    if (this.state.isAuthenticated) {
      this.props.navigation.navigate('UserDashboard')
    } else {
      this.props.navigation.navigate('SignIn')
    }
  }

  //Calculate emissions using distance and seat class
  calcEmissions() {
    let temp = this.props.navigation.getParam('distance', 'distanceTraveled');
    tempD = Math.round(temp);
    tempF = tempD / 1000;
    this.setState({
      footprint: tempF,
    })
  }

  render() {
    const {
      flightChars,
      flightNums,
      footprint,
    } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.containerTop}>
          <View style={styles.buttonBarTop}>
            {/*Navigation Buttons*/}
            <Ionicons style={styles.navigationIcon} name="md-arrow-back"
              onPress={() => this.props.navigation.goBack()} />
            <FontAwesome style={styles.navigationIcon} name="user-circle-o"
              onPress={() => this.handleUserRedirect()} />
          </View>
          {/*Flight Number*/}
          <Text style={styles.smallBlueText}>FLIGHT NUMBER:</Text>
          <Text style={styles.bigBlueText}>{flightChars} {flightNums}</Text>
          {/*CO2 footprint*/}
          <View style={styles.topText}>
            <Text style={styles.bigWhiteText}>{footprint}</Text>
            <View style={styles.alignSubScript}>
              <Text style={styles.midWhiteText}>METRIC TONS CO</Text>
              <Text style={{ fontSize: 12, lineHeight: 30, color: Colors.white }}>2</Text>
            </View>
            <Text style={styles.smallBlueText}>WE CAN FIX THIS TOGETHER</Text>
          </View>
          {/*Navigate to next screen*/}
          <TouchableOpacity
            style={styles.bottomGreenButton}
            onPress={() => this.props.navigation.navigate('CheckoutWithFlight', {
              footprint: footprint,
              flightChars: flightChars,
              flightNums: flightNums,
            })}>
            <Text style={styles.buttonText}>PLANT TREES</Text>
          </TouchableOpacity>
        </View>
        <Footer color='white' />
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
    backgroundColor: Colors.darkgrey,
  },
  containerTop: {
    justifyContent: 'center',
    paddingLeft: '5%',
    paddingRight: '5%',
    marginTop: '10%',
    paddingTop: '15%',
    paddingBottom: '5%',
    backgroundColor: Colors.darkgrey,
  },
  smallBlueText: {
    fontFamily: 'Montserrat',
    fontSize: 12,
    color: Colors.lightblue,
  },
  bigBlueText: {
    fontFamily: 'Montserrat-bold',
    fontSize: 30,
    color: Colors.lightblue
  },
  buttonBarTop: {
    flexDirection: 'row',
    height: '10%',
    justifyContent: 'space-between',
    marginBottom: '5%'
  },
  topText: {
    marginTop: '20%',
    marginBottom: '20%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  midWhiteText: {
    fontFamily: 'Montserrat',
    fontSize: 22,
    color: Colors.white,
    lineHeight: 25
  },
  bigWhiteText: {
    fontFamily: 'Montserrat-bold',
    fontSize: 48,
    color: Colors.white,
  },
  alignSubScript: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  bottomGreenButton: {
    borderRadius: 10,
    backgroundColor: Colors.lightgreen,
    height: '13%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Montserrat-bold',
    color: Colors.darkgrey,
    fontSize: 12
  },
  navigationIcon: {
    color: Colors.white,
    fontSize: 30,
  },
});