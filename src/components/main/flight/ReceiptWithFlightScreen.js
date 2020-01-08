import React from 'react'

import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert
} from 'react-native'

import { Ionicons, FontAwesome } from '@expo/vector-icons';

import Dash from 'react-native-dash';

import Colors from '../../../assets/Colors.js';

import Footer from '../../utilities/Footer.js';

import Auth from '@aws-amplify/auth';

export default class ReceiptWithFlightScreen extends React.Component {
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
      footprint: this.props.navigation.getParam('footprint', 'carbonEmissions'),
      treeNum: this.props.navigation.getParam('treeNum', 'treeNum'),
      years: this.props.navigation.getParam('years', 'years'),
      total_cost: this.props.navigation.getParam('total_cost', 'total_cost'),
      flightChars: this.props.navigation.getParam('flightChars', 'chars'),
      flightNums: this.props.navigation.getParam('flightNums', 'nums'),
    })
    this.checkAuth()
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

  render() {
    const {
      tripIndex,
      depCityName,
      arrCityName,
      footprint,
      treeNum,
      years,
      total_cost,
      flightChars,
      flightNums,
    } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.containerTop}>
          <View style={styles.buttonBarNav}>
            {/*Navigation Buttons*/}
            <Ionicons style={styles.navigationIcon} name="md-arrow-back"
              onPress={() => this.props.navigation.goBack()} />
            <Text style={styles.flightBlueText}>FLIGHT {flightChars} {flightNums}</Text>
            <FontAwesome style={styles.navigationIcon} name="user-circle-o"
              onPress={() => this.handleUserRedirect()} />
          </View>
          <View style={styles.receiptContainer}>
            <View style={styles.textRow}>
              {/*Route*/}
              <Text style={styles.receiptTextLeft}>ROUTE</Text>
              {/* Departure to Arrival */}
              {tripIndex == 1 &&
                <Text style={styles.receiptTextRight}>{depCityName} &#10230; {arrCityName}</Text>
              }
              {tripIndex == 2 &&
                <Text style={styles.receiptTextRight}>{depCityName} &#10231; {arrCityName}</Text>
              }
            </View>
            <Dash style={styles.dashedLine} dashColor={Colors.lightgrey} dashGap={0} />
            <View style={styles.textRow}>
              {/*Carbon Footprints*/}
              <Text style={styles.receiptTextLeft}>CARBON FOOTPRINT (METRIC TONS)</Text>
              <Text style={styles.receiptTextRight}>{footprint}</Text>
            </View>
            <Dash style={styles.dashedLine} dashColor={Colors.lightgrey} dashGap={0} />
            <View style={styles.textRow}>
              {/*Total trees donated in transaction*/}
              <Text style={styles.receiptTextLeft}>TOTAL TREES</Text>
              <Text style={styles.receiptTextRight}>{treeNum}</Text>
            </View>
            <Dash style={styles.dashedLine} dashColor={Colors.lightgrey} dashGap={0} />
            <View style={styles.textRow}>
              {/*Years to neutralize*/}
              <Text style={styles.receiptTextLeft}>YEARS TO NEUTRALIZE</Text>
              <Text style={styles.receiptTextRight}>{years}</Text>
            </View>
            <Dash style={styles.dashedLine} dashColor={Colors.lightgrey} dashGap={0} />
            <View style={styles.textRow}>
              {/*Cost of transaction*/}
              <Text style={styles.receiptTextLeft}>PRICE</Text>
              <Text style={styles.receiptTextRight}>${total_cost}</Text>
            </View>
          </View>
          {/*Navigate to checkout page*/}
          <TouchableOpacity
            style={styles.bottomGreenButton}
            onPress={() => Alert.alert('Link to payment, send cost prop')}>
            <View style={styles.alignText}>
              <Text style={styles.buttonText}>PAY WITH </Text>
              <Text style={styles.stripeText}> stripe</Text>
            </View>
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
    flexDirection: 'column',
    backgroundColor: Colors.white,
  },
  containerTop: {
    justifyContent: 'center',
    paddingLeft: '5%',
    paddingRight: '5%',
    paddingTop: '20%',
    backgroundColor: Colors.white,
  },
  buttonBarNav: {
    flexDirection: 'row',
    height: '10%',
    justifyContent: 'space-between',
    marginBottom: '5%',
  },
  flightBlueText: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    color: Colors.lightblue,
    justifyContent: 'center',
    alignItems: 'center',
    lineHeight: 30
  },
  receiptContainer: {
    paddingTop: '25%',
    paddingBottom: '30%',
  },
  dashedLine: {
    width: '100%',
    height: 0.5,
    marginBottom: '5%'
  },
  textRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '5%',
  },
  receiptTextLeft: {
    fontFamily: 'Montserrat',
    color: Colors.darkgrey,
    fontSize: 12
  },
  receiptTextRight: {
    fontFamily: 'Montserrat-bold',
    color: Colors.darkgrey,
    fontSize: 12
  },
  alignText: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  bottomGreenButton: {
    borderRadius: 10,
    backgroundColor: Colors.lightgreen,
    height: '10%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Montserrat-bold',
    color: Colors.darkgrey,
    fontSize: 12
  },
  stripeText: {
    fontFamily: 'Fago-black',
    color: Colors.darkgrey,
    fontSize: 18,
    lineHeight: 18
  },
  navigationIcon: {
    color: Colors.grey,
    fontSize: 30,
  },
});

