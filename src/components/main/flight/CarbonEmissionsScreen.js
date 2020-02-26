import React from 'react'

import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native'

import { Ionicons, FontAwesome, Feather } from '@expo/vector-icons';

import Colors from '../../../assets/Colors.js';

import Footer from '../../utilities/Footer.js';

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
      tripIndex: this.props.navigation.getParam('tripIndex', 'tripIndex'),
      depCityName: this.props.navigation.getParam('depCityName', 'departureCity'),
      arrCityName: this.props.navigation.getParam('arrCityName', 'arrivalCity'),
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
    let dist = this.props.navigation.getParam('distance', 'distanceTraveled');
    let seat = this.props.navigation.getParam('distance', 'distanceTraveled');
    console.log(seat);
    //Short Flight
    if(dist < 500){
      dist *= .25493;
    //Medium Flight
    }else if(dist < 1000){
      //Economy seat
      if(this.props.navigation.getParam('seatState', 'state') == 'Economy'){
        dist *= .15573;
      //Business seat
      }else if(this.props.navigation.getParam('seatState', 'state') == 'Business' || this.props.navigation.getParam('seatState', 'state') == 'First Class'){
        dist *= .2336;
      }
    //Long Flight
    }else{
      //Economy Seat
      if(this.props.navigation.getParam('seatState', 'state') == 'Economy'){
        dist *= .14981;
      //Business Seat
      }else if(this.props.navigation.getParam('seatState', 'state') == 'Business'){
        dist *= .43446;
      //First Class Seat
      }else if(this.props.navigation.getParam('seatState', 'state') == 'First Class'){
        dist *= .59925;
       
      }
    }
    emmisions = Math.round(dist);
    emmisions /= 1000;
    this.setState({
      footprint: emmisions,
    })
  }

  render() {
    const {
      flightChars,
      flightNums,
      footprint,
    } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.containerTop}>
          <View style={styles.buttonBarNav}>
            {/*Navigation Buttons*/}
            <Ionicons style={styles.navigationIcon} name="md-arrow-back"
              onPress={() => this.props.navigation.goBack()} />
            <FontAwesome style={styles.navigationIcon} name="user-circle-o"
              onPress={() => this.handleUserRedirect()} />
          </View>
          {/*Flight Number*/}
          <Text style={styles.smallBlueText}>FLIGHT NUMBER</Text>
          <Text style={styles.bigBlueText}>{flightChars} {flightNums}</Text>
          {/*CO2 footprint*/}
          <View style={styles.midText}>
            <Text style={styles.bigWhiteText}>{footprint}</Text>
            <View style={styles.alignSubScript}>
              <Text style={styles.midWhiteText}>Metric Tons CO</Text>
              <Text style={{ fontSize: 12, lineHeight: 30, color: Colors.white }}>2</Text>
            </View>
            <Text style={styles.smallBlueText}>WE CAN FIX THIS TOGETHER</Text>
          </View>
          {/*Navigate to next screen*/}
          <TouchableOpacity
            style={styles.bottomGreenButton}
            onPress={() => this.props.navigation.navigate('CheckoutWithFlight', {
              tripIndex: this.state.tripIndex,
              depCityName: this.state.depCityName,
              arrCityName: this.state.arrCityName,
              footprint: footprint,
              flightChars: flightChars,
              flightNums: flightNums,
            })}>
            <Text style={styles.buttonText}>PLANT TREES</Text>
          </TouchableOpacity>
        </View>
        <Footer color='white' />
      </View>
    )
  }
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: Colors.darkgrey,
    height: height,
    width: width
  },
  containerTop: {
    paddingLeft: width * 0.05,
    paddingRight: width * 0.05,
    paddingTop: height * 0.06,
    marginBottom: height * 0.10,
    backgroundColor: Colors.darkgrey,
  },
  buttonBarNav: {
    flexDirection: 'row',
    height: height * 0.05,
    justifyContent: 'space-between',
    marginBottom: height * 0.05,
  },
  smallBlueText: {
    fontFamily: 'Montserrat',
    fontSize: 12,
    color: Colors.lightblue,
  },
  bigBlueText: {
    fontFamily: 'Montserrat-bold',
    fontSize: 30,
    color: Colors.lightblue,
  },
  midText: {
    height: height * 0.20,
    marginTop: height * 0.15,
    marginBottom: height * 0.1725,
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
    height: height * 0.08,
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